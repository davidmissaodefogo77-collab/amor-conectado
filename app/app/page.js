"use client";
import { useState } from "react";

const T = {
  "pt-BR": { chats:"Chats", normal:"NORMAL R$29,99", vip:"VIP R$49,90", gratis:"1 DIA GRÁTIS", video:"📹 CHAMADA PRIVADA", videoBloq:"🔒 VÍDEO PRIVADO SÓ VIP", trad:"🎤 Ela ouve traduzido", jogos:"🎮 SALINHA DE JOGOS - NORMAL E VIP", presente:"🎁 Presente R$4,90 a R$99,90", gps:"📍 GPS MUNDIAL", input:"Mensagem..." },
  "en-US": { chats:"Chats", normal:"NORMAL $5.99", vip:"VIP $9.90", gratis:"1 DAY FREE", video:"📹 PRIVATE CALL", videoBloq:"🔒 PRIVATE VIDEO VIP ONLY", trad:"🎤 She hears translated", jogos:"🎮 GAME ROOM - NORMAL & VIP", presente:"🎁 Gift $0.99 - $19.99", gps:"📍 WORLD GPS", input:"Message..." },
  "es-ES": { chats:"Chats", normal:"NORMAL $5.99", vip:"VIP $9.90", gratis:"1 DÍA GRATIS", video:"📹 LLAMADA PRIVADA", videoBloq:"🔒 VIDEO PRIVADO SOLO VIP", trad:"🎤 Ella escucha traducido", jogos:"🎮 SALA DE JUEGOS - NORMAL Y VIP", presente:"🎁 Regalo $0.99 - $19.99", gps:"📍 GPS MUNDIAL", input:"Mensaje..." },
};

