// Hero — light theme: warm off-white bg + soft blobs + floating AI card.
function Hero() {
  return (
    <section style={{position:'relative',padding:'96px 32px 64px',overflow:'hidden',background:'#FFFBF5'}}>
      <div aria-hidden style={{position:'absolute',top:-120,left:'10%',width:520,height:520,background:'rgba(249,115,22,0.18)',filter:'blur(80px)',borderRadius:'9999px',pointerEvents:'none'}}/>
      <div aria-hidden style={{position:'absolute',top:200,right:'5%',width:480,height:480,background:'rgba(59,130,246,0.10)',filter:'blur(80px)',borderRadius:'9999px',pointerEvents:'none'}}/>
      <div style={{maxWidth:1280,margin:'0 auto',position:'relative',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:64,alignItems:'center'}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:9999,background:'#FFEDD5',border:'1px solid #FED7AA',marginBottom:24}}>
            <span style={{width:6,height:6,borderRadius:9999,background:'#F97316'}}/>
            <span style={{fontSize:12,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#C2410C'}}>AI destekli pazaryeri</span>
          </div>
          <h1 style={{fontFamily:'Geist,Inter,sans-serif',fontWeight:900,fontSize:64,lineHeight:1.05,letterSpacing:'-0.025em',color:'#0F172A',margin:0}}>
            3D dosyandan<br/>
            <span style={{background:'linear-gradient(to right,#FB923C,#EA580C)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>saniyeler</span> içinde<br/>
            fiyat al
          </h1>
          <p style={{marginTop:24,fontSize:18,lineHeight:1.6,color:'#4B5563',maxWidth:520}}>
            STL / OBJ dosyanı yükle, yapay zeka anlık fiyat hesaplasın. <strong style={{color:'#0F172A',fontWeight:600}}>340+</strong> doğrulanmış üreticiden teklif al ya da <strong style={{color:'#C2410C',fontWeight:600}}>"Hızlı Üretim"</strong> moduyla anında sipariş ver.
          </p>
          <div style={{display:'flex',gap:12,marginTop:32}}>
            <a href="#" style={{fontSize:15,fontWeight:600,color:'#fff',background:'#F97316',padding:'14px 28px',borderRadius:9999,textDecoration:'none',boxShadow:'0 10px 25px -3px rgba(249,115,22,0.4)'}}>3D Dosya Yükle</a>
            <a href="#" style={{fontSize:15,fontWeight:600,color:'#0F172A',background:'#fff',padding:'14px 28px',borderRadius:9999,textDecoration:'none',border:'1px solid #E5E7EB'}}>Üreticileri Keşfet</a>
          </div>
          <div style={{marginTop:24,fontSize:13,color:'#6B7280'}}>
            Ücretsiz kayıt&nbsp;&nbsp;•&nbsp;&nbsp;Kredi kartı gerekmez&nbsp;&nbsp;•&nbsp;&nbsp;Anında başla
          </div>
        </div>
        <PricingHeroCard/>
      </div>
    </section>
  );
}

function PricingHeroCard() {
  return (
    <div style={{position:'relative',background:'#fff',border:'1px solid #F3F4F6',borderRadius:32,padding:28,boxShadow:'0 25px 50px -12px rgba(15,23,42,0.18)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:8,height:8,borderRadius:9999,background:'#F97316',boxShadow:'0 0 10px #FB923C'}}/>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#C2410C'}}>AI Anlık Fiyat Analizi</span>
        </div>
        <span style={{fontFamily:'Geist Mono,monospace',fontSize:11,color:'#9CA3AF'}}>part_4f2c.stl</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
        {[['Hacim','42,3 cm³'],['Süre','1s 12dk'],['Malzeme','PLA · Mat'],['Doğruluk','±0.2 mm']].map(([k,v])=>(
          <div key={k} style={{background:'#F9FAFB',borderRadius:12,padding:'10px 12px'}}>
            <div style={{fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>{k}</div>
            <div style={{fontSize:13,color:'#111827',fontWeight:600,marginTop:2}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid #F3F4F6',paddingTop:18}}>
        <div style={{fontSize:11,color:'#6B7280',marginBottom:6}}>Tahmini fiyat aralığı</div>
        <div style={{display:'flex',alignItems:'baseline',gap:6}}>
          <span style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:48,color:'#0F172A',letterSpacing:'-0.02em'}}>₺340</span>
          <span style={{fontSize:18,color:'#9CA3AF'}}>– ₺520</span>
        </div>
        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button style={{flex:1,fontSize:13,fontWeight:600,color:'#fff',background:'#F97316',padding:'10px',borderRadius:9999,border:'none',cursor:'pointer'}}>Teklif Al</button>
          <button style={{flex:1,fontSize:13,fontWeight:700,color:'#0F172A',background:'#FDBA74',padding:'10px',borderRadius:9999,border:'none',cursor:'pointer'}}>⚡ Hızlı Üretim</button>
        </div>
      </div>
    </div>
  );
}
window.Hero = Hero;
