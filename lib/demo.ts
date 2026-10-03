import { detectCategory } from "./guardrails";
import type { Category, ChatMessage, FamilyBrief, Incident, Lang } from "./types";

/**
 * Offline demo mode. Used when no API key is configured or the LLM call fails, so the
 * prototype always works on stage. Replies are hand-written to model the tone we prompt the AI for.
 */

type Script = { first: Record<Category, string>; follow: string[]; crisis: string };

const SCRIPTS: Record<Lang, Script> = {
  en: {
    first: {
      intimate:
        "I'm really glad you told me. What they're doing is a crime called sextortion, and it is 100% on them, not you. Please don't pay or send anything more: paying almost never makes them stop. Can you screenshot the chat and their profile first, without deleting anything?",
      doxxing:
        "That sounds frightening, having your details out there like that. You did nothing to deserve this. Doxxing can be reported straight to the Online Safety Commission without going to the platform first. Are you somewhere safe right now?",
      scam:
        "Oof, that's a horrible feeling, but these scams are run by professionals who fool adults every day. It's not because you're stupid. The most urgent thing: call your bank's hotline now to try to stop the transfer, then ScamShield at 1799. Would it help if I walked you through what to say?",
      harassment:
        "I'm sorry, that's really cruel, and no one deserves to be treated like that. Wanting to avoid school makes total sense. Let's save the evidence first: screenshots of the group and the edited pictures. Do you know who started the chat?",
      general:
        "Thanks for reaching out. Whatever's happening, you don't have to handle it alone. Take a slow breath with me. Can you tell me a bit more about what happened?",
    },
    follow: [
      "You're handling this really well, even if it doesn't feel like it. When you're ready, the Act tab has a checklist and can turn what you told me into a clean summary for reporting.",
      "A lot of people your age worry most about how their parents will react. If that's on your mind, the Family tab can write a calm note in your mum or dad's language. Want to try it?",
      "That makes sense. One small step at a time. Is there one trusted adult, like a parent, teacher or counsellor, you could show this to today?",
    ],
    crisis:
      "I'm really glad you told me, and I'm worried about you. You matter, and what's happening online does not decide your worth. Please talk to someone at SOS right now: call 1767 or WhatsApp 9151 1767. They're there 24 hours. Are you safe at this moment?",
  },
  zh: {
    first: {
      intimate:
        "谢谢你愿意告诉我。对方的行为叫做“性勒索”，是犯罪，完全是他们的错，不是你的错。请不要付钱，也不要再发任何东西，付钱几乎不会让他们停止。你能先把聊天记录和对方的账号截图保存下来吗？不要删除任何东西。",
      doxxing:
        "个人资料被这样公开，一定很可怕。你没有做错任何事。“人肉搜索”可以直接向网络安全委员会（OSC）举报，不需要先找平台。你现在在安全的地方吗？",
      scam:
        "这种感觉一定很难受。但这些骗子是专业的，每天都有大人上当，不是因为你笨。最紧急的是：现在就打给你的银行热线，试着拦截转账，然后打ScamShield热线1799。需要我教你怎么说吗？",
      harassment:
        "听到这些我很难过，这真的很过分，没有人应该被这样对待。不想去学校是很正常的反应。我们先保存证据：截图群组和那些被恶搞的照片。你知道是谁开的群吗？",
      general: "谢谢你来找我。不管发生了什么，你都不需要一个人面对。我们先慢慢深呼吸。可以多告诉我一点发生了什么吗？",
    },
    follow: [
      "虽然你可能不觉得，但你处理得很好。准备好的时候，“行动”页面有一个清单，还可以把你说的整理成一份清楚的摘要，方便举报。",
      "很多同龄人最担心的是爸妈的反应。如果你也担心，“家人”页面可以用爸妈的语言写一段平静的话。要试试吗？",
      "我明白。一步一步来。今天有没有一位你信任的大人，比如爸妈、老师或辅导员，可以给他们看？",
    ],
    crisis:
      "谢谢你告诉我，我很担心你。你很重要，网上发生的事情不能决定你的价值。请现在就联系SOS：拨打1767，或WhatsApp 9151 1767，24小时都有人。你现在安全吗？",
  },
  ms: {
    first: {
      intimate:
        "Terima kasih kerana beritahu saya. Apa yang mereka buat ialah jenayah yang dipanggil sekstorsi, dan ia 100% salah mereka, bukan anda. Tolong jangan bayar atau hantar apa-apa lagi, bayar hampir tak pernah buat mereka berhenti. Boleh anda tangkap layar chat dan profil mereka dulu, tanpa padam apa-apa?",
      doxxing:
        "Mesti menakutkan bila maklumat peribadi anda didedahkan begitu. Anda tak buat apa-apa yang salah. Doxxing boleh dilaporkan terus kepada Suruhanjaya Keselamatan Dalam Talian (OSC) tanpa perlu ke platform dulu. Anda berada di tempat selamat sekarang?",
      scam:
        "Itu memang perasaan yang teruk, tapi penipu ini profesional dan orang dewasa pun kena tipu setiap hari. Ini bukan kerana anda bodoh. Yang paling penting: telefon talian bank anda sekarang untuk cuba hentikan pemindahan, kemudian ScamShield di 1799. Nak saya tunjukkan apa nak cakap?",
      harassment:
        "Saya minta maaf, itu sangat kejam dan tiada siapa patut dilayan begitu. Memang wajar anda tak mahu ke sekolah. Mari simpan bukti dulu: tangkap layar group itu dan gambar yang diedit. Anda tahu siapa yang buat group itu?",
      general:
        "Terima kasih kerana menghubungi. Apa pun yang berlaku, anda tak perlu hadapinya seorang diri. Tarik nafas perlahan-lahan dengan saya. Boleh cerita sedikit lagi apa yang berlaku?",
    },
    follow: [
      "Anda sedang mengendalikan ini dengan baik, walaupun mungkin tak rasa begitu. Bila bersedia, tab Tindakan ada senarai semak dan boleh jadikan cerita anda ringkasan yang kemas untuk laporan.",
      "Ramai orang sebaya anda paling risau tentang reaksi ibu bapa. Kalau itu yang anda fikirkan, tab Keluarga boleh tulis nota yang tenang dalam bahasa ibu atau ayah anda. Nak cuba?",
      "Saya faham. Satu langkah kecil pada satu masa. Ada tak seorang dewasa yang anda percaya, seperti ibu bapa, guru atau kaunselor, yang anda boleh tunjukkan hari ini?",
    ],
    crisis:
      "Terima kasih kerana beritahu saya, dan saya risau tentang anda. Anda penting, dan apa yang berlaku dalam talian tidak menentukan nilai diri anda. Sila hubungi SOS sekarang: telefon 1767 atau WhatsApp 9151 1767, 24 jam. Adakah anda selamat sekarang?",
  },
  ta: {
    first: {
      intimate:
        "என்னிடம் சொன்னதற்கு நன்றி. அவர்கள் செய்வது பாலியல் மிரட்டல் என்ற குற்றம். இது முழுக்க அவர்களின் தவறு, உங்களுடையது அல்ல. தயவுசெய்து பணம் கொடுக்கவோ எதையும் அனுப்பவோ வேண்டாம், பணம் கொடுத்தாலும் அவர்கள் நிறுத்துவதில்லை. எதையும் அழிக்காமல், முதலில் அரட்டையையும் அவர்களின் கணக்கையும் திரைப்பிடிப்பு எடுக்க முடியுமா?",
      doxxing:
        "உங்கள் விவரங்கள் இப்படி வெளியானது மிகவும் பயமாக இருக்கும். நீங்கள் எந்தத் தவறும் செய்யவில்லை. இதைத் தளத்திடம் முதலில் போகாமல் நேரடியாக இணையப் பாதுகாப்பு ஆணையத்திடம் (OSC) புகாரளிக்கலாம். இப்போது நீங்கள் பாதுகாப்பான இடத்தில் இருக்கிறீர்களா?",
      scam:
        "இது மிகவும் கஷ்டமான உணர்வு. ஆனால் இந்த மோசடிக்காரர்கள் தொழில்முறையாளர்கள், பெரியவர்களும் தினமும் ஏமாறுகிறார்கள். இது உங்கள் முட்டாள்தனம் அல்ல. மிக அவசரம்: இப்போதே உங்கள் வங்கியின் அவசர எண்ணை அழைத்துப் பணப் பரிமாற்றத்தை நிறுத்த முயலுங்கள், பிறகு ScamShield 1799. என்ன சொல்வது என்று நான் உதவட்டுமா?",
      harassment:
        "மன்னிக்கவும், இது மிகவும் கொடூரமானது, யாரும் இப்படி நடத்தப்படக் கூடாது. பள்ளிக்குப் போக விருப்பமில்லாதது புரிகிறது. முதலில் ஆதாரத்தைச் சேமிப்போம்: குழுவையும் திருத்தப்பட்ட படங்களையும் திரைப்பிடிப்பு எடுங்கள். அந்தக் குழுவை யார் தொடங்கினார்கள் என்று தெரியுமா?",
      general:
        "தொடர்பு கொண்டதற்கு நன்றி. என்ன நடந்தாலும், நீங்கள் தனியாகச் சமாளிக்க வேண்டியதில்லை. என்னுடன் மெதுவாக மூச்சு விடுங்கள். என்ன நடந்தது என்று இன்னும் கொஞ்சம் சொல்ல முடியுமா?",
    },
    follow: [
      "உங்களுக்கு அப்படித் தோன்றாவிட்டாலும், நீங்கள் இதை நன்றாகக் கையாளுகிறீர்கள். தயாரானதும், 'செயல்' பகுதியில் ஒரு சரிபார்ப்புப் பட்டியல் உள்ளது, நீங்கள் சொன்னதைப் புகாருக்கான சுருக்கமாகவும் மாற்றும்.",
      "உங்கள் வயதில் பலர் பெற்றோர் எப்படி நடந்துகொள்வார்கள் என்றுதான் அதிகம் கவலைப்படுவார்கள். அப்படியானால், 'குடும்பம்' பகுதி உங்கள் அம்மா அல்லது அப்பாவின் மொழியில் அமைதியான குறிப்பை எழுதும். முயற்சி செய்யலாமா?",
      "புரிகிறது. ஒவ்வொரு சிறிய அடியாக. இன்று இதைக் காட்டக்கூடிய நம்பகமான ஒரு பெரியவர், பெற்றோர், ஆசிரியர் அல்லது ஆலோசகர், இருக்கிறார்களா?",
    ],
    crisis:
      "என்னிடம் சொன்னதற்கு நன்றி, உங்களைப் பற்றி கவலையாக இருக்கிறது. நீங்கள் முக்கியமானவர். இணையத்தில் நடப்பது உங்கள் மதிப்பைத் தீர்மானிக்காது. தயவுசெய்து இப்போதே SOS-ஐ அழைக்கவும்: 1767, அல்லது WhatsApp 9151 1767, 24 மணி நேரமும். இப்போது நீங்கள் பாதுகாப்பாக இருக்கிறீர்களா?",
  },
};

