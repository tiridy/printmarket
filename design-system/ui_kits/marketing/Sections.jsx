// StatsBar + CTABanner + Footer — light theme.
function StatsBar() {
  const stats = [['12.400+','Tamamlanan sipariş'],['340+','Doğrulanmış üretici'],['4,9/5','Müşteri memnuniyeti'],['2–3 gün','Ortalama teslimat']];
  return (
    <section style={{padding:'80px 32px',background:'#fff',borderTop:'1px solid #F3F4F6',borderBottom:'1px solid #F3F4F6'}}>
      <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:32}}>
        {stats.map(([v,l])=>(
          <div key={l} style={{textAlign:'center'}}>
            <div style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:40,color:'#0F172A',letterSpacing:'-0.02em'}}>{v}</div>
            <div style={{fontSize:13,color:'#6B7280',marginTop:6}}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section style={{padding:'96px 32px',background:'#FFFBF5'}}>
      <div style={{maxWidth:1280,margin:'0 auto',background:'linear-gradient(to right,#F97316,#EA580C)',borderRadius:40,padding:'64px 48px',textAlign:'center',boxShadow:'0 25px 50px -12px rgba(234,88,12,0.4)'}}>
        <h2 style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:48,lineHeight:1.1,letterSpacing:'-0.02em',color:'#fff',margin:0}}>İlk dosyanı yükle, fiyatı gör</h2>
        <p style={{marginTop:14,fontSize:17,color:'rgba(255,255,255,0.92)',maxWidth:560,marginLeft:'auto',marginRight:'auto'}}>Saniyeler içinde AI fiyat analizi. Üretici seç ya da Hızlı Üretim ile anında sipariş ver.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:28}}>
          <a href="#" style={{fontSize:15,fontWeight:700,color:'#EA580C',background:'#fff',padding:'14px 28px',borderRadius:9999,textDecoration:'none'}}>Ücretsiz Başla</a>
          <a href="#" style={{fontSize:15,fontWeight:600,color:'#fff',background:'rgba(0,0,0,0.18)',padding:'14px 28px',borderRadius:9999,textDecoration:'none',border:'1px solid rgba(255,255,255,0.3)'}}>Demo İste</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ['Ürün',['Nasıl Çalışır','Fiyatlandırma','Materyaller','API']],
    ['Şirket',['Hakkımızda','Blog','Kariyer','Basın']],
    ['Destek',['Yardım Merkezi','İletişim','Topluluk','Durum']],
    ['Yasal',['Kullanım Şartları','Gizlilik','KVKK','Çerezler']],
  ];
  return (
    <footer style={{padding:'64px 32px 32px',borderTop:'1px solid #F3F4F6',background:'#fff'}}>
      <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'1.5fr repeat(4,1fr)',gap:48}}>
        <div>
          <div style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:24,letterSpacing:'-0.04em',color:'#F97316'}}>TİRİDY</div>
          <p style={{fontSize:13,color:'#6B7280',marginTop:12,lineHeight:1.6}}>Türkiye'nin AI destekli 3D üretim pazaryeri.</p>
        </div>
        {cols.map(([title,items])=>(
          <div key={title}>
            <div style={{fontSize:12,fontWeight:700,color:'#0F172A',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.1em'}}>{title}</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {items.map(i=><a key={i} href="#" style={{fontSize:13,color:'#6B7280',textDecoration:'none'}}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{maxWidth:1280,margin:'48px auto 0',paddingTop:24,borderTop:'1px solid #F3F4F6',display:'flex',justifyContent:'space-between',fontSize:12,color:'#9CA3AF'}}>
        <span>© 2026 TİRİDY · Tüm hakları saklıdır</span>
        <span>İstanbul, Türkiye</span>
      </div>
    </footer>
  );
}
window.StatsBar = StatsBar;
window.CTABanner = CTABanner;
window.Footer = Footer;
