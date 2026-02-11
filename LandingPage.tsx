
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  Check, 
  ChevronDown, 
  Zap, 
  Video, 
  Layers, 
  Globe, 
  Clock, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles,
  Smartphone,
  Mic2,
  Cpu,
  Tv
} from 'lucide-react';

// --- Types ---
interface NavLinkProps { href: string; children: React.ReactNode; }
interface FeatureCardProps { icon: React.ElementType; title: string; description: string; }
interface AccordionItemProps { question: string; answer: string; }
interface VideoItem { id: number | string; title: string; category: string; videoSrc: string; }

// --- Video Data Configuration ---
const BASE_VIDEO_URL = "https://storage.googleapis.com/kirato-landing-videos/kiratolandvid/";

const GALLERY_DATA: VideoItem[] = [
  { id: "v1", title: "Cinematic Teaser", category: "Cinematic", videoSrc: `${BASE_VIDEO_URL}AQP_1tm5DX3adJJhAt0rb_Ng9hhCEgaFtYfWzqT2njvIrWu_HXVI7Hx8R7srEt5Ae.mp4` },
  { id: "v2", title: "VFX Smoke Shot", category: "VFX", videoSrc: `${BASE_VIDEO_URL}AQOzYU9GCaIowG4EzAEkGcGMvylqtS224ulzvpIs0UheD94L3QfR2yGB2IvoVAB.mp4` },
  { id: "v3", title: "Product Ad", category: "Ads", videoSrc: `${BASE_VIDEO_URL}AQNv9AgPwXVm9NnrZAyqkIS_GAXOJcZmfBZ3AHfYfyzLhR3Tym4iqqTglD2kjws.mp4` },
  { id: "v4", title: "Transition Test", category: "Transitions", videoSrc: `${BASE_VIDEO_URL}AQOFq78CxNJwnbhSjmByHJafQK_TjUkTKym1Stp_5_vGOI0ANdtS0XHRoa8v62CSI5DXg8Rbn.mp4` },
  { id: "v5", title: "Moody Scene", category: "Cinematic", videoSrc: `${BASE_VIDEO_URL}AQPBz4vubY5g3oAP_8bZduoXuu_U5GvkVSPBQyFqhUFPqRNC3V9bFwVYa_LCZpv.mp4` },
  { id: "v6", title: "Dynamic VFX", category: "VFX", videoSrc: `${BASE_VIDEO_URL}AQNb_E5LjZqyaVDHamacAn7bKSTqfINoAS_mwBUGXOb3uOnogYM9P34gTXvUkPA.mp4` },
  { id: "v7", title: "Fashion Spot", category: "Ads", videoSrc: `${BASE_VIDEO_URL}AQP3TnFjTmHFdgyEw7ndb36Sycqbo8sXDJ2oydQjHmC0djpfl2ER3Z9Vxlx1Cr0cSfCgYXhtaqQWXA.mp4` },
  { id: "v8", title: "Epic Reveal", category: "Cinematic", videoSrc: `${BASE_VIDEO_URL}AQN7_XQYnGgyZKy90_O345t_I_H47t3r5v2Ybl224vBcX9O7HQZaELrkKumJTT0.mp4` },
  { id: "v9", title: "Digital Flow", category: "Transitions", videoSrc: `${BASE_VIDEO_URL}AQPI4sJoLlKJ3gGyJJo0XnuIAGUQkKRGpopt2mDz3ZXXSki2Giln9IIYuqxb7DGNtp.mp4` },
];

const CATEGORIES = ["All", "Ads", "VFX", "Cinematic", "Transitions"];

// --- Sub-components ---

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a href={href} className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-colors">{children}</a>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="p-8 rounded-2xl glass hover:border-indigo-500/50 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left focus:outline-none">
        <span className="text-lg font-medium text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const VideoCard: React.FC<{ item: VideoItem, onSelect: (item: VideoItem) => void, className?: string }> = ({ item, onSelect, className = "" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`relative group rounded-2xl overflow-hidden glass border-white/10 shadow-lg cursor-pointer transition-all duration-500 hover:border-indigo-500/40 hover:-translate-y-1 w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
    >
      <div className="aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] relative overflow-hidden bg-black/40">
        <video 
          ref={videoRef}
          src={item.videoSrc} 
          className="w-full h-full object-cover" 
          muted loop playsInline preload="metadata"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all transform ${isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-60'}`}>
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white ml-1" />
          </div>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-indigo-600/80 backdrop-blur-md text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white border border-indigo-400/30">
          AI
        </span>
      </div>

      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col items-start gap-1 z-10">
        <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full glass border-white/20 text-[9px] sm:text-[11px] font-bold text-white shadow-xl truncate max-w-full">
          {item.title}
        </span>
      </div>
    </div>
  );
};

