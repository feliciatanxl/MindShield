import type { Audience, Lang } from "./types";

export const LANGS: { id: Lang; label: string; speech: string }[] = [
  { id: "en", label: "English", speech: "en-SG" },
  { id: "zh", label: "中文", speech: "zh-CN" },
  { id: "ms", label: "Melayu", speech: "ms-MY" },
  { id: "ta", label: "தமிழ்", speech: "ta-IN" },
];

export const LANG_NAME: Record<Lang, string> = {
  en: "English",
  zh: "Simplified Chinese (Mandarin)",
  ms: "Malay",
  ta: "Tamil",
};

type QuickStart = { label: string; text: string };

type Strings = {
  tagline: string;
  safeHere: string;
  nothingStored: string;
  chooseLang: string;
  howFeeling: string;
  moods: string[];
  whatHappened: string;
  quickStarts: QuickStart[];
  orType: string;
  tabs: { home: string; talk: string; family: string; action: string };
  placeholder: string;
  send: string;
  quickExit: string;
  getHelp: string;
  crisisTitle: string;
  crisisBody: string;
  redacted: (n: number) => string;
  familyCta: string;
  reportCta: string;
  thinking: string;
  demoMode: string;
  emptyTalk: string;
  family: {
    title: string;
    intro: string;
    who: string;
    audiences: Record<Audience, string>;
    theirLang: string;
    generate: string;
    needChat: string;
  };
  card: {
    heading: (who: string) => string;
    whatHappened: string;
    notTheirFault: string;
    doNow: string;
    avoid: string;
    fromChild: string;
    readAloud: string;
    stop: string;
    copy: string;
    copied: string;
    noVoice: string;
  };
  action: {
    title: string;
    intro: string;
    checklistTitle: string;
    checklist: string[];
    reportTitle: string;
    build: string;
    fields: {
      category: string;
      platform: string;
      handles: string;
      firstSeen: string;
      summary: string;
      demands: string;
    };
    routeTitle: string;
    download: string;
    print: string;
    under18: string;
  };
  hotlinesTitle: string;
  close: string;
};

