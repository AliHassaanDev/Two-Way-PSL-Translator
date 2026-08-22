"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileVideo,
  Hand,
  Heart,
  Home as HomeIcon,
  Info,
  Languages,
  LogOut,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User,
  Volume2,
} from "lucide-react";

type Mode = "home" | "psl-to-urdu" | "urdu-to-psl";

const recentActivity = [
  { title: "PSL to Urdu", meta: "Translated 2 mins ago", tone: "teal" },
  { title: "Urdu to PSL", meta: "Translated 1 hour ago", tone: "violet" },
  { title: "PSL to Urdu", meta: "Translated yesterday", tone: "lavender" },
];

const recentTranslations = ["السلام علیکم", "آپ کیسے ہیں؟", "شکریہ", "براہ کرم مدد کریں"];

export default function Page() {
  const [view, setView] = useState<Mode | "landing">("landing");
  const [cameraOn, setCameraOn] = useState(false);
  const [urduText, setUrduText] = useState("");
  const [autoPlay, setAutoPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const navigate = (nextView: string) => {
    const normalized = nextView.replace(/^\//, "");
    if (!normalized || normalized === "") setView("landing");
    else if (normalized === "home") setView("home");
    else if (normalized === "psl-to-urdu") setView("psl-to-urdu");
    else if (normalized === "urdu-to-psl") setView("urdu-to-psl");
    else if (normalized === "history" || normalized === "favorites" || normalized === "profile" || normalized === "settings") setView("home");
    else setView("home");
  };

  if (view === "landing") {
    return <main className="site-shell"><Landing onStart={() => setView("home")} onNavigate={navigate} /></main>;
  }

  if (view === "psl-to-urdu") {
    return (
      <main className="site-shell">
        <TranslatorShell active="psl-to-urdu" onNavigate={navigate} onLogout={() => setView("landing")}>
          <PSLToUrdu cameraOn={cameraOn} setCameraOn={setCameraOn} />
        </TranslatorShell>
      </main>
    );
  }

  if (view === "urdu-to-psl") {
    return (
      <main className="site-shell">
        <TranslatorShell active="urdu-to-psl" onNavigate={navigate} onLogout={() => setView("landing")}>
          <UrduToPSL
            text={urduText}
            setText={setUrduText}
            autoPlay={autoPlay}
            setAutoPlay={setAutoPlay}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </TranslatorShell>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <AppDashboard onNavigate={navigate} onLogout={() => setView("landing")} />
    </main>
  );
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark"><Hand size={21} strokeWidth={2.2} /></div>
      <span>SignSpeak</span>
    </div>
  );
}

function Landing({ onStart, onNavigate }: { onStart: () => void; onNavigate: (href: string) => void }) {
  return (
    <section className="landing-page">
      <header className="landing-header">
        <Logo />
        <nav className="landing-nav">
          <button>Features</button>
          <button>How It Works</button>
          <button>About Us</button>
          <button>Contact</button>
          <button className="primary-btn compact" onClick={onStart}>Get Started</button>
        </nav>
      </header>

      <div className="landing-hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">Two-way communication for PSL users</div>
          <h1><span>Speak Freely.</span><br />Understand Deeply.</h1>
          <p>SignSpeak is a two-way sign language translator that bridges the gap between sign language and speech. Because every conversation matters.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => onNavigate("/psl-to-urdu")}>Start Translating</button>
            <button className="secondary-btn">Learn More</button>
          </div>

          <div className="feature-strip">
            <Feature icon={<Hand size={22} />} title="Two-Way Translation" text="PSL to Urdu & Urdu to PSL" tone="violet" />
            <Feature icon={<Sparkles size={21} />} title="AI Powered" text="Advanced AI for accurate and real-time translation" tone="teal" />
            <Feature icon={<Languages size={21} />} title="Easy to Use" text="Simple, intuitive and accessible for everyone" tone="blue" />
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="hero-hand hero-hand-back"><Hand size={210} strokeWidth={1.5} /></div>
          <div className="hero-hand hero-hand-front"><Hand size={220} strokeWidth={1.5} /></div>
          <div className="dot-cluster" />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text, tone }: { icon: React.ReactNode; title: string; text: string; tone: string }) {
  return (
    <div className="feature-item">
      <div className={`feature-icon ${tone}`}>{icon}</div>
      <div><h3>{title}</h3><p>{text}</p></div>
    </div>
  );
}

function ShellTop({}: { onNavigate: (href: string) => void; onLogout: () => void }) {
  return (
    <header className="app-topbar">
      <Logo />
      <div className="topbar-right">
        <button className="icon-btn"><Bell size={18} /></button>
        <div className="user-name">Ali Hassaan</div>
        <div className="user-avatar">AH</div>
      </div>
    </header>
  );
}

function Sidebar({ active, onNavigate, onLogout }: { active: Mode; onNavigate: (href: string) => void; onLogout: () => void }) {
  const items = [
    { key: "home", label: "Home", icon: <HomeIcon size={16} />, href: "/home" },
    { key: "psl-to-urdu", label: "PSL to Urdu", icon: <Languages size={16} />, href: "/psl-to-urdu" },
    { key: "urdu-to-psl", label: "Urdu to PSL", icon: <Languages size={16} />, href: "/urdu-to-psl" },
    { key: "history", label: "History", icon: <Clock3 size={16} />, href: "/home" },
    { key: "favorites", label: "Favorites", icon: <Heart size={16} />, href: "/home" },
    { key: "profile", label: "Profile", icon: <User size={16} />, href: "/home" },
    { key: "settings", label: "Settings", icon: <Settings size={16} />, href: "/home" },
  ];
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="side-nav">
        {items.map((item) => (
          <button key={item.key} className={`side-item ${active === item.key ? "active" : ""}`} onClick={() => onNavigate(item.href)}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="side-item logout" onClick={onLogout}><span><LogOut size={16} /></span><span>Log Out</span></button>
    </aside>
  );
}

function AppDashboard({ onNavigate, onLogout }: { onNavigate: (href: string) => void; onLogout: () => void }) {
  return (
    <div className="app-page">
      <ShellTop onNavigate={onNavigate} onLogout={onLogout} />
      <div className="app-frame">
        <Sidebar active="home" onNavigate={onNavigate} onLogout={onLogout} />
        <section className="content-area dashboard-area">
          <div className="dashboard-heading">
            <h2>Welcome back! <span>👋</span></h2>
            <p>Choose a translation mode to get started.</p>
          </div>
          <div className="mode-grid">
            <ModeCard tone="teal" badge="PSL to Urdu" title="Sign to Urdu" text="Upload a video or use your camera to translate PSL into Urdu text or speech." icon={<Hand size={42} />} button="Start Translating" onClick={() => onNavigate("/psl-to-urdu")} />
            <ModeCard tone="violet" badge="Urdu to PSL" title="Urdu to Sign" text="Enter Urdu text and watch it come to life in PSL with our AI 3D model." icon={<User size={42} />} button="Start Translating" onClick={() => onNavigate("/urdu-to-psl")} />
          </div>
          <div className="activity-panel">
            <div className="activity-header"><h3>Your Recent Activity</h3><button>View all <ArrowRight size={15} /></button></div>
            <div className="activity-list">
              {recentActivity.map((x, i) => <div className="activity-item" key={i}><div className={`activity-icon ${x.tone}`}>{i === 1 ? <User size={17} /> : <Hand size={17} />}</div><div><strong>{x.title}</strong><span>{x.meta}</span></div></div>)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ModeCard({ tone, badge, title, text, icon, button, onClick }: { tone: string; badge: string; title: string; text: string; icon: React.ReactNode; button: string; onClick: () => void }) {
  return <div className={`mode-card ${tone}`}><div className="mode-card-content"><span className="pill">{badge}</span><h3>{title}</h3><p>{text}</p><button className={`primary-btn small ${tone}`} onClick={onClick}>{button}</button></div><div className="mode-icon">{icon}</div></div>;
}

function TranslatorShell({ active, onNavigate, onLogout, children }: { active: Mode; onNavigate: (href: string) => void; onLogout: () => void; children: React.ReactNode }) {
  return <div className="app-page"><ShellTop onNavigate={onNavigate} onLogout={onLogout} /><div className="app-frame"><Sidebar active={active} onNavigate={onNavigate} onLogout={onLogout} /><section className="content-area translator-area">{children}</section></div></div>;
}

function PSLToUrdu({ cameraOn, setCameraOn }: { cameraOn: boolean; setCameraOn: (v: boolean) => void }) {
  return <>
    <div className="page-header"><div><h2 className="teal-title">PSL to Urdu</h2><p>Convert Pakistani Sign Language to Urdu text or speech.</p></div><button className="info-btn"><Info size={15} /> How it works</button></div>
    <div className="psl-layout">
      <div className="panel camera-panel">
        <div className="tab-row"><button className="tab active"><Camera size={15} /> Camera</button><button className="tab"><FileVideo size={15} /> Upload Video</button></div>
        <div className="camera-stage">
          {cameraOn ? <div className="camera-live"><div className="camera-corner tl" /><div className="camera-corner tr" /><div className="camera-corner bl" /><div className="camera-corner br" /><span className="live-badge">LIVE</span><div className="fake-signer"><div className="fake-head" /><div className="fake-body" /><div className="fake-hand left" /><div className="fake-hand right" /></div><div className="camera-caption">Camera active</div></div> : <div className="camera-off"><div className="camera-circle"><Camera size={26} /></div><strong>Camera is off</strong><span>Click the button below to start your camera</span><button className="primary-btn teal small" onClick={() => setCameraOn(true)}>Start Camera</button></div>}
        </div>
      </div>
      <div className="panel translation-panel">
        <div className="panel-title">Translation (Urdu)</div>
        <div className="translation-box">Urdu translation will appear here...</div>
        <button className="secondary-btn icon-text"><Volume2 size={15} /> Listen</button>
      </div>
    </div>
    <div className="tips-panel"><strong>Tips for better results:</strong><span><Sparkles size={13} /> Good lighting</span><span><Search size={13} /> Clear hand visibility</span><span><Volume2 size={13} /> Minimal background noise</span></div>
  </>;
}

function UrduToPSL({ text, setText, autoPlay, setAutoPlay, isPlaying, setIsPlaying }: { text: string; setText: (v: string) => void; autoPlay: boolean; setAutoPlay: (v: boolean) => void; isPlaying: boolean; setIsPlaying: (v: boolean) => void }) {
  return <>
    <div className="page-header"><div><h2 className="violet-title">Urdu to PSL</h2><p>Enter Urdu text and convert it to Pakistani Sign Language.</p></div><button className="info-btn"><Info size={15} /> How it works</button></div>
    <div className="urdu-layout">
      <div className="input-column">
        <div className="panel input-panel">
          <div className="panel-title">Enter Urdu Text</div>
          <textarea dir="rtl" placeholder="Type or paste Urdu text here..." value={text} onChange={(e) => setText(e.target.value)} maxLength={500} />
          <div className="counter">{text.length} / 500 Characters</div>
          <button className="primary-btn violet translate-btn"><Sparkles size={16} /> Translate</button>
        </div>
      </div>
      <div className="panel avatar-panel">
        <div className="panel-title">PSL Output</div>
        <div className="avatar-stage">
          <Avatar />
          <div className="avatar-controls">
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause size={18} /> : <Play size={18} />}<span>{isPlaying ? "Pause" : "Play / Pause"}</span></button>
            <button><RotateCcw size={18} /><span>Replay</span></button>
            <button><Clock3 size={18} /><span>Slow</span></button>
          </div>
        </div>
        <div className="avatar-footer"><button className={`switch ${autoPlay ? "on" : ""}`} onClick={() => setAutoPlay(!autoPlay)}><span /></button><span>Auto Play</span><button className="fullscreen-btn">Fullscreen <ArrowUpRight size={13} /></button></div>
      </div>
    </div>
    <div className="recent-panel"><div className="recent-heading"><strong>Recent Translations</strong></div><div className="translation-chips">{recentTranslations.map((t) => <button key={t} onClick={() => setText(t)} dir="rtl">{t}</button>)}</div></div>
  </>;
}

function Avatar() {
  return <div className="avatar-illustration" aria-hidden="true">
    <div className="avatar-hair" />
    <div className="avatar-face"><div className="eye left" /><div className="eye right" /><div className="mouth" /></div>
    <div className="avatar-neck" />
    <div className="avatar-shirt" />
    <div className="avatar-arm left" />
    <div className="avatar-arm right" />
    <div className="avatar-forearm raised" />
    <div className="avatar-hand raised"><span /><span /><span /><span /><span /></div>
  </div>;
}
