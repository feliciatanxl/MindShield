import { CATEGORY_LABEL, ROUTES } from "./resources";
import type { Incident } from "./types";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const URGENCY_COLOR = { high: ["#fbeceb", "#8f2f2a"], medium: ["#ece7f8", "#67539f"], low: ["#e3efe6", "#3b5e46"] };

/**
 * Renders the incident as an A4 page in the browser, rasterises it and saves a PDF.
 * Rasterising (vs. jsPDF text) means Chinese / Tamil / Malay quotes render correctly without
 * embedding multi-MB fonts. Everything happens on-device: the report never touches a server.
 */
export async function downloadIncidentPdf(i: Incident, evidence: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);

  const [ubg, ufg] = URGENCY_COLOR[i.urgency];
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 12px;width:170px;color:#5b6676;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;vertical-align:top;border-bottom:1px solid #e3efe6">${label}</td>
      <td style="padding:10px 12px;font-size:15px;border-bottom:1px solid #e3efe6">${esc(value)}</td>
    </tr>`;

  const el = document.createElement("div");
  el.style.cssText =
    "position:fixed;left:-10000px;top:0;width:794px;background:#fff;color:#1f2a37;font-family:'Segoe UI',system-ui,'Noto Sans','Noto Sans SC','Noto Sans Tamil','Microsoft YaHei','Nirmala UI',sans-serif;line-height:1.5";
  el.innerHTML = `
    <div style="background:linear-gradient(90deg,#ece7f8,#e3efe6);padding:28px 40px">
      <div style="font-size:13px;font-weight:600;color:#3b5e46;letter-spacing:.08em">MINDSHIELD SG</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
        <div style="font-size:26px;font-weight:700">Incident Summary</div>
        <div style="background:${ubg};color:${ufg};padding:4px 14px;border-radius:999px;font-size:13px;font-weight:700">${i.urgency.toUpperCase()} URGENCY</div>
      </div>
      <div style="font-size:13px;color:#5b6676;margin-top:6px">Prepared ${esc(new Date().toLocaleString("en-SG"))}</div>
    </div>
    <div style="padding:28px 40px 36px">
      <div style="background:#f3f8f4;border-radius:12px;padding:12px 16px;font-size:13px;color:#3b5e46">
        Personal identifiers (NRIC, phone, email, address) were removed automatically. Attach original screenshots separately.
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:20px">
        ${row("Type of harm", CATEGORY_LABEL[i.category])}
        ${row("Platform", i.platform)}
        ${row("Account(s) involved", i.handles.join(", ") || "Unknown")}
        ${row("When it started", i.firstSeen)}
        ${row("What they want", i.demands)}
        ${row("Evidence", evidence)}
      </table>
      <div style="margin-top:24px;font-size:12px;font-weight:600;color:#5b6676;text-transform:uppercase;letter-spacing:.04em">What happened</div>
      <div style="margin-top:8px;font-size:15px;white-space:pre-wrap;border:1px solid #e3efe6;border-radius:12px;padding:14px 16px">${esc(i.summary)}</div>
      <div style="margin-top:24px;font-size:12px;font-weight:600;color:#5b6676;text-transform:uppercase;letter-spacing:.04em">Where to report</div>
      <ol style="margin:8px 0 0;padding-left:22px;font-size:14px;list-style:decimal">
        ${ROUTES[i.category]
          .map(
            (r) =>
              `<li style="margin-bottom:6px">${esc(r.step)}${r.where ? ` — <b style="color:#3b5e46">${esc(r.where)}</b>` : ""}${
                r.href?.startsWith("http") ? ` <span style="color:#5b6676">(${esc(r.href.replace(/^https?:\/\//, ""))})</span>` : ""
              }</li>`
          )
          .join("")}
      </ol>
      <div style="margin-top:28px;background:#fbeceb;color:#8f2f2a;border-radius:12px;padding:12px 16px;font-size:13px;font-weight:600">
        Need to talk? SOS 1767 (24h) · WhatsApp 9151 1767 · Mindline 1771 · Emergency 999
      </div>
    </div>`;
  document.body.appendChild(el);

  try {
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const pageH = 297;
    const imgH = (canvas.height * pageW) / canvas.width;
    const img = canvas.toDataURL("image/jpeg", 0.92);
    // Tall reports flow onto extra pages by shifting the same image up one page at a time.
    for (let y = 0; y < imgH; y += pageH) {
      if (y > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, -y, pageW, imgH);
    }
    pdf.setProperties({ title: "MindShield SG Incident Summary" });
    pdf.save(`incident-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  } finally {
    el.remove();
  }
}