export const T: Record<Lang, Strings> = {
  en: {
    tagline: "You're not alone in this.",
    safeHere: "You're safe here.",
    nothingStored:
      "Nothing is saved. Close this tab and it's all gone. Names, numbers and IC details are hidden before anything reaches the AI.",
    chooseLang: "Which language feels most comfortable?",
    howFeeling: "How are you feeling right now?",
    moods: ["Panicking", "Scared", "Ashamed", "Angry", "Numb"],
    whatHappened: "What's going on? Tap one, or just type.",
    quickStarts: [
      {
        label: "Someone is threatening to leak my photos",
        text: "Someone on Telegram has private photos of me and says they'll send them to my school group chat unless I pay $500 by tonight. I don't know what to do.",
      },
      {
        label: "I think I got scammed",
        text: "I applied for a part-time job online and transferred $300 for a 'training fee'. Now they're asking for more and I think it's a scam. My parents don't know.",
      },
      {
        label: "People are posting my personal info",
        text: "Someone posted my full name, school and home address on an Instagram page and people are commenting nasty things.",
      },
      {
        label: "I'm being bullied online",
        text: "My classmates made a group chat to make fun of me and they keep sharing edited pictures of me. I don't want to go to school.",
      },
    ],
    orType: "Or tell me in your own words…",
    tabs: { home: "Home", talk: "Talk", family: "Family", action: "Act" },
    placeholder: "Type here. Singlish is ok.",
    send: "Send",
    quickExit: "Quick exit",
    getHelp: "Get help now",
    crisisTitle: "You matter. Please talk to a real person now.",
    crisisBody: "Trained people are available right now, 24 hours, for free.",
    redacted: (n) => `${n} personal detail${n > 1 ? "s" : ""} hidden before sending to the AI`,
    familyCta: "Help me tell my family",
    reportCta: "Build my report",
    thinking: "Thinking…",
    demoMode: "Demo mode: scripted replies, no AI key set",
    emptyTalk: "Start on Home, or just say hi here.",
    family: {
      title: "Help me tell my family",
      intro:
        "Telling family can feel scarier than the harm itself. We'll write a calm, blame-free note in their language. You choose if and when to show it.",
      who: "Who do you want to tell?",
      audiences: { mum: "Mum", dad: "Dad", grandparent: "Grandparent", teacher: "Teacher / Counsellor" },
      theirLang: "Their language",
      generate: "Create the note",
      needChat: "Tell me a little about what happened in Talk first, so the note is accurate.",
    },
    card: {
      heading: (who) => `A note for ${who}`,
      whatHappened: "What happened",
      notTheirFault: "Why this is not their fault",
      doNow: "What helps right now",
      avoid: "Please avoid",
      fromChild: "What I want to say to you",
      readAloud: "Read aloud",
      stop: "Stop",
      copy: "Copy",
      copied: "Copied",
      noVoice: "No voice for this language on this device. Show the screen instead.",
    },
    action: {
      title: "Take back control",
      intro: "Small steps, in order. You don't have to do them all today.",
      checklistTitle: "Protect the evidence",
      checklist: [
        "Screenshot the messages, profile and URL (include date & time)",
        "Do NOT delete the chat, and do NOT reply or pay",
        "Report and block the account on the platform",
        "Turn on 2FA and change passwords you shared",
        "Tell one trusted adult (we can help: Family tab)",
      ],
      reportTitle: "Incident summary",
      build: "Build summary from our chat",
      fields: {
        category: "Type of harm",
        platform: "Platform",
        handles: "Account(s) involved",
        firstSeen: "When it started",
        summary: "What happened",
        demands: "What they want",
      },
      routeTitle: "Where to report",
      download: "Download",
      print: "Print",
      under18:
        "Under 18? A parent or guardian files the Online Safety Commission report with you. The Family tab can help you start that conversation.",
    },
    hotlinesTitle: "Talk to someone now",
    close: "Close",
  },

  zh: {
    tagline: "你不是一个人。",
    safeHere: "在这里你是安全的。",
    nothingStored: "我们不会保存任何内容。关闭页面就全部消失。姓名、电话和身份证号码会在发送给AI之前被隐藏。",
    chooseLang: "你最习惯用哪种语言？",
    howFeeling: "你现在感觉怎么样？",
    moods: ["很慌", "害怕", "羞耻", "生气", "麻木"],
    whatHappened: "发生了什么事？点一个，或直接打字。",
    quickStarts: [
      {
        label: "有人威胁要散布我的照片",
        text: "有人在Telegram上有我的私密照片，说如果我今晚不付500元，就把照片发到我学校的群组。我不知道该怎么办。",
      },
      {
        label: "我可能被骗了",
        text: "我在网上申请兼职，转了300元的“培训费”。现在他们又要更多钱，我觉得是诈骗。我爸妈不知道。",
      },
      {
        label: "有人公开了我的个人资料",
        text: "有人在Instagram上公开了我的全名、学校和住址，很多人在下面留难听的评论。",
      },
      {
        label: "我在网上被欺负",
        text: "同学开了一个群组专门取笑我，还一直分享我被恶搞的照片。我不想去学校了。",
      },
    ],
    orType: "或者用你自己的话告诉我……",
    tabs: { home: "首页", talk: "倾诉", family: "家人", action: "行动" },
    placeholder: "在这里输入……",
    send: "发送",
    quickExit: "快速离开",
    getHelp: "立即求助",
    crisisTitle: "你很重要。请现在就和真人聊聊。",
    crisisBody: "受过训练的人24小时都在，完全免费。",
    redacted: (n) => `已在发送给AI前隐藏 ${n} 项个人资料`,
    familyCta: "帮我告诉家人",
    reportCta: "整理我的报告",
    thinking: "正在思考……",
    demoMode: "演示模式：预设回复，未设置AI密钥",
    emptyTalk: "从首页开始，或者在这里打个招呼。",
    family: {
      title: "帮我告诉家人",
      intro: "告诉家人有时比事情本身更让人害怕。我们会用他们的语言写一段平静、不责怪的话。要不要给他们看、什么时候给，由你决定。",
      who: "你想告诉谁？",
      audiences: { mum: "妈妈", dad: "爸爸", grandparent: "爷爷奶奶 / 外公外婆", teacher: "老师 / 辅导员" },
      theirLang: "他们的语言",
      generate: "生成这段话",
      needChat: "请先在“倾诉”里简单说说发生了什么，这样内容才会准确。",
    },
    card: {
      heading: (who) => `写给${who}的话`,
      whatHappened: "发生了什么",
      notTheirFault: "为什么这不是孩子的错",
      doNow: "现在可以怎么帮忙",
      avoid: "请避免",
      fromChild: "我想对你说",
      readAloud: "朗读",
      stop: "停止",
      copy: "复制",
      copied: "已复制",
      noVoice: "此设备没有这种语言的语音。请直接给他们看屏幕。",
    },
    action: {
      title: "重新掌握主动权",
      intro: "一步一步来。不需要今天全部做完。",
      checklistTitle: "保留证据",
      checklist: [
        "截图保存聊天、对方账号和网址（包括日期和时间）",
        "不要删除聊天，不要回复，也不要付钱",
        "在平台上举报并封锁该账号",
        "开启双重验证，修改曾经泄露的密码",
        "告诉一位信任的大人（可以用“家人”页面）",
      ],
      reportTitle: "事件摘要",
      build: "根据我们的对话生成摘要",
      fields: {
        category: "伤害类型",
        platform: "平台",
        handles: "涉及的账号",
        firstSeen: "开始时间",
        summary: "经过",
        demands: "对方的要求",
      },
      routeTitle: "可以向哪里举报",
      download: "下载",
      print: "打印",
      under18: "未满18岁？网络安全委员会（OSC）的报告需由父母或监护人陪同提交。“家人”页面可以帮你开口。",
    },
    hotlinesTitle: "现在就找人聊聊",
    close: "关闭",
  },

  ms: {
    tagline: "Anda tidak keseorangan.",
    safeHere: "Anda selamat di sini.",
    nothingStored:
      "Tiada apa yang disimpan. Tutup tab ini dan semuanya hilang. Nama, nombor telefon dan butiran IC disembunyikan sebelum dihantar kepada AI.",
    chooseLang: "Bahasa mana yang paling selesa untuk anda?",
    howFeeling: "Bagaimana perasaan anda sekarang?",
    moods: ["Panik", "Takut", "Malu", "Marah", "Kosong"],
    whatHappened: "Apa yang berlaku? Pilih satu, atau taip sahaja.",
    quickStarts: [
      {
        label: "Seseorang ugut untuk sebarkan gambar saya",
        text: "Seseorang di Telegram ada gambar peribadi saya dan kata dia akan hantar ke group chat sekolah saya kalau saya tak bayar $500 malam ini. Saya tak tahu nak buat apa.",
      },
      {
        label: "Saya rasa saya kena tipu",
        text: "Saya mohon kerja sambilan dalam talian dan pindahkan $300 untuk 'yuran latihan'. Sekarang mereka minta lagi dan saya rasa ini penipuan. Ibu bapa saya tak tahu.",
      },
      {
        label: "Orang sebarkan maklumat peribadi saya",
        text: "Seseorang siarkan nama penuh, sekolah dan alamat rumah saya di satu page Instagram dan orang tulis komen yang jahat.",
      },
      {
        label: "Saya dibuli dalam talian",
        text: "Kawan sekelas buat group chat untuk ejek saya dan asyik kongsi gambar saya yang diedit. Saya tak nak pergi sekolah.",
      },
    ],
    orType: "Atau ceritakan dengan kata-kata anda sendiri…",
    tabs: { home: "Utama", talk: "Cerita", family: "Keluarga", action: "Tindakan" },
    placeholder: "Taip di sini…",
    send: "Hantar",
    quickExit: "Keluar cepat",
    getHelp: "Dapatkan bantuan",
    crisisTitle: "Anda penting. Sila bercakap dengan seseorang sekarang.",
    crisisBody: "Orang yang terlatih sedia membantu 24 jam, percuma.",
    redacted: (n) => `${n} butiran peribadi disembunyikan sebelum dihantar kepada AI`,
    familyCta: "Bantu saya beritahu keluarga",
    reportCta: "Sediakan laporan saya",
    thinking: "Sedang berfikir…",
    demoMode: "Mod demo: jawapan skrip, tiada kunci AI",
    emptyTalk: "Mula di halaman Utama, atau sapa sahaja di sini.",
    family: {
      title: "Bantu saya beritahu keluarga",
      intro:
        "Memberitahu keluarga kadang-kadang lebih menakutkan daripada kejadian itu sendiri. Kami akan tulis nota yang tenang dan tidak menyalahkan, dalam bahasa mereka. Anda yang tentukan bila mahu tunjukkan.",
      who: "Siapa yang anda mahu beritahu?",
      audiences: { mum: "Ibu", dad: "Ayah", grandparent: "Datuk / Nenek", teacher: "Guru / Kaunselor" },
      theirLang: "Bahasa mereka",
      generate: "Buat nota",
      needChat: "Ceritakan sedikit tentang apa yang berlaku di tab Cerita dahulu, supaya nota ini tepat.",
    },
    card: {
      heading: (who) => `Nota untuk ${who}`,
      whatHappened: "Apa yang berlaku",
      notTheirFault: "Kenapa ini bukan salah anak",
      doNow: "Apa yang membantu sekarang",
      avoid: "Sila elakkan",
      fromChild: "Apa yang saya mahu katakan",
      readAloud: "Baca dengan kuat",
      stop: "Berhenti",
      copy: "Salin",
      copied: "Disalin",
      noVoice: "Tiada suara untuk bahasa ini pada peranti ini. Tunjukkan skrin sahaja.",
    },
    action: {
      title: "Ambil semula kawalan",
      intro: "Langkah kecil, satu demi satu. Tak perlu buat semua hari ini.",
      checklistTitle: "Simpan bukti",
      checklist: [
        "Tangkap layar mesej, profil dan URL (termasuk tarikh & masa)",
        "JANGAN padam chat, JANGAN balas atau bayar",
        "Laporkan dan sekat akaun itu di platform",
        "Hidupkan 2FA dan tukar kata laluan yang pernah dikongsi",
        "Beritahu seorang dewasa yang dipercayai (tab Keluarga boleh bantu)",
      ],
      reportTitle: "Ringkasan kejadian",
      build: "Sediakan ringkasan daripada perbualan kita",
      fields: {
        category: "Jenis bahaya",
        platform: "Platform",
        handles: "Akaun terlibat",
        firstSeen: "Bila bermula",
        summary: "Apa yang berlaku",
        demands: "Apa yang mereka mahu",
      },
      routeTitle: "Di mana untuk melapor",
      download: "Muat turun",
      print: "Cetak",
      under18:
        "Bawah 18 tahun? Ibu bapa atau penjaga membuat laporan kepada Suruhanjaya Keselamatan Dalam Talian (OSC) bersama anda. Tab Keluarga boleh bantu anda mula bercakap.",
    },
    hotlinesTitle: "Bercakap dengan seseorang sekarang",
    close: "Tutup",
  },

  ta: {
    tagline: "நீங்கள் தனியாக இல்லை.",
    safeHere: "இங்கே நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்.",
    nothingStored:
      "எதுவும் சேமிக்கப்படாது. இந்த தாவலை மூடினால் எல்லாம் மறைந்துவிடும். பெயர், தொலைபேசி எண், அடையாள அட்டை விவரங்கள் AI-க்கு அனுப்பும் முன் மறைக்கப்படும்.",
    chooseLang: "எந்த மொழி உங்களுக்கு வசதியாக இருக்கிறது?",
    howFeeling: "இப்போது நீங்கள் எப்படி உணர்கிறீர்கள்?",
    moods: ["பதற்றம்", "பயம்", "வெட்கம்", "கோபம்", "உணர்வற்ற நிலை"],
    whatHappened: "என்ன நடக்கிறது? ஒன்றைத் தட்டுங்கள், அல்லது தட்டச்சு செய்யுங்கள்.",
    quickStarts: [
      {
        label: "என் புகைப்படங்களை வெளியிடுவதாக ஒருவர் மிரட்டுகிறார்",
        text: "Telegram-இல் ஒருவரிடம் என் தனிப்பட்ட புகைப்படங்கள் உள்ளன. இன்றிரவுக்குள் $500 கொடுக்காவிட்டால் என் பள்ளி குழு அரட்டைக்கு அனுப்புவேன் என்கிறார். என்ன செய்வதென்று தெரியவில்லை.",
      },
      {
        label: "நான் ஏமாற்றப்பட்டேன் என்று நினைக்கிறேன்",
        text: "இணையத்தில் பகுதிநேர வேலைக்கு விண்ணப்பித்து 'பயிற்சிக் கட்டணம்' என்று $300 அனுப்பினேன். இப்போது இன்னும் கேட்கிறார்கள், இது மோசடி என்று நினைக்கிறேன். என் பெற்றோருக்குத் தெரியாது.",
      },
      {
        label: "என் தனிப்பட்ட தகவல்களை வெளியிடுகிறார்கள்",
        text: "ஒருவர் என் முழுப் பெயர், பள்ளி, வீட்டு முகவரியை ஒரு Instagram பக்கத்தில் வெளியிட்டார், பலர் மோசமான கருத்துகள் எழுதுகிறார்கள்.",
      },
      {
        label: "இணையத்தில் என்னைக் கேலி செய்கிறார்கள்",
        text: "என் வகுப்புத் தோழர்கள் என்னைக் கேலி செய்ய ஒரு குழு அரட்டை உருவாக்கி, என் படங்களைத் திருத்திப் பகிர்கிறார்கள். பள்ளிக்குப் போக விருப்பமில்லை.",
      },
    ],
    orType: "அல்லது உங்கள் சொந்த வார்த்தைகளில் சொல்லுங்கள்…",
    tabs: { home: "முகப்பு", talk: "பேசு", family: "குடும்பம்", action: "செயல்" },
    placeholder: "இங்கே தட்டச்சு செய்யுங்கள்…",
    send: "அனுப்பு",
    quickExit: "விரைவு வெளியேற்றம்",
    getHelp: "இப்போதே உதவி",
    crisisTitle: "நீங்கள் முக்கியமானவர். தயவுசெய்து இப்போதே ஒருவரிடம் பேசுங்கள்.",
    crisisBody: "பயிற்சி பெற்றவர்கள் 24 மணி நேரமும் இலவசமாக உதவத் தயாராக உள்ளனர்.",
    redacted: (n) => `AI-க்கு அனுப்பும் முன் ${n} தனிப்பட்ட விவரங்கள் மறைக்கப்பட்டன`,
    familyCta: "என் குடும்பத்திடம் சொல்ல உதவுங்கள்",
    reportCta: "என் அறிக்கையைத் தயாரி",
    thinking: "யோசிக்கிறது…",
    demoMode: "டெமோ முறை: முன்னமைக்கப்பட்ட பதில்கள், AI சாவி இல்லை",
    emptyTalk: "முகப்பில் தொடங்குங்கள், அல்லது இங்கே வணக்கம் சொல்லுங்கள்.",
    family: {
      title: "என் குடும்பத்திடம் சொல்ல உதவுங்கள்",
      intro:
        "குடும்பத்திடம் சொல்வது சில நேரம் நடந்ததை விட அதிகம் பயமாக இருக்கும். அவர்கள் மொழியில், அமைதியான, குற்றம் சாட்டாத ஒரு குறிப்பை எழுதுவோம். எப்போது காட்டுவது என்பது உங்கள் முடிவு.",
      who: "யாரிடம் சொல்ல விரும்புகிறீர்கள்?",
      audiences: { mum: "அம்மா", dad: "அப்பா", grandparent: "தாத்தா / பாட்டி", teacher: "ஆசிரியர் / ஆலோசகர்" },
      theirLang: "அவர்களின் மொழி",
      generate: "குறிப்பை உருவாக்கு",
      needChat: "முதலில் 'பேசு' பகுதியில் நடந்ததைச் சுருக்கமாகச் சொல்லுங்கள், அப்போது குறிப்பு சரியாக இருக்கும்.",
    },
    card: {
      heading: (who) => `${who}-க்கு ஒரு குறிப்பு`,
      whatHappened: "என்ன நடந்தது",
      notTheirFault: "இது ஏன் பிள்ளையின் தவறு அல்ல",
      doNow: "இப்போது எது உதவும்",
      avoid: "தயவுசெய்து தவிர்க்கவும்",
      fromChild: "நான் சொல்ல விரும்புவது",
      readAloud: "சத்தமாக வாசி",
      stop: "நிறுத்து",
      copy: "நகலெடு",
      copied: "நகலெடுக்கப்பட்டது",
      noVoice: "இந்தச் சாதனத்தில் இந்த மொழிக்குக் குரல் இல்லை. திரையைக் காட்டுங்கள்.",
    },
    action: {
      title: "கட்டுப்பாட்டை மீண்டும் பெறுங்கள்",
      intro: "சிறிய படிகள், ஒவ்வொன்றாக. இன்றே எல்லாவற்றையும் செய்ய வேண்டியதில்லை.",
      checklistTitle: "ஆதாரத்தைப் பாதுகாக்கவும்",
      checklist: [
        "செய்திகள், சுயவிவரம், URL-ஐ திரைப்பிடிப்பு எடுங்கள் (தேதி & நேரத்துடன்)",
        "அரட்டையை அழிக்காதீர்கள், பதில் அளிக்கவோ பணம் கொடுக்கவோ வேண்டாம்",
        "அந்தக் கணக்கைத் தளத்தில் புகாரளித்துத் தடுக்கவும்",
        "2FA-வை இயக்கி, பகிர்ந்த கடவுச்சொற்களை மாற்றவும்",
        "நம்பகமான ஒரு பெரியவரிடம் சொல்லுங்கள் (குடும்பம் பகுதி உதவும்)",
      ],
      reportTitle: "சம்பவச் சுருக்கம்",
      build: "நம் உரையாடலிலிருந்து சுருக்கம் உருவாக்கு",
      fields: {
        category: "தீங்கின் வகை",
        platform: "தளம்",
        handles: "சம்பந்தப்பட்ட கணக்குகள்",
        firstSeen: "எப்போது தொடங்கியது",
        summary: "என்ன நடந்தது",
        demands: "அவர்கள் என்ன கேட்கிறார்கள்",
      },
      routeTitle: "எங்கே புகாரளிப்பது",
      download: "பதிவிறக்கு",
      print: "அச்சிடு",
      under18:
        "18 வயதுக்குக் கீழா? இணையப் பாதுகாப்பு ஆணையத்திடம் (OSC) பெற்றோர் அல்லது பாதுகாவலர் உங்களுடன் சேர்ந்து புகாரளிப்பார். 'குடும்பம்' பகுதி பேச்சைத் தொடங்க உதவும்.",
    },
    hotlinesTitle: "இப்போதே ஒருவரிடம் பேசுங்கள்",
    close: "மூடு",
  },
};
