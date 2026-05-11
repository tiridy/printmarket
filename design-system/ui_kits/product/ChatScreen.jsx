// ChatScreen — message list + composer (per-order).
function ChatScreen() {
  const messages = [
    {who:'them',name:'Atlas 3D Studio',time:'10:42',body:'Merhaba Ahmet! Dosyanı inceledim, 42cm³ hacim ve PLA için 1–2 günlük üretim öneriyorum.'},
    {who:'me',time:'10:44',body:'Süper. Mat siyah olarak basabilir misiniz?'},
    {who:'them',name:'Atlas 3D Studio',time:'10:45',body:'Tabii. Mat siyah PLA stoğumuzda var. Fiyat aynı kalır: ₺340.'},
    {who:'me',time:'10:46',body:'Tamam, onaylıyorum. Kargo İstanbul içi olacak.'},
    {who:'them',name:'Atlas 3D Studio',time:'10:47',body:'Harika! Üretim başlatıldı. Tahmini teslim 8 Mayıs Cuma. 🛠️'},
  ];
  return (
    <div data-screen-label="Chat" style={{display:'flex',flexDirection:'column',height:'calc(100vh - 60px)',maxWidth:900,margin:'0 auto',width:'100%'}}>
      <div style={{padding:'18px 24px',borderBottom:'1px solid #E5E7EB',background:'#fff',display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:42,height:42,borderRadius:9999,background:'linear-gradient(135deg,#F97316,#EA580C)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>A3</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:15,color:'#111827'}}>Atlas 3D Studio</div>
            <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:'#15803D',fontWeight:600}}>
              <span style={{width:6,height:6,borderRadius:9999,background:'#22C55E'}}/>Çevrimiçi
            </span>
          </div>
          <div style={{fontFamily:'Geist Mono,monospace',fontSize:11,color:'#9CA3AF',marginTop:2}}>Sipariş #4f2c-9d · Robot kol bağlantı parçası</div>
        </div>
        <span style={{background:'#FFEDD5',color:'#C2410C',padding:'5px 12px',borderRadius:9999,fontSize:11,fontWeight:700}}>Üretimde</span>
      </div>

      <div style={{flex:1,overflow:'auto',padding:'20px 24px',background:'#F9FAFB',display:'flex',flexDirection:'column',gap:12}}>
        <div style={{textAlign:'center',fontSize:11,color:'#9CA3AF',padding:'8px 0',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em'}}>5 Mayıs Pazartesi</div>
        {messages.map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.who==='me'?'flex-end':'flex-start'}}>
            <div style={{maxWidth:'66%',padding:'10px 14px',borderRadius:14,fontSize:14,lineHeight:1.5,
              background:m.who==='me'?'#F97316':'#fff',color:m.who==='me'?'#fff':'#111827',
              border:m.who==='me'?'none':'1px solid #E5E7EB',
              borderBottomRightRadius:m.who==='me'?4:14,borderBottomLeftRadius:m.who==='me'?14:4}}>
              {m.body}
              <div style={{fontSize:10,marginTop:5,opacity:m.who==='me'?0.85:0.55,fontFamily:'Geist Mono,monospace'}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'12px 24px',borderTop:'1px solid #E5E7EB',background:'#fff',display:'flex',alignItems:'center',gap:10}}>
        <button style={{width:40,height:40,border:'1px solid #E5E7EB',borderRadius:10,background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#6B7280'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81"/></svg>
        </button>
        <input placeholder="Mesaj yaz…" style={{flex:1,padding:'11px 14px',border:'1px solid #E5E7EB',borderRadius:9999,background:'#F9FAFB',fontFamily:'Geist,sans-serif',fontSize:14,outline:'none'}}/>
        <button style={{width:40,height:40,background:'#F97316',color:'#fff',border:'none',borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px -2px rgba(249,115,22,0.4)'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/></svg>
        </button>
      </div>
    </div>
  );
}
window.ChatScreen = ChatScreen;
