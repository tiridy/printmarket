// AppShell — sidebar + topbar wrapper for the product surface.
function AppShell({active, setActive, children}) {
  const items = [
    {id:'home',  label:'Ana Sayfa',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m2.25 12 8.954-8.955a1.5 1.5 0 0 1 2.122 0L22.28 12M4.5 9.75v10.125a1.125 1.125 0 0 0 1.125 1.125H9.75v-4.875a1.125 1.125 0 0 1 1.125-1.125h2.25a1.125 1.125 0 0 1 1.125 1.125V21h4.125a1.125 1.125 0 0 0 1.125-1.125V9.75"/></svg>},
    {id:'orders',label:'Siparişlerim', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>},
    {id:'explore',label:'Keşfet',      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>},
    {id:'chat',  label:'Mesajlar',     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/></svg>},
    {id:'order', label:'Yeni Sipariş',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>},
  ];
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F9FAFB'}}>
      <aside style={{width:224,background:'#fff',borderRight:'1px solid #E5E7EB',padding:'20px 14px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{padding:'8px 12px 18px'}}>
          <span style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:22,letterSpacing:'-0.04em',color:'#F97316'}}>TİRİDY</span>
        </div>
        {items.map(it=>{
          const on = it.id===active;
          return (
            <button key={it.id} onClick={()=>setActive(it.id)} style={{
              display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',cursor:'pointer',
              background:on?'#FFF7ED':'transparent',color:on?'#C2410C':'#374151',fontFamily:'Geist,sans-serif',fontWeight:on?600:500,fontSize:14,textAlign:'left'
            }}>
              <span style={{color:on?'#F97316':'#6B7280'}}>{it.icon}</span>
              {it.label}
            </button>
          );
        })}
        <div style={{flex:1}}/>
        <div style={{padding:'12px',borderTop:'1px solid #F3F4F6',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:9999,background:'linear-gradient(135deg,#F97316,#FB923C)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:13}}>AY</div>
          <div style={{lineHeight:1.2}}>
            <div style={{fontSize:13,fontWeight:600,color:'#111827'}}>Ahmet Yılmaz</div>
            <div style={{fontSize:11,color:'#9CA3AF'}}>Müşteri</div>
          </div>
        </div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <header style={{height:60,background:'#fff',borderBottom:'1px solid #E5E7EB',display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
          <div style={{flex:1,position:'relative',maxWidth:480}}>
            <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF',pointerEvents:'none'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
            </span>
            <input placeholder="Üretici, malzeme veya sipariş ara…" style={{width:'100%',padding:'9px 12px 9px 38px',border:'1px solid #E5E7EB',borderRadius:10,background:'#F9FAFB',fontFamily:'Geist,sans-serif',fontSize:13,outline:'none'}}/>
          </div>
          <button style={{position:'relative',width:38,height:38,border:'1px solid #E5E7EB',borderRadius:10,background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#374151'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/></svg>
            <span style={{position:'absolute',top:8,right:9,width:7,height:7,borderRadius:9999,background:'#F97316',border:'2px solid #fff'}}/>
          </button>
          <button onClick={()=>setActive('order')} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'#F97316',color:'#fff',border:'none',borderRadius:9999,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:13,cursor:'pointer',boxShadow:'0 4px 10px -2px rgba(249,115,22,0.35)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Yeni Sipariş
          </button>
        </header>
        <main style={{flex:1,overflow:'auto'}}>{children}</main>
      </div>
    </div>
  );
}
window.AppShell = AppShell;
