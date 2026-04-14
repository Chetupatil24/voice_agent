"use client";
import { useState, useEffect } from "react";

const T = {
  en: {
    badge: "Built for India's 63M+ SMBs",
    h1a: "Your Business Answers",
    h1b: "Every Call. Even at 3 AM.",
    sub: "Multilingual AI Voice Agents for Indian SMBs. Handle inquiries, book appointments, and close sales in English, Hindi, and Kannada — while you sleep.",
    cta1: "Start Free Trial", cta2: "Watch Demo",
    statsLabel: ["Businesses Automated","Calls Handled Daily","Languages Supported","Avg Response Time"],
    statsVal:   ["2,000+","45,000+","3","<200ms"],
    featTitle: "Everything your front desk needs.", featSub: "From answering the first ring to booking the appointment — fully automated, always on.",
    features: [
      { icon:"translate",title:"Multilingual AI",desc:"Flawless Hindi, English & Kannada with Hinglish and regional accent handling." },
      { icon:"schedule",title:"Smart Appointments",desc:"AI syncs with your calendar, confirms bookings via WhatsApp, and sends reminders." },
      { icon:"auto_awesome",title:"Intent Recognition",desc:"Understands complex Indian queries — pricing, availability, directions, FAQs." },
      { icon:"flash_on",title:"Instant Responses",desc:"Sub-200ms latency for natural, human-like voice conversations round the clock." },
      { icon:"analytics",title:"Live Analytics",desc:"Real-time call dashboards, sentiment analysis, and conversion tracking." },
      { icon:"integration_instructions",title:"CRM Integrations",desc:"Connects to Zoho, HubSpot, WhatsApp Business, and custom webhooks." },
    ],
    demoTitle:"Hear the future of Indian commerce.", demoSub:"Our AI understands dialects, accents, and local nuances. Switch languages mid-call.",
    pricingTitle:"Transparent Pricing", pricingSub:"Simple plans that scale as you grow. No hidden fees.",
    pricingPlans:[
      { name:"Starter",price:"₹4,999",period:"/mo",color:"primary",features:["500 Minutes/month","2 Shared Numbers","Appointment Booking","WhatsApp Alerts","Basic Analytics"],cta:"Get Started" },
      { name:"Growth",price:"₹14,999",period:"/mo",color:"secondary",popular:true,features:["2,000 Minutes/month","Dedicated Number","CRM Integration","Custom Voice Persona","Priority Support"],cta:"Start Growth" },
      { name:"Enterprise",price:"Custom",period:"",color:"tertiary",features:["Unlimited Minutes","Multi-Location","Custom AI Training","SLA Guarantee","Dedicated Manager"],cta:"Contact Sales" },
    ],
    testimonials:[
      { name:"Rajesh Patil",biz:"Patil Motors, Pune",quote:"Missed calls dropped to zero. We're booking 40% more test drives.",avatar:"R" },
      { name:"Dr. Priya Sharma",biz:"Smile Dental, Bengaluru",quote:"Our receptionist handles 10 calls a day. VaaniAI handles 200.",avatar:"P" },
      { name:"Ankit Gupta",biz:"QuickKart India",quote:"Customers can't tell it's AI. The Hindi is flawless.",avatar:"A" },
    ],
    finalTitle:"Ready to never miss a lead?", finalSub:"Join 2,000+ Indian businesses automating their front desk with VaaniAI.", finalCta:"Get Started Free",
  },
  hi: {
    badge:"भारत के 6.3 करोड़+ SMBs के लिए",
    h1a:"आपका व्यवसाय हर कॉल का",
    h1b:"जवाब देता है। रात 3 बजे भी।",
    sub:"भारतीय SMBs के लिए बहुभाषी AI वॉइस एजेंट। हिंदी, अंग्रेजी और कन्नड़ में पूछताछ संभालें — सोते समय भी।",
    cta1:"निःशुल्क ट्रायल", cta2:"डेमो देखें",
    statsLabel:["स्वचालित व्यवसाय","दैनिक कॉल","भाषाएं","औसत प्रतिक्रिया"],
    statsVal:["2,000+","45,000+","3","<200ms"],
    featTitle:"आपके फ्रंट डेस्क की सब जरूरतें।", featSub:"पहली रिंग से बुकिंग तक — पूरी तरह स्वचालित।",
    features:[
      { icon:"translate",title:"बहुभाषी AI",desc:"बेदाग हिंदी, अंग्रेजी और कन्नड़ — हिंग्लिश सहित।" },
      { icon:"schedule",title:"स्मार्ट अपॉइंटमेंट",desc:"AI कैलेंडर से सिंक होता है और WhatsApp पर पुष्टि करता है।" },
      { icon:"auto_awesome",title:"इरादा पहचान",desc:"जटिल भारतीय व्यवसाय प्रश्नों को समझता है।" },
      { icon:"flash_on",title:"तत्काल प्रतिक्रिया",desc:"200ms से कम विलंब के साथ स्वाभाविक बातचीत।" },
      { icon:"analytics",title:"लाइव एनालिटिक्स",desc:"वास्तविक समय कॉल डैशबोर्ड और ट्रैकिंग।" },
      { icon:"integration_instructions",title:"CRM एकीकरण",desc:"Zoho, HubSpot, WhatsApp Business से जुड़ें।" },
    ],
    demoTitle:"भारतीय व्यापार का भविष्य सुनें।", demoSub:"हमारा AI बोलियों और लहजों को समझता है। कॉल के बीच भाषा बदलें।",
    pricingTitle:"पारदर्शी मूल्य", pricingSub:"सरल प्लान। कोई छिपा शुल्क नहीं।",
    pricingPlans:[
      { name:"स्टार्टर",price:"₹4,999",period:"/माह",color:"primary",features:["500 मिनट/माह","2 शेयर्ड नंबर","अपॉइंटमेंट बुकिंग","WhatsApp अलर्ट","बेसिक एनालिटिक्स"],cta:"शुरू करें" },
      { name:"ग्रोथ",price:"₹14,999",period:"/माह",color:"secondary",popular:true,features:["2,000 मिनट/माह","डेडिकेटेड नंबर","CRM इंटीग्रेशन","कस्टम वॉइस","प्राथमिकता समर्थन"],cta:"ग्रोथ शुरू" },
      { name:"एंटरप्राइज",price:"कस्टम",period:"",color:"tertiary",features:["असीमित मिनट","मल्टी-लोकेशन","कस्टम AI ट्रेनिंग","SLA गारंटी","डेडिकेटेड मैनेजर"],cta:"बिक्री संपर्क" },
    ],
    testimonials:[
      { name:"राजेश पाटिल",biz:"पाटिल मोटर्स, पुणे",quote:"मिस्ड कॉल शून्य हो गई। 40% ज्यादा बुकिंग।",avatar:"R" },
      { name:"डॉ. प्रिया शर्मा",biz:"स्माइल डेंटल, बेंगलुरु",quote:"रिसेप्शनिस्ट 10 कॉल लेता था। VaaniAI 200 लेता है।",avatar:"P" },
      { name:"अंकित गुप्ता",biz:"QuickKart India",quote:"ग्राहक नहीं बता पाते कि AI है। हिंदी बिल्कुल सही।",avatar:"A" },
    ],
    finalTitle:"कोई भी लीड न गंवाएं।", finalSub:"2,000+ भारतीय व्यवसायों से जुड़ें।", finalCta:"मुफ्त शुरू करें",
  },
  kn: {
    badge:"ಭಾರತದ 6.3 ಕೋಟಿ+ SMB ಗಳಿಗಾಗಿ",
    h1a:"ನಿಮ್ಮ ವ್ಯವಹಾರ ಪ್ರತಿ ಕರೆಗೆ",
    h1b:"ಉತ್ತರಿಸುತ್ತದೆ. ರಾತ್ರಿ 3 ಗಂಟೆಗೂ.",
    sub:"ಭಾರತೀಯ SMB ಗಳಿಗಾಗಿ ಬಹುಭಾಷಾ AI ವಾಯ್ಸ್ ಏಜೆಂಟ್‌ಗಳು. ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ವಿಚಾರಣೆ ನಿರ್ವಹಿಸಿ.",
    cta1:"ಉಚಿತ ಪ್ರಯೋಗ", cta2:"ಡೆಮೋ ನೋಡಿ",
    statsLabel:["ಸ್ವಯಂಚಾಲಿತ ವ್ಯವಹಾರಗಳು","ದೈನಿಕ ಕರೆಗಳು","ಭಾಷೆಗಳು","ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ"],
    statsVal:["2,000+","45,000+","3","<200ms"],
    featTitle:"ನಿಮ್ಮ ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ನ ಎಲ್ಲ ಅಗತ್ಯಗಳು.", featSub:"ಮೊದಲ ರಿಂಗ್‌ನಿಂದ ಬುಕಿಂಗ್‌ವರೆಗೆ — ಸಂಪೂರ್ಣ ಸ್ವಯಂಚಾಲಿತ.",
    features:[
      { icon:"translate",title:"ಬಹುಭಾಷಾ AI",desc:"ನಿರ್ದೋಷ ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್ — ಪ್ರಾದೇಶಿಕ ಉಚ್ಚಾರಣೆ ಬೆಂಬಲ." },
      { icon:"schedule",title:"ಸ್ಮಾರ್ಟ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",desc:"AI ಕ್ಯಾಲೆಂಡರ್ ಸಿಂಕ್ ಮತ್ತು WhatsApp ದೃಢೀಕರಣ." },
      { icon:"auto_awesome",title:"ಉದ್ದೇಶ ಗುರುತಿಸುವಿಕೆ",desc:"ಸಂಕೀರ್ಣ ಭಾರತೀಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ." },
      { icon:"flash_on",title:"ತಕ್ಷಣ ಪ್ರತಿಕ್ರಿಯೆ",desc:"200ms ಗಿಂತ ಕಡಿಮೆ ವಿಳಂಬ — ನೈಸರ್ಗಿಕ ಸಂಭಾಷಣೆ." },
      { icon:"analytics",title:"ಲೈವ್ ಅನಾಲಿಟಿಕ್ಸ್",desc:"ನೈಜ-ಸಮಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್." },
      { icon:"integration_instructions",title:"CRM ಏಕೀಕರಣ",desc:"Zoho, HubSpot, WhatsApp Business ಗೆ ಸಂಪರ್ಕ." },
    ],
    demoTitle:"ಭಾರತೀಯ ವಾಣಿಜ್ಯದ ಭವಿಷ್ಯ ಕೇಳಿ.", demoSub:"ನಮ್ಮ AI ಉಪಭಾಷೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ.",
    pricingTitle:"ಪಾರದರ್ಶಕ ಬೆಲೆ", pricingSub:"ಸರಳ ಯೋಜನೆಗಳು. ಅಡಗಿದ ಶುಲ್ಕಗಳಿಲ್ಲ.",
    pricingPlans:[
      { name:"ಸ್ಟಾರ್ಟರ್",price:"₹4,999",period:"/ತಿಂಗಳು",color:"primary",features:["500 ನಿಮಿಷ/ತಿಂಗಳು","2 ಹಂಚಿಕೆ ಸಂಖ್ಯೆ","ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕಿಂಗ್","WhatsApp ಅಲರ್ಟ್","ಮೂಲ ಅನಾಲಿಟಿಕ್ಸ್"],cta:"ಪ್ರಾರಂಭಿಸಿ" },
      { name:"ಗ್ರೋಥ್",price:"₹14,999",period:"/ತಿಂಗಳು",color:"secondary",popular:true,features:["2,000 ನಿಮಿಷ","ಡೆಡಿಕೇಟೆಡ್ ನಂಬರ್","CRM ಏಕೀಕರಣ","ಕಸ್ಟಮ್ ಧ್ವನಿ","ಆದ್ಯತಾ ಬೆಂಬಲ"],cta:"ಗ್ರೋಥ್ ಪ್ರಾರಂಭ" },
      { name:"ಎಂಟರ್‌ಪ್ರೈಸ್",price:"ಕಸ್ಟಮ್",period:"",color:"tertiary",features:["ಅಪರಿಮಿತ ನಿಮಿಷ","ಮಲ್ಟಿ-ಲೊಕೇಶನ್","ಕಸ್ಟಮ್ AI","SLA ಗ್ಯಾರಂಟಿ","ಡೆಡಿಕೇಟೆಡ್ ಮ್ಯಾನೇಜರ್"],cta:"ಮಾರಾಟ ಸಂಪರ್ಕ" },
    ],
    testimonials:[
      { name:"ರಾಜೇಶ್ ಪಾಟೀಲ್",biz:"ಪಾಟೀಲ್ ಮೋಟರ್ಸ್, ಪುಣೆ",quote:"ಮಿಸ್ಡ್ ಕಾಲ್ ಶೂನ್ಯ. 40% ಹೆಚ್ಚು ಬುಕಿಂಗ್.",avatar:"R" },
      { name:"ಡಾ. ಪ್ರಿಯಾ ಶರ್ಮಾ",biz:"ಸ್ಮೈಲ್ ಡೆಂಟಲ್, ಬೆಂಗಳೂರು",quote:"VaaniAI 200 ಕಾಲ್ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ.",avatar:"P" },
      { name:"ಅಂಕಿತ್ ಗುಪ್ತಾ",biz:"QuickKart India",quote:"ಇದು AI ಎಂದು ತಿಳಿಯುವುದಿಲ್ಲ. ಕನ್ನಡ ನಿರ್ದೋಷ.",avatar:"A" },
    ],
    finalTitle:"ಯಾವ ಲೀಡ್ ತಪ್ಪಿಸಿಕೊಳ್ಳಲು ಸಿದ್ಧ?", finalSub:"2,000+ ಭಾರತೀಯ ವ್ಯವಹಾರಗಳು VaaniAI ಬಳಸುತ್ತಿವೆ.", finalCta:"ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",
  },
};

