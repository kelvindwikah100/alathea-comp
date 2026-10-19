import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Check, Sparkles, Volume2, Cpu, BatteryCharging, ShieldCheck, X } from 'lucide-react';

/**
 * Custom Titanium Crystal Cluster Component
 * Renders a photorealistic multi-faceted raw titanium crystal rock tilted at -36deg
 * matching the exact silhouette, contrast, and chrome facets in the "Materials" card.
 */
const TitaniumCrystalGraphic: React.FC = () => {
  // Deterministic crystalline facet definitions for the diagonal elongated nugget
  const facets = [
    // Core silhouette & dark metallic base layer
    { points: '28,118 18,98 32,76 52,58 76,38 102,22 128,16 152,26 164,46 154,72 134,94 108,116 78,132 48,134', fill: 'url(#crystalBase)' },
    // Left/Bottom cluster facets
    { points: '22,102 36,92 44,108 30,118', fill: '#D8DEE8' },
    { points: '36,92 52,86 44,108', fill: '#4A5260' },
    { points: '30,118 44,108 58,120 42,130', fill: '#9AA4B4' },
    { points: '44,108 64,98 58,120', fill: '#1E232B' },
    { points: '42,130 58,120 74,126 56,135', fill: '#E6ECF5' },
    { points: '58,120 78,108 74,126', fill: '#5C6474' },
    { points: '26,84 44,74 36,92 20,96', fill: '#F4F7FB' },
    { points: '44,74 58,82 36,92', fill: '#2B313B' },
    { points: '34,68 54,58 44,74', fill: '#B8C2D2' },
    // Center-Left facets (high contrast metallic shards)
    { points: '52,86 70,74 64,98 44,108', fill: '#ECEFF6' },
    { points: '70,74 86,84 64,98', fill: '#353C48' },
    { points: '64,98 86,84 94,102 78,108', fill: '#C8D2E2' },
    { points: '78,108 94,102 104,114 82,124', fill: '#F7FASG' },
    { points: '78,108 96,100 102,114 84,122', fill: '#F5F8FC' },
    { points: '54,58 74,48 70,74 52,68', fill: '#7D8798' },
    { points: '74,48 92,58 70,74', fill: '#1B2028' },
    { points: '70,74 92,58 102,74 86,84', fill: '#E2E9F3' },
    { points: '86,84 102,74 114,88 94,102', fill: '#525B6B' },
    { points: '94,102 114,88 124,98 104,114', fill: '#B4BFCE' },
    // Center & Upper-Right crystalline ridges
    { points: '74,48 94,32 108,44 92,58', fill: '#EFF4FA' },
    { points: '92,58 108,44 122,56 102,74', fill: '#2C333F' },
    { points: '102,74 122,56 134,68 114,88', fill: '#DCE4F0' },
    { points: '114,88 134,68 144,78 124,98', fill: '#3B4352' },
    { points: '94,32 116,20 124,34 108,44', fill: '#8B96A8' },
    { points: '108,44 124,34 138,44 122,56', fill: '#F8FAFD' },
    { points: '122,56 138,44 150,56 134,68', fill: '#636D7E' },
    { points: '116,20 138,16 144,30 124,34', fill: '#E4EBF5' },
    { points: '124,34 144,30 156,42 138,44', fill: '#232933' },
    { points: '138,44 156,42 162,56 150,56', fill: '#C2CCE0' },
    { points: '134,68 150,56 158,68 144,78', fill: '#EDF2F9' },
    // Sharp micro-crystalline specular nuggets
    { points: '58,72 68,64 74,76 62,82', fill: '#FFFFFF' },
    { points: '82,52 94,46 98,58 86,62', fill: '#FFFFFF' },
    { points: '106,34 118,28 122,40 110,44', fill: '#FFFFFF' },
    { points: '42,96 52,90 56,100 46,104', fill: '#FFFFFF' },
    { points: '96,78 108,72 112,82 100,86', fill: '#FFFFFF' },
    { points: '126,50 136,44 140,54 130,58', fill: '#FFFFFF' },
    { points: '68,104 78,98 82,108 72,112', fill: '#FFFFFF' },
    { points: '132,22 142,20 146,28 136,32', fill: '#FFFFFF' },
    // Deep crevices for realistic mineral texture
    { points: '48,66 56,62 58,70 46,72', fill: '#12161C' },
    { points: '76,62 84,58 86,68 74,70', fill: '#12161C' },
    { points: '102,52 110,48 112,58 100,60', fill: '#12161C' },
    { points: '62,88 72,84 74,94 60,94', fill: '#12161C' },
    { points: '116,70 126,66 128,76 114,78', fill: '#12161C' },
    { points: '88,92 98,88 100,98 86,98', fill: '#12161C' },
    { points: '32,104 40,100 42,110 30,112', fill: '#12161C' },
  ];

  return (
    <div className="relative w-[175px] h-[150px] flex items-center justify-center select-none pointer-events-none -mr-2">
      {/* Subtle drop shadow beneath the crystal */}
      <div className="absolute w-[135px] h-[44px] bg-[#7C889B]/25 blur-xl rounded-full -rotate-[32deg] translate-y-4 translate-x-1" />
      <svg
        viewBox="0 0 180 150"
        className="w-full h-full drop-shadow-[0_10px_14px_rgba(30,40,60,0.22)]"
        fill="none"
      >
        <defs>
          <linearGradient id="crystalBase" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B4250" />
            <stop offset="35%" stopColor="#8E99AC" />
            <stop offset="70%" stopColor="#525B6C" />
            <stop offset="100%" stopColor="#CBD4E4" />
          </linearGradient>
          <linearGradient id="shardSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#B8C4D8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2A303C" stopOpacity="0.9" />
          </linearGradient>
          <filter id="roughCrystal" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="4" result="noise" />
            <feSpecularLighting
              in="noise"
              surfaceScale="6"
              specularConstant="1.4"
              specularExponent="28"
              lightingColor="#FFFFFF"
              result="spec"
            >
              <fePointLight x="110" y="30" z="90" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="in" result="specOut" />
            <feBlend in="SourceGraphic" in2="specOut" mode="screen" />
          </filter>
        </defs>

        {/* Main Faceted Titanium Body */}
        <g filter="url(#roughCrystal)">
          {facets.map((f, idx) => (
            <polygon
              key={idx}
              points={f.points}
              fill={f.fill}
              stroke="#2B323E"
              strokeWidth="0.45"
              strokeLinejoin="bevel"
            />
          ))}

          {/* Additional high-detail crystalline shards around the perimeter for natural mineral jaggedness */}
          <polygon points="18,98 26,84 34,94 22,106" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="46,62 62,48 68,60 52,70" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="80,36 98,24 104,36 86,46" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="112,20 132,14 136,26 118,30" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="142,24 158,34 152,48 138,38" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="148,58 162,66 146,82 136,72" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="122,96 138,84 128,104 110,112" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="88,118 108,108 96,124 76,130" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="52,128 74,122 62,136 42,134" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
        </g>

        {/* Crisp metallic rim highlights */}
        <polyline
          points="24,96 42,74 58,80 76,50 94,56 112,28 130,34 146,24"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeOpacity="0.85"
          fill="none"
        />
        <polyline
          points="36,116 58,102 74,110 98,86 116,94 138,68 154,54"
          stroke="#FFFFFF"
          strokeWidth="0.9"
          strokeOpacity="0.75"
          fill="none"
        />
      </svg>
    </div>
  );
};

