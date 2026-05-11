// MarketingNav — sticky top nav (light theme).
function MarketingNav() {
  return (
    <header style={{position:'sticky',top:0,zIndex:50,background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid #F3F4F6'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'18px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:40}}>
          <a href="#" style={{fontFamily:'Geist,Inter,sans-serif',fontWeight:900,fontSize:24,letterSpacing:'-0.04em',color:'#F97316',textDecoration:'none'}}>TİRİDY</a>
          <nav style={{display:'flex',gap:28}}>
            {['Üreticiler','Fiyatlandırma','Nasıl Çalışır','Blog'].map(t=>(
              <a key={t} href="#" style={{fontSize:14,color:'#4B5563',textDecoration:'none',fontWeight:500}}>{t}</a>
            ))}
          </nav>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <a href="#" style={{fontSize:14,color:'#111827',textDecoration:'none',fontWeight:500,padding:'8px 4px'}}>Giriş</a>
          <a href="#" style={{fontSize:14,color:'#fff',background:'#F97316',textDecoration:'none',fontWeight:600,padding:'10px 20px',borderRadius:9999,boxShadow:'0 4px 12px rgba(249,115,22,0.3)'}}>Ücretsiz Başla</a>
        </div>
      </div>
    </header>
  );
}
window.MarketingNav = MarketingNav;
