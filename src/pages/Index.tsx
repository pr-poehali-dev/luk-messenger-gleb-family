import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ── SPLASH SCREEN ──────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const outTimer = window.setTimeout(() => setPhase("out"), 2200);
    const doneTimer = window.setTimeout(() => onDone(), 2650);
    return () => { clearTimeout(outTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden ${phase === "out" ? "splash-out" : ""}`}
      style={{ background: "var(--luk-bg)" }}
    >
      {/* Ambient orbs */}
      <div className="orb-1 absolute w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #9B5CFF, transparent 70%)", top: "10%", left: "5%" }} />
      <div className="orb-2 absolute w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF5CF1, transparent 70%)", bottom: "15%", right: "5%" }} />
      <div className="absolute w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #5CF1FF, transparent 70%)", bottom: "30%", left: "20%" }} />

      {/* Logo block */}
      <div className="splash-logo flex flex-col items-center gap-5">
        {/* Icon */}
        <div className="relative">
          <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #6B2FE8, #B84CF7, #FF5CF1)", boxShadow: "0 0 60px #9B5CFF60, 0 20px 60px #00000060" }}>
            <span className="text-5xl select-none">✉️</span>
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-[2rem] opacity-50 pointer-events-none"
            style={{ boxShadow: "0 0 0 1px rgba(155,92,255,0.4), 0 0 40px rgba(155,92,255,0.3)" }} />
        </div>

        {/* Name */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="shimmer-text text-6xl font-black tracking-tight leading-none" style={{ fontFamily: "'Golos Text', sans-serif" }}>
            LUK
          </h1>
          <p className="splash-tagline text-white/45 text-sm tracking-[0.25em] uppercase font-medium">
            Messenger
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-40">
        <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="splash-progress h-full rounded-full" style={{ background: "linear-gradient(90deg, #9B5CFF, #FF5CF1)", width: "0%" }} />
        </div>
        {/* Loader dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="splash-dot w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--luk-purple)", animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TYPES ──────────────────────────────────────────────────────────
type ContactId = "gleb" | "mamulya" | "papa" | "sestra";
type Screen = "chats" | "contacts" | "calls" | "settings" | "profile" | "chat";
type MsgType = "text" | "voice";

interface Message {
  id: string;
  from: "me" | ContactId;
  type: MsgType;
  text?: string;
  voiceDuration?: number;
  time: Date;
  reactions?: string[];
  read: boolean;
}

interface Contact {
  id: ContactId;
  name: string;
  avatar: string;
  status: "online" | "offline" | "typing";
  lastSeen?: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface CallRecord {
  id: string;
  contact: ContactId;
  type: "incoming" | "outgoing" | "missed";
  duration?: string;
  time: Date;
}

// ── DATA ───────────────────────────────────────────────────────────
const CONTACTS: Contact[] = [
  {
    id: "gleb",
    name: "Глеб",
    avatar: "https://cdn.poehali.dev/projects/ea83636a-a68e-4e72-812a-bdb87ba6eb9b/files/ffd68cdc-a62e-4c07-aa48-662da82b6098.jpg",
    status: "online",
    color: "#9B5CFF",
    gradientFrom: "#6B2FE8",
    gradientTo: "#B84CF7",
  },
  {
    id: "mamulya",
    name: "Мамуля",
    avatar: "https://cdn.poehali.dev/projects/ea83636a-a68e-4e72-812a-bdb87ba6eb9b/files/12bcca5f-ffda-44f5-a913-2499e064c947.jpg",
    status: "online",
    color: "#FF5CF1",
    gradientFrom: "#C42FBE",
    gradientTo: "#FF5CF1",
  },
  {
    id: "papa",
    name: "Папа",
    avatar: "https://cdn.poehali.dev/projects/ea83636a-a68e-4e72-812a-bdb87ba6eb9b/files/02d60b18-9da4-4014-90a0-6367f1bad8f1.jpg",
    status: "offline",
    lastSeen: "был 5 мин назад",
    color: "#5CF1FF",
    gradientFrom: "#2FB8C4",
    gradientTo: "#5CF1FF",
  },
  {
    id: "sestra",
    name: "Сестра",
    avatar: "https://cdn.poehali.dev/projects/ea83636a-a68e-4e72-812a-bdb87ba6eb9b/files/2dc7746f-a367-449e-a66d-96340af4ef13.jpg",
    status: "online",
    color: "#FF8C5C",
    gradientFrom: "#FF5C2E",
    gradientTo: "#FFBB5C",
  },
];

const AUTO_MESSAGES: Record<ContactId, string[]> = {
  gleb: [
    "о куль антон",
    "чё делаешь?",
    "видел мем? 💀",
    "иди сюда",
    "хаха это жесть",
    "слушай, позвони когда сможешь",
    "ты дома?",
    "гоу гулять?",
    "братан смотри",
    "нуу ладно",
  ],
  mamulya: [
    "Антоша, ты поел?",
    "Позвони маме ❤️",
    "Как ты там?",
    "Приедешь сегодня?",
    "Я пирожки испекла 🥧",
    "Одевайся теплее!",
    "Целую тебя, сыночек",
    "Позвони когда доедешь",
    "Купи хлебушка по пути",
    "Мы тебя любим!",
  ],
  papa: [
    "Сынок, как дела?",
    "Всё нормально?",
    "Держись там",
    "Мужик должен быть сильным 💪",
    "Когда приедешь?",
    "Созвонимся вечером",
    "Гордимся тобой",
    "Работа как?",
    "Бегаешь ещё?",
    "Молодец",
  ],
  sestra: [
    "АНТОН!!",
    "смотри что нашла 😍",
    "ты мне должен",
    "помоги с домашкой плз",
    "это смешно до слёз",
    "я тебя люблю кстати",
    "можешь зайти ко мне?",
    "расскажи мне всё",
    "ты лучший брат ✨",
    "хочу кушать",
  ],
};

const VOICE_DURATIONS: Record<ContactId, number[]> = {
  gleb: [8, 15, 23],
  mamulya: [45, 62, 30],
  papa: [12, 28, 55],
  sestra: [6, 19, 11],
};

const EMOJIS_REACTIONS = ["❤️", "😂", "🔥", "👍", "😮", "😢"];

const uid = () => Math.random().toString(36).slice(2, 9);
const formatTime = (d: Date) =>
  d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
const getContact = (id: ContactId) => CONTACTS.find((c) => c.id === id)!;

// ── AVATAR ─────────────────────────────────────────────────────────
function Avatar({ contact, size = 44, showOnline = true }: { contact: Contact; size?: number; showOnline?: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <img
        src={contact.avatar}
        alt={contact.name}
        className="rounded-full object-cover w-full h-full"
        style={{ border: `2px solid ${contact.color}50` }}
      />
      {showOnline && contact.status === "online" && (
        <div className="online-dot absolute bottom-0 right-0" />
      )}
    </div>
  );
}

// ── TYPING ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot w-2 h-2 rounded-full bg-white/40"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

// ── VOICE SYNTH ────────────────────────────────────────────────────
// Уникальный профиль голоса для каждого контакта
const VOICE_PROFILES: Record<string, { pitch: number; speed: number; timbre: number; vibrato: number }> = {
  gleb:    { pitch: 180,  speed: 1.15, timbre: 0.6, vibrato: 3.5 }, // молодой парень — высокий, быстрый
  mamulya: { pitch: 250,  speed: 0.88, timbre: 0.3, vibrato: 5.0 }, // мама — мягкий, плавный
  papa:    { pitch: 100,  speed: 0.78, timbre: 0.8, vibrato: 2.0 }, // папа — низкий, спокойный
  sestra:  { pitch: 290,  speed: 1.25, timbre: 0.4, vibrato: 6.0 }, // сестра — звонкий, живой
  me:      { pitch: 160,  speed: 1.0,  timbre: 0.5, vibrato: 3.0 },
};

function playVoiceSound(contactId: string, durationSec: number, onEnd: () => void) {
  type AudioContextConstructor = typeof AudioContext;
  const AudioCtx: AudioContextConstructor = window.AudioContext || (window as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext!;
  const ctx = new AudioCtx();
  const profile = VOICE_PROFILES[contactId] || VOICE_PROFILES.me;
  const playDur = Math.min(durationSec, 8); // не дольше 8с реального звука

  // Несколько осцилляторов для богатого тембра
  const freqs = [
    profile.pitch,
    profile.pitch * 1.5,
    profile.pitch * 2.0,
    profile.pitch * 0.5,
  ];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
  masterGain.gain.setValueAtTime(0.18, ctx.currentTime + playDur - 0.1);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + playDur);
  masterGain.connect(ctx.destination);

  // Лёгкий reverb через delay
  const delay = ctx.createDelay(0.3);
  delay.delayTime.value = 0.06;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.12;
  masterGain.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(ctx.destination);

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = idx === 0 ? "sine" : idx === 1 ? "triangle" : "sine";
    osc.frequency.value = freq;

    // Вибрато
    const vibLfo = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vibLfo.frequency.value = profile.vibrato;
    vibGain.gain.value = freq * 0.012;
    vibLfo.connect(vibGain);
    vibGain.connect(osc.frequency);
    vibLfo.start();
    vibLfo.stop(ctx.currentTime + playDur);

    // «Речевая» амплитудная модуляция — имитация слогов
    const ampLfo = ctx.createOscillator();
    const ampGain = ctx.createGain();
    ampLfo.frequency.value = profile.speed * 3.5;
    ampGain.gain.value = 0.35;
    ampLfo.connect(ampGain);
    ampGain.connect(gain.gain);
    ampLfo.start();
    ampLfo.stop(ctx.currentTime + playDur);

    gain.gain.value = idx === 0 ? 0.5 : idx === 1 ? 0.25 * profile.timbre : 0.1;

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + playDur);
  });

  // Закрыть контекст по окончании
  window.setTimeout(() => {
    ctx.close();
    onEnd();
  }, playDur * 1000 + 150);
}

// ── VOICE MESSAGE ──────────────────────────────────────────────────
function VoiceMessage({ duration, color, isOutgoing, contactId }: {
  duration: number;
  color: string;
  isOutgoing: boolean;
  contactId: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number>();

  const bars = useRef(
    Array.from({ length: 26 }, () => 12 + Math.random() * 20)
  ).current;

  const toggle = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      setPlaying(false);
      setProgress(0);
      return;
    }

    setPlaying(true);
    setProgress(0);

    // Запуск звука
    playVoiceSound(isOutgoing ? "me" : contactId, duration, () => {});

    // Прогресс-бар
    const step = 100 / (duration * 10);
    intervalRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          return 0;
        }
        return p + step;
      });
    }, 100);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const progressBars = Math.floor((progress / 100) * bars.length);

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={toggle}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 active:scale-95 flex-shrink-0"
        style={{ background: isOutgoing ? "rgba(255,255,255,0.2)" : `${color}30` }}
      >
        <Icon name={playing ? "Pause" : "Play"} size={15} className="text-white" />
      </button>
      <div className="flex items-center gap-[2px]" style={{ height: 28 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className={i < progressBars && playing ? "wave-bar" : ""}
            style={{
              width: 3,
              height: h,
              borderRadius: 2,
              background: i < progressBars
                ? (isOutgoing ? "rgba(255,255,255,0.9)" : color)
                : "rgba(255,255,255,0.25)",
              animationDelay: `${(i * 0.04).toFixed(2)}s`,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-white/50 font-mono flex-shrink-0">{duration}с</span>
    </div>
  );
}

// ── CALL SCREEN ────────────────────────────────────────────────────
function CallScreen({ contact, onEnd }: { contact: Contact; onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-20"
      style={{ background: `linear-gradient(160deg, ${contact.gradientFrom}DD, #0D0F1A 65%)` }}
    >
      <div className="flex flex-col items-center gap-4">
        <p className="text-white/50 text-xs tracking-widest uppercase">Звонок</p>
        <div className="relative w-32 h-32">
          <div className="call-pulse absolute inset-0 rounded-full" style={{ background: contact.color }} />
          <img src={contact.avatar} className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-white/10" />
        </div>
        <h2 className="text-white text-3xl font-black mt-2">{contact.name}</h2>
        <p className="text-white/50 font-mono text-lg">{fmt(seconds)}</p>
      </div>

      <div className="flex items-center gap-10">
        <button onClick={() => setMuted(!muted)} className="flex flex-col items-center gap-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted ? "bg-white/25" : "bg-white/10"}`}>
            <Icon name={muted ? "MicOff" : "Mic"} size={22} className="text-white" />
          </div>
          <span className="text-white/40 text-xs">{muted ? "Вкл" : "Выкл"} микр.</span>
        </button>

        <button onClick={onEnd} className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40 hover:bg-red-600 transition-all hover:scale-105 active:scale-95">
            <Icon name="PhoneOff" size={24} className="text-white" />
          </div>
          <span className="text-white/40 text-xs">Завершить</span>
        </button>

        <button onClick={() => setSpeaker(!speaker)} className="flex flex-col items-center gap-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${speaker ? "bg-white/25" : "bg-white/10"}`}>
            <Icon name={speaker ? "Volume2" : "VolumeX"} size={22} className="text-white" />
          </div>
          <span className="text-white/40 text-xs">Динамик</span>
        </button>
      </div>
    </div>
  );
}

// ── INCOMING CALL ──────────────────────────────────────────────────
function IncomingCallBanner({ contact, onAccept, onDecline }: { contact: Contact; onAccept: () => void; onDecline: () => void }) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-80 rounded-3xl p-4 animate-notif"
      style={{ background: "rgba(18,21,31,0.96)", border: `1px solid ${contact.color}50`, backdropFilter: "blur(24px)", boxShadow: "0 20px 60px #000000A0" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-ring flex-shrink-0">
          <img src={contact.avatar} className="w-12 h-12 rounded-full object-cover" style={{ border: `2px solid ${contact.color}` }} />
        </div>
        <div>
          <p className="text-white/40 text-xs">Входящий звонок</p>
          <p className="text-white font-bold text-xl leading-tight">{contact.name}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onDecline} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-all">
          <Icon name="PhoneOff" size={16} />
          <span className="text-sm font-semibold">Отклонить</span>
        </button>
        <button onClick={onAccept} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500/15 hover:bg-green-500/25 text-green-400 transition-all">
          <Icon name="Phone" size={16} />
          <span className="text-sm font-semibold">Ответить</span>
        </button>
      </div>
    </div>
  );
}

