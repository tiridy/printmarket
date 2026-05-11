// OrderStep1 — 4-step header + drop zone for new order.
function OrderStep1() {
  return (
    <div data-screen-label="Order Step 1" style={{padding:'32px',maxWidth:780,margin:'0 auto',width:'100%'}}>
      {/* Stepper */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24}}>
        {[
          {n:1,l:'Dosya',on:true,done:false},
          {n:2,l:'Detaylar',on:false,done:false},
          {n:3,l:'AI Fiyat',on:false,done:false},
          {n:4,l:'Mod',on:false,done:false},
        ].map((s,i,arr)=>(
          <React.Fragment key={s.n}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:30,height:30,borderRadius:9999,background:s.on?'#F97316':'#F3F4F6',color:s.on?'#fff':'#6B7280',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>{s.n}</div>
              <span style={{fontSize:13,fontWeight:600,color:s.on?'#111827':'#6B7280'}}>{s.l}</span>
            </div>
            {i<arr.length-1 && <div style={{flex:1,height:2,background:'#E5E7EB',borderRadius:9999}}/>}
          </React.Fragment>
        ))}
      </div>

      <h1 style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:32,letterSpacing:'-0.02em',color:'#0F172A',margin:'0 0 8px'}}>3D dosyanı yükle</h1>
      <p style={{margin:'0 0 24px',color:'#6B7280',fontSize:14}}>STL, OBJ, 3MF veya STEP formatında. AI saniyeler içinde hacim ve fiyat tahmini yapacak.</p>

      <div style={{border:'2px dashed #FB923C',background:'#FFF7ED',borderRadius:24,padding:'48px 28px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
        <div style={{width:64,height:64,borderRadius:9999,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#F97316',boxShadow:'0 4px 14px rgba(249,115,22,0.2)'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5m0 0L7.5 12m4.5-4.5v13.5"/></svg>
        </div>
        <div>
          <div style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:18,color:'#111827',marginBottom:4}}>Dosyanı buraya bırak</div>
          <div style={{fontSize:13,color:'#6B7280'}}>veya bilgisayarından seç &nbsp;•&nbsp; Maks 100MB</div>
        </div>
        <button style={{padding:'12px 24px',background:'#F97316',color:'#fff',border:'none',borderRadius:9999,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:14,cursor:'pointer',boxShadow:'0 8px 20px -4px rgba(249,115,22,0.4)'}}>Dosya Seç</button>
        <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap',justifyContent:'center'}}>
          {['STL','OBJ','3MF','STEP'].map(f=><span key={f} style={{padding:'4px 11px',background:'#fff',border:'1px solid #FED7AA',borderRadius:9999,fontFamily:'Geist Mono,monospace',fontSize:11,fontWeight:600,color:'#C2410C'}}>{f}</span>)}
        </div>
      </div>

      <div style={{display:'flex',gap:10,marginTop:18,padding:'12px 16px',background:'#F3F4F6',borderRadius:12,fontSize:12,color:'#374151'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,color:'#6B7280',marginTop:2}}><path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
        <span>Dosyaların güvenli ve şifreli. Yalnızca seçtiğin üreticilerle paylaşılır.</span>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginTop:24}}>
        <button style={{padding:'11px 22px',background:'#fff',color:'#374151',border:'1px solid #E5E7EB',borderRadius:12,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:13,cursor:'pointer'}}>← Geri</button>
        <button style={{padding:'11px 22px',background:'#111827',color:'#fff',border:'none',borderRadius:12,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:13,cursor:'pointer'}}>Devam Et →</button>
      </div>
    </div>
  );
}
window.OrderStep1 = OrderStep1;