type Lang = keyof typeof T;

function Waveform() {
  const h = [3,6,10,14,10,6,8,12,8,5,9,13,9,6,4];
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {h.map((v, i) => (
        <div key={i} className="wave-bar rounded-full" style={{ height: `${v*3}px`, animationDelay:`${i*0.08}s` }} />
      ))}
    </div>
  );
}

const cm: Record<string,{ring:string;badge:string;btnCls:string;icon:string}> = {
  primary:   { ring:"border-t-primary",   badge:"bg-primary/10 text-primary",     btnCls:"bg-primary text-on-primary",           icon:"text-primary"   },
  secondary: { ring:"border-t-secondary", badge:"bg-secondary/10 text-secondary", btnCls:"bg-secondary text-on-secondary",       icon:"text-secondary" },
  tertiary:  { ring:"border-t-tertiary",  badge:"bg-tertiary/10 text-tertiary",   btnCls:"bg-gradient-to-r from-tertiary to-tertiary-container text-on-tertiary", icon:"text-tertiary"  },
};

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const c = T[lang];
  const langKeys: Lang[] = ["en","hi","kn"];
  const langLabels = ["English","हिंदी","ಕನ್ನಡ"];
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t+1), 2000); return () => clearInterval(id); }, []);

  const convMsgs = [
    { role:"caller", text:"Hello, main appointment lena chahta hoon", lang:"Hindi" },
    { role:"ai",     text:"Bilkul! Dr. Sharma ke liye Tuesday 3pm chalega?", lang:"Hindi" },
    { role:"caller", text:"Yes, perfect.", lang:"EN" },
    { role:"ai",     text:"Confirmed! WhatsApp reminder bhejunga.", lang:"EN" },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background:"#050810" }}>

      {/* ── Navbar ── */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-3.5" style={{ background:"rgba(5,8,16,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-6">
          <a href="/" className="text-2xl font-black font-headline tracking-tight" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VaaniAI</a>
          <div className="hidden md:flex gap-1 p-1 rounded-full" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
            {langKeys.map((k,i) => (
              <button key={k} onClick={() => setLang(k)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang===k ? "text-on-primary shadow-lg" : "text-on-surface-variant hover:text-on-surface"}`}
                style={lang===k ? { background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 4px 15px rgba(70,241,197,0.3)" } : {}}>
                {langLabels[i]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login" className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Login</a>
          <a href="/register" className="px-5 py-2.5 rounded-full text-sm font-bold text-on-primary transition-all hover:scale-105" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 4px 20px rgba(70,241,197,0.3)" }}>
            Get Started →
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden hero-mesh">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        {/* orbs */}
        <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(70,241,197,0.1),transparent 70%)", top:"-150px", left:"-150px", animation:"orb-float 10s ease-in-out infinite" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(199,191,255,0.1),transparent 70%)", bottom:"-100px", right:"-100px", animation:"orb-float 13s ease-in-out infinite", animationDelay:"3s" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(255,168,88,0.07),transparent 70%)", top:"40%", right:"8%", animation:"orb-float 9s ease-in-out infinite", animationDelay:"1.5s" }} />

        <div className="relative z-10 max-w-5xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background:"rgba(70,241,197,0.08)", border:"1px solid rgba(70,241,197,0.2)", color:"#46f1c5" }}>
            <span className="status-dot-live" />{c.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black leading-[1.05] tracking-tight">
            <span className="block text-on-surface">{c.h1a}</span>
            <span className="block" style={{ background:"linear-gradient(135deg,#46f1c5 0%,#c7bfff 50%,#ffcea6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{c.h1b}</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{c.sub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a href="/register" className="px-8 py-4 rounded-2xl font-bold text-base text-on-primary hover:scale-105 active:scale-95 transition-all" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 8px 30px rgba(70,241,197,0.35)" }}>
              {c.cta1}
            </a>
            <button className="px-8 py-4 rounded-2xl font-semibold text-base text-on-surface flex items-center gap-2 hover:border-primary/40 hover:text-primary transition-all" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <span className="material-symbols-outlined text-lg">play_circle</span>{c.cta2}
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap pt-2">
            {["No credit card required","14-day free trial","Cancel anytime"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>{t}
              </span>
            ))}
          </div>
        </div>

        {/* hero cards */}
        <div className="relative z-10 mt-16 w-full max-w-6xl px-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7 rounded-3xl p-6 card-lift" style={{ background:"rgba(28,32,40,0.7)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"rgba(70,241,197,0.1)" }}>
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings:"'FILL' 1" }}>support_agent</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Live Agent Conversation</p>
                    <p className="text-[10px] text-on-surface-variant">Vaani Dental — incoming call</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background:"rgba(70,241,197,0.08)", border:"1px solid rgba(70,241,197,0.2)" }}>
                  <span className="status-dot-live" />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:"#46f1c5" }}>LIVE</span>
                </div>
              </div>
              <div className="space-y-3">
                {convMsgs.map((msg,i) => (
                  <div key={i} className={`flex gap-3 ${msg.role==="ai" ? "" : "flex-row-reverse"}`}
                    style={{ opacity: tick > i*0.5 ? 1 : 0.3, transition:"opacity 0.5s" }}>
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{ background: msg.role==="ai" ? "rgba(70,241,197,0.15)" : "rgba(255,255,255,0.06)", color: msg.role==="ai" ? "#46f1c5" : "#bacac2" }}>
                      {msg.role==="ai" ? "AI" : "👤"}
                    </div>
                    <div className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                      style={msg.role==="ai"
                        ? { background:"rgba(70,241,197,0.08)", border:"1px solid rgba(70,241,197,0.15)", borderTopLeftRadius:4 }
                        : { background:"rgba(255,255,255,0.05)", borderTopRightRadius:4 }}>
                      <p className="text-on-surface">{msg.text}</p>
                      <span className="text-[9px] font-bold mt-1 block" style={{ color: msg.role==="ai" ? "rgba(70,241,197,0.5)" : "rgba(186,202,194,0.5)" }}>{msg.lang}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                <Waveform />
                <p className="text-center text-[10px] text-on-surface-variant mt-1 tracking-widest uppercase">Processing speech...</p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
              {[
                { icon:"call", color:"#46f1c5", colorBg:"rgba(70,241,197,0.1)", label:"Calls today", value:"247", sub:"78% of daily quota", pct:78 },
                { icon:"event_available", color:"#c7bfff", colorBg:"rgba(199,191,255,0.1)", label:"Booked this week", value:"94", sub:"+32% vs last week" },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl p-5 card-lift" style={{ background:"rgba(28,32,40,0.7)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="material-symbols-outlined text-2xl" style={{ color:card.color, fontVariationSettings:"'FILL' 1" }}>{card.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:card.colorBg, color:card.color }}>Today</span>
                  </div>
                  <p className="text-3xl font-headline font-black text-on-surface">{card.value}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{card.label}</p>
                  {card.pct && <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}><div className="h-full rounded-full" style={{ width:`${card.pct}%`, background:`linear-gradient(90deg,${card.color},${card.color}aa)` }} /></div>}
                  <p className="text-[10px] mt-1 font-bold" style={{ color:card.color }}>{card.sub}</p>
                </div>
              ))}
              <div className="rounded-2xl p-5" style={{ background:"rgba(28,32,40,0.7)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Latency</p><p className="text-xl font-headline font-black" style={{ color:"#46f1c5" }}>187ms</p></div>
                  <div><p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">CSAT</p><p className="text-xl font-headline font-black" style={{ color:"#c7bfff" }}>98.4%</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y" style={{ background:"#07090f", borderColor:"rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {(c.statsVal as string[]).map((val,i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-headline font-black" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{val}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">{(c.statsLabel as string[])[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="py-8 overflow-hidden" style={{ background:"#07090f", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-center text-[10px] uppercase tracking-widest mb-5" style={{ color:"rgba(186,202,194,0.3)", fontWeight:700 }}>Trusted by innovative Indian businesses</p>
        <div className="overflow-hidden">
          <div className="ticker-track">
            {["QuickKart","Patil Motors","Vaani Dental","BrightEdu","TechServe","StarHub Retail","MediCare Plus","AutoZone India","QuickKart","Patil Motors","Vaani Dental","BrightEdu","TechServe","StarHub Retail","MediCare Plus","AutoZone India"].map((b,i) => (
              <span key={i} className="font-headline font-bold text-lg tracking-widest uppercase px-8" style={{ color:"rgba(186,202,194,0.2)" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-28" style={{ background:"#07090f" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface mb-4">{c.featTitle}</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">{c.featSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(c.features as {icon:string;title:string;desc:string}[]).map((feat,i) => {
              const colors = ["rgba(70,241,197,0.1)","rgba(199,191,255,0.1)","rgba(255,168,88,0.1)"];
              const textColors = ["#46f1c5","#c7bfff","#ffcea6"];
              return (
                <div key={i} className="feat-card rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center" style={{ background:colors[i%3] }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color:textColors[i%3], fontVariationSettings:"'FILL' 1" }}>{feat.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-on-surface text-lg mb-2">{feat.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Demo ── */}
      <section className="py-28 relative overflow-hidden" style={{ background:"#050810" }}>
        <div className="absolute w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(70,241,197,0.05),transparent 60%)", top:"50%", left:"-200px", transform:"translateY(-50%)" }} />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6" style={{ background:"rgba(199,191,255,0.08)", border:"1px solid rgba(199,191,255,0.2)", color:"#c7bfff" }}>
              <span className="material-symbols-outlined text-sm">mic</span>Live Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface mb-6 leading-tight">{c.demoTitle}</h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">{c.demoSub}</p>
            {[
              { icon:"translate",  color:"#46f1c5",  bg:"rgba(70,241,197,0.08)",  border:"rgba(70,241,197,0.2)",  t:"Multi-Dialect Support",  d:"Seamless Hindi-English (Hinglish) and regional accents." },
              { icon:"flash_on",   color:"#c7bfff",  bg:"rgba(199,191,255,0.08)", border:"rgba(199,191,255,0.2)", t:"Ultra-Low Latency",       d:"< 200ms response for natural conversations." },
              { icon:"headphones", color:"#ffcea6",  bg:"rgba(255,206,166,0.08)", border:"rgba(255,206,166,0.2)", t:"Natural Voice Quality",   d:"High-fidelity TTS with emotion and tone matching." },
            ].map(item => (
              <div key={item.t} className="flex items-start gap-4 p-4 rounded-2xl mb-3" style={{ background:item.bg, border:`1px solid ${item.border}` }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background:item.bg }}>
                  <span className="material-symbols-outlined" style={{ color:item.color, fontVariationSettings:"'FILL' 1" }}>{item.icon}</span>
                </div>
                <div><h4 className="font-bold text-on-surface">{item.t}</h4><p className="text-sm text-on-surface-variant">{item.d}</p></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-[280px] h-[560px] rounded-[3rem] p-4 relative" style={{ background:"#0c0f1a", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 0 80px rgba(70,241,197,0.12)" }}>
                <div className="w-24 h-6 rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2" style={{ background:"#0a0d13" }} />
                <div className="h-full w-full rounded-[2.3rem] overflow-hidden flex flex-col items-center justify-between py-12 px-6" style={{ background:"#050810" }}>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 pulse-ring" style={{ background:"rgba(70,241,197,0.1)" }}>
                      <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings:"'FILL' 1" }}>mic</span>
                    </div>
                    <h4 className="text-xl font-headline font-black text-on-surface">VaaniAI</h4>
                    <p className="text-xs font-bold animate-pulse mt-1 tracking-widest uppercase" style={{ color:"#46f1c5" }}>Listening...</p>
                  </div>
                  <Waveform />
                  <div className="w-full space-y-3">
                    <div className="flex gap-1 p-1 rounded-xl" style={{ background:"rgba(255,255,255,0.04)" }}>
                      {["EN","HI","KN"].map((l,i) => (
                        <button key={l} className="flex-1 py-2 text-[10px] font-bold rounded-lg transition-all"
                          style={i===0 ? { background:"linear-gradient(135deg,#46f1c5,#00d4aa)", color:"#00382b", boxShadow:"0 4px 10px rgba(70,241,197,0.3)" } : { color:"rgba(186,202,194,0.6)" }}>
                          {l}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background:"rgba(70,241,197,0.06)", border:"1px solid rgba(70,241,197,0.1)" }}>
                      <p className="text-[11px] text-on-surface leading-relaxed">"Hello! Vaani Dental here. How can I help you today?"</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-16 rounded-full -z-10" style={{ background:"radial-gradient(circle,rgba(70,241,197,0.06),transparent 70%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-28" style={{ background:"#07090f" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface mb-4">{c.pricingTitle}</h2>
            <p className="text-on-surface-variant text-lg">{c.pricingSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {(c.pricingPlans as {name:string;price:string;period:string;color:string;popular?:boolean;features:string[];cta:string}[]).map((plan) => {
              const isPopular = plan.popular;
              return (
                <div key={plan.name} className={`relative rounded-3xl p-8 price-card transition-all duration-300 ${isPopular ? "md:-mt-6" : ""}`}
                  style={{
                    background:"rgba(24,28,36,0.9)",
                    border:isPopular ? "1px solid rgba(199,191,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
                    borderTop:`4px solid ${plan.color==="primary" ? "#46f1c5" : plan.color==="secondary" ? "#c7bfff" : "#ffcea6"}`,
                    boxShadow: isPopular ? "0 0 40px rgba(199,191,255,0.15), 0 30px 60px rgba(0,0,0,0.3)" : undefined,
                  }}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap"
                      style={{ background:"linear-gradient(135deg,#c7bfff,#ffcea6)", color:"#170065" }}>
                      Most Popular
                    </div>
                  )}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
                    style={{ background: plan.color==="primary" ? "rgba(70,241,197,0.1)" : plan.color==="secondary" ? "rgba(199,191,255,0.1)" : "rgba(255,206,166,0.1)",
                             color: plan.color==="primary" ? "#46f1c5" : plan.color==="secondary" ? "#c7bfff" : "#ffcea6" }}>
                    {plan.name}
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-headline font-black text-on-surface">{plan.price}</span>
                    <span className="text-on-surface-variant text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg flex-shrink-0"
                          style={{ color: plan.color==="primary" ? "#46f1c5" : plan.color==="secondary" ? "#c7bfff" : "#ffcea6", fontVariationSettings:"'FILL' 1" }}>
                          check_circle
                        </span>{f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]`}
                    style={isPopular
                      ? { background:"linear-gradient(135deg,#c7bfff,#ffcea6)", color:"#170065", boxShadow:"0 8px 20px rgba(199,191,255,0.3)" }
                      : plan.color==="primary"
                      ? { background:"linear-gradient(135deg,#46f1c5,#00d4aa)", color:"#00382b" }
                      : { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#e0e2ee" }}>
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28" style={{ background:"#050810" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-black text-on-surface mb-4">Loved by Indian businesses.</h2>
            <p className="text-on-surface-variant">Real results from real customers across India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(c.testimonials as {name:string;biz:string;quote:string;avatar:string}[]).map((t,i) => (
              <div key={i} className="rounded-2xl p-6 card-lift" style={{ background:"rgba(28,32,40,0.7)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex mb-3">{[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings:"'FILL' 1" }}>star</span>)}</div>
                <p className="text-on-surface leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-on-primary"
                    style={{ background:"linear-gradient(135deg,rgba(70,241,197,0.4),rgba(199,191,255,0.4))" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{t.name}</p>
                    <p className="text-on-surface-variant text-[11px]">{t.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-6" style={{ background:"#07090f" }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            style={{ background:"rgba(28,32,40,0.8)", border:"1px solid rgba(70,241,197,0.2)", boxShadow:"0 0 60px rgba(70,241,197,0.08), inset 0 0 60px rgba(70,241,197,0.03)" }}>
            <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(70,241,197,0.08),transparent 60%)", top:"-150px", right:"-100px" }} />
            <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(199,191,255,0.06),transparent 60%)", bottom:"-100px", left:"-50px" }} />
            <div className="relative z-10">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 block" style={{ fontVariationSettings:"'FILL' 1" }}>support_agent</span>
              <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface mb-6 leading-tight">{c.finalTitle}</h2>
              <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto">{c.finalSub}</p>
              <a href="/register" className="inline-block px-10 py-5 rounded-2xl font-bold text-lg text-on-primary hover:scale-105 transition-all"
                style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 8px 30px rgba(70,241,197,0.4)" }}>
                {c.finalCta} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16" style={{ background:"#040609", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <span className="text-xl font-black font-headline" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VaaniAI</span>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed max-w-xs">Intelligence that speaks your language. Built with pride in India for the world's most dynamic businesses.</p>
          </div>
          {[
            { title:"Product", links:["Features","Integrations","Pricing","Security"] },
            { title:"Company", links:["About Us","Careers","Blog","Press"] },
            { title:"Legal",   links:["Privacy Policy","Terms of Service"] },
          ].map(s => (
            <div key={s.title}>
              <h5 className="text-on-surface font-bold text-xs mb-4 uppercase tracking-widest">{s.title}</h5>
              <ul className="space-y-2.5">
                {s.links.map(l => <li key={l}><a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-[10px]" style={{ color:"rgba(186,202,194,0.3)" }}>© 2024 VaaniAI Technologies Private Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/login" className="text-[10px] hover:text-primary transition-colors" style={{ color:"rgba(186,202,194,0.3)" }}>Tenant Login</a>
            <a href="/owner-login" className="text-[10px] hover:text-primary transition-colors" style={{ color:"rgba(186,202,194,0.3)" }}>Owner Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
