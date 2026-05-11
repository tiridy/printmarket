// ExploreScreen — filter sidebar + producer card grid.
function ExploreScreen() {
  const list = [
    {name:'Atlas 3D Studio',  city:'İstanbul',score:98,sc:'#F97316',cat:'Süper Üretici',catBg:'#FFEDD5',catFg:'#C2410C',rating:4.9,reviews:127,price:'₺320',time:'1–2 gün',mats:['PLA','PETG','Resin']},
    {name:'Mavi Dijital',     city:'Ankara',  score:92,sc:'#3B82F6',cat:'Endüstriyel',  catBg:'#E2E8F0',catFg:'#334155',rating:4.8,reviews:84, price:'₺410',time:'2–3 gün',mats:['ABS','Nylon','Metal']},
    {name:'Forma Studio',     city:'İzmir',   score:88,sc:'#22C55E',cat:'Ekonomik',     catBg:'#DCFCE7',catFg:'#15803D',rating:4.7,reviews:62, price:'₺240',time:'3–5 gün',mats:['PLA','ABS']},
    {name:'Helios Üretim',    city:'Bursa',   score:96,sc:'#F97316',cat:'Süper Üretici',catBg:'#FFEDD5',catFg:'#C2410C',rating:4.9,reviews:203,price:'₺380',time:'1–2 gün',mats:['Resin','Nylon']},
    {name:'Karbon Studio',    city:'İstanbul',score:91,sc:'#3B82F6',cat:'Hızlı Üretici',catBg:'#DBEAFE',catFg:'#1D4ED8',rating:4.7,reviews:58, price:'₺290',time:'24 saat',mats:['PLA','PETG']},
    {name:'Volkan Mühendislik',city:'Konya',   score:85,sc:'#22C55E',cat:'Yeni',         catBg:'#FEF9C3',catFg:'#A16207',rating:4.6,reviews:14, price:'₺210',time:'4–6 gün',mats:['PLA']},
  ];
  return (
    <div data-screen-label="Explore" style={{padding:'28px 32px',display:'flex',gap:20,maxWidth:1280,margin:'0 auto',width:'100%'}}>
      <aside style={{width:240,flexShrink:0,display:'flex',flexDirection:'column',gap:18,position:'sticky',top:24,alignSelf:'flex-start'}}>
        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:18}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.16em',color:'#6B7280',marginBottom:10}}>Kategori</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {['Tümü','Süper Üretici','Hızlı Üretici','Endüstriyel','Ekonomik','Uzman','Yeni'].map((c,i)=>(
              <label key={c} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'#374151',cursor:'pointer',padding:'4px 0'}}>
                <input type="checkbox" defaultChecked={i===0} style={{accentColor:'#F97316'}}/>{c}
              </label>
            ))}
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:18}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.16em',color:'#6B7280',marginBottom:10}}>Malzeme</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['PLA','ABS','PETG','Resin','Nylon','Metal'].map((m,i)=>(
              <span key={m} style={{padding:'5px 11px',borderRadius:9999,background:i===0?'#FFEDD5':'#F3F4F6',color:i===0?'#C2410C':'#374151',fontSize:12,fontWeight:600,cursor:'pointer'}}>{m}</span>
            ))}
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:18}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.16em',color:'#6B7280',marginBottom:10}}>Şehir</div>
          <select style={{width:'100%',padding:'8px 10px',border:'1px solid #E5E7EB',borderRadius:8,fontFamily:'Geist,sans-serif',fontSize:13,background:'#fff'}}>
            <option>Tüm şehirler</option><option>İstanbul</option><option>Ankara</option><option>İzmir</option>
          </select>
        </div>
        <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:18}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.16em',color:'#6B7280',marginBottom:10}}>Min skor</div>
          <input type="range" defaultValue="80" min="60" max="100" style={{width:'100%',accentColor:'#F97316'}}/>
          <div style={{fontFamily:'Geist Mono,monospace',fontSize:12,color:'#6B7280',marginTop:6}}>80 / 100</div>
        </div>
      </aside>

      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div>
            <h2 style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:24,letterSpacing:'-0.02em',color:'#0F172A',margin:0}}>Üreticiler</h2>
            <div style={{fontSize:13,color:'#6B7280',marginTop:4}}>340+ doğrulanmış üretici · skora göre sıralı</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#6B7280'}}>
            Sırala
            <select style={{padding:'7px 10px',border:'1px solid #E5E7EB',borderRadius:8,fontFamily:'Geist,sans-serif',fontSize:13,background:'#fff'}}>
              <option>En yüksek skor</option><option>En düşük fiyat</option><option>En hızlı teslim</option>
            </select>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
          {list.map(p=>(
            <div key={p.name} style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:16,padding:18,boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                <span style={{background:p.catBg,color:p.catFg,padding:'4px 10px',borderRadius:9999,fontSize:11,fontWeight:700}}>{p.cat}</span>
                <div style={{width:44,height:44,borderRadius:9999,border:`2.5px solid ${p.sc}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14,color:p.sc}}>{p.score}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <div style={{fontFamily:'Geist,sans-serif',fontWeight:700,fontSize:16,color:'#111827'}}>{p.name}</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd"/></svg>
              </div>
              <div style={{fontSize:12,color:'#6B7280',marginBottom:12,display:'flex',alignItems:'center',gap:4}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {p.city}
                <span style={{color:'#D1D5DB'}}>·</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.32.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>
                <span style={{fontWeight:600,color:'#111827'}}>{p.rating}</span>
                <span>({p.reviews})</span>
              </div>
              <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
                {p.mats.map(m=><span key={m} style={{fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:9999,background:'#F3F4F6',color:'#374151',fontFamily:'Geist Mono,monospace'}}>{m}</span>)}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:14,borderTop:'1px solid #F3F4F6'}}>
                <div>
                  <div style={{fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>Başlangıç</div>
                  <div style={{fontFamily:'Geist,sans-serif',fontWeight:900,fontSize:20,color:'#111827',letterSpacing:'-0.02em'}}>{p.price}</div>
                  <div style={{fontSize:11,color:'#6B7280'}}>{p.time}</div>
                </div>
                <button style={{padding:'9px 18px',background:'#111827',color:'#fff',border:'none',borderRadius:9999,fontFamily:'Geist,sans-serif',fontWeight:600,fontSize:13,cursor:'pointer'}}>Teklif Al</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.ExploreScreen = ExploreScreen;
