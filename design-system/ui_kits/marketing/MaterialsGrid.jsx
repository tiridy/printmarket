// MaterialsGrid — light theme, with realistic material-evocative SVG illustrations.
function MaterialsGrid() {
  const items = [
    {
      name:'PLA', desc:'Hızlı prototipleme · biyobozunur',
      color:'#22C55E', bg:'#F0FDF4', bd:'#BBF7D0',
      art:(
        // Filament spool — side view, with wound filament rings
        <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="pla-spool" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff"/>
              <stop offset="0.7" stopColor="#F0FDF4"/>
              <stop offset="1" stopColor="#DCFCE7"/>
            </radialGradient>
            <linearGradient id="pla-fil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4ADE80"/>
              <stop offset="1" stopColor="#15803D"/>
            </linearGradient>
          </defs>
          <rect width="200" height="140" fill="#F0FDF4"/>
          {/* Spool body */}
          <g transform="translate(100 72)">
            <ellipse cx="0" cy="48" rx="60" ry="6" fill="#000" opacity="0.08"/>
            {/* Outer rim */}
            <circle r="56" fill="url(#pla-spool)" stroke="#86EFAC" strokeWidth="1.5"/>
            {/* Filament wound — concentric arcs in green */}
            {[52,48,44,40,36,32,28,24].map((r,i)=>(
              <circle key={i} r={r} fill="none" stroke="url(#pla-fil)" strokeWidth="3.2" opacity={0.55 + (i%2)*0.25}/>
            ))}
            {/* Inner hub */}
            <circle r="20" fill="#fff" stroke="#86EFAC" strokeWidth="1.5"/>
            <circle r="6" fill="#BBF7D0"/>
            <circle r="2.5" fill="#16A34A"/>
            {/* 3 hub holes */}
            {[0,120,240].map(a=>(
              <circle key={a} cx={Math.cos(a*Math.PI/180)*13} cy={Math.sin(a*Math.PI/180)*13} r="2.2" fill="#86EFAC"/>
            ))}
            {/* Filament tail coming out */}
            <path d="M52 -8 Q 70 -20 88 -10" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        </svg>
      )
    },
    {
      name:'ABS', desc:'Mekanik dayanım · darbe',
      color:'#3B82F6', bg:'#EFF6FF', bd:'#BFDBFE',
      art:(
        // 3D printed angular bracket — mechanical part
        <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="abs-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#DBEAFE"/>
              <stop offset="1" stopColor="#93C5FD"/>
            </linearGradient>
            <linearGradient id="abs-side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#1D4ED8"/>
            </linearGradient>
            <pattern id="abs-layers" patternUnits="userSpaceOnUse" width="4" height="2.5">
              <rect width="4" height="2.5" fill="#3B82F6"/>
              <line x1="0" y1="2.4" x2="4" y2="2.4" stroke="#1E40AF" strokeWidth="0.3" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="200" height="140" fill="#EFF6FF"/>
          {/* Build plate suggestion */}
          <ellipse cx="100" cy="120" rx="80" ry="6" fill="#000" opacity="0.06"/>
          {/* L-bracket isometric */}
          <g transform="translate(100 70)">
            {/* Back face (vertical part) */}
            <polygon points="-44,-40 -10,-50 -10,30 -44,40" fill="url(#abs-side)" stroke="#1E40AF" strokeWidth="1"/>
            {/* Top face */}
            <polygon points="-44,-40 -10,-50 40,-30 6,-20" fill="url(#abs-top)" stroke="#1E40AF" strokeWidth="1"/>
            {/* Front horizontal extension */}
            <polygon points="-10,30 6,-20 40,-30 40,20 6,30" fill="url(#pat-fill)" />
            <polygon points="-10,30 6,-20 40,-30 40,20 6,30" fill="url(#abs-layers)" stroke="#1E40AF" strokeWidth="1"/>
            {/* Bolt holes */}
            <ellipse cx="-25" cy="-12" rx="5" ry="3" fill="#1E3A8A"/>
            <ellipse cx="-25" cy="14" rx="5" ry="3" fill="#1E3A8A"/>
            <ellipse cx="22" cy="0" rx="4" ry="2.5" fill="#1E3A8A"/>
            <ellipse cx="22" cy="14" rx="4" ry="2.5" fill="#1E3A8A"/>
          </g>
        </svg>
      )
    },
    {
      name:'PETG', desc:'Saydam · gıda güvenli',
      color:'#F97316', bg:'#FFF7ED', bd:'#FED7AA',
      art:(
        // Translucent water bottle / container
        <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="petg-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FED7AA" stopOpacity="0.4"/>
              <stop offset="0.5" stopColor="#FDBA74" stopOpacity="0.7"/>
              <stop offset="1" stopColor="#FED7AA" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          <rect width="200" height="140" fill="#FFF7ED"/>
          {/* Shadow */}
          <ellipse cx="100" cy="124" rx="38" ry="4" fill="#000" opacity="0.08"/>
          {/* Bottle */}
          <g transform="translate(100 70)">
            {/* Cap */}
            <rect x="-12" y="-58" width="24" height="10" rx="2" fill="#F97316"/>
            <rect x="-12" y="-58" width="24" height="3" fill="#EA580C"/>
            {/* Neck */}
            <rect x="-9" y="-48" width="18" height="6" fill="url(#petg-body)" stroke="#FB923C" strokeWidth="1.2"/>
            {/* Shoulder + body */}
            <path d="M-9 -42 Q -28 -34 -28 -16 L -28 40 Q -28 52 -16 52 L 16 52 Q 28 52 28 40 L 28 -16 Q 28 -34 9 -42 Z"
                  fill="url(#petg-body)" stroke="#FB923C" strokeWidth="1.5"/>
            {/* Highlights — glassy reflections */}
            <path d="M-20 -10 Q -22 10 -20 30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
            <path d="M-15 -8 Q -16 8 -15 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            {/* Body ridges */}
            <line x1="-26" y1="0" x2="26" y2="0" stroke="#FB923C" strokeWidth="0.8" opacity="0.5"/>
            <line x1="-26" y1="14" x2="26" y2="14" stroke="#FB923C" strokeWidth="0.8" opacity="0.5"/>
            {/* Liquid inside hint */}
            <path d="M-26 28 Q 0 24 26 28 L 26 40 Q 28 52 16 52 L -16 52 Q -28 52 -28 40 Z" fill="#FED7AA" opacity="0.5"/>
          </g>
        </svg>
      )
    },
    {
      name:'Resin', desc:'Yüksek hassasiyet · pürüzsüz',
      color:'#A855F7', bg:'#FAF5FF', bd:'#E9D5FF',
      art:(
        // Faceted high-detail crystal/gem (smooth resin print)
        <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="rs-1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3E8FF"/><stop offset="1" stopColor="#C084FC"/></linearGradient>
            <linearGradient id="rs-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C084FC"/><stop offset="1" stopColor="#7E22CE"/></linearGradient>
            <linearGradient id="rs-3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A855F7"/><stop offset="1" stopColor="#581C87"/></linearGradient>
          </defs>
          <rect width="200" height="140" fill="#FAF5FF"/>
          {/* Sparkles */}
          <g fill="#C084FC" opacity="0.6">
            <path d="M30 28 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z"/>
            <path d="M170 100 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z"/>
            <path d="M168 32 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1 z"/>
          </g>
          <ellipse cx="100" cy="124" rx="44" ry="5" fill="#000" opacity="0.08"/>
          {/* Diamond shape */}
          <g transform="translate(100 70)">
            {/* Top crown facets */}
            <polygon points="-40,-12 -20,-32 0,-36 -10,-12" fill="url(#rs-1)" stroke="#A855F7" strokeWidth="1.2"/>
            <polygon points="0,-36 20,-32 40,-12 10,-12" fill="url(#rs-1)" stroke="#A855F7" strokeWidth="1.2"/>
            <polygon points="-10,-12 0,-36 10,-12" fill="#fff" opacity="0.85" stroke="#A855F7" strokeWidth="1"/>
            {/* Belt */}
            <polygon points="-40,-12 -10,-12 0,-2 -36,-2" fill="url(#rs-2)" stroke="#7E22CE" strokeWidth="1"/>
            <polygon points="-36,-2 0,-2 -10,-12" fill="#A855F7" opacity="0.6"/>
            <polygon points="10,-12 40,-12 36,-2 0,-2" fill="url(#rs-2)" stroke="#7E22CE" strokeWidth="1"/>
            <polygon points="0,-2 36,-2 10,-12" fill="#A855F7" opacity="0.6"/>
            {/* Pavilion */}
            <polygon points="-36,-2 0,-2 0,40" fill="url(#rs-3)" stroke="#581C87" strokeWidth="1.2"/>
            <polygon points="0,-2 36,-2 0,40" fill="url(#rs-2)" stroke="#581C87" strokeWidth="1.2"/>
            {/* Internal facet line */}
            <line x1="-20" y1="-2" x2="-10" y2="20" stroke="#581C87" strokeWidth="0.8" opacity="0.6"/>
            <line x1="20" y1="-2" x2="10" y2="20" stroke="#581C87" strokeWidth="0.8" opacity="0.6"/>
          </g>
        </svg>
      )
    },
    {
      name:'Nylon', desc:'Esnek · aşınma direnci',
      color:'#EAB308', bg:'#FEFCE8', bd:'#FDE68A',
      art:(
        // Woven fabric / mesh pattern
        <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ny-weave" patternUnits="userSpaceOnUse" width="20" height="20">
              {/* Horizontal threads */}
              <rect x="0" y="0" width="20" height="20" fill="#FEFCE8"/>
              <rect x="0" y="2" width="8" height="6" rx="3" fill="#FDE047"/>
              <rect x="12" y="2" width="8" height="6" rx="3" fill="#FDE047"/>
              <rect x="0" y="12" width="8" height="6" rx="3" fill="#FACC15"/>
              <rect x="12" y="12" width="8" height="6" rx="3" fill="#FACC15"/>
              {/* Vertical threads passing over */}
              <rect x="2" y="8" width="6" height="6" rx="3" fill="#EAB308"/>
              <rect x="12" y="8" width="6" height="6" rx="3" fill="#EAB308"/>
              <rect x="2" y="-2" width="6" height="6" rx="3" fill="#CA8A04"/>
              <rect x="12" y="-2" width="6" height="6" rx="3" fill="#CA8A04"/>
              <rect x="2" y="18" width="6" height="6" rx="3" fill="#CA8A04"/>
              <rect x="12" y="18" width="6" height="6" rx="3" fill="#CA8A04"/>
            </pattern>
            <radialGradient id="ny-vignette" cx="0.5" cy="0.5" r="0.7">
              <stop offset="0.6" stopColor="#000" stopOpacity="0"/>
              <stop offset="1" stopColor="#000" stopOpacity="0.18"/>
            </radialGradient>
          </defs>
          <rect width="200" height="140" fill="#FEFCE8"/>
          <rect width="200" height="140" fill="url(#ny-weave)"/>
          <rect width="200" height="140" fill="url(#ny-vignette)"/>
          {/* Highlight sheen */}
          <path d="M-20 30 L 220 -10 L 220 10 L -20 50 Z" fill="#fff" opacity="0.18"/>
        </svg>
      )
    },
    {
      name:'Metal', desc:'Endüstriyel · DMLS / SLM',
      color:'#475569', bg:'#F1F5F9', bd:'#CBD5E1',
      art:(
        // Industrial metal gear/flange
        <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mt-disc" cx="0.5" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#F1F5F9"/>
              <stop offset="0.5" stopColor="#CBD5E1"/>
              <stop offset="1" stopColor="#475569"/>
            </radialGradient>
            <radialGradient id="mt-hub" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0" stopColor="#E2E8F0"/>
              <stop offset="1" stopColor="#334155"/>
            </radialGradient>
          </defs>
          <rect width="200" height="140" fill="#F1F5F9"/>
          <ellipse cx="100" cy="124" rx="56" ry="5" fill="#000" opacity="0.12"/>
          {/* Gear */}
          <g transform="translate(100 70)">
            {/* Teeth */}
            {Array.from({length:12}).map((_,i)=>{
              const a = (i/12) * Math.PI * 2;
              const x = Math.cos(a) * 52;
              const y = Math.sin(a) * 52;
              return (
                <rect key={i} x={-8} y={-6} width="16" height="14" rx="2"
                      fill="url(#mt-disc)" stroke="#334155" strokeWidth="1"
                      transform={`translate(${x} ${y}) rotate(${a*180/Math.PI + 90})`}/>
              );
            })}
            {/* Outer disc */}
            <circle r="44" fill="url(#mt-disc)" stroke="#334155" strokeWidth="1.5"/>
            {/* Bolt holes (recessed) */}
            {[0,72,144,216,288].map(a=>(
              <g key={a} transform={`rotate(${a})`}>
                <circle cx="0" cy="-30" r="5" fill="#1E293B"/>
                <circle cx="0" cy="-30" r="3" fill="#0F172A"/>
              </g>
            ))}
            {/* Hub */}
            <circle r="18" fill="url(#mt-hub)" stroke="#1E293B" strokeWidth="1.5"/>
            {/* Center bore (hex) */}
            <polygon points="0,-10 8.6,-5 8.6,5 0,10 -8.6,5 -8.6,-5" fill="#0F172A"/>
            {/* Surface highlight */}
            <ellipse cx="-14" cy="-22" rx="20" ry="6" fill="#fff" opacity="0.4"/>
          </g>
        </svg>
      )
    },
  ];
  return (
    <section style={{padding:'96px 32px',background:'#fff',borderTop:'1px solid #F3F4F6',borderBottom:'1px solid #F3F4F6'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <span style={{fontSize:12,fontWeight:700,letterSpacing:'0.3em',textTransform:'uppercase',color:'#F97316'}}>Malzemeler</span>
          <h2 style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:48,lineHeight:1.1,letterSpacing:'-0.02em',color:'#0F172A',marginTop:12}}>Her ihtiyaca uygun teknoloji</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {items.map(m=>(
            <div key={m.name} style={{background:'#fff',border:'1px solid #F3F4F6',borderRadius:24,overflow:'hidden',boxShadow:'0 1px 3px rgba(15,23,42,0.05)',display:'flex',flexDirection:'column'}}>
              <div style={{height:170,background:m.bg,borderBottom:`1px solid ${m.bd}`}}>{m.art}</div>
              <div style={{padding:'18px 22px 22px'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{width:10,height:10,borderRadius:3,background:m.color}}/>
                  <div style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:20,color:'#0F172A',letterSpacing:'-0.01em'}}>{m.name}</div>
                </div>
                <div style={{fontSize:13,color:'#6B7280',lineHeight:1.5}}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.MaterialsGrid = MaterialsGrid;