export function demoReply(messages: ChatMessage[], lang: Lang, crisis: boolean): string {
  const s = SCRIPTS[lang];
  if (crisis) return s.crisis;
  const userTurns = messages.filter((m) => m.role === "user");
  if (userTurns.length <= 1) return s.first[detectCategory(userTurns.map((m) => m.content).join(" "))];
  return s.follow[(userTurns.length - 2) % s.follow.length];
}

type BriefScript = { what: Record<Category, string>; fault: string; doNow: string[]; avoid: string[]; opening: string };

const BRIEFS: Record<Lang, BriefScript> = {
  en: {
    what: {
      intimate:
        "Someone online got hold of private photos of your child and is threatening to share them unless they pay money. This is a crime called sextortion. These people target thousands of young people at once.",
      doxxing:
        "Someone posted your child's personal details, like their name, school and address, on social media, and strangers are leaving hurtful comments. This is called doxxing, and it is now something the government's Online Safety Commission can act on.",
      scam:
        "Your child answered an online job advertisement and was tricked into sending money for a fake 'fee'. Now the scammers are asking for more. These are organised criminal groups who fool adults too.",
      harassment:
        "Some classmates created an online chat group to mock your child and are sharing edited pictures of them. This is cyberbullying, and it has made your child afraid to go to school.",
      general: "Your child has been hurt by something that happened online and has found the courage to tell you.",
    },
    fault:
      "Your child was deliberately targeted by people who know exactly how to manipulate young people. Feeling scolded now would only make them hide things next time. They chose to tell you, which is brave.",
    doNow: [
      "Stay calm, listen first, and thank them for telling you",
      "Help save the evidence (screenshots), then report it together. As their parent, you can file with the Online Safety Commission (osc.gov.sg) or the police",
      "Check in on how they are feeling over the next few days. SOS 1767 and Mindline 1771 can help you both",
    ],
    avoid: [
      "Scolding or asking 'why were you so careless?'",
      "Taking away their phone. It holds the evidence and cuts them off from support",
      "Paying, replying to, or confronting the person responsible",
    ],
    opening:
      "Something happened online that I'm scared about. Please don't be angry. I'm telling you because I trust you, and I need you to help me report it.",
  },
  zh: {
    what: {
      intimate:
        "有人在网上拿到了孩子的私密照片，威胁说如果不付钱就把照片散布出去。这是一种叫“性勒索”的犯罪。这些人会同时针对成千上万的年轻人。",
      doxxing:
        "有人在社交媒体（例如Instagram）上公开了孩子的姓名、学校和住址，还有陌生人留下伤人的评论。这叫“人肉搜索”，政府的网络安全委员会现在可以处理。",
      scam: "孩子在网上应征兼职，被骗以“培训费”的名义转了钱。现在骗子还要更多钱。这些是有组织的犯罪集团，连大人也常常上当。",
      harassment: "一些同学在网上开了聊天群组取笑孩子，还分享恶搞孩子的照片。这是网络霸凌，孩子现在害怕去学校。",
      general: "孩子在网上遇到了让他/她受伤的事情，鼓起勇气来告诉您。",
    },
    fault: "孩子是被专门懂得操控年轻人的人故意盯上的。如果现在被责骂，下次孩子只会把事情藏起来。孩子选择告诉您，是很勇敢的。",
    doNow: [
      "保持冷静，先听孩子说，谢谢孩子告诉您",
      "帮忙保存证据（截图），然后一起举报。作为家长，您可以向网络安全委员会（osc.gov.sg）或警方报案",
      "接下来几天多关心孩子的心情。SOS 1767 和 Mindline 1771 可以帮助你们",
    ],
    avoid: ["责骂孩子，或问“你怎么这么不小心？”", "没收手机，因为手机里有证据，而且会让孩子失去支持", "付钱、回复或去找对方理论"],
    opening: "我在网上遇到了一件让我很害怕的事。请不要生气，我告诉您是因为我信任您。我需要您陪我一起去举报。",
  },
  ms: {
    what: {
      intimate:
        "Seseorang dalam talian mendapat gambar peribadi anak anda dan mengugut untuk menyebarkannya jika tidak dibayar. Ini jenayah yang dipanggil sekstorsi. Mereka menyasarkan ribuan anak muda serentak.",
      doxxing:
        "Seseorang menyiarkan butiran peribadi anak anda, seperti nama, sekolah dan alamat, di media sosial, dan orang asing menulis komen yang menyakitkan. Ini dipanggil doxxing, dan Suruhanjaya Keselamatan Dalam Talian kerajaan kini boleh mengambil tindakan.",
      scam:
        "Anak anda memohon kerja sambilan dalam talian dan ditipu untuk menghantar wang bagi 'yuran' palsu. Kini penipu meminta lebih. Ini kumpulan jenayah teratur yang turut menipu orang dewasa.",
      harassment:
        "Beberapa rakan sekelas membuat kumpulan chat dalam talian untuk mengejek anak anda dan berkongsi gambar yang diedit. Ini buli siber, dan anak anda kini takut ke sekolah.",
      general: "Anak anda telah disakiti oleh sesuatu yang berlaku dalam talian dan memberanikan diri untuk memberitahu anda.",
    },
    fault:
      "Anak anda sengaja disasarkan oleh orang yang tahu cara memanipulasi anak muda. Jika dimarahi sekarang, mereka akan menyembunyikan masalah lain kali. Mereka memilih untuk beritahu anda, dan itu satu keberanian.",
    doNow: [
      "Bertenang, dengar dahulu, dan ucap terima kasih kerana mereka beritahu",
      "Bantu simpan bukti (tangkap layar), kemudian buat laporan bersama. Sebagai ibu bapa, anda boleh melapor kepada Suruhanjaya Keselamatan Dalam Talian (osc.gov.sg) atau polis",
      "Tanya khabar perasaan mereka beberapa hari ini. SOS 1767 dan Mindline 1771 boleh membantu anda berdua",
    ],
    avoid: [
      "Memarahi atau bertanya 'kenapa cuai sangat?'",
      "Merampas telefon mereka, kerana ia menyimpan bukti dan memutuskan sokongan",
      "Membayar, membalas, atau berdepan dengan pelaku",
    ],
    opening:
      "Ada sesuatu berlaku dalam talian yang buat saya takut. Tolong jangan marah, saya beritahu kerana saya percaya pada anda. Saya perlukan anda temankan saya untuk buat laporan.",
  },
  ta: {
    what: {
      intimate:
        "இணையத்தில் ஒருவர் உங்கள் பிள்ளையின் தனிப்பட்ட புகைப்படங்களைப் பெற்று, பணம் கொடுக்காவிட்டால் அவற்றைப் பரப்புவதாக மிரட்டுகிறார். இது பாலியல் மிரட்டல் என்ற குற்றம். இவர்கள் ஒரே நேரத்தில் ஆயிரக்கணக்கான இளையர்களைக் குறிவைக்கிறார்கள்.",
      doxxing:
        "ஒருவர் உங்கள் பிள்ளையின் பெயர், பள்ளி, முகவரி போன்ற விவரங்களைச் சமூக ஊடகத்தில் வெளியிட்டார், அறியாதவர்கள் புண்படுத்தும் கருத்துகள் எழுதுகிறார்கள். இதை அரசாங்கத்தின் இணையப் பாதுகாப்பு ஆணையம் இப்போது கையாள முடியும்.",
      scam:
        "உங்கள் பிள்ளை இணையத்தில் ஒரு பகுதிநேர வேலைக்கு விண்ணப்பித்து, போலியான 'கட்டணம்' என்று ஏமாற்றப்பட்டுப் பணம் அனுப்பினார். இப்போது இன்னும் கேட்கிறார்கள். இவர்கள் பெரியவர்களையும் ஏமாற்றும் கும்பல்.",
      harassment:
        "சில வகுப்புத் தோழர்கள் உங்கள் பிள்ளையைக் கேலி செய்ய இணையக் குழு உருவாக்கி, திருத்திய படங்களைப் பகிர்கிறார்கள். இது இணையக் கொடுமைப்படுத்தல், உங்கள் பிள்ளை இப்போது பள்ளிக்குப் போகப் பயப்படுகிறார்.",
      general: "இணையத்தில் நடந்த ஒன்றால் உங்கள் பிள்ளை காயப்பட்டு, உங்களிடம் சொல்லத் துணிந்துள்ளார்.",
    },
    fault:
      "இளையர்களை ஏமாற்றத் தெரிந்தவர்களால் உங்கள் பிள்ளை வேண்டுமென்றே குறிவைக்கப்பட்டார். இப்போது திட்டினால், அடுத்த முறை விஷயங்களை மறைப்பார்கள். உங்களிடம் சொல்லத் தேர்ந்தெடுத்தது தைரியம்.",
    doNow: [
      "அமைதியாக இருங்கள், முதலில் கேளுங்கள், சொன்னதற்கு நன்றி சொல்லுங்கள்",
      "ஆதாரத்தைச் (திரைப்பிடிப்பு) சேமிக்க உதவி, சேர்ந்து புகாரளியுங்கள். பெற்றோராக நீங்கள் இணையப் பாதுகாப்பு ஆணையம் (osc.gov.sg) அல்லது காவல்துறையிடம் புகாரளிக்கலாம்",
      "அடுத்த சில நாட்கள் அவர்கள் மனநிலையைக் கவனியுங்கள். SOS 1767, Mindline 1771 உதவும்",
    ],
    avoid: [
      "திட்டுவது அல்லது 'ஏன் இவ்வளவு கவனக்குறைவு?' என்று கேட்பது",
      "கைபேசியைப் பறிப்பது. அதில் ஆதாரம் உள்ளது, ஆதரவும் துண்டிக்கப்படும்",
      "பணம் கொடுப்பது, பதில் அனுப்புவது, அல்லது குற்றவாளியை எதிர்கொள்வது",
    ],
    opening:
      "இணையத்தில் எனக்குப் பயமாக இருக்கும் ஒன்று நடந்தது. தயவுசெய்து கோபப்படாதீர்கள், உங்களை நம்புவதால்தான் சொல்கிறேன். புகாரளிக்க என்னுடன் வாருங்கள்.",
  },
};