export default function AmorConectado() {
  const [idioma, setIdioma] = useState("pt-BR");
  const t = T[idioma];
  const [plano, setPlano] = useState(null);
  const [videoMode, setVideoMode] = useState("meia");
  const [trad, setTrad] = useState(false);
  const [msg, setMsg] = useState("");
  const [mensagens, setMensagens] = useState([[{de:"ela", texto:"Oi amor! Bora jogar Sinuca enquanto conversa?"}]]);

  const chamarVideo = () => {
    if(plano!=="vip"){ alert(t.videoBloq+" - Ative VIP com 1 DIA GRÁTIS"); return; }
    setVideoMode("meia");
  };

  const traduzirVoz = () => {
    if(plano!=="vip"){ alert("TRADUTOR DE VOZ SÓ NO VIP"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ alert("Abre no Chrome do celular"); return; }
    const rec = new SR(); rec.lang = idioma; setTrad(true);
    rec.onresult = async (e) => {
      const txt = e.results[0][0].transcript;
      const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(txt)}&langpair=${idioma==="pt-BR"?"pt|en":"en|pt"}`);
      const j = await r.json();
      const tradu = j.responseData.translatedText;
      const fala = new SpeechSynthesisUtterance(tradu);
      fala.lang = idioma==="pt-BR"?"en-US":"pt-BR";
      speechSynthesis.speak(fala);
      setTrad(false);
    };
    rec.onend = ()=>setTrad(false);
    rec.start();
  };

  const enviar = () => { if(!msg) return; const n=[...mensagens]; n[0].push({de:"eu", texto:msg}); setMensagens(n); setMsg(""); };

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100dvh", background:"#080510", color:"white", fontFamily:"system-ui"}}>
      <div style={{padding:"10px", background:"#1a0f2e", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <b style={{color:"#ff4d8d"}}>💖 AMOR CONECTADO GLOBAL</b>
        <div style={{display:"flex", gap:"5px"}}>
          <button onClick={()=>setIdioma("pt-BR")} style={{background:idioma==="pt-BR"?"#ff4d8d":"#222", border:"none", padding:"6px 10px", borderRadius:"20px", color:"white"}}>🇧🇷</button>
          <button onClick={()=>setIdioma("en-US")} style={{background:idioma==="en-US"?"#ff4d8d":"#222", border:"none", padding:"6px 10px", borderRadius:"20px", color:"white"}}>🇺🇸</button>
          <button onClick={()=>setIdioma("es-ES")} style={{background:idioma==="es-ES"?"#ff4d8d":"#222", border:"none", padding:"6px 10px", borderRadius:"20px", color:"white"}}>🇪🇸</button>
        </div>
      </div>

      {videoMode!=="off" && (
        <div style={{height: videoMode==="cheia"?"100%":videoMode==="meia"?"45%":"130px", width: videoMode==="mini"?"150px":"100%", position: videoMode==="mini"?"fixed":"relative", bottom:videoMode==="mini"?"90px":"auto", right:"10px", background:"#000", border:"2px solid #ff4d8d", zIndex:99, display:"grid", placeItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <div>📹 VÍDEO {videoMode.toUpperCase()} {trad?"🔴 TRADUZINDO":""}</div>
            <div style={{display:"flex", gap:"5px", marginTop:"8px", flexWrap:"wrap", justifyContent:"center"}}>
              <button onClick={()=>setVideoMode("meia")} style={{padding:"6px 8px", borderRadius:"20px", background:"#222", color:"white", border:"none", fontSize:"10px"}}>Meia</button>
              <button onClick={()=>setVideoMode("cheia")} style={{padding:"6px 8px", borderRadius:"20px", background:"#222", color:"white", border:"none", fontSize:"10px"}}>Cheia</button>
              <button onClick={()=>setVideoMode("mini")} style={{padding:"6px 8px", borderRadius:"20px", background:"#222", color:"white", border:"none", fontSize:"10px"}}>Minimizar</button>
              <button onClick={traduzirVoz} style={{padding:"6px 10px", borderRadius:"20px", background:"#ff4d8d", color:"white", border:"none", fontSize:"10px", fontWeight:"900"}}>{t.trad}</button>
              <button onClick={()=>setVideoMode("off")} style={{padding:"6px 8px", borderRadius:"20px", background:"#ff3b3b", color:"white", border:"none", fontSize:"10px"}}>X</button>
            </div>
            <div style={{fontSize:"9px", opacity:0.6, marginTop:"5px"}}>SÓ VIP: Você fala PT, ela OUVE EN automático</div>
          </div>
        </div>
      )}

      <div style={{display:"flex", flex:1, overflow:"hidden"}}>
        <div style={{width:"40%", minWidth:"300px", background:"#121212", borderRight:"1px solid #222", display:"flex", flexDirection:"column"}}>
          <div style={{padding:"10px", display:"flex", gap:"6px"}}>
            <button onClick={()=>setPlano("normal")} style={{flex:1, padding:"10px", borderRadius:"10px", background:plano==="normal"?"#ff4d8d":"#1e1e1e", border:"none", color:"white", fontSize:"11px", fontWeight:"900"}}>{t.normal}<br/>{t.gratis}<br/>Jogos ✅</button>
            <button onClick={()=>setPlano("vip")} style={{flex:1, padding:"10px", borderRadius:"10px", background:plano==="vip"?"#ff4d8d":"#2a1020", border:"1px solid #ff4d8d", color:"white", fontSize:"11px", fontWeight:"900"}}>{t.vip}<br/>{t.gratis}<br/>Vídeo + Voz</button>
          </div>
          <button onClick={chamarVideo} style={{margin:"0 10px", padding:"12px", borderRadius:"12px", border:"none", background:plano==="vip"?"#00ff88":"#333", fontWeight:"900"}}>{plano==="vip"?t.video:t.videoBloq}</button>
          <div style={{padding:"10px", flex:1, overflowY:"auto"}}>
            <div style={{fontSize:"10px", opacity:0.5, fontWeight:"900"}}>{t.jogos} • {t.presente} • {t.gps}</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", marginTop:"8px"}}>
              {["Sinuca","Baralho","Dominó","Tetris","Bolinha","Cobrinha"].map(g=><div key={g} style={{background:"#1e1e1e", padding:"12px", borderRadius:"12px", textAlign:"center", border:"1px solid #333"}}>🎮<br/><b style={{fontSize:"11px"}}>{g}</b><div style={{fontSize:"9px", opacity:0.5}}>Normal + VIP</div></div>)}
            </div>
            <div style={{marginTop:"10px", background:"#1e1e1e", padding:"10px", borderRadius:"10px", fontSize:"11px"}}>📍 Ana 2.1km Rio das Ostras<br/>🇺🇸 Sarah 5km Miami<br/>🇪🇸 Carlos 1km Madrid<br/><span style={{fontSize:"9px", opacity:0.5}}>GPS Mundial - Normal vê bairro, VIP vê rua exata</span></div>
            <div style={{marginTop:"10px", display:"flex", gap:"6px", flexWrap:"wrap"}}>{["R$4,90 🌹","R$14,90 ❤️","R$49,90 💍","R$99,90 👑"].map(p=><span key={p} style={{background:"#2a1020", padding:"6px 10px", borderRadius:"20px", fontSize:"10px", border:"1px solid #ff4d8d"}}>{p}</span>)}</div>
          </div>
        </div>
        <div style={{flex:1, display:"flex", flexDirection:"column", background:"#0a0614"}}>
          <div style={{flex:1, padding:"12px", overflowY:"auto"}}>{mensagens[0].map((m,i)=><div key={i} style={{textAlign:m.de==="eu"?"right":"left", marginBottom:"8px"}}><span style={{background:m.de==="eu"?"#ff4d8d":"#1e1e1e", padding:"8px 12px", borderRadius:"14px", display:"inline-block", fontSize:"13px"}}>{m.texto}</span></div>)}</div>
          <div style={{padding:"10px", background:"#121212", display:"flex", gap:"8px"}}><input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviar()} placeholder={t.input} style={{flex:1, padding:"12px", borderRadius:"20px", background:"#1e1e1e", border:"1px solid #333", color:"white"}}/><button onClick={enviar} style={{width:"44px", height:"44px", borderRadius:"50%", background:"#ff4d8d", border:"none", color:"white"}}>➤</button></div>
        </div>
      </div>
    </div>
  );
}
