// DashboardScreen — customer home: welcome + KPIs + recent activity.
function DashboardScreen({setActive}) {
  return (
    <div data-screen-label="Customer Dashboard" style={{padding:'28px 32px',display:'flex',flexDirection:'column',gap:20,maxWidth:1100,margin:'0 auto',width:'100%'}}>
      {/* Welcome */}
      <div style={{background:'linear-gradient(135deg,#0F172A,#1E293B)',borderRadius:24,padding:'28px 32px',color:'#F1F5F9',display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',overflow:'hidden'}}>
        <div aria-hidden style={{position:'absolute',top:-40,right:40,width:200,height:200,background:'rgba(249,115,22,0.18)',filter:'blur(60px)',borderRadius:9999}}/>
        <div style={{position:'relative'}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#FDBA74',marginBottom:8}}>Hoş geldin</div>
          <h1 style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:30,letterSpacing:'-0.02em',margin:0}}>İyi günler, Ahmet 👋</h1>
          <p style={{margin:'8px 0 0',fontSize:14,color:'#94A3B8'}}>Bugün 2 yeni teklif var. Devam etmek ister misin?</p>
        </div>
        <button onClick={()=>setActive('order')} style={{padding:'12px 22px',background:'#F97316',color:'#fff',border:'none',borderRadius:9999,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:14,cursor:'pointer',boxShadow:'0 10px 25px -3px rgba(249,115,22,0.4)'}}>3D Dosya Yükle</button>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[
          ['Aktif sipariş','3','#F97316','#FFEDD5'],
          ['Bekleyen teklif','7','#3B82F6','#DBEAFE'],
          ['Tamamlanan','24','#22C55E','#DCFCE7'],
          ['Toplam harcama','₺18.420','#0F172A','#F3F4F6'],
        ].map(([l,v,fg,bg])=>(
          <div key={l} style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:16,padding:18,boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div style={{fontSize:12,color:'#6B7280',fontWeight:500}}>{l}</div>
              <div style={{width:28,height:28,borderRadius:8,background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{width:8,height:8,borderRadius:9999,background:fg}}/>
              </div>
            </div>
            <div style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:30,color:'#111827',marginTop:6,letterSpacing:'-0.02em'}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Two-column: recent orders + offers */}
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14}}>
        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:16,padding:20}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <h3 style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:16,color:'#111827',margin:0}}>Son siparişler</h3>
            <a href="#" style={{fontSize:12,color:'#F97316',textDecoration:'none',fontWeight:600}}>Tümünü gör →</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              {id:'#4f2c-9d',name:'Robot kol bağlantı parçası',status:'Üretimde',sBg:'#FFEDD5',sFg:'#C2410C',price:'₺420',mat:'PLA'},
              {id:'#7a31-c5',name:'Prototip kapağı',status:'Kargoda',sBg:'#F3E8FF',sFg:'#7E22CE',price:'₺180',mat:'PETG'},
              {id:'#2b18-04',name:'Endüstriyel braket',status:'Teslim edildi',sBg:'#DCFCE7',sFg:'#15803D',price:'₺1.240',mat:'Metal'},
              {id:'#9c5d-77',name:'Diş hekimi modeli',status:'Beklemede',sBg:'#FEF9C3',sFg:'#A16207',price:'₺95',mat:'Resin'},
            ].map(o=>(
              <div key={o.id} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',background:'#F9FAFB',borderRadius:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:'#fff',border:'1px solid #E5E7EB',display:'flex',alignItems:'center',justifyContent:'center',color:'#6B7280'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:13,color:'#111827',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.name}</div>
                  <div style={{fontFamily:'Geist Mono,monospace',fontSize:11,color:'#9CA3AF',marginTop:2}}>{o.id} · {o.mat}</div>
                </div>
                <span style={{background:o.sBg,color:o.sFg,padding:'4px 10px',borderRadius:9999,fontSize:11,fontWeight:600}}>{o.status}</span>
                <span style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:14,color:'#111827',minWidth:64,textAlign:'right'}}>{o.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:16,padding:20}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <h3 style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:16,color:'#111827',margin:0}}>Yeni teklifler</h3>
            <span style={{background:'#FFEDD5',color:'#C2410C',padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:700}}>2 yeni</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              {prod:'Atlas 3D Studio',score:98,sc:'#F97316',price:'₺340',time:'2 gün'},
              {prod:'Mavi Dijital',score:92,sc:'#3B82F6',price:'₺410',time:'3 gün'},
              {prod:'Forma Studio',score:88,sc:'#22C55E',price:'₺240',time:'5 gün'},
            ].map(o=>(
              <div key={o.prod} style={{padding:14,border:'1px solid #E5E7EB',borderRadius:12,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:40,height:40,borderRadius:9999,border:`2.5px solid ${o.sc}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:o.sc}}>{o.score}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:13,color:'#111827'}}>{o.prod}</div>
                  <div style={{fontSize:11,color:'#6B7280',marginTop:2}}>{o.time} · {o.price}</div>
                </div>
                <button style={{padding:'7px 14px',background:'#111827',color:'#fff',border:'none',borderRadius:9999,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:12,cursor:'pointer'}}>İncele</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.DashboardScreen = DashboardScreen;