export function demoBrief(messages: ChatMessage[], lang: Lang): FamilyBrief {
  const b = BRIEFS[lang];
  const cat = detectCategory(messages.filter((m) => m.role === "user").map((m) => m.content).join(" "));
  return { whatHappened: b.what[cat], notTheirFault: b.fault, doNow: b.doNow, avoid: b.avoid, openingLine: b.opening };
}

const PLATFORMS = ["Telegram", "Instagram", "TikTok", "Discord", "WhatsApp", "Snapchat", "Facebook", "X", "Twitter", "Roblox", "Carousell", "YouTube", "Reddit"];

export function demoIncident(messages: ChatMessage[]): Incident {
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join(" ");
  const category = detectCategory(text);
  const platform = PLATFORMS.find((p) => new RegExp(`\\b${p}\\b`, "i").test(text)) ?? "Unknown";
  const handles = [...new Set(text.match(/@[\w.]{2,30}/g) ?? [])];
  const money = text.match(/S?\$\s?\d[\d,]*(\.\d{2})?|\d[\d,]*\s?(元|块|dollars?|ringgit|வெள்ளி)/gi);
  const when =
    text.match(/\b(yesterday|last (night|week|month)|this (morning|week)|\d+ (days?|weeks?) ago|\d{1,2} (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\b/i)?.[0] ??
    "Unknown";
  const deadline = text.match(/\bby (tonight|today|tomorrow|\d{1,2}(:\d{2})?\s?(am|pm))\b/i)?.[0];
  const demands =
    category === "intimate" || category === "scam"
      ? (money
          ? `${category === "scam" ? "Money paid / requested" : "Payment demanded"}: ${money.join(", ")}`
          : "Payment or more images demanded") + (deadline ? `, ${deadline}` : "")
      : "None stated";
  const urgency: Incident["urgency"] = category === "intimate" || /tonight|today|deadline|threat|今晚|malam ini|இன்றிரவு/i.test(text) ? "high" : "medium";
  const firstUser = messages.find((m) => m.role === "user")?.content ?? "";
  return {
    category,
    platform,
    handles,
    firstSeen: when,
    summary: `The student reports: "${firstUser.slice(0, 400)}${firstUser.length > 400 ? "…" : ""}"`,
    demands,
    urgency,
  };
}
