// ManufacturerPreview — light theme producer cards.
function ManufacturerPreview() {
  const list = [
    {name:'Atlas 3D Studio',city:'İstanbul',score:98,scoreColor:'#F97316',cat:'Süper Üretici',catBg:'#FFEDD5',catFg:'#C2410C',rating:4.9,reviews:127,price:'₺320',time:'1–2 gün'},
    {name:'Mavi Dijital',city:'Ankara',score:92,scoreColor:'#3B82F6',cat:'Endüstriyel',catBg:'#E2E8F0',catFg:'#334155',rating:4.8,reviews:84,price:'₺410',time:'2–3 gün'},
    {name:'Forma Studio',city:'İzmir',score:88,scoreColor:'#22C55E',cat:'Ekonomik',catBg:'#DCFCE7',catFg:'#15803D',rating:4.7,reviews:62,price:'₺240',time:'3–5 gün'},
  ];
  return (
    <section style={{padding:'96px 32px',background:'#FFFBF5'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:40}}>
          <div>
            <span style={{fontSize:12,fontWeight:700,letterSpacing:'0.3em',textTransform:'uppercase',color:'#F97316'}}>Üreticiler</span>
            <h2 style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:48,lineHeight:1.1,letterSpacing:'-0.02em',color:'#0F172A',marginTop:12}}>Doğrulanmış 340+ üretici</h2>
          </div>
          <a href="#" style={{fontSize:14,color:'#F97316',textDecoration:'none',fontWeight:600}}>Tümünü Gör →</a>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {list.map(p=>(
            <div key={p.name} style={{background:'#fff',border:'1px solid #F3F4F6',borderRadius:24,padding:24,boxShadow:'0 1px 3px rgba(15,23,42,0.06)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <span style={{background:p.catBg,color:p.catFg,padding:'4px 10px',borderRadius:9999,fontSize:11,fontWeight:700}}>{p.cat}</span>
                <div style={{width:48,height:48,borderRadius:9999,border:`3px solid ${p.scoreColor}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:p.scoreColor,background:'#fff'}}>{p.score}</div>
              </div>
              <div style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:18,color:'#0F172A',marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:12,color:'#6B7280',marginBottom:14,display:'flex',alignItems:'center',gap:4}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {p.city}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:14}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.32.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>
                <span style={{fontSize:13,fontWeight:600,color:'#0F172A'}}>{p.rating}</span>
                <span style={{fontSize:12,color:'#9CA3AF'}}>({p.reviews})</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:14,borderTop:'1px solid #F3F4F6'}}>
                <div><div style={{fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>Başlangıç</div><div style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:18,color:'#0F172A'}}>{p.price}</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>Süre</div><div style={{fontWeight:600,fontSize:14,color:'#0F172A',marginTop:2}}>{p.time}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.ManufacturerPreview = ManufacturerPreview;