// --- Main Landing Page Component ---

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const filteredGallery = useMemo(() => {
    if (activeCategory === "All") return GALLERY_DATA;
    return GALLERY_DATA.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const pricingPlans = [
    { name: "Starter", price: "11", credits: "300 credits / month", features: ["Access to AI Studio + Workflow", "HD exports", "Basic VFX / Color / Audio tools", "Standard rendering speed"], cta: "Start Starter", popular: false },
    { name: "Pro", price: "27", credits: "900 credits / month", features: ["Everything in Starter", "4K exports", "Full VFX, Color & Audio tools", "Faster rendering"], cta: "Start Pro", popular: true },
    { name: "Studio", price: "47", credits: "1800 credits / month", features: ["Everything in Pro", "Priority cloud rendering", "Commercial usage rights", "Highest queue priority"], cta: "Start Studio", popular: false }
  ];

  return (
    <div className="relative bg-[#0b0f1a] text-white selection:bg-indigo-500 selection:text-white scroll-smooth">
      <div className="fixed inset-0 pointer-events-none hero-gradient -z-10" />
      
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300" onClick={() => setSelectedVideo(null)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10" onClick={(e) => e.stopPropagation()}>
            <video src={selectedVideo.videoSrc} className="w-full h-full object-contain bg-black" autoPlay controls playsInline />
            <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-6 p-4 rounded-2xl glass border-white/10 hidden sm:block">
              <p className="text-white font-bold text-lg">{selectedVideo.title}</p>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{selectedVideo.category}</p>
            </div>
          </div>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-600/20">
              <span className="text-xl font-black text-white leading-none">K</span>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 ml-1">KIRATO AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#product">Product</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
            <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Start Pro</button>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 glass border-t border-white/10 p-6 flex flex-col gap-6 md:hidden">
            <div className="flex flex-col gap-6" onClick={closeMobileMenu}>
              <NavLink href="#product">Product</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </div>
            <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Start Pro</button>
          </div>
        )}
      </nav>

      <section className="pt-32 sm:pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight glow-text">
              Create cinematic videos <br />
              <span className="text-indigo-500">from one prompt.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl">
              Kirato AI generates ads, VFX shots, transitions, and realistic clips in minutes — no timelines, no plugins, no complex tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/30 active:scale-95">
                Try Kirato AI <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 glass hover:bg-white/10 text-white rounded-xl font-bold transition-all active:scale-95">Open Workflow Mode</button>
            </div>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">Made with Kirato AI</h2>
                <p className="text-gray-400 max-w-lg leading-relaxed text-sm sm:text-base">Explore cinematic ads, VFX shots, and realistic clips generated by our workflow.</p>
              </div>
              <div className="flex flex-wrap gap-2 p-1 glass rounded-xl border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {filteredGallery.map((item, index) => (
                <VideoCard 
                  key={item.id} 
                  item={item} 
                  onSelect={setSelectedVideo} 
                  // MOBILE-ONLY FIX + DESKTOP-ONLY FIX: 
                  // index === length - 1 (the 9th item) 
                  // is hidden on mobile (<sm) to keep a clean 2x4 grid, 
                  // visible on tablet (sm to lg) to keep a clean 3x3 grid,
                  // and hidden on desktop (>=lg) to keep a clean 2x4 grid.
                  className={index === filteredGallery.length - 1 ? "hidden sm:block lg:hidden" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-white/5 py-12 bg-black/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 text-gray-500 font-bold text-lg uppercase tracking-widest opacity-60">
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Tv className="w-5 h-5" /> Ads</span>
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Smartphone className="w-5 h-5" /> Reels</span>
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Layers className="w-5 h-5" /> Product Teasers</span>
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">Short Films</span>
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">Game Trailers</span>
        </div>
      </div>

      <section id="product" className="py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">Pick your creation mode</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">Start simple with a prompt — or craft premium ads with nodes. Same engine, different control.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-12 rounded-[2.5rem] glass border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700"><Sparkles className="w-48 h-48 text-indigo-400" /></div>
              <div className="mb-8 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-4">FAST MODE</span>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">AI Studio</h3>
              </div>
              <ul className="space-y-6 mb-12 flex-grow relative z-10">
                <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-indigo-400" /></div><span className="text-gray-300 text-base sm:text-lg">One prompt → cinematic clip</span></li>
                <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-indigo-400" /></div><span className="text-gray-300 text-base sm:text-lg">Auto camera, motion & style</span></li>
                <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-indigo-400" /></div><span className="text-gray-300 text-base sm:text-lg">Best for quick ads & teasers</span></li>
              </ul>
              <button className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all active:scale-[0.98] relative z-10">Try AI Studio</button>
            </div>
            <div className="p-8 sm:p-12 rounded-[2.5rem] glass border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700"><Layers className="w-48 h-48 text-indigo-400" /></div>
              <div className="mb-8 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-4">PRO MODE</span>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">Workflow</h3>
              </div>
              <ul className="space-y-6 mb-12 flex-grow relative z-10">
                <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-indigo-400" /></div><span className="text-gray-300 text-base sm:text-lg leading-tight">Node-based control (VFX, transitions, grade)</span></li>
                <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-indigo-400" /></div><span className="text-gray-300 text-base sm:text-lg">First/last frame precision</span></li>
                <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-indigo-400" /></div><span className="text-gray-300 text-base sm:text-lg">Best for premium ads & sequences</span></li>
              </ul>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20 relative z-10">Open Workflow</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Why Kirato AI?</h2>
            <div className="w-20 h-1.5 bg-indigo-600 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={Zap} title="No skills needed" description="Forget timelines and keyframes. If you can describe it, we can render it with perfect consistency." />
            <FeatureCard icon={Video} title="Cinematic quality" description="Engineered by cinematographers to ensure lighting, framing, and depth of field are Hollywood-grade." />
            <FeatureCard icon={Clock} title="Fast iterations" description="Produce multiple variations in minutes. Cut your production cycles from weeks to just seconds." />
            <FeatureCard icon={Mic2} title="Multilingual voice" description="Auto-translate and voiceover your videos in 30+ languages with perfect lip-syncing technology." />
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20 tracking-tight">Three steps to cinematic mastery</h2>
          <div className="grid md:grid-cols-3 gap-16 relative">
            <div className="relative">
              <div className="text-9xl font-black text-white/5 absolute -top-16 left-1/2 -translate-x-1/2 select-none">1</div>
              <div className="w-20 h-20 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20"><Sparkles className="w-8 h-8 text-indigo-400" /></div>
              <h3 className="text-2xl font-bold mb-4">Describe your vision</h3>
              <p className="text-gray-400">Type your prompt or upload a script. Mention mood, lighting, and camera angle.</p>
            </div>
            <div className="relative">
              <div className="text-9xl font-black text-white/5 absolute -top-16 left-1/2 -translate-x-1/2 select-none">2</div>
              <div className="w-20 h-20 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20"><Cpu className="w-8 h-8 text-indigo-400" /></div>
              <h3 className="text-2xl font-bold mb-4">Neural Rendering</h3>
              <p className="text-gray-400">Our engine synthesizes high-fidelity frames with consistent physics and motion.</p>
            </div>
            <div className="relative">
              <div className="text-9xl font-black text-white/5 absolute -top-16 left-1/2 -translate-x-1/2 select-none">3</div>
              <div className="w-20 h-20 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20"><Globe className="w-8 h-8 text-indigo-400" /></div>
              <h3 className="text-2xl font-bold mb-4">Export & Share</h3>
              <p className="text-gray-400">Download in 4K resolution, localized for every social platform automatically.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">Scale your video production with credits that fit your workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`relative p-8 md:p-10 rounded-[2.5rem] glass transition-all duration-500 flex flex-col h-full ${plan.popular ? 'border-indigo-500/50 shadow-2xl shadow-indigo-600/15 bg-indigo-500/[0.03] scale-105 z-10' : 'border-white/10 hover:border-white/20'}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-indigo-600 text-[10px] font-black tracking-widest uppercase">Most Popular</div>}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-gray-500 mb-1 font-medium">/ month</span>
                  </div>
                  <p className="text-indigo-400 text-sm font-bold uppercase tracking-wider">{plan.credits}</p>
                </div>
                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 text-gray-300 text-sm leading-relaxed">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-indigo-400" /></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-12">All plans include a 7-day free trial. Cancel anytime.</p>
        </div>
      </section>

      <section id="faq" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="glass rounded-3xl p-8 border-white/5">
            <AccordionItem question="How realistic are the videos?" answer="Kirato AI uses a proprietary neural rendering engine that respects the laws of physics and light. While we excel at cinematic VFX and high-end stylized shots, our realistic mode is indistinguishable from live footage in most advertising contexts." />
            <AccordionItem question="Can I edit the videos after generation?" answer="Yes. Our Workflow Mode gives you full node-based control to tweak lighting, add VFX layers, adjust color grading, and swap audio elements just like a traditional NLE, but faster." />
            <AccordionItem question="What is the difference between Studio and Workflow?" answer="Studio is for speed and storytelling—ideal for creators who want to prompt and get a finished video. Workflow is for professionals who need granular control over every aspect of the frame and sound." />
            <AccordionItem question="Is my data and training content private?" answer="Absolutely. We do not use your generated content or proprietary assets to train our public models. Every Pro workspace is sandboxed and encrypted." />
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <span className="text-xl font-black text-white leading-none">K</span>
                </div>
                <span className="text-xl font-black tracking-tighter">KIRATO AI</span>
              </div>
              <p className="text-gray-500 max-sm leading-relaxed">Empowering the next generation of visual storytellers with cinematic AI that bridges the gap between imagination and reality.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#product" className="hover:text-indigo-400 transition-colors">AI Studio</a></li>
                <li><a href="#product" className="hover:text-indigo-400 transition-colors">Pro Workflow</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Kirato AI Technologies Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-white transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