// ── NOTIFICATION ───────────────────────────────────────────────────
function NotifBanner({ contact, text, onTap }: { contact: Contact; text: string; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-80 rounded-2xl p-3 animate-notif text-left"
      style={{ background: "rgba(18,21,31,0.96)", border: `1px solid ${contact.color}40`, backdropFilter: "blur(20px)", boxShadow: "0 16px 40px #00000090" }}
    >
      <div className="flex items-center gap-3">
        <img src={contact.avatar} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="overflow-hidden flex-1">
          <p className="text-white font-semibold text-sm">{contact.name}</p>
          <p className="text-white/50 text-xs truncate">{text}</p>
        </div>
        <Icon name="ChevronRight" size={14} className="text-white/25 flex-shrink-0" />
      </div>
    </button>
  );
}

// ── CHAT VIEW ──────────────────────────────────────────────────────
function ChatView({
  contactId, messages, onSend, onBack, onCall, onReaction, isTyping,
}: {
  contactId: ContactId;
  messages: Message[];
  onSend: (text: string) => void;
  onBack: () => void;
  onCall: () => void;
  onReaction: (msgId: string, emoji: string) => void;
  isTyping: boolean;
}) {
  const contact = getContact(contactId);
  const [input, setInput] = useState("");
  const [reactionMsgId, setReactionMsgId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = () => {
    if (input.trim()) { onSend(input.trim()); setInput(""); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: "rgba(18,21,31,0.97)", borderBottom: "1px solid var(--luk-border)", backdropFilter: "blur(10px)" }}>
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <Avatar contact={contact} size={40} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-[15px]">{contact.name}</p>
          <p className="text-xs" style={{ color: isTyping ? contact.color : (contact.status === "online" ? "#5CFFA0" : "rgba(255,255,255,0.35)") }}>
            {isTyping ? "печатает..." : contact.status === "online" ? "онлайн" : contact.lastSeen}
          </p>
        </div>
        <button onClick={onCall} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: `${contact.color}20` }}>
          <Icon name="Phone" size={17} style={{ color: contact.color }} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-all">
          <Icon name="MoreVertical" size={17} className="text-white/40" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2" style={{ background: "var(--luk-bg)" }}>
        {messages.map((msg) => {
          const isOut = msg.from === "me";
          return (
            <div key={msg.id} className={`flex ${isOut ? "justify-end" : "justify-start"} animate-message`}>
              <div className="relative group max-w-[78%]">
                {/* Incoming */}
                {!isOut && (
                  <div className="flex items-end gap-2">
                    <img src={contact.avatar} className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0" />
                    <div className="msg-bubble-in rounded-2xl rounded-bl-sm px-3 py-2.5">
                      {msg.type === "voice"
                        ? <VoiceMessage duration={msg.voiceDuration!} color={contact.color} isOutgoing={false} contactId={contact.id} />
                        : <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                      }
                      <p className="text-white/25 text-[10px] mt-1 text-right">{formatTime(msg.time)}</p>
                    </div>
                  </div>
                )}
                {/* Outgoing */}
                {isOut && (
                  <div className="msg-bubble-out rounded-2xl rounded-br-sm px-3 py-2.5">
                    {msg.type === "voice"
                      ? <VoiceMessage duration={msg.voiceDuration!} color="#fff" isOutgoing={true} contactId="me" />
                      : <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    }
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-white/40 text-[10px]">{formatTime(msg.time)}</p>
                      <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} className="text-white/40" />
                    </div>
                  </div>
                )}

                {/* Reactions display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex gap-0.5 mt-1 ${isOut ? "justify-end" : "justify-start ml-9"}`}>
                    {msg.reactions.map((r, i) => (
                      <span key={i} className="text-sm bg-white/10 rounded-full px-1.5 py-0.5 border border-white/10">{r}</span>
                    ))}
                  </div>
                )}

                {/* Reaction trigger */}
                <button
                  onClick={() => setReactionMsgId(reactionMsgId === msg.id ? null : msg.id)}
                  className="absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/80"
                  style={{ [isOut ? "left" : "right"]: "-26px" }}
                >
                  <Icon name="SmilePlus" size={15} />
                </button>

                {/* Reaction picker */}
                {reactionMsgId === msg.id && (
                  <div
                    className={`absolute z-20 flex gap-1 p-2 rounded-2xl ${isOut ? "right-0" : "left-8"} -top-14 animate-fade-in`}
                    style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)", boxShadow: "0 8px 32px #00000080" }}
                  >
                    {EMOJIS_REACTIONS.map((e) => (
                      <button key={e} onClick={() => { onReaction(msg.id, e); setReactionMsgId(null); }} className="text-xl hover:scale-125 transition-transform">
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start animate-message">
            <div className="flex items-end gap-2">
              <img src={contact.avatar} className="w-7 h-7 rounded-full object-cover" />
              <div className="msg-bubble-in rounded-2xl rounded-bl-sm">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-3 py-3 flex-shrink-0" style={{ background: "var(--luk-panel)", borderTop: "1px solid var(--luk-border)" }}>
        <button className="w-9 h-9 flex items-center justify-center text-white/35 hover:text-white/70 transition-colors flex-shrink-0">
          <Icon name="Paperclip" size={20} />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Сообщение..."
          rows={1}
          className="flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none"
          style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)", maxHeight: 100, lineHeight: "1.5" }}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-25 flex-shrink-0"
          style={{ background: input.trim() ? "linear-gradient(135deg, #6B2FE8, #B84CF7)" : "var(--luk-card)" }}
        >
          <Icon name="Send" size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────────
function SettingsScreen() {
  const [notif, setNotif] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [preview, setPreview] = useState(true);
  const [twofa, setTwofa] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} className="relative w-12 h-6 rounded-full transition-all flex-shrink-0" style={{ background: value ? "linear-gradient(90deg, #6B2FE8, #B84CF7)" : "var(--luk-border)" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: value ? "calc(100% - 22px)" : "2px" }} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-2 px-1">{title}</p>
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)" }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ icon, label, right }: { icon: string; label: string; right?: React.ReactNode }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0" style={{ borderColor: "var(--luk-border)" }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(155,92,255,0.15)" }}>
        <Icon name={icon} size={15} className="text-purple-400" />
      </div>
      <span className="text-white text-sm flex-1">{label}</span>
      {right || <Icon name="ChevronRight" size={14} className="text-white/20" />}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <Section title="Уведомления">
        <Row icon="Bell" label="Push-уведомления" right={<Toggle value={notif} onChange={setNotif} />} />
        <Row icon="Volume2" label="Звуки" right={<Toggle value={sounds} onChange={setSounds} />} />
        <Row icon="Eye" label="Превью сообщений" right={<Toggle value={preview} onChange={setPreview} />} />
      </Section>
      <Section title="Приватность">
        <Row icon="Shield" label="Двухфакторная аутентификация" right={<Toggle value={twofa} onChange={setTwofa} />} />
        <Row icon="CheckCheck" label="Отметки о прочтении" right={<Toggle value={readReceipts} onChange={setReadReceipts} />} />
        <Row icon="Clock" label="Последняя активность" />
        <Row icon="Lock" label="Код-пароль" />
      </Section>
      <Section title="Аккаунт">
        <Row icon="User" label="Изменить профиль" />
        <Row icon="Phone" label="Изменить номер" />
        <Row icon="Trash2" label="Удалить аккаунт" />
      </Section>
      <Section title="Приложение">
        <Row icon="Palette" label="Тема" right={<span className="text-white/35 text-sm mr-2">Тёмная</span>} />
        <Row icon="Globe" label="Язык" right={<span className="text-white/35 text-sm mr-2">Русский</span>} />
        <Row icon="Info" label="О приложении" right={<span className="text-white/35 text-sm mr-2">LUK 1.0</span>} />
      </Section>
    </div>
  );
}

// ── CALLS SCREEN ───────────────────────────────────────────────────
function CallsScreen({ calls, onCall }: { calls: CallRecord[]; onCall: (id: ContactId) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {calls.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-white/20 gap-3">
          <Icon name="PhoneCall" size={44} />
          <p className="text-sm">Нет истории звонков</p>
        </div>
      )}
      {calls.map((call) => {
        const c = getContact(call.contact);
        const isMissed = call.type === "missed";
        const isIncoming = call.type === "incoming";
        return (
          <div key={call.id} className="flex items-center gap-3 py-3.5 border-b" style={{ borderColor: "var(--luk-border)" }}>
            <img src={c.avatar} className="w-12 h-12 rounded-full object-cover flex-shrink-0" style={{ border: `2px solid ${c.color}40` }} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{c.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon name={isMissed ? "PhoneMissed" : isIncoming ? "PhoneIncoming" : "PhoneOutgoing"} size={12} style={{ color: isMissed ? "#FF4444" : isIncoming ? "#5CFFA0" : "#5CF1FF" }} />
                <span className="text-xs" style={{ color: isMissed ? "#FF4444" : "rgba(255,255,255,0.35)" }}>
                  {isMissed ? "Пропущенный" : isIncoming ? "Входящий" : "Исходящий"}
                  {call.duration && ` · ${call.duration}`}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-white/25 text-xs">{formatTime(call.time)}</span>
              <button onClick={() => onCall(call.contact)} className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all" style={{ background: `${c.color}20` }}>
                <Icon name="Phone" size={14} style={{ color: c.color }} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── CONTACTS SCREEN ────────────────────────────────────────────────
function ContactsScreen({ contacts, onChat, onCall }: { contacts: Contact[]; onChat: (id: ContactId) => void; onCall: (id: ContactId) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {contacts.map((c) => (
        <button key={c.id} onClick={() => onChat(c.id)} className="w-full flex items-center gap-3 py-3.5 border-b hover:bg-white/5 transition-colors rounded-xl px-2" style={{ borderColor: "var(--luk-border)" }}>
          <Avatar contact={c} size={52} />
          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-white">{c.name}</p>
            <p className="text-xs mt-0.5" style={{ color: c.status === "online" ? "#5CFFA0" : "rgba(255,255,255,0.35)" }}>
              {c.status === "online" ? "онлайн" : c.lastSeen}
            </p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onCall(c.id); }} className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all flex-shrink-0" style={{ background: `${c.color}20` }}>
            <Icon name="Phone" size={16} style={{ color: c.color }} />
          </button>
        </button>
      ))}
    </div>
  );
}

// ── PROFILE SCREEN ─────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative h-52 flex items-end px-6 pb-5 overflow-hidden" style={{ background: "linear-gradient(135deg, #5C2FE8, #9B5CFF, #FF5CF1)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(92,241,255,0.15) 0%, transparent 50%)" }} />
        <div className="relative flex items-end gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center text-4xl" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              🚀
            </div>
            <div className="online-dot absolute bottom-1 right-1" style={{ borderColor: "#6B2FE8" }} />
          </div>
          <div className="pb-1">
            <h2 className="text-white text-2xl font-black">Антон</h2>
            <p className="text-white/60 text-sm">+7 999 123-45-67</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)" }}>
          <Icon name="MessageSquare" size={16} className="text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-white/40 text-xs">Статус</p>
            <p className="text-white text-sm">🚀 Всегда на связи!</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Сообщений", value: "1.2k", icon: "MessageSquare" },
            { label: "Контактов", value: "4", icon: "Users" },
            { label: "Звонков", value: "48", icon: "Phone" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 flex flex-col items-center gap-1.5" style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)" }}>
              <Icon name={s.icon} size={18} className="text-purple-400" />
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-white/35 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)" }}>
          {[
            { icon: "Edit3", label: "Изменить профиль" },
            { icon: "Camera", label: "Изменить фото" },
            { icon: "Share2", label: "Поделиться профилем" },
          ].map((item, i, arr) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--luk-border)" : undefined }}>
              <Icon name={item.icon} size={16} className="text-purple-400 flex-shrink-0" />
              <span className="text-white text-sm">{item.label}</span>
              <Icon name="ChevronRight" size={14} className="text-white/20 ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SEARCH BAR ─────────────────────────────────────────────────────
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="px-4 pb-3 flex-shrink-0">
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm text-white placeholder:text-white/25 outline-none"
          style={{ background: "var(--luk-card)", border: "1px solid var(--luk-border)" }}
        />
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────
export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>("chats");
  const [activeChat, setActiveChat] = useState<ContactId | null>(null);
  const [search, setSearch] = useState("");

  const [messages, setMessages] = useState<Record<ContactId, Message[]>>({
    gleb: [{ id: uid(), from: "gleb", type: "text", text: "о куль антон", time: new Date(), reactions: [], read: true }],
    mamulya: [],
    papa: [],
    sestra: [],
  });

  const [typing, setTyping] = useState<Record<ContactId, boolean>>({ gleb: false, mamulya: false, papa: false, sestra: false });
  const [unread, setUnread] = useState<Record<ContactId, number>>({ gleb: 1, mamulya: 0, papa: 0, sestra: 0 });
  const [callScreen, setCallScreen] = useState<ContactId | null>(null);
  const [incomingCall, setIncomingCall] = useState<ContactId | null>(null);
  const [notif, setNotif] = useState<{ contact: ContactId; text: string } | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);

  const notifTimer = useRef<number>();
  const timers = useRef<number[]>([]);

  const scheduleAutoMsg = useCallback((contactId: ContactId) => {
    const delay = 25000 + Math.random() * 40000;
    const t = window.setTimeout(() => {
      const text = AUTO_MESSAGES[contactId][Math.floor(Math.random() * AUTO_MESSAGES[contactId].length)];
      const isVoice = Math.random() < 0.2;
      const dur = VOICE_DURATIONS[contactId];

      setTyping((prev) => ({ ...prev, [contactId]: true }));

      window.setTimeout(() => {
        const newMsg: Message = {
          id: uid(),
          from: contactId,
          type: isVoice ? "voice" : "text",
          text: isVoice ? undefined : text,
          voiceDuration: isVoice ? dur[Math.floor(Math.random() * dur.length)] : undefined,
          time: new Date(),
          reactions: [],
          read: false,
        };
        setTyping((prev) => ({ ...prev, [contactId]: false }));
        setMessages((prev) => ({ ...prev, [contactId]: [...prev[contactId], newMsg] }));
        setUnread((prev) => ({ ...prev, [contactId]: prev[contactId] + 1 }));

        setActiveChat((current) => {
          if (current !== contactId) {
            setNotif({ contact: contactId, text: isVoice ? "🎵 Голосовое сообщение" : text });
            clearTimeout(notifTimer.current);
            notifTimer.current = window.setTimeout(() => setNotif(null), 4000);
          } else {
            setUnread((prev) => ({ ...prev, [contactId]: 0 }));
          }
          return current;
        });

        scheduleAutoMsg(contactId);
      }, 1500 + Math.random() * 2000);
    }, delay);
    timers.current.push(t);
  }, []);

  const scheduleIncomingCall = useCallback(() => {
    const delay = 70000 + Math.random() * 80000;
    const t = window.setTimeout(() => {
      const ids: ContactId[] = ["gleb", "mamulya", "papa", "sestra"];
      const contactId = ids[Math.floor(Math.random() * ids.length)];
      setCallScreen((cs) => {
        if (!cs) setIncomingCall((ic) => ic || contactId);
        return cs;
      });
      scheduleIncomingCall();
    }, delay);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    CONTACTS.forEach((c) => scheduleAutoMsg(c.id));
    scheduleIncomingCall();
    const currentTimers = timers.current;
    return () => currentTimers.forEach(clearTimeout);
  }, [scheduleAutoMsg, scheduleIncomingCall]);

  const openChat = (id: ContactId) => {
    setActiveChat(id);
    setScreen("chat");
    setUnread((prev) => ({ ...prev, [id]: 0 }));
    setMessages((prev) => ({ ...prev, [id]: prev[id].map((m) => ({ ...m, read: true })) }));
    setNotif(null);
  };

  const sendMessage = (text: string) => {
    if (!activeChat) return;
    const msg: Message = { id: uid(), from: "me", type: "text", text, time: new Date(), reactions: [], read: false };
    setMessages((prev) => ({ ...prev, [activeChat]: [...prev[activeChat], msg] }));
    setTimeout(() => setMessages((prev) => ({ ...prev, [activeChat!]: prev[activeChat!].map((m) => m.id === msg.id ? { ...m, read: true } : m) })), 1500);
  };

  const addReaction = (msgId: string, emoji: string) => {
    if (!activeChat) return;
    setMessages((prev) => ({
      ...prev,
      [activeChat]: prev[activeChat].map((m) =>
        m.id === msgId ? { ...m, reactions: [...(m.reactions || []).filter((r) => r !== emoji), emoji] } : m
      ),
    }));
  };

  const startCall = (id: ContactId) => {
    setCallScreen(id);
    setCalls((prev) => [{ id: uid(), contact: id, type: "outgoing", time: new Date() }, ...prev]);
  };

  const endCall = () => {
    const dur = `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;
    setCalls((prev) => prev.map((c, i) => i === 0 ? { ...c, duration: dur } : c));
    setCallScreen(null);
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    setCalls((prev) => [{ id: uid(), contact: incomingCall, type: "incoming", time: new Date() }, ...prev]);
    setCallScreen(incomingCall);
    setIncomingCall(null);
  };

  const declineCall = () => {
    if (incomingCall) setCalls((prev) => [{ id: uid(), contact: incomingCall, type: "missed", time: new Date() }, ...prev]);
    setIncomingCall(null);
  };

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
  const missedCalls = calls.filter((c) => c.type === "missed").length;

  const filteredContacts = CONTACTS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const sortedChats = [...CONTACTS].sort((a, b) => {
    const la = messages[a.id].at(-1)?.time;
    const lb = messages[b.id].at(-1)?.time;
    if (!la && !lb) return 0;
    if (!la) return 1;
    if (!lb) return -1;
    return lb.getTime() - la.getTime();
  });

  const navItems = [
    { id: "chats", icon: "MessageSquare", label: "Чаты", badge: totalUnread },
    { id: "contacts", icon: "Users", label: "Контакты" },
    { id: "calls", icon: "Phone", label: "Звонки", badge: missedCalls },
    { id: "profile", icon: "User", label: "Профиль" },
    { id: "settings", icon: "Settings", label: "Настройки" },
  ] as const;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--luk-bg)" }}>
      {/* Splash */}
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {/* Overlay screens */}
      {callScreen && <CallScreen contact={getContact(callScreen)} onEnd={endCall} />}
      {incomingCall && !callScreen && (
        <IncomingCallBanner contact={getContact(incomingCall)} onAccept={acceptCall} onDecline={declineCall} />
      )}
      {notif && !callScreen && !incomingCall && (
        <NotifBanner contact={getContact(notif.contact)} text={notif.text} onTap={() => { openChat(notif.contact); }} />
      )}

      {/* App Header */}
      {screen !== "chat" && (
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <h1 className="text-2xl font-black luk-text-gradient tracking-tight">
            {screen === "chats" ? "LUK" : screen === "contacts" ? "Контакты" : screen === "calls" ? "Звонки" : screen === "profile" ? "Профиль" : "Настройки"}
          </h1>
          {screen === "chats" && (
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/8 transition-colors" style={{ background: "var(--luk-card)" }}>
              <Icon name="PenSquare" size={17} className="text-white/50" />
            </button>
          )}
        </div>
      )}

      {/* Search */}
      {(screen === "chats" || screen === "contacts") && (
        <SearchBar value={search} onChange={setSearch} />
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* CHATS */}
        {screen === "chats" && (
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {(search ? filteredContacts : sortedChats).map((c) => {
              const last = messages[c.id].at(-1);
              const isTypingNow = typing[c.id];
              return (
                <button key={c.id} onClick={() => openChat(c.id)} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-colors active:scale-[0.98]">
                  <Avatar contact={c} size={54} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-white text-[15px]">{c.name}</span>
                      {last && <span className="text-white/25 text-xs flex-shrink-0">{formatTime(last.time)}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1 mr-2" style={{ color: isTypingNow ? c.color : "rgba(255,255,255,0.4)" }}>
                        {isTypingNow ? "печатает..." : last ? (last.type === "voice" ? "🎵 Голосовое" : (last.from === "me" ? "Вы: " : "") + last.text) : "Нет сообщений"}
                      </span>
                      {unread[c.id] > 0 && (
                        <div className="flex-shrink-0 min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 text-white text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}>
                          {unread[c.id]}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* CHAT */}
        {screen === "chat" && activeChat && (
          <ChatView
            contactId={activeChat}
            messages={search ? messages[activeChat].filter((m) => m.text?.toLowerCase().includes(search.toLowerCase())) : messages[activeChat]}
            onSend={sendMessage}
            onBack={() => { setScreen("chats"); setActiveChat(null); setSearch(""); }}
            onCall={() => startCall(activeChat)}
            onReaction={addReaction}
            isTyping={typing[activeChat]}
          />
        )}

        {screen === "contacts" && <ContactsScreen contacts={search ? filteredContacts : CONTACTS} onChat={openChat} onCall={startCall} />}
        {screen === "calls" && <CallsScreen calls={calls} onCall={startCall} />}
        {screen === "profile" && <ProfileScreen />}
        {screen === "settings" && <SettingsScreen />}
      </div>

      {/* Bottom Nav */}
      {screen !== "chat" && (
        <div className="flex items-center flex-shrink-0" style={{ background: "var(--luk-panel)", borderTop: "1px solid var(--luk-border)" }}>
          {navItems.map((item) => {
            const isActive = screen === item.id;
            return (
              <button key={item.id} onClick={() => { setScreen(item.id as Screen); setSearch(""); }} className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-all active:scale-90">
                <div className="relative">
                  <Icon name={item.icon} size={22} style={{ color: isActive ? "var(--luk-purple)" : "rgba(255,255,255,0.3)" }} />
                  {"badge" in item && item.badge && item.badge > 0 ? (
                    <div className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-1 text-white text-[9px] font-bold" style={{ background: "linear-gradient(135deg, #FF2E2E, #FF5CF1)" }}>
                      {item.badge}
                    </div>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium" style={{ color: isActive ? "var(--luk-purple)" : "rgba(255,255,255,0.3)" }}>
                  {item.label}
                </span>
                {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, var(--luk-purple), var(--luk-pink))" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}