import { useState, useEffect, useRef, useCallback } from "react";

// ════════════════════════════════════════════════════════════════
// 글로벌 스타일
// ════════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Noto+Serif+KR:wght@400;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body { background: #F5F0E8; overflow-x: hidden; }
    #root, #root > div { max-width: 420px; margin: 0 auto; width: 100%; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse {
      0%,100% { transform: scale(1);    opacity: 0.85; }
      50%      { transform: scale(1.07); opacity: 1; }
    }
    @keyframes sandRipple {
      0%   { transform: scale(0.8); opacity: 0.6; }
      100% { transform: scale(2.6); opacity: 0; }
    }
    @keyframes particleFall {
      0%   { transform: translateY(-8px);  opacity: 0.9; }
      100% { transform: translateY(55px);  opacity: 0; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes popIn {
      0%   { transform: scale(0.85); opacity: 0; }
      70%  { transform: scale(1.04); }
      100% { transform: scale(1);    opacity: 1; }
    }
    .fade-up  { animation: fadeUp  0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .fade-in  { animation: fadeIn  0.4s ease both; }
    .slide-in { animation: slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }
    .pop-in   { animation: popIn   0.45s cubic-bezier(0.22,1,0.36,1) both; }
    button { transition: transform 0.1s, opacity 0.1s; }
    button:active { transform: scale(0.96) !important; }
    ::-webkit-scrollbar { width: 0; }
  `}</style>
);

// ════════════════════════════════════════════════════════════════
// 디자인 토큰 (앱 전체 공유)
// ════════════════════════════════════════════════════════════════
const A = {                        // App shell colours
  bg:      "#F7F4EF",
  card:    "#FFFFFF",
  navy:    "#1E2A4A",
  teal:    "#3D8B8B",
  tealLt:  "#EAF4F4",
  peach:   "#E8856A",
  peachLt: "#FDF0EC",
  sage:    "#7BA68A",
  sageLt:  "#EEF5F0",
  lav:     "#8B7EC8",
  lavLt:   "#F0EEFB",
  gold:    "#C9A84C",
  goldLt:  "#FBF5E6",
  muted:   "#9CA3AF",
  border:  "#E8E4DD",
};

const S = {                        // Session colours (warm earth)
  bg:       "#F5F0E8",
  bgWarm:   "#EDE6D6",
  sand:     "#C4A882",
  sandDk:   "#9C7B52",
  sandDeep: "#6B4E2A",
  earth:    "#3D2B1A",
  cream:    "#FBF6EE",
  teal:     "#3A8A82",
  tealSoft: "#D4EDEB",
  peach:    "#D4735A",
  peachSoft:"#FAE9E4",
  sage:     "#6B9E7A",
  sageSoft: "#E4F0E8",
  gold:     "#C09A40",
  goldSoft: "#FBF5E6",
  text:     "#2A1F14",
  muted:    "#8C7B68",
  border:   "#DDD4C4",
};

// ════════════════════════════════════════════════════════════════
// 공통 컴포넌트
// ════════════════════════════════════════════════════════════════
const Icon = ({ name, size = 22, color = A.navy }) => {
  const paths = {
    home:     <path d="M3 12L12 3l9 9M5 10v10h5v-5h4v5h5V10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    journal:  <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm3 3h10M7 12h10M7 16h6" strokeWidth="1.8" strokeLinecap="round"/>,
    travel:   <><circle cx="12" cy="12" r="8" strokeWidth="1.8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" strokeWidth="1.8" strokeLinecap="round"/></>,
    profile:  <><circle cx="12" cy="8" r="4" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.8" strokeLinecap="round"/></>,
    check:    <path d="M5 13l4 4L19 7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>,
    lock:     <><rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.8"/><path d="M8 11V7a4 4 0 018 0v4" strokeWidth="1.8" strokeLinecap="round"/></>,
    arrow:    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    back:     <path d="M19 12H5M12 5l-7 7 7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    message:  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    chart:    <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2" strokeLinecap="round"/>,
    bell:     <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeWidth="1.8" strokeLinecap="round"/>,
    settings: <><circle cx="12" cy="12" r="3" strokeWidth="1.8"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="1.8" strokeLinecap="round"/></>,
    star:     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    play:     <><circle cx="12" cy="12" r="9" strokeWidth="1.8"/><path d="M10 8l6 4-6 4V8z" strokeWidth="1.8" strokeLinejoin="round"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}>{paths[name]}</svg>;
};

const Btn = ({ children, onClick, variant = "primary", disabled, full = true, style: sx }) => {
  const base = {
    border: "none", borderRadius: 14, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Gowun Dodum', sans-serif", fontSize: 15, fontWeight: 700,
    padding: "14px 22px", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: 8, opacity: disabled ? 0.42 : 1,
    width: full ? "100%" : "auto", ...sx,
  };
  const vs = {
    primary:   { background: A.teal,    color: "#fff", boxShadow: `0 4px 14px ${A.teal}38` },
    peach:     { background: S.peach,   color: "#fff", boxShadow: `0 4px 14px ${S.peach}38` },
    secondary: { background: A.bg,      color: A.navy, border: `1.5px solid ${A.border}` },
    ghost:     { background: "transparent", color: A.muted, fontSize: 13 },
    navy:      { background: A.navy,    color: "#fff", boxShadow: `0 4px 14px ${A.navy}30` },
  };
  return <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...vs[variant] }}>{children}</button>;
};

// ════════════════════════════════════════════════════════════════
// 앱 데이터
// ════════════════════════════════════════════════════════════════
const SESSIONS = [
  { id:1, day:"1-2일차",   theme:"수용",          color:A.peach,   bg:A.peachLt, title:"나의 고통, 낯선 손님처럼",  sub:"인간 고통의 정상성과 심리적 수용",       emoji:"🏔️", unlocked:true  },
  { id:2, day:"3-4일차",   theme:"현재 순간",      color:A.teal,    bg:A.tealLt,  title:"지금, 이 순간으로",          sub:"통제의 문제와 현재 접촉하기",            emoji:"🌊", unlocked:false },
  { id:3, day:"5-6일차",   theme:"탈융합",         color:A.lav,     bg:A.lavLt,   title:"생각과 나 사이 공간",         sub:"인지적 탈융합 경험하기",                emoji:"🍃", unlocked:false },
  { id:4, day:"7-8일차",   theme:"수용 심화",      color:A.sage,    bg:A.sageLt,  title:"순수한 고통과 더러운 고통",  sub:"비판단적 자각과 마음챙김",              emoji:"🌬️", unlocked:false },
  { id:5, day:"9-10일차",  theme:"맥락 자기",      color:A.gold,    bg:A.goldLt,  title:"체스판 위의 관찰자",          sub:"변하지 않는 나와 만나기",               emoji:"♟️", unlocked:false },
  { id:6, day:"11-12일차", theme:"가치",           color:A.peach,   bg:A.peachLt, title:"내 삶의 나침반",              sub:"가치 탐색과 명료화",                    emoji:"🧭", unlocked:false },
  { id:7, day:"13-14일차", theme:"전념행동",       color:A.teal,    bg:A.tealLt,  title:"버스와 승객",                 sub:"전념과 기꺼이 경험하기",                emoji:"🚌", unlocked:false },
  { id:8, day:"15-16일차", theme:"마무리",         color:A.lav,     bg:A.lavLt,   title:"항해를 마치며",               sub:"전념 유지와 프로그램 마무리",           emoji:"⛵", unlocked:false },
];

const MOOD_DATA = [
  { day:"월", mood:45 }, { day:"화", mood:52 }, { day:"수", mood:48 },
  { day:"목", mood:61 }, { day:"금", mood:58 }, { day:"토", mood:67 }, { day:"일", mood:70 },
];

// ════════════════════════════════════════════════════════════════
// ▌ APP SHELL — 타임라인
// ════════════════════════════════════════════════════════════════
const HomeScreen = ({ completedIds, currentDay, onStartSession }) => {
  const nextSession = SESSIONS.find(s => !completedIds.includes(s.id)) || SESSIONS[7];
  const progress = (completedIds.length / 8) * 100;

  return (
    <div style={{ padding: "0 20px 110px" }}>
      <div style={{ paddingTop: 28, marginBottom: 26 }}>
        <p style={{ fontSize: 13, color: A.muted, marginBottom: 4, fontFamily: "'Gowun Dodum', sans-serif" }}>오늘도 잘 오셨어요</p>
        <h1 style={{ fontSize: 27, fontWeight: 800, color: A.navy, fontFamily: "'Noto Serif KR', serif" }}>
          마음여행 <span style={{ color: A.teal }}>ACT</span>
        </h1>
      </div>

      {/* 진도 카드 */}
      <div style={{
        background: A.navy, borderRadius: 22, padding: "22px 24px", marginBottom: 18,
        position: "relative", overflow: "hidden",
      }}>
        {[0,1].map(i => (
          <div key={i} style={{
            position:"absolute", borderRadius:"50%",
            border:"1px solid rgba(255,255,255,0.06)",
            width: 160+i*80, height: 160+i*80,
            right: -40+i*(-20), top: -40+i*(-10),
          }}/>
        ))}
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginBottom:5, letterSpacing:"0.07em", fontFamily:"'Gowun Dodum', sans-serif" }}>현재 여정</p>
              <p style={{ fontSize:17, fontWeight:700, color:"#fff", fontFamily:"'Noto Serif KR', serif" }}>{nextSession.title}</p>
            </div>
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 12px", fontSize:22 }}>
              {nextSession.emoji}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:8, height:5, marginBottom:8 }}>
            <div style={{ height:"100%", borderRadius:8, width:`${progress}%`, background:"linear-gradient(90deg,#3D8B8B,#7BA68A)", transition:"width 0.8s ease" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontFamily:"'Gowun Dodum', sans-serif" }}>D+{currentDay}</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:700, fontFamily:"'Gowun Dodum', sans-serif" }}>{completedIds.length}/8 회기 완료</p>
          </div>
        </div>
      </div>

      {/* 오늘의 활동 */}
      <div style={{
        background: nextSession.bg, border:`1px solid ${nextSession.color}28`,
        borderRadius:18, padding:"18px 20px", marginBottom:18,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:nextSession.color, boxShadow:`0 0 0 3px ${nextSession.color}28` }}/>
          <span style={{ fontSize:12, fontWeight:700, color:nextSession.color, fontFamily:"'Gowun Dodum', sans-serif" }}>
            {nextSession.day} · 회기 {nextSession.id}
          </span>
          <span style={{ marginLeft:"auto", background:nextSession.color, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
            {nextSession.theme}
          </span>
        </div>
        <p style={{ fontSize:15, fontWeight:700, color:A.navy, marginBottom:6, fontFamily:"'Noto Serif KR', serif" }}>{nextSession.title}</p>
        <p style={{ fontSize:13, color:"#666", lineHeight:1.7, marginBottom:14, fontFamily:"'Gowun Dodum', sans-serif" }}>{nextSession.sub}</p>
        <Btn onClick={() => onStartSession(nextSession.id)} variant="peach">
          오늘 활동 시작하기 <Icon name="arrow" size={15} color="#fff"/>
        </Btn>
      </div>

      {/* 상담사 편지 */}
      <div style={{ background:A.card, borderRadius:16, padding:"18px 20px", marginBottom:18, border:`1px solid ${A.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <Icon name="message" size={16} color={A.teal}/>
          <span style={{ fontSize:13, fontWeight:700, color:A.navy, fontFamily:"'Gowun Dodum', sans-serif" }}>상담사의 편지</span>
          {completedIds.length > 0 && <span style={{ marginLeft:"auto", background:A.peach, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10 }}>새 편지</span>}
        </div>
        <div style={{ background:A.tealLt, borderRadius:12, padding:"14px 16px" }}>
          <p style={{ fontSize:13, color:"#444", lineHeight:1.8, fontFamily:"'Gowun Dodum', sans-serif" }}>
            {completedIds.includes(1)
              ? "1회기를 완료하셨군요 🌿 모래늪에서 어떤 느낌을 받으셨나요? 저항할수록 더 깊이 빠지는 경험, 우리 마음도 그렇답니다. 내일도 함께해요."
              : "여정을 시작해봐요. 첫 발을 내딛는 것만으로도 충분히 용기 있는 일입니다 🌱"}
          </p>
          <p style={{ fontSize:11, color:A.muted, marginTop:8, textAlign:"right", fontFamily:"'Gowun Dodum', sans-serif" }}>상담사 김○○</p>
        </div>
      </div>

      {/* 전체 회기 */}
      <p style={{ fontSize:14, fontWeight:700, color:A.navy, marginBottom:12, fontFamily:"'Gowun Dodum', sans-serif" }}>전체 여정</p>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {SESSIONS.map(s => {
          const done   = completedIds.includes(s.id);
          const active = s.id === nextSession.id;
          const locked = !done && !active;
          return (
            <div key={s.id}
              onClick={() => active && onStartSession(s.id)}
              style={{
                display:"flex", alignItems:"center", gap:13,
                background: active ? s.bg : A.card,
                border:`1px solid ${active ? s.color+"38" : A.border}`,
                borderRadius:14, padding:"13px 16px",
                cursor: active ? "pointer" : "default",
                opacity: locked ? 0.5 : 1,
              }}
            >
              <div style={{
                width:40, height:40, borderRadius:12, flexShrink:0,
                background: done ? A.sageLt : (active ? s.color : A.border),
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: done ? 0 : 20,
              }}>
                {done ? <Icon name="check" size={18} color={A.sage}/> : <span>{s.emoji}</span>}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color: active ? s.color : A.muted, fontWeight:700, marginBottom:2, fontFamily:"'Gowun Dodum', sans-serif" }}>
                  {s.day} · {s.theme}
                </p>
                <p style={{ fontSize:13, fontWeight:700, color:A.navy, fontFamily:"'Gowun Dodum', sans-serif" }}>{s.title}</p>
              </div>
              {locked && <Icon name="lock" size={15} color={A.muted}/>}
              {active  && <Icon name="arrow" size={15} color={s.color}/>}
              {done    && <span style={{ fontSize:11, color:A.sage, fontWeight:700, fontFamily:"'Gowun Dodum', sans-serif" }}>완료</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ▌ APP SHELL — 마음일지
// ════════════════════════════════════════════════════════════════
const JournalScreen = () => {
  const [vals, setVals] = useState({ mood:60, sleep:70, action:50, avoid:40 });
  const [saved, setSaved] = useState(false);

  const items = [
    { key:"mood",   label:"지금 기분",            icon:"💙", color:A.teal   },
    { key:"sleep",  label:"어제 수면 만족도",      icon:"🌙", color:A.lav   },
    { key:"action", label:"목표 행동 실천도",      icon:"✅", color:A.sage  },
    { key:"avoid",  label:"불쾌 감정 회피 노력",   icon:"🔄", color:A.peach },
  ];

  return (
    <div style={{ padding:"0 20px 110px" }}>
      <div style={{ paddingTop:28, marginBottom:24 }}>
        <p style={{ fontSize:13, color:A.muted, marginBottom:4, fontFamily:"'Gowun Dodum', sans-serif" }}>오늘의 기록</p>
        <h2 style={{ fontSize:25, fontWeight:800, color:A.navy, fontFamily:"'Noto Serif KR', serif" }}>마음 일지</h2>
      </div>

      {/* 이번주 차트 */}
      <div style={{ background:A.card, borderRadius:16, padding:"18px 20px", marginBottom:18, border:`1px solid ${A.border}` }}>
        <p style={{ fontSize:13, fontWeight:700, color:A.navy, marginBottom:14, fontFamily:"'Gowun Dodum', sans-serif" }}>이번 주 기분 흐름</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:54 }}>
          {MOOD_DATA.map((d,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", height:`${d.mood*0.54}px`, background: i===6 ? A.teal : `${A.teal}55`, borderRadius:"4px 4px 0 0" }}/>
              <span style={{ fontSize:9, color:A.muted, fontFamily:"'Gowun Dodum', sans-serif" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 슬라이더들 */}
      <div style={{ background:A.card, borderRadius:16, padding:"20px", border:`1px solid ${A.border}`, marginBottom:16 }}>
        <p style={{ fontSize:13, fontWeight:700, color:A.navy, marginBottom:18, fontFamily:"'Gowun Dodum', sans-serif" }}>오늘을 기록해요</p>
        {items.map(item => (
          <div key={item.key} style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:700, color:A.navy, fontFamily:"'Gowun Dodum', sans-serif" }}>{item.icon} {item.label}</span>
              <span style={{ fontSize:17, fontWeight:800, color:item.color, fontFamily:"'Noto Serif KR', serif" }}>{vals[item.key]}</span>
            </div>
            <div style={{ position:"relative", height:36, display:"flex", alignItems:"center" }}>
              <div style={{ position:"absolute", width:"100%", height:5, background:A.border, borderRadius:8 }}>
                <div style={{ height:"100%", width:`${vals[item.key]}%`, background:`linear-gradient(90deg,${item.color}70,${item.color})`, borderRadius:8 }}/>
              </div>
              <input type="range" min="0" max="100" value={vals[item.key]}
                onChange={e => setVals(v => ({ ...v, [item.key]: +e.target.value }))}
                style={{ position:"absolute", width:"100%", opacity:0, height:36, cursor:"pointer" }}/>
              <div style={{
                position:"absolute", left:`calc(${vals[item.key]}% - 11px)`,
                width:22, height:22, borderRadius:"50%",
                background:"#fff", border:`2.5px solid ${item.color}`,
                boxShadow:`0 2px 8px ${item.color}40`, pointerEvents:"none", transition:"left 0.05s",
              }}/>
            </div>
          </div>
        ))}
      </div>

      <Btn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2200); }}
        variant={saved ? "secondary" : "navy"}>
        {saved ? <><Icon name="check" size={16} color={A.sage}/> 저장 완료!</> : "오늘 기록 저장"}
      </Btn>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ▌ APP SHELL — 마음여행 (세션 목록)
// ════════════════════════════════════════════════════════════════
const TravelScreen = ({ completedIds, onStartSession }) => {
  const nextId = (SESSIONS.find(s => !completedIds.includes(s.id)) || SESSIONS[7]).id;
  return (
    <div style={{ padding:"0 20px 110px" }}>
      <div style={{ paddingTop:28, marginBottom:24 }}>
        <p style={{ fontSize:13, color:A.muted, marginBottom:4, fontFamily:"'Gowun Dodum', sans-serif" }}>4주 여정</p>
        <h2 style={{ fontSize:25, fontWeight:800, color:A.navy, fontFamily:"'Noto Serif KR', serif" }}>마음 여행</h2>
      </div>

      {/* ACT 6요소 */}
      <div style={{ background:A.navy, borderRadius:20, padding:"20px 20px 16px", marginBottom:22 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12, letterSpacing:"0.07em", fontFamily:"'Gowun Dodum', sans-serif" }}>ACT 6가지 핵심 과정</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[["🤲","수용"],["🌊","현재 접촉"],["🍃","탈융합"],["♟️","맥락 자기"],["🧭","가치"],["🚀","전념행동"]].map(([e,n]) => (
            <div key={n} style={{ background:"rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{e}</div>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontFamily:"'Gowun Dodum', sans-serif" }}>{n}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {SESSIONS.map(s => {
          const done   = completedIds.includes(s.id);
          const active = s.id === nextId;
          const locked = !done && !active;
          return (
            <div key={s.id}
              onClick={() => (active || done) && onStartSession(s.id)}
              style={{
                background:A.card, border:`1.5px solid ${active ? s.color : A.border}`,
                borderRadius:18, overflow:"hidden",
                cursor: (active||done) ? "pointer" : "default",
                opacity: locked ? 0.45 : 1,
                boxShadow: active ? `0 4px 18px ${s.color}28` : "none",
              }}
            >
              <div style={{ height:4, background: done ? A.sage : (active ? s.color : A.border) }}/>
              <div style={{ padding:"15px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:50, height:50, borderRadius:14, background: done ? A.sageLt : s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                    {done ? "✅" : s.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <span style={{ fontSize:11, color:s.color, fontWeight:700, fontFamily:"'Gowun Dodum', sans-serif" }}>회기 {s.id}</span>
                      <span style={{ fontSize:11, color:A.muted, fontFamily:"'Gowun Dodum', sans-serif" }}>· {s.day}</span>
                      {active && <span style={{ background:s.color, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:10 }}>진행 중</span>}
                    </div>
                    <p style={{ fontSize:14, fontWeight:800, color:A.navy, marginBottom:2, fontFamily:"'Noto Serif KR', serif" }}>{s.title}</p>
                    <p style={{ fontSize:11, color:A.muted, fontFamily:"'Gowun Dodum', sans-serif" }}>{s.sub}</p>
                  </div>
                  {locked && <Icon name="lock" size={15} color={A.muted}/>}
                  {(active||done) && <Icon name="arrow" size={15} color={s.color}/>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ▌ APP SHELL — 마이페이지
// ════════════════════════════════════════════════════════════════
const ProfileScreen = ({ completedIds, currentDay }) => (
  <div style={{ padding:"0 20px 110px" }}>
    <div style={{ paddingTop:28, marginBottom:24 }}>
      <p style={{ fontSize:13, color:A.muted, marginBottom:4, fontFamily:"'Gowun Dodum', sans-serif" }}>나의 기록</p>
      <h2 style={{ fontSize:25, fontWeight:800, color:A.navy, fontFamily:"'Noto Serif KR', serif" }}>마이 페이지</h2>
    </div>

    <div style={{ background:`linear-gradient(135deg,${A.navy},#2D4A7A)`, borderRadius:20, padding:"24px", marginBottom:18, textAlign:"center" }}>
      <div style={{ width:68, height:68, borderRadius:"50%", background:A.teal, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🌱</div>
      <p style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:4, fontFamily:"'Noto Serif KR', serif" }}>마음여행자</p>
      <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:20, fontFamily:"'Gowun Dodum', sans-serif" }}>D+{currentDay} · 여정 중</p>
      <div style={{ display:"flex", justifyContent:"space-around" }}>
        {[[`${currentDay}일`,"연속 참여"],[`${completedIds.length}회기`,"완료"],[`${completedIds.length*5}개`,"활동"]].map(([v,l]) => (
          <div key={l}>
            <p style={{ fontSize:17, fontWeight:800, color:"#fff", fontFamily:"'Noto Serif KR', serif" }}>{v}</p>
            <p style={{ fontSize:10, color:"rgba(255,255,255,0.45)", fontFamily:"'Gowun Dodum', sans-serif" }}>{l}</p>
          </div>
        ))}
      </div>
    </div>

    {[
      { icon:"message", label:"상담사와의 대화", badge:"1", color:A.teal },
      { icon:"bell",    label:"알림 설정",        color:A.lav  },
      { icon:"chart",   label:"나의 성장 기록",   color:A.sage },
      { icon:"star",    label:"프로그램 평가",    color:A.gold },
      { icon:"settings",label:"설정",             color:A.muted},
    ].map(item => (
      <div key={item.label} style={{ background:A.card, borderRadius:14, padding:"16px 18px", marginBottom:10, border:`1px solid ${A.border}`, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
        <div style={{ width:40, height:40, borderRadius:12, background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name={item.icon} size={18} color={item.color}/>
        </div>
        <span style={{ fontSize:14, fontWeight:700, color:A.navy, flex:1, fontFamily:"'Gowun Dodum', sans-serif" }}>{item.label}</span>
        {item.badge && <span style={{ background:A.peach, color:"#fff", fontSize:10, fontWeight:700, width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{item.badge}</span>}
        <Icon name="arrow" size={14} color={A.muted}/>
      </div>
    ))}
  </div>
);

// ════════════════════════════════════════════════════════════════
// ▌ SESSION 1 — 세부 단계들
// ════════════════════════════════════════════════════════════════

// 세션 내 진행 바
const SessProgress = ({ cur, total }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 22px 0" }}>
    <div style={{ flex:1, height:4, background:S.border, borderRadius:8, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${(cur/total)*100}%`, background:`linear-gradient(90deg,${S.teal},${S.sage})`, borderRadius:8, transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)" }}/>
    </div>
    <span style={{ fontSize:11, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", whiteSpace:"nowrap" }}>{cur}/{total}</span>
  </div>
);

// ── S1-0: 인트로 ─────────────────────────────────────────────────
const S1Intro = ({ onNext }) => (
  <div style={{ minHeight:"100vh", width:"100%", background:S.earth, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 28px", position:"relative", overflow:"hidden" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ position:"absolute", width:260+i*110, height:260+i*110, borderRadius:"50%", border:`1px solid rgba(196,168,130,${0.07-i*0.02})`, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}/>
    ))}
    <div style={{ position:"relative", textAlign:"center", maxWidth:340 }}>
      <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(196,168,130,0.14)", border:"1px solid rgba(196,168,130,0.28)", borderRadius:30, padding:"7px 16px", marginBottom:30, animationDelay:"0.1s" }}>
        <span>🏔️</span>
        <span style={{ fontSize:12, color:S.sand, fontFamily:"'Gowun Dodum', sans-serif", letterSpacing:"0.06em" }}>1회기 · 1–2일차</span>
      </div>
      <h1 className="fade-up" style={{ fontSize:30, fontWeight:700, color:S.cream, fontFamily:"'Noto Serif KR', serif", lineHeight:1.35, marginBottom:16, animationDelay:"0.2s" }}>
        나의 고통,<br/><span style={{ color:S.sand }}>낯선 손님처럼</span>
      </h1>
      <p className="fade-up" style={{ fontSize:15, color:"rgba(251,246,238,0.6)", fontFamily:"'Gowun Dodum', sans-serif", lineHeight:1.9, marginBottom:44, animationDelay:"0.32s" }}>
        고통은 삶의 일부입니다.<br/>오늘은 없애려 싸우는 대신,<br/>잠시 옆에 두는 연습을 시작해요.
      </p>
      <div className="fade-up" style={{ marginBottom:36, animationDelay:"0.44s" }}>
        {[["🏜️","모래늪 비유"],["🚰","수도꼭지 비유"],["📓","경험 일지"],["🌱","괴로움 너머 탐색"]].map(([e,t],i,arr) => (
          <div key={t} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i<arr.length-1 ? "1px solid rgba(196,168,130,0.1)" : "none" }}>
            <span style={{ fontSize:17, width:26 }}>{e}</span>
            <span style={{ fontSize:14, color:"rgba(251,246,238,0.72)", fontFamily:"'Gowun Dodum', sans-serif" }}>{t}</span>
            <span style={{ marginLeft:"auto", fontSize:11, color:"rgba(196,168,130,0.45)" }}>약 5분</span>
          </div>
        ))}
      </div>
      <div className="fade-up" style={{ animationDelay:"0.56s" }}>
        <Btn onClick={onNext} variant="peach">여정 시작하기 →</Btn>
        <p style={{ marginTop:12, fontSize:12, color:"rgba(251,246,238,0.3)", fontFamily:"'Gowun Dodum', sans-serif" }}>총 소요 약 20분</p>
      </div>
    </div>
  </div>
);

// ── S1-1: 고통의 정상성 슬라이드 ─────────────────────────────────
const S1Normality = ({ onNext }) => {
  const [idx, setIdx] = useState(0);
  const slides = [
    { emoji:"💭", title:"당신만 힘든 게 아니에요", body:"우울하고, 불안하고, 공허한 느낌…\n이런 감정을 경험하는 건 누구나 피할 수 없는 일이에요.\n\n전 세계 3억 명이 우울을 경험하고 있습니다.", hi:false },
    { emoji:"🌊", title:"감정은 날씨 같은 것",      body:"비가 오는 날이 있듯, 마음에도 흐린 날이 있어요.\n날씨를 없애려 싸울 수 없듯,\n감정도 있는 그대로 두는 것이 때로는 더 현명합니다.", hi:false },
    { emoji:"🔑", title:"오늘의 핵심 아이디어",     body:"고통을 없애려는 노력이 오히려\n고통을 더 크게 만들 수 있습니다.\n\n오늘은 그 역설을 함께 경험해볼 거예요.", hi:true },
  ];
  const s = slides[idx];
  return (
    <div style={{ minHeight:"100vh", width:"100%", background:S.bg, display:"flex", flexDirection:"column" }}>
      <SessProgress cur={1} total={5}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"24px 24px 28px" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:28 }}>
          {slides.map((_,i) => <div key={i} style={{ width:i===idx?20:6, height:6, borderRadius:3, background:i===idx?S.teal:S.border, transition:"all 0.3s" }}/>)}
        </div>
        <div key={idx} className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:54, marginBottom:26, animation:"pulse 3s ease-in-out infinite" }}>{s.emoji}</div>
          <h2 style={{ fontSize:22, fontWeight:700, color:S.text, fontFamily:"'Noto Serif KR', serif", textAlign:"center", marginBottom:20, lineHeight:1.4 }}>{s.title}</h2>
          <div style={{ background:s.hi?S.tealSoft:S.cream, border:`1px solid ${s.hi?S.teal+"38":S.border}`, borderRadius:18, padding:"22px 24px", width:"100%" }}>
            <p style={{ fontSize:15, color:S.text, lineHeight:2.0, fontFamily:"'Gowun Dodum', sans-serif", whiteSpace:"pre-line", textAlign:"center" }}>{s.body}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          {idx>0 && <Btn variant="secondary" onClick={() => setIdx(i=>i-1)} full={false} style={{ flex:"0 0 76px", fontSize:13 }}>← 이전</Btn>}
          <Btn variant={idx===slides.length-1?"peach":"primary"} onClick={() => idx<slides.length-1 ? setIdx(i=>i+1) : onNext()}>
            {idx<slides.length-1 ? "다음 →" : "모래늪 체험 →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ── S1-2: 모래늪 인터랙션 ─────────────────────────────────────────
const S1Quicksand = ({ onNext }) => {
  const [phase, setPhase]       = useState("intro");   // intro | struggle | surrender | done
  const [sinkLv, setSinkLv]     = useState(0);
  const [struggles, setStruggles] = useState(0);
  const [particles, setParticles] = useState([]);
  const [showMsg, setShowMsg]   = useState(false);
  const pidRef   = useRef(0);
  const timerRef = useRef(null);

  const doStruggle = useCallback(() => {
    if (phase !== "struggle") return;
    setStruggles(n => n+1);
    setSinkLv(l => Math.min(l + 7 + Math.random()*5, 100));
    const p = { id: pidRef.current++, x: 28 + Math.random()*44 };
    setParticles(ps => [...ps.slice(-7), p]);
    setTimeout(() => setParticles(ps => ps.filter(x => x.id !== p.id)), 1100);
  }, [phase]);

  useEffect(() => {
    if (phase === "surrender") {
      timerRef.current = setInterval(() => {
        setSinkLv(l => {
          const n = l - 1.8;
          if (n <= 14) { clearInterval(timerRef.current); setShowMsg(true); }
          return Math.max(n, 14);
        });
      }, 75);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const bodyH = Math.max(8, 80 - sinkLv * 0.58);
  const faceEmoji = phase==="surrender" ? (showMsg?"😮‍💨":"😟") : (sinkLv>65?"😨":"😰");

  return (
    <div style={{ minHeight:"100vh", width:"100%", background:S.bg, display:"flex", flexDirection:"column" }}>
      <SessProgress cur={2} total={5}/>

      {phase === "intro" && (
        <div className="fade-up" style={{ flex:1, padding:"24px 24px 28px", display:"flex", flexDirection:"column" }}>
          <div style={{ background:S.sandDeep, borderRadius:20, padding:"22px 24px", marginBottom:20 }}>
            <p style={{ fontSize:11, color:S.sand, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:7, letterSpacing:"0.07em" }}>🏜️ 핵심 비유</p>
            <h2 style={{ fontSize:21, fontWeight:700, color:S.cream, fontFamily:"'Noto Serif KR', serif", lineHeight:1.4, marginBottom:10 }}>모래늪에 빠졌다고 상상해보세요</h2>
            <p style={{ fontSize:14, color:"rgba(251,246,238,0.7)", fontFamily:"'Gowun Dodum', sans-serif", lineHeight:1.9 }}>본능적으로 발버둥치고 싶겠죠. 하지만 모래늪에서는 움직일수록 더 깊이 빠져듭니다.</p>
          </div>
          <div style={{ background:S.cream, borderRadius:16, padding:"18px 20px", border:`1px solid ${S.border}`, flex:1, marginBottom:24 }}>
            <p style={{ fontSize:14, color:S.text, lineHeight:1.9, fontFamily:"'Gowun Dodum', sans-serif" }}>우리 마음도 그렇습니다. 불안이나 슬픔을 없애려 할수록, 그것들은 더 강해집니다.<br/><br/><span style={{ color:S.teal, fontWeight:700 }}>지금 직접 경험해볼까요?</span></p>
          </div>
          <Btn onClick={() => setPhase("struggle")} variant="peach">체험 시작하기 →</Btn>
        </div>
      )}

      {(phase === "struggle" || phase === "surrender") && (
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 22px 0" }}>
            <div style={{ background: phase==="struggle"?S.peachSoft:S.sageSoft, border:`1px solid ${phase==="struggle"?S.peach+"35":S.sage+"35"}`, borderRadius:13, padding:"11px 16px", transition:"all 0.5s" }}>
              <p style={{ fontSize:13, fontWeight:700, color: phase==="struggle"?S.peach:S.sage, textAlign:"center", fontFamily:"'Gowun Dodum', sans-serif" }}>
                {phase==="struggle" ? `💪 버튼을 눌러 탈출해보세요! (${struggles}번 시도)` : "🌿 가만히 기다려보세요... 천천히 안정됩니다"}
              </p>
            </div>
          </div>

          {/* 모래늪 시각화 */}
          <div style={{ flex:1, position:"relative", overflow:"hidden", margin:"14px 22px", background:"linear-gradient(180deg,#D4C4A8,#C4A882 28%,#9C7B52 58%,#6B4E2A)", borderRadius:22, minHeight:260 }}>
            <div style={{ position:"absolute", top:12, right:14, background:"rgba(0,0,0,0.32)", borderRadius:10, padding:"5px 11px" }}>
              <p style={{ fontSize:11, color:"#fff", fontFamily:"'Gowun Dodum', sans-serif" }}>빠짐 {Math.round(sinkLv)}%</p>
            </div>
            {phase==="struggle" && particles.map(p => (
              <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, bottom:`${50-sinkLv*0.28}%`, width:56, height:56, borderRadius:"50%", border:`2px solid rgba(196,168,130,0.7)`, animation:"sandRipple 0.85s ease-out forwards", transform:"translate(-50%,50%)" }}/>
            ))}
            {/* 캐릭터 */}
            <div style={{ position:"absolute", left:"50%", bottom:0, transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center" }}>
              {phase==="struggle" && sinkLv>18 && (
                <div style={{ display:"flex", gap:34, marginBottom:-4, position:"relative", zIndex:2 }}>
                  <div style={{ width:20, height:7, background:"#E8C9A0", borderRadius:4, transform:"rotate(-38deg) translateY(3px)" }}/>
                  <div style={{ width:20, height:7, background:"#E8C9A0", borderRadius:4, transform:"rotate(38deg) translateY(3px)" }}/>
                </div>
              )}
              <div style={{ width:32, background:"#5B8DD9", height:`${bodyH}px`, borderRadius:"6px 6px 0 0", position:"relative", zIndex:2, transition:"height 0.25s ease" }}/>
              <div style={{ position:"absolute", bottom:`${bodyH-1}px`, zIndex:3 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"#E8C9A0", border:"2px solid #D4A87A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{faceEmoji}</div>
              </div>
              <div style={{ width:46, height:`${sinkLv*0.85}px`, background:"linear-gradient(180deg,rgba(156,123,82,0.85),rgba(107,78,42,1))", borderRadius:"0 0 8px 8px", transition:"height 0.25s ease" }}/>
            </div>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"28%", background:"linear-gradient(180deg,transparent,#6B4E2A)" }}/>
          </div>

          <div style={{ padding:"0 22px 28px", display:"flex", flexDirection:"column", gap:10 }}>
            {phase==="struggle" && (
              <>
                <Btn onClick={doStruggle} variant="peach">💪 발버둥치기!</Btn>
                <Btn onClick={() => { setSinkLv(l => Math.max(l,38)); setPhase("surrender"); }} variant="ghost">그냥 가만히 있어보기...</Btn>
              </>
            )}
            {phase==="surrender" && showMsg && (
              <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ background:S.sageSoft, borderRadius:14, padding:"15px 17px", border:`1px solid ${S.sage}38` }}>
                  <p style={{ fontSize:14, color:S.text, lineHeight:1.85, fontFamily:"'Gowun Dodum', sans-serif" }}>💡 <strong>보셨나요?</strong><br/>발버둥칠수록 더 깊이 빠지고, 가만히 있으니 조금씩 안정되었죠. 우리 마음속 고통도 똑같이 작동합니다.</p>
                </div>
                <Btn onClick={onNext} variant="primary">이어서 → 수도꼭지 비유</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── S1-3: 수도꼭지 비유 ──────────────────────────────────────────
const S1Faucet = ({ onNext }) => {
  const [open, setOpen]       = useState(false);
  const [level, setLevel]     = useState(0);
  const [tries, setTries]     = useState(0);
  const [revealed, setRevealed] = useState(false);
  const tmRef = useRef(null);

  useEffect(() => {
    if (open) { tmRef.current = setInterval(() => setLevel(l => Math.min(l+2.8,100)), 55); }
    else       { clearInterval(tmRef.current); }
    return () => clearInterval(tmRef.current);
  }, [open]);

  const tryClose = () => {
    const next = tries + 1;
    setTries(next);
    setOpen(false);
    setTimeout(() => setOpen(true), 1400);
    if (next >= 3) setRevealed(true);
  };

  return (
    <div style={{ minHeight:"100vh", width:"100%", background:S.bg, display:"flex", flexDirection:"column" }}>
      <SessProgress cur={3} total={5}/>
      <div style={{ flex:1, padding:"24px 24px 28px", display:"flex", flexDirection:"column" }}>
        <div style={{ marginBottom:18 }}>
          <p style={{ fontSize:11, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:5, letterSpacing:"0.05em" }}>🚰 비유 체험</p>
          <h2 style={{ fontSize:21, fontWeight:700, color:S.text, fontFamily:"'Noto Serif KR', serif", lineHeight:1.4 }}>수도꼭지를<br/>잠그려 해보세요</h2>
        </div>

        {/* 시각화 */}
        <div style={{ background:"linear-gradient(180deg,#E8F4F8,#D0E8F0)", borderRadius:20, padding:"20px", marginBottom:16, border:"1px solid #B8D8E8" }}>
          <div style={{ textAlign:"center", marginBottom:10 }}>
            <div onClick={() => { if (!open) return; setOpen(false); setTries(t=>t+1); if(tries+1>=3) setRevealed(true); setTimeout(()=>setOpen(true),1400); }}
              style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", cursor:"pointer", gap:4 }}>
              <div style={{ fontSize:46, transition:"transform 0.3s", transform: open?"rotate(0deg)":"rotate(-18deg)" }}>🚰</div>
              <span style={{ fontSize:11, fontFamily:"'Gowun Dodum', sans-serif", color: open?"#3A8A82":"#888" }}>
                {open ? "물이 흐르는 중..." : "잠김"}
              </span>
            </div>
            {open && (
              <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:6 }}>
                {[0,0.22,0.44].map((d,i) => (
                  <div key={i} style={{ width:6, height:10, borderRadius:"50% 50% 50% 50%/40% 40% 60% 60%", background:"#5BA8C4", animation:`particleFall 0.85s ease-in infinite`, animationDelay:`${d}s` }}/>
                ))}
              </div>
            )}
          </div>
          <div style={{ width:"78%", margin:"0 auto", background:"rgba(255,255,255,0.48)", borderRadius:"4px 4px 12px 12px", border:"2px solid #A8C8D8", height:90, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${level}%`, background:"linear-gradient(180deg,#7BC4D8AA,#5BA8C4CC)", transition:"height 0.12s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {level>14 && <span style={{ fontSize:11, color:"#fff", fontFamily:"'Gowun Dodum', sans-serif", fontWeight:700 }}>{Math.round(level)}%</span>}
            </div>
          </div>
          <p style={{ fontSize:11, color:"#888", textAlign:"center", marginTop:8, fontFamily:"'Gowun Dodum', sans-serif" }}>수도꼭지를 터치해서 잠가보세요</p>
        </div>

        <div style={{ background:S.cream, borderRadius:16, padding:"18px 20px", border:`1px solid ${S.border}`, flex:1, marginBottom:18 }}>
          {!revealed ? (
            <>
              <p style={{ fontSize:14, color:S.text, lineHeight:1.9, fontFamily:"'Gowun Dodum', sans-serif", marginBottom: tries>0?12:0 }}>
                수도꼭지를 잠그면 잠깐 멈추지만, 곧 다시 열립니다. 불쾌한 감정을 억누르거나 피하려 할 때도 이와 같아요.
              </p>
              {tries > 0 && <div className="fade-in" style={{ background:S.peachSoft, borderRadius:10, padding:"10px 14px", border:`1px solid ${S.peach}28` }}>
                <p style={{ fontSize:13, color:S.peach, fontFamily:"'Gowun Dodum', sans-serif" }}>{tries}번 잠그셨네요. 계속할수록 더 지치지 않나요?</p>
              </div>}
            </>
          ) : (
            <div className="fade-up">
              <p style={{ fontSize:15, fontWeight:700, color:S.teal, fontFamily:"'Noto Serif KR', serif", marginBottom:10 }}>💡 통제는 해결책이 아니에요</p>
              <p style={{ fontSize:14, color:S.text, lineHeight:1.9, fontFamily:"'Gowun Dodum', sans-serif" }}>
                감정을 통제하려는 노력 자체가 당신의 에너지를 소모하고 있어요. ACT에서는 이를 <strong>"통제 의제"</strong>라고 부릅니다.
              </p>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          {!revealed && <Btn onClick={tryClose} variant="secondary">수도꼭지 잠그기 ({tries}/3)</Btn>}
          {revealed  && <Btn onClick={onNext} variant="primary">경험 일지 작성 →</Btn>}
        </div>
      </div>
    </div>
  );
};

// ── S1-4: 경험 일지 ──────────────────────────────────────────────
const S1Diary = ({ onNext }) => {
  const [emotion,  setEmotion]  = useState("");
  const [intensity,setIntensity]= useState(50);
  const [location, setLocation] = useState("");
  const [thought,  setThought]  = useState("");
  const [saved,    setSaved]    = useState(false);

  const ok = emotion && location && thought.trim().length > 4;

  const handleSave = () => { setSaved(true); setTimeout(onNext, 1700); };

  return (
    <div style={{ minHeight:"100vh", width:"100%", background:S.bg, display:"flex", flexDirection:"column" }}>
      <SessProgress cur={4} total={5}/>
      <div style={{ flex:1, padding:"24px 24px 28px", overflowY:"auto" }}>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:11, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:5 }}>📓 경험 일지</p>
          <h2 style={{ fontSize:21, fontWeight:700, color:S.text, fontFamily:"'Noto Serif KR', serif", lineHeight:1.4 }}>지금 내 안에 있는<br/>것에 이름을 붙여봐요</h2>
          <p style={{ fontSize:13, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", marginTop:8, lineHeight:1.7 }}>판단하지 말고, 있는 그대로 관찰해보세요.</p>
        </div>

        {/* 감정 선택 */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:700, color:S.text, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:9 }}>지금 느끼는 감정은?</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["슬픔","불안","무기력","공허함","외로움","자기혐오","분노","두려움"].map(e => (
              <button key={e} onClick={() => setEmotion(e)} style={{ background: emotion===e?S.teal:S.cream, color: emotion===e?"#fff":S.text, border:`1.5px solid ${emotion===e?S.teal:S.border}`, borderRadius:30, padding:"8px 16px", fontSize:13, cursor:"pointer", fontFamily:"'Gowun Dodum', sans-serif", transition:"all 0.18s" }}>{e}</button>
            ))}
          </div>
        </div>

        {/* 강도 */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <p style={{ fontSize:13, fontWeight:700, color:S.text, fontFamily:"'Gowun Dodum', sans-serif" }}>강도는?</p>
            <span style={{ fontSize:17, fontWeight:800, color:S.teal, fontFamily:"'Noto Serif KR', serif" }}>{intensity}</span>
          </div>
          <div style={{ position:"relative", height:38, display:"flex", alignItems:"center" }}>
            <div style={{ position:"absolute", width:"100%", height:5, background:S.border, borderRadius:8 }}>
              <div style={{ height:"100%", width:`${intensity}%`, background:`linear-gradient(90deg,${S.tealSoft},${S.teal})`, borderRadius:8 }}/>
            </div>
            <input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(+e.target.value)} style={{ position:"absolute", width:"100%", opacity:0, height:38, cursor:"pointer" }}/>
            <div style={{ position:"absolute", left:`calc(${intensity}% - 11px)`, width:22, height:22, borderRadius:"50%", background:"#fff", border:`2.5px solid ${S.teal}`, boxShadow:`0 2px 8px ${S.teal}40`, pointerEvents:"none", transition:"left 0.05s" }}/>
          </div>
        </div>

        {/* 신체 위치 */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:700, color:S.text, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:9 }}>몸의 어느 부분에서 느껴지나요?</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["가슴","배","목","머리","어깨","온몸"].map(b => (
              <button key={b} onClick={() => setLocation(b)} style={{ background: location===b?S.peach:S.cream, color: location===b?"#fff":S.text, border:`1.5px solid ${location===b?S.peach:S.border}`, borderRadius:30, padding:"8px 16px", fontSize:13, cursor:"pointer", fontFamily:"'Gowun Dodum', sans-serif", transition:"all 0.18s" }}>{b}</button>
            ))}
          </div>
        </div>

        {/* 생각 */}
        <div style={{ marginBottom:22 }}>
          <p style={{ fontSize:13, fontWeight:700, color:S.text, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:9 }}>지금 머릿속에 오가는 생각은?</p>
          <textarea value={thought} onChange={e => setThought(e.target.value)} placeholder="판단 없이, 있는 그대로 적어보세요..."
            style={{ width:"100%", minHeight:96, background:S.cream, border:`1.5px solid ${thought?S.teal+"55":S.border}`, borderRadius:13, padding:"13px 15px", fontSize:14, color:S.text, resize:"none", fontFamily:"'Gowun Dodum', sans-serif", lineHeight:1.8, outline:"none", transition:"border 0.2s" }}/>
        </div>

        {saved
          ? <div className="fade-up" style={{ background:S.sageSoft, borderRadius:13, padding:"15px", textAlign:"center", border:`1px solid ${S.sage}38` }}><p style={{ fontSize:15, color:S.sage, fontWeight:700, fontFamily:"'Gowun Dodum', sans-serif" }}>✅ 잘 기록됐어요. 다음으로 이동합니다...</p></div>
          : <Btn onClick={handleSave} variant="primary" disabled={!ok}>{ok ? "기록 저장하고 다음 →" : "감정, 위치, 생각을 모두 입력해주세요"}</Btn>
        }
      </div>
    </div>
  );
};

// ── S1-5: 괴로움 너머 + 완료 ─────────────────────────────────────
const S1Beyond = ({ onComplete }) => {
  const [answers, setAnswers] = useState({ who:"", what:"", feel:"" });
  const [phase, setPhase]     = useState("q"); // q | reflect | done

  const qs = [
    { key:"who",  label:"괴로움이 사라진다면, 누구와 함께 있고 싶나요?", ph:"예: 오랜 친구, 가족과 함께..." },
    { key:"what", label:"무엇을 하고 싶나요?",                             ph:"예: 오래 걷기, 좋아하는 음악 듣기..." },
    { key:"feel", label:"어떤 느낌을 경험하고 싶나요?",                   ph:"예: 가볍고 자유로운 느낌, 따뜻함..." },
  ];
  const allFilled = Object.values(answers).every(v => v.trim().length > 0);

  return (
    <div style={{ minHeight:"100vh", width:"100%", background:S.bg, display:"flex", flexDirection:"column" }}>
      <SessProgress cur={5} total={5}/>
      <div style={{ flex:1, padding:"24px 24px 28px", display:"flex", flexDirection:"column" }}>

        {phase === "q" && (
          <>
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:11, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:5 }}>🌱 가치 탐색</p>
              <h2 style={{ fontSize:21, fontWeight:700, color:S.text, fontFamily:"'Noto Serif KR', serif", lineHeight:1.4 }}>괴로움이<br/>사라진다면?</h2>
              <p style={{ fontSize:13, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", marginTop:8, lineHeight:1.7 }}>지금의 고통이 없어진다면 어떤 삶을 살고 싶나요?</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14, flex:1 }}>
              {qs.map(q => (
                <div key={q.key}>
                  <p style={{ fontSize:13, fontWeight:700, color:S.text, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:7 }}>{q.label}</p>
                  <textarea value={answers[q.key]} onChange={e => setAnswers(a => ({ ...a, [q.key]:e.target.value }))} placeholder={q.ph} rows={2}
                    style={{ width:"100%", background:S.cream, border:`1.5px solid ${answers[q.key]?S.gold+"70":S.border}`, borderRadius:12, padding:"12px 14px", fontSize:14, color:S.text, resize:"none", fontFamily:"'Gowun Dodum', sans-serif", lineHeight:1.7, outline:"none", transition:"border 0.2s" }}/>
                </div>
              ))}
            </div>
            <Btn onClick={() => setPhase("reflect")} variant="primary" disabled={!allFilled} style={{ marginTop:20 }}>
              {allFilled ? "내 가치 확인하기 →" : "세 가지를 모두 적어주세요"}
            </Btn>
          </>
        )}

        {phase === "reflect" && (
          <div className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column" }}>
            <div style={{ background:S.goldSoft, borderRadius:20, padding:"22px 20px", flex:1, marginBottom:18, border:`1px solid ${S.gold}28` }}>
              <p style={{ fontSize:13, color:S.gold, fontWeight:700, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:16 }}>🌟 당신이 원하는 것</p>
              {[{ label:"함께 있고 싶은 사람", v:answers.who, emoji:"🤝" },{ label:"하고 싶은 것", v:answers.what, emoji:"✨" },{ label:"경험하고 싶은 느낌", v:answers.feel, emoji:"💛" }].map(item => (
                <div key={item.label} style={{ display:"flex", gap:11, alignItems:"flex-start", padding:"12px 0", borderBottom:`1px solid ${S.gold}18` }}>
                  <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{item.emoji}</span>
                  <div>
                    <p style={{ fontSize:11, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", marginBottom:3 }}>{item.label}</p>
                    <p style={{ fontSize:15, color:S.text, fontFamily:"'Noto Serif KR', serif", fontWeight:600 }}>{item.v}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:16, background:"rgba(255,255,255,0.55)", borderRadius:11, padding:"13px 15px" }}>
                <p style={{ fontSize:14, color:S.text, lineHeight:1.85, fontFamily:"'Gowun Dodum', sans-serif" }}>이것들이 바로 당신의 <strong>가치</strong>가 향하는 방향이에요. 앞으로의 여정에서 이 나침반을 기억해두세요.</p>
              </div>
            </div>
            <Btn onClick={() => setPhase("done")} variant="peach">1회기 완료하기 🎉</Btn>
          </div>
        )}

        {phase === "done" && (
          <div className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
            <div style={{ fontSize:60, marginBottom:18, animation:"pulse 2s ease-in-out infinite" }}>🏔️</div>
            <h2 style={{ fontSize:26, fontWeight:700, color:S.text, fontFamily:"'Noto Serif KR', serif", marginBottom:10 }}>1회기 완료!</h2>
            <p style={{ fontSize:14, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif", lineHeight:1.85, marginBottom:6 }}>오늘 배운 것을 기억해요.</p>
            <div style={{ background:S.cream, borderRadius:18, padding:"20px 22px", width:"100%", margin:"14px 0 26px", border:`1px solid ${S.border}` }}>
              {[["🏜️","발버둥칠수록 더 깊이 빠진다"],["🚰","억누를수록 더 솟아오른다"],["📓","이름 붙이면 덜 두렵다"],["🌱","고통 너머에 원하는 삶이 있다"]].map(([e,t],i,arr) => (
                <div key={t} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i<arr.length-1?`1px solid ${S.border}`:"none" }}>
                  <span style={{ fontSize:17 }}>{e}</span>
                  <span style={{ fontSize:14, color:S.text, fontFamily:"'Gowun Dodum', sans-serif" }}>{t}</span>
                </div>
              ))}
            </div>
            <Btn onClick={onComplete} variant="navy">홈으로 돌아가기</Btn>
            <p style={{ marginTop:11, fontSize:12, color:S.muted, fontFamily:"'Gowun Dodum', sans-serif" }}>다음 활동은 내일 열립니다 🌙</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ▌ SESSION 1 — 메인 컨트롤러
// ════════════════════════════════════════════════════════════════
const Session1 = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const next = () => setStep(s => s + 1);
  const steps = [
    <S1Intro      key="i" onNext={next}/>,
    <S1Normality  key="n" onNext={next}/>,
    <S1Quicksand  key="q" onNext={next}/>,
    <S1Faucet     key="f" onNext={next}/>,
    <S1Diary      key="d" onNext={next}/>,
    <S1Beyond     key="b" onComplete={onComplete}/>,
  ];
  return <div style={{ maxWidth:420, margin:"0 auto", width:"100%", overflowX:"hidden" }}>{steps[step]}</div>;
};

// ════════════════════════════════════════════════════════════════
// ▌ 하단 탭 바
// ════════════════════════════════════════════════════════════════
const TabBar = ({ active, onChange }) => (
  <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(18px)", borderTop:`1px solid ${A.border}`, display:"flex", zIndex:60 }}>
    {[["home","타임라인"],["journal","마음일지"],["travel","마음여행"],["profile","마이페이지"]].map(([id,label]) => (
      <button key={id} onClick={() => onChange(id)} style={{ flex:1, padding:"11px 0", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
        <div style={{ width:42, height:30, borderRadius:10, background: active===id?A.tealLt:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}>
          <Icon name={id} size={20} color={active===id?A.teal:A.muted}/>
        </div>
        <span style={{ fontSize:10, fontWeight: active===id?700:400, color: active===id?A.teal:A.muted, fontFamily:"'Gowun Dodum', sans-serif" }}>{label}</span>
      </button>
    ))}
  </div>
);

// ════════════════════════════════════════════════════════════════
// ▌ 루트 앱
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [tab,          setTab]          = useState("home");
  const [activeSession,setActiveSession]= useState(null);   // null | 1 | 2 | ...
  const [completedIds, setCompletedIds] = useState([]);
  const [currentDay]                   = useState(1);

  const handleStartSession = (id) => setActiveSession(id);

  const handleSessionComplete = (id) => {
    setCompletedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setActiveSession(null);
    setTab("home");
  };

  // 세션 화면이 열려 있으면 탭바 숨기고 세션 렌더
  if (activeSession === 1) {
    return (
      <div style={{ maxWidth:420, margin:"0 auto", width:"100%", fontFamily:"'Gowun Dodum', sans-serif", background:S.bg, minHeight:"100vh", overflowX:"hidden" }}>
        <GlobalStyles/>
        <Session1 onComplete={() => handleSessionComplete(1)}/>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:420, margin:"0 auto", fontFamily:"'Gowun Dodum', sans-serif", background:A.bg, minHeight:"100vh" }}>
      <GlobalStyles/>
      <div style={{ overflowY:"auto", paddingBottom:80 }}>
        {tab === "home"    && <HomeScreen    completedIds={completedIds} currentDay={currentDay} onStartSession={handleStartSession}/>}
        {tab === "journal" && <JournalScreen/>}
        {tab === "travel"  && <TravelScreen  completedIds={completedIds} onStartSession={handleStartSession}/>}
        {tab === "profile" && <ProfileScreen completedIds={completedIds} currentDay={currentDay}/>}
      </div>
      <TabBar active={tab} onChange={setTab}/>
    </div>
  );
}