/**
 * Custom AI Assistant Glowing Iridescent Orb Component
 * Matches the soft periwinkle outer ring and glowing white/blue 3D petal sphere in the "Ai Asisstant" card.
 */
const AiOrbGraphic: React.FC<{ isListening?: boolean }> = ({ isListening = false }) => {
  return (
    <div className="relative w-[124px] h-[124px] flex items-center justify-center select-none pointer-events-none">
      {/* Outer Translucent Periwinkle Disc */}
      <div
        className={`w-[122px] h-[122px] rounded-full flex items-center justify-center relative transition-transform duration-700 ${
          isListening ? 'scale-105' : ''
        }`}
        style={{
          background:
            'radial-gradient(circle at 70% 30%, #E7EFFC 0%, #D3E0F7 52%, #C5D5F2 85%, #BBD0F0 100%)',
          boxShadow:
            'inset 0 2px 8px rgba(255,255,255,0.85), inset 0 -4px 12px rgba(145,170,215,0.4), 0 8px 20px rgba(165,185,220,0.28)',
        }}
      >
        {/* Subtle inner ring sheen */}
        <div
          className="w-[88px] h-[88px] rounded-full relative overflow-hidden flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 65% 65%, #FFFFFF 0%, #DCE8FD 38%, #A9C2F6 74%, #95B2EE 100%)',
            boxShadow:
              '0 6px 18px rgba(120,150,210,0.35), inset 0 2px 6px rgba(255,255,255,0.9)',
          }}
        >
          {/* Top-left periwinkle petal lobe */}
          <div
            className="absolute -top-2 -left-2 w-[66px] h-[66px] rounded-full opacity-90"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, #8CA9EC 0%, #AFC5F8 55%, transparent 75%)',
              filter: 'blur(2px)',
            }}
          />

          {/* Top-right icy cyan/lavender lobe */}
          <div
            className="absolute -top-1 right-0 w-[62px] h-[62px] rounded-full opacity-95"
            style={{
              background:
                'radial-gradient(circle at 60% 35%, #EBF3FF 0%, #C4D7FA 55%, transparent 78%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Bottom-left soft shadow petal */}
          <div
            className="absolute bottom-0 -left-1 w-[58px] h-[58px] rounded-full opacity-85"
            style={{
              background:
                'radial-gradient(circle at 30% 70%, #9EB8F2 0%, #C6D8FA 60%, transparent 80%)',
              filter: 'blur(2px)',
            }}
          />

          {/* Characteristic curved 3D ribbon crease across center */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="orbGlowCore" cx="62%" cy="62%" r="42%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="45%" stopColor="#F5F9FF" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#C8DCFD" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#9AB6F2" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="petalEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8AA8EC" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ADC6F8" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Intersecting internal Siri-style translucent wave petals */}
            <path
              d="M 14,55 C 24,22 68,20 84,48 C 68,34 34,38 14,55 Z"
              fill="url(#petalEdge)"
              opacity="0.75"
            />
            <path
              d="M 24,78 C 20,44 52,28 82,42 C 58,42 40,56 24,78 Z"
              fill="#8FAEEF"
              opacity="0.35"
            />
            {/* Bright glowing white core on the center/bottom-right */}
            <circle cx="58" cy="58" r="34" fill="url(#orbGlowCore)" />
          </svg>

          {/* Specular glass rim highlight */}
          <div className="absolute inset-0 rounded-full border border-white/75 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Interactive states (default matches screenshot 100%)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [transportMode, setTransportMode] = useState<'paused' | 'playing' | 'recording'>('paused');
  const [secondsElapsed, setSecondsElapsed] = useState<number>(97); // 0.01.37 default
  const [trackNumber, setTrackNumber] = useState<number>(4); // 04 default
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<null | 'menu' | 'search' | 'contact' | 'buy' | 'materials' | 'ai'>(null);
  const [cartCount, setCartCount] = useState<number>(1);

  // Animate timer and motorized wheel only when user clicks Play or Record
  useEffect(() => {
    if (transportMode === 'paused') return;

    const timerInterval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    const wheelInterval = setInterval(() => {
      setWheelRotation((prev) => (prev + (transportMode === 'recording' ? 2.2 : 1.5)) % 360);
    }, 30);

    return () => {
      clearInterval(timerInterval);
      clearInterval(wheelInterval);
    };
  }, [transportMode]);

  // Format seconds as 0.MM.SS to match "0.01.37" on the TP-7 OLED screen
  const formatOledTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${hrs}.${pad(mins)}.${pad(secs)}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#111111] flex items-center justify-center overflow-x-hidden selection:bg-[#111111] selection:text-white">
      {/* Load exact geometric font family */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-oled {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Main Locked-Proportion Desktop Canvas (1440x900 reference frame) */}
      <div className="font-jakarta relative w-full max-w-[1440px] min-h-[880px] bg-[#FFFFFF] px-8 sm:px-11 pt-7 pb-8 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle ambient cool light behind the TP-7 device on the right */}
        <div
          className="pointer-events-none absolute right-[8%] top-[14%] w-[520px] h-[520px] rounded-full opacity-55 blur-[95px]"
          style={{
            background: 'radial-gradient(circle, #D8E5F8 0%, #EBF2FC 55%, transparent 100%)',
          }}
        />

        {/* ============================================================
            1. TOP NAVBAR
           ============================================================ */}
        <header className="relative z-30 flex items-center justify-between w-full pt-1">
          {/* Left Group: Logo + Menu + Search */}
          <div className="flex items-center">
            {/* Logo: Today. */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setTransportMode('paused');
                setSecondsElapsed(97);
                setWheelRotation(0);
              }}
              className="text-[25px] font-extrabold tracking-[-0.035em] text-[#111111] leading-none select-none"
            >
              Today.
            </a>

            {/* Menu Button with exact custom 2-line + dot icon */}
            <button
              onClick={() => setActiveModal('menu')}
              className="ml-12 sm:ml-[58px] flex items-center gap-2.5 text-[13.5px] font-medium text-[#1E1E1E] hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open Menu"
            >
              <span className="flex flex-col justify-center gap-[3.5px] w-[22px]">
                {/* Top full line */}
                <span className="w-[22px] h-[1.6px] bg-[#1E1E1E] rounded-full" />
                {/* Bottom dot + shorter line */}
                <span className="flex items-center justify-between w-[22px]">
                  <span className="w-[2px] h-[1.6px] bg-[#1E1E1E] rounded-full" />
                  <span className="w-[17px] h-[1.6px] bg-[#1E1E1E] rounded-full" />
                </span>
              </span>
              <span>Menu</span>
            </button>

            {/* Search Icon Button */}
            <button
              onClick={() => setActiveModal('search')}
              className="ml-7 text-[#1E1E1E] hover:opacity-70 transition-opacity p-1 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-[17px] h-[17px] stroke-[1.8]" />
            </button>
          </div>

          {/* Right Group: Cart Bag + Contact Us Pill */}
          <div className="flex items-center gap-3.5">
            {/* Shopping Bag Button with external top-right '1' superscript */}
            <div className="relative">
              <button
                onClick={() => setCartCount((c) => (c >= 9 ? 1 : c + 1))}
                className="w-[42px] h-[42px] rounded-full border border-[#DCDFE6] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Shopping Bag"
                title="Click to update cart count"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[17px] h-[17px] stroke-[#1E1E1E]"
                  fill="none"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 7h12l1 13H5L6 7z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              </button>
              <span className="absolute -top-0.5 -right-2 text-[11px] font-semibold text-[#141414] leading-none">
                {cartCount}
              </span>
            </div>

            {/* Contact Us Dark Pill Button */}
            <button
              onClick={() => setActiveModal('contact')}
              className="h-[42px] pl-6 pr-5 rounded-full bg-[#141414] text-[#F1F1F1] flex items-center gap-7 hover:bg-[#262626] transition-colors cursor-pointer shadow-sm"
            >
              <span className="text-[13px] font-normal tracking-[0.01em]">Contact Us</span>
              <ArrowUpRight className="w-[15px] h-[15px] text-[#EAEAEA] stroke-[1.7]" />
            </button>
          </div>
        </header>

        {/* ============================================================
            2. LEFT VERTICAL STEP INDICATOR (1, 2, 3 + Progress Line 01)
            Aligned horizontally with "Today." logo on the left
           ============================================================ */}
        <div className="hidden lg:flex flex-col items-center absolute left-[44px] top-[44.5%] -translate-y-1/2 z-20 select-none">
          {/* Interlocking 1, 2, 3 Circles */}
          <div className="flex flex-col items-center">
            {[1, 2, 3].map((step, index) => {
              const isActive = activeStep === step;
              return (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  style={{ zIndex: 30 - index * 10 }}
                  className={`w-[21px] h-[21px] rounded-full text-[11px] font-medium flex items-center justify-center transition-all cursor-pointer ${
                    index > 0 ? '-mt-[3.5px]' : ''
                  } ${
                    isActive
                      ? 'bg-[#111111] text-white border border-[#111111]'
                      : 'bg-white/90 text-[#1E1E1E] border border-[#484E58] hover:border-[#111111]'
                  }`}
                  title={`Step 0${step}`}
                >
                  {step}
                </button>
              );
            })}
          </div>

          {/* Vertical Progress Track */}
          <div className="mt-9 w-[1.5px] h-[106px] bg-[#CBD5E6] relative rounded-full overflow-hidden">
            <div
              className="absolute left-0 w-full bg-[#141414] transition-all duration-300"
              style={{
                height: '46px',
                bottom: activeStep === 1 ? '0px' : activeStep === 2 ? '30px' : '60px',
              }}
            />
          </div>

          {/* Step Number Label */}
          <span className="mt-2 text-[12px] font-medium text-[#222222] tracking-tight">
            0{activeStep}
          </span>
        </div>

        {/* ============================================================
            3. MAIN HERO SECTION (Left Copy + Right TP-7 Device & Widgets)
           ============================================================ */}
        <main className="relative grid grid-cols-1 lg:grid-cols-12 items-center pt-4 pb-2 lg:pl-[122px]">
          
          {/* LEFT COLUMN: Hero Copy & CTA */}
          <div className="lg:col-span-6 z-20 pr-2">
            {/* Hot Gadget Badge */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-[50px] h-[50px] rounded-full bg-[#E5EEFA] flex items-center justify-center shrink-0">
                {/* Custom 6-spoke Asterisk SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-[22px] h-[22px] stroke-[#141414]"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="3.5" x2="12" y2="20.5" />
                  <line x1="4.6" y1="7.75" x2="19.4" y2="16.25" />
                  <line x1="19.4" y1="7.75" x2="4.6" y2="16.25" />
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#141414] leading-tight tracking-[-0.01em]">
                  Hot Gadget
                </h2>
                <p className="text-[13.5px] font-normal text-[#8D939E] leading-snug mt-0.5">
                  Revolution in Recorder technology
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-[42px] sm:text-[56px] xl:text-[58px] font-medium text-[#111111] leading-[1.13] tracking-[-0.028em] mb-7">
              Discover The Best Digital
              <br />
              Voice Recorders
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[17.5px] font-normal text-[#676B74] leading-[1.6] max-w-[435px] mb-10">
              Get the best by trusting us, we offer the best quality and the best price.
            </p>

            {/* Buy Now Outlined Pill Button */}
            <button
              onClick={() => setActiveModal('buy')}
              className="w-[206px] h-[60px] rounded-full border-[1.2px] border-[#262626] bg-transparent hover:bg-[#111111] hover:text-white text-[#111111] group transition-all duration-200 flex items-center justify-between px-7 cursor-pointer"
            >
              <span className="text-[15.5px] font-medium tracking-[-0.01em]">Buy Now</span>
              <ArrowUpRight className="w-[18px] h-[18px] stroke-[1.8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* RIGHT COLUMN: Tilted TP-7 Digital Voice Recorder + 3 Callout Widgets */}
          <div className="lg:col-span-6 relative h-[520px] flex items-center justify-center mt-10 lg:mt-0">
            
            {/* ==========================================================
                TILTED TP-7 HARDWARE ASSEMBLY (Rotated 15.5 deg clockwise)
               ========================================================== */}
            <div className="relative w-[360px] h-[454px] rotate-[15.5deg] translate-x-6 -translate-y-1 select-none">
              
              {/* 1. Bottom Metallic Pole / Strap Extending Down Behind Bottom Card */}
              <div
                className="absolute -bottom-[210px] right-[40px] w-[52px] h-[230px] z-0 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(90deg, #6E7E94 0%, #9BAAC0 22%, #C5D2E4 45%, #8494AA 72%, #59677B 100%)',
                  boxShadow: '8px 16px 28px rgba(100,120,150,0.28)',
                }}
              >
                {/* Brushed vertical metallic ridges on the strap */}
                <div
                  className="w-full h-full opacity-45"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px, rgba(25,35,50,0.3) 4px)',
                  }}
                />
                {/* Dark vertical center channel groove */}
                <div className="absolute inset-y-0 left-[38%] w-[2.5px] bg-[#2D3748]/70" />
                <div className="absolute inset-y-0 left-[44%] w-[1px] bg-white/60" />
              </div>

              {/* 2. Top-Left Silver Antenna / Jack Sleeve Protrusion */}
              <div
                className="absolute -top-[42px] left-[28px] w-[11px] h-[44px] rounded-t-sm"
                style={{
                  background:
                    'linear-gradient(90deg, #E2E9F3 0%, #FFFFFF 45%, #C5D1E3 85%, #9AA8BE 100%)',
                  boxShadow: '0 -2px 6px rgba(160,180,205,0.25)',
                }}
              />

              {/* 3. Left Side Sculpted Aluminum Rocker / Side-Lever Mechanism */}
              <div className="absolute top-[74px] -left-[22px] w-[26px] h-[222px] z-10 pointer-events-none">
                <svg viewBox="0 0 32 240" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="leverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F2F6FC" />
                      <stop offset="55%" stopColor="#DAE5F4" />
                      <stop offset="100%" stopColor="#B2C1D8" />
                    </linearGradient>
                  </defs>
                  {/* Sculpted lever bar body */}
                  <path
                    d="M 28,4 L 14,12 C 8,15 6,22 6,30 L 6,96 C 6,104 12,110 12,118 C 12,126 6,132 6,140 L 6,204 C 6,214 10,220 18,224 L 28,228 Z"
                    fill="url(#leverGrad)"
                    stroke="#9BAAC2"
                    strokeWidth="1"
                  />
                  {/* Upper pivot screw recess */}
                  <circle cx="17" cy="24" r="4.5" fill="#BCCAE0" stroke="#7A8A9F" strokeWidth="0.8" />
                  {/* Middle ergonomic notch */}
                  <path
                    d="M 6,108 Q 20,120 6,132"
                    fill="none"
                    stroke="#7C8B9F"
                    strokeWidth="1.4"
                  />
                  <circle cx="18" cy="120" r="3" fill="#68768A" />
                  {/* Lower pivot screw recess */}
                  <circle cx="17" cy="212" r="5" fill="#C4D2E6" stroke="#7A8A9F" strokeWidth="1" />
                </svg>
              </div>

              {/* 4. Right Side 3D Extruded Chassis Thickness Edge + Buttons */}
              <div
                className="absolute top-[16px] -right-[7px] w-[8px] h-[422px] rounded-r-[14px] z-0"
                style={{
                  background: 'linear-gradient(180deg, #C7D5EA 0%, #9EB0CA 50%, #7E90AC 100%)',
                }}
              >
                {/* Side metallic buttons along upper-right edge */}
                <div className="w-[3.5px] h-[24px] bg-[#64748B] rounded-r-sm mt-[68px] ml-[5px]" />
                <div className="w-[3.5px] h-[34px] bg-[#475569] rounded-r-sm mt-[14px] ml-[5px]" />
                <div className="w-[3.5px] h-[22px] bg-[#64748B] rounded-r-sm mt-[38px] ml-[5px]" />
              </div>

              {/* 5. MAIN TP-7 ANODIZED CHASSIS BODY */}
              <div
                className="relative w-full h-full rounded-[22px] overflow-hidden z-10 flex flex-col justify-between"
                style={{
                  background:
                    'linear-gradient(142deg, #F5F8FD 0%, #E5EDF8 38%, #D2DFEF 76%, #C2D2E8 100%)',
                  boxShadow:
                    'inset 0 2px 3px rgba(255,255,255,0.95), inset -4px -4px 12px rgba(135,155,185,0.38), -12px 24px 48px rgba(145,168,200,0.32)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                {/* TOP HEADER ZONE OF TP-7: "TP-7 •" and OLED Screen "TODAY 0.01.37 04" */}
                <div className="relative pt-4 px-6 flex items-start justify-between">
                  {/* Left: TP-7 Engraving + Black Dot */}
                  <div className="flex items-center gap-3.5">
                    <span className="text-[26px] font-light tracking-[0.04em] text-[#5B6678] leading-none">
                      TP-7
                    </span>
                    <span className="w-[5px] h-[5px] rounded-full bg-[#1E242B] mt-0.5" />
                  </div>

                  {/* Center-top tiny mic pinhole */}
                  <span className="w-[4px] h-[4px] rounded-full bg-[#252B33] mt-3.5 -ml-6" />

                  {/* Right: Recessed OLED Display */}
                  <div
                    className="w-[88px] h-[45px] rounded-[6px] bg-[#0D1218] p-1.5 flex flex-col justify-between border-[1.5px] border-[#515E70] shadow-inner -mr-1 mt-0.5"
                    style={{
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.85), 0 1px 2px rgba(255,255,255,0.6)',
                    }}
                  >
                    <div className="font-oled text-[14.5px] font-semibold tracking-[0.12em] text-[#F1F5F9] leading-none text-center">
                      TODAY
                    </div>
                    <div className="flex items-center justify-between px-0.5">
                      <span className="font-oled text-[9.5px] font-medium text-[#CBD5E1] tracking-tighter leading-none">
                        {formatOledTimer(secondsElapsed)}
                      </span>
                      <span className="font-oled bg-[#D8E2EF] text-[#0D1218] text-[8.5px] font-bold px-1 py-[0.5px] rounded-[2px] leading-tight">
                        0{trackNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Small white LED indicator on upper-left & Orange "M" badge on upper-right */}
                <div className="absolute top-[60px] left-[22px] w-[7px] h-[7px] rounded-full bg-white/90 shadow-[0_0_6px_#fff]" />
                <div className="absolute top-[86px] right-[18px] w-[14px] h-[14px] rounded-[3px] bg-[#DE6B38] text-white text-[8.5px] font-bold flex items-center justify-center shadow-sm">
                  M
                </div>

                {/* ========================================================
                    6. CENTER MOTORIZED JOG WHEEL / TAPE REEL
                   ======================================================== */}
                <div className="relative w-[306px] h-[306px] mx-auto -mt-3 rounded-full flex items-center justify-center">
                  {/* Dark outer gap ring */}
                  <div
                    className="w-full h-full rounded-full border-[1.6px] border-[#6F7E94] flex items-center justify-center relative overflow-hidden transition-transform duration-75"
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      background:
                        'conic-gradient(from 135deg at 50% 50%, #E7EFFA 0deg, #D5E1F2 75deg, #EEF4FC 155deg, #C9D7EC 245deg, #E2ECFA 315deg, #E7EFFA 360deg)',
                      boxShadow:
                        'inset 0 2px 5px rgba(255,255,255,0.9), inset 0 -3px 8px rgba(120,140,170,0.35), 0 3px 10px rgba(90,110,140,0.18)',
                    }}
                  >
                    {/* Subtle Secondary Diagonal Crease Line (Bottom-Left to Top-Right) */}
                    <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/75 to-transparent -rotate-[42deg]" />

                    {/* Primary Engraved Diagonal Axis (Top-Left to Bottom-Right) with "96/24" and "3 00 M" */}
                    <div className="absolute w-full h-full flex items-center justify-center rotate-[44deg]">
                      {/* Hairline groove */}
                      <div className="w-full h-[1px] bg-[#9AA8BE]/55" />

                      {/* "96/24" radial engraving on upper-left radius */}
                      <span className="absolute left-[46px] -top-[14px] font-oled text-[10.5px] font-semibold tracking-[0.08em] text-[#687588] select-none">
                        96 /24
                      </span>

                      {/* "3 00 M" radial engraving on lower-right radius */}
                      <span className="absolute right-[42px] top-[6px] font-oled text-[10.5px] font-semibold tracking-[0.1em] text-[#687588] select-none">
                        3 00 M
                      </span>
                    </div>

                    {/* Center Dark Slate Hub with 3 White Dots */}
                    <div
                      className="relative z-10 w-[76px] h-[76px] rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #778192 0%, #586272 100%)',
                        boxShadow:
                          'inset 0 2px 4px rgba(255,255,255,0.25), 0 2px 6px rgba(40,50,65,0.35)',
                      }}
                    >
                      {/* 3 Pin Dots arranged inside the center hub */}
                      <span className="absolute top-[18px] right-[26px] w-[4.5px] h-[4.5px] rounded-full bg-[#E8EEF6]" />
                      <span className="absolute bottom-[25px] left-[16px] w-[4.5px] h-[4.5px] rounded-full bg-[#E8EEF6]" />
                      <span className="absolute bottom-[16px] right-[22px] w-[4.5px] h-[4.5px] rounded-full bg-[#E8EEF6]" />
                    </div>
                  </div>
                </div>

                {/* Subtle circular outline on the bottom-right corner above Stop button (where WTR050 line bends) */}
                <div className="absolute bottom-[88px] right-[22px] w-[22px] h-[22px] rounded-full border border-[#96A5BC]/75 pointer-events-none" />

                {/* ========================================================
                    7. BOTTOM 3 PHYSICAL TRANSPORT KEYS (Record, Play, Stop)
                   ======================================================== */}
                <div className="relative h-[82px] w-full px-5 bg-transparent flex flex-col justify-end">
                  {/* Horizontal dark separation groove */}
                  <div className="w-full h-[2px] bg-[#647286]" />

                  <div className="grid grid-cols-3 h-[76px] w-full bg-[#647286] gap-[2px]">
                    {/* Key 1: Record Button (Orange Dot at top-left) */}
                    <button
                      onClick={() =>
                        setTransportMode((m) => (m === 'recording' ? 'paused' : 'recording'))
                      }
                      title="Record (Interactive)"
                      className={`relative h-full w-full transition-all cursor-pointer active:translate-y-[1px] ${
                        transportMode === 'recording' ? 'brightness-95' : 'hover:brightness-98'
                      }`}
                      style={{
                        background:
                          'linear-gradient(180deg, #DCE6F6 0%, #CBD8EC 82%, #B8C8E0 100%)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.85)',
                      }}
                    >
                      <span
                        className={`absolute top-3.5 left-3.5 w-[11px] h-[11px] rounded-full bg-[#F15A29] ${
                          transportMode === 'recording' ? 'animate-ping' : ''
                        }`}
                      />
                      <span className="absolute top-3.5 left-3.5 w-[11px] h-[11px] rounded-full bg-[#F15A29]" />
                    </button>

                    {/* Key 2: Play Button (Black Triangle) */}
                    <button
                      onClick={() =>
                        setTransportMode((m) => (m === 'playing' ? 'paused' : 'playing'))
                      }
                      title="Play / Pause (Interactive)"
                      className={`relative h-full w-full flex items-center justify-center transition-all cursor-pointer active:translate-y-[1px] ${
                        transportMode === 'playing' ? 'brightness-95' : 'hover:brightness-98'
                      }`}
                      style={{
                        background:
                          'linear-gradient(180deg, #DCE6F6 0%, #CBD8EC 82%, #B8C8E0 100%)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.85)',
                      }}
                    >
                      <svg viewBox="0 0 16 16" className="w-[13px] h-[13px] fill-[#181E26] -mt-2">
                        <polygon points="3,2 14,8 3,14" />
                      </svg>
                    </button>

                    {/* Key 3: Stop Button (Black Square) */}
                    <button
                      onClick={() => {
                        setTransportMode('paused');
                        setTrackNumber((t) => (t % 9) + 1);
                      }}
                      title="Stop (Interactive)"
                      className="relative h-full w-full flex items-center justify-center transition-all cursor-pointer hover:brightness-98 active:translate-y-[1px]"
                      style={{
                        background:
                          'linear-gradient(180deg, #DCE6F6 0%, #CBD8EC 82%, #B8C8E0 100%)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.85)',
                      }}
                    >
                      <div className="w-[10px] h-[10px] bg-[#181E26] rounded-[1px] -mt-2" />
                    </button>
                  </div>

                  {/* Subtle bottom lip bevel under the 3 keys */}
                  <div className="w-full h-[5px] bg-gradient-to-b from-[#9BAAC0] to-[#BCCAE0] border-t border-[#728197]" />
                </div>
              </div>
            </div>

            {/* ==========================================================
                FLOATING FROSTED GLASS CALLOUT WIDGETS & SVG POINTER LINES
                (Unrotated horizontal overlays matching the reference 100%)
               ========================================================== */}

            {/* 1. TOP-LEFT CALLOUT: Lithium Battery */}
            <div className="absolute top-[28px] left-[6px] sm:left-[18px] z-30 flex items-center pointer-events-none">
              <div
                className="w-[156px] py-[18px] px-3 rounded-[18px] text-center backdrop-blur-md"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(238,242,247,0.9) 0%, rgba(229,234,242,0.86) 100%)',
                  boxShadow:
                    '0 10px 25px rgba(150,165,190,0.16), inset 0 1px 1px rgba(255,255,255,0.95)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                <div className="text-[13px] font-semibold text-[#18181B] leading-tight">
                  Lithium Battery
                </div>
                <div className="text-[9.5px] font-normal text-[#7B818E] mt-1.5 leading-tight">
                  A Type Of Rechargeable Battery
                </div>
              </div>

              {/* Exact Curved Pointer Line to Upper Wheel Rim */}
              <svg
                width="98"
                height="48"
                viewBox="0 0 98 48"
                fill="none"
                className="-ml-[1px] mt-7 overflow-visible"
              >
                <defs>
                  <linearGradient id="lineLithium" x1="0" y1="0" x2="98" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#262B33" stopOpacity="0.95" />
                    <stop offset="72%" stopColor="#4A5568" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,10 L 74,10 Q 90,10 90,26 L 88,44"
                  stroke="url(#lineLithium)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 2. MIDDLE-LEFT CALLOUT: Noice Canseling (exact reference spelling) */}
            <div className="absolute bottom-[132px] -left-[4px] sm:left-[0px] z-30 flex items-center pointer-events-none">
              <div
                className="w-[156px] py-[18px] px-3 rounded-[18px] text-center backdrop-blur-md"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(238,242,247,0.9) 0%, rgba(229,234,242,0.86) 100%)',
                  boxShadow:
                    '0 10px 25px rgba(150,165,190,0.16), inset 0 1px 1px rgba(255,255,255,0.95)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                <div className="text-[13px] font-semibold text-[#18181B] leading-tight">
                  Noice Canseling
                </div>
                <div className="text-[9.5px] font-normal text-[#7B818E] mt-1.5 leading-tight">
                  Easily Tune Back Into The World
                </div>
              </div>

              {/* Exact Angled Pointer Line to Center Wheel Hub */}
              <svg
                width="155"
                height="95"
                viewBox="0 0 155 95"
                fill="none"
                className="-ml-[1px] -mt-5 overflow-visible"
              >
                <defs>
                  <linearGradient id="lineNoise" x1="0" y1="80" x2="150" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22262E" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#4B5563" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,76 L 44,76 Q 50,76 55,72 L 146,6"
                  stroke="url(#lineNoise)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 3. BOTTOM-RIGHT CALLOUT: WTR050 Chipset */}
            <div className="absolute bottom-[36px] right-0 z-30 flex items-center pointer-events-none">
              {/* Pointer Line on the Left of WTR050 Card */}
              <svg
                width="68"
                height="96"
                viewBox="0 0 68 96"
                fill="none"
                className="-mr-[1px] -mt-8 overflow-visible"
              >
                <defs>
                  <linearGradient id="lineChipset" x1="68" y1="86" x2="4" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#262B33" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#525E70" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 68,84 L 36,84 Q 30,84 27,77 L 4,8"
                  stroke="url(#lineChipset)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="w-[156px] py-[18px] px-3 rounded-[18px] text-center backdrop-blur-md"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(238,242,247,0.92) 0%, rgba(229,234,242,0.88) 100%)',
                  boxShadow:
                    '0 10px 25px rgba(150,165,190,0.16), inset 0 1px 1px rgba(255,255,255,0.95)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                <div className="text-[13px] font-semibold text-[#18181B] leading-tight">
                  WTR050 Chipset
                </div>
                <div className="text-[9.5px] font-normal text-[#7B818E] mt-1.5 leading-tight">
                  Best Audio Recorder Chipset
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ============================================================
            4. BOTTOM 2 FEATURE CARDS ROW (Materials & Ai Asisstant)
           ============================================================ */}
        <section className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-2">
          
          {/* LEFT CARD: Materials */}
          <div
            className="h-auto sm:h-[196px] rounded-[28px] px-8 sm:px-9 py-6 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(234,239,246,0.92) 0%, rgba(238,242,248,0.86) 100%)',
              boxShadow:
                '0 4px 24px rgba(165,180,205,0.12), inset 0 1px 1px rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.85)',
            }}
          >
            {/* Left Copy */}
            <div className="max-w-[252px] z-10 text-left">
              <h3 className="text-[27px] font-medium text-[#111111] tracking-[-0.02em] leading-tight mb-3">
                Materials
              </h3>
              <p className="text-[13px] font-normal text-[#2D3138] leading-[1.48]">
                All the materials used in this recorder are titanium crystal and you can use and enjoy it for years without any worries.
              </p>
            </div>

            {/* Center-Right: Titanium Crystal Graphic + Action Button */}
            <div className="flex items-center gap-4 sm:gap-5 mt-4 sm:mt-0 z-10">
              <TitaniumCrystalGraphic />

              <button
                onClick={() => setActiveModal('materials')}
                className="w-[56px] h-[56px] rounded-full bg-[#0C0C0C] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-md"
                aria-label="Explore Materials"
              >
                <ArrowUpRight className="w-[20px] h-[20px] stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* RIGHT CARD: Ai Asisstant (exact reference spelling) */}
          <div className="relative">
            {/* Bottom tip of the TP-7 metallic strap peeking out from behind the Ai Asisstant card (just like the reference image!) */}
            <div
              className="hidden lg:block absolute -bottom-[28px] right-[176px] w-[52px] h-[42px] rotate-[15.5deg] z-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, #6A7A90 0%, #98A8BE 25%, #C2D0E2 48%, #7E8EA4 76%, #526074 100%)',
                boxShadow: '4px 8px 18px rgba(90,110,140,0.25)',
              }}
            >
              <div className="absolute inset-y-0 left-[38%] w-[2px] bg-[#2D3748]/70" />
            </div>

            <div
              className="relative z-10 h-auto sm:h-[196px] rounded-[28px] px-8 sm:px-9 py-6 flex flex-col sm:flex-row items-center justify-between overflow-hidden backdrop-blur-md"
              style={{
                background:
                  'linear-gradient(135deg, rgba(233,238,245,0.88) 0%, rgba(237,241,247,0.84) 100%)',
                boxShadow:
                  '0 4px 24px rgba(165,180,205,0.12), inset 0 1px 1px rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.85)',
              }}
            >
              {/* Left Copy */}
              <div className="max-w-[268px] z-10 text-left">
                <h3 className="text-[27px] font-medium text-[#111111] tracking-[-0.02em] leading-tight mb-3">
                  Ai Asisstant
                </h3>
                <p className="text-[13px] font-normal text-[#2D3138] leading-[1.48]">
                  The intelligent voice assistant of this device is able to perform any command from your side.
                </p>
              </div>

              {/* Center-Right: AI Glowing Orb + Action Button */}
              <div className="flex items-center gap-6 sm:gap-7 mt-4 sm:mt-0 z-10">
                <AiOrbGraphic isListening={transportMode === 'recording'} />

                <button
                  onClick={() => setActiveModal('ai')}
                  className="w-[56px] h-[56px] rounded-full bg-[#0C0C0C] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-md"
                  aria-label="Explore AI Assistant"
                >
                  <ArrowUpRight className="w-[20px] h-[20px] stroke-[1.8]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            NON-INTRUSIVE INTERACTIVE DRAWER / MODAL FOR DEMO ACTIONS
           ============================================================ */}
        {activeModal && (
          <div
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white rounded-[24px] max-w-md w-full p-7 shadow-2xl border border-gray-100 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              {activeModal === 'buy' && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEFA] text-[#141414] text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> TP-7 Digital Recorder
                  </div>
                  <h4 className="text-2xl font-bold text-[#111111] mb-2">
                    Today. TP-7 Ultra Field Recorder
                  </h4>
                  <p className="text-sm text-[#676B74] mb-5 leading-relaxed">
                    Precision-machined titanium crystal chassis with motorized tape reel, WTR050 audio chipset, and onboard AI voice command processing.
                  </p>
                  <div className="space-y-2.5 mb-6 text-xs text-[#2D3138]">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F4F7FB]">
                      <Cpu className="w-4 h-4 text-[#111111]" />
                      <span>WTR050 96kHz/24-bit Studio Audio Chipset</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F4F7FB]">
                      <BatteryCharging className="w-4 h-4 text-[#111111]" />
                      <span>Rechargeable High-Density Lithium Battery (7h+)</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F4F7FB]">
                      <Volume2 className="w-4 h-4 text-[#111111]" />
                      <span>Adaptive Noise Canceling & Motorized Jog Platter</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block">Price</span>
                      <span className="text-2xl font-bold text-[#111111]">$1,499</span>
                    </div>
                    <button
                      onClick={() => {
                        setCartCount((c) => c + 1);
                        setActiveModal(null);
                      }}
                      className="px-6 py-3 rounded-full bg-[#141414] text-white text-sm font-medium hover:bg-[#2a2a2a] transition flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Add to Bag
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'materials' && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEFA] text-[#141414] text-xs font-semibold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" /> Aerospace Grade
                  </div>
                  <h4 className="text-2xl font-bold text-[#111111] mb-2">
                    Titanium Crystal Unibody
                  </h4>
                  <p className="text-sm text-[#676B74] leading-relaxed mb-4">
                    All the materials used in this recorder are forged from raw titanium crystal, giving the TP-7 unmatched acoustic damping, zero flex, and scratch resistance for decades of field recording.
                  </p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 rounded-full bg-[#141414] text-white text-sm font-medium cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              )}

              {activeModal === 'ai' && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEFA] text-[#141414] text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> Neural Voice Engine
                  </div>
                  <h4 className="text-2xl font-bold text-[#111111] mb-2">
                    On-Device AI Assistant
                  </h4>
                  <p className="text-sm text-[#676B74] leading-relaxed mb-4">
                    Instant real-time voice transcription, smart cue markers, and hands-free transport control powered directly by the WTR050 neural core.
                  </p>
                  <button
                    onClick={() => {
                      setTransportMode('recording');
                      setActiveModal(null);
                    }}
                    className="w-full py-3 rounded-full bg-[#141414] text-white text-sm font-medium cursor-pointer"
                  >
                    Test Live Recording on TP-7
                  </button>
                </div>
              )}

              {(activeModal === 'menu' || activeModal === 'search' || activeModal === 'contact') && (
                <div>
                  <h4 className="text-xl font-bold text-[#111111] mb-2 capitalize">
                    {activeModal === 'menu' && 'Today. Navigation'}
                    {activeModal === 'search' && 'Search Products'}
                    {activeModal === 'contact' && 'Contact Today. Studio'}
                  </h4>
                  <p className="text-sm text-[#676B74] mb-4">
                    {activeModal === 'menu' &&
                      'Explore our field audio ecosystem: TP-7 Digital Recorder, TX-6 Mixer, and CM-15 Condenser Microphone.'}
                    {activeModal === 'search' &&
                      'Search across TP-7 firmware, titanium accessories, and lossless audio modules.'}
                    {activeModal === 'contact' &&
                      'Our audio engineering specialists are available 24/7 for studio & field consultation.'}
                  </p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 rounded-full bg-[#141414] text-white text-sm font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}