import { useState, useCallback } from "react";

// ─── Design tokens ────────────────────────────────────────────
const T = {
  bg:"#0A0C10", bgCard:"#0F1218", bgElevated:"#161B24", bgHover:"#1C2333",
  border:"#1E2840", borderLight:"#2A3650",
  accent:"#3B82F6", accentDim:"#1D3461", accentText:"#93C5FD",
  green:"#10B981", greenDim:"#064E3B", greenText:"#6EE7B7",
  amber:"#F59E0B", amberDim:"#451A03", amberText:"#FCD34D",
  red:"#EF4444", redDim:"#450A0A", redText:"#FCA5A5",
  text:"#F1F5F9", textMuted:"#64748B", textSub:"#94A3B8",
};

// ─── Data ─────────────────────────────────────────────────────
const FLIGHTS_DATA = [
  { id:"HY 602", from:"TAS", to:"IST", dep:"15 июн 08:45", arr:"11:20", duration:"5ч 35м", aircraft:"A321", bcFree:2,  bcTotal:16, bids:28, topBid:620, revenue:1180,  status:"active",   haul:"medium" },
  { id:"HY 814", from:"TAS", to:"DXB", dep:"15 июн 14:30", arr:"17:15", duration:"4ч 45м", aircraft:"B787", bcFree:8,  bcTotal:24, bids:11, topBid:480, revenue:3840,  status:"active",   haul:"medium" },
  { id:"HY 233", from:"TAS", to:"MOW", dep:"15 июн 11:15", arr:"13:30", duration:"3ч 15м", aircraft:"A320", bcFree:0,  bcTotal:8,  bids:43, topBid:390, revenue:0,     status:"sold",     haul:"short"  },
  { id:"HY 177", from:"TAS", to:"FRA", dep:"16 июн 06:00", arr:"09:45", duration:"7ч 45м", aircraft:"B767", bcFree:14, bcTotal:20, bids:5,  topBid:550, revenue:7700,  status:"upcoming", haul:"long"   },
  { id:"HY 409", from:"TAS", to:"PEK", dep:"16 июн 09:20", arr:"15:50", duration:"5ч 30м", aircraft:"A330", bcFree:6,  bcTotal:18, bids:19, topBid:510, revenue:3060,  status:"active",   haul:"medium" },
  { id:"HY 551", from:"TAS", to:"ICN", dep:"16 июн 13:00", arr:"22:15", duration:"6ч 15м", aircraft:"B787", bcFree:3,  bcTotal:20, bids:31, topBid:540, revenue:1620,  status:"active",   haul:"long"   },
  { id:"HY 088", from:"TAS", to:"LHR", dep:"17 июн 00:30", arr:"05:20", duration:"8ч 50м", aircraft:"B767", bcFree:10, bcTotal:16, bids:2,  topBid:600, revenue:6000,  status:"upcoming", haul:"ultra"  },
  { id:"HY 312", from:"TAS", to:"ALA", dep:"15 июн 16:45", arr:"17:35", duration:"1ч 05м", aircraft:"A319", bcFree:4,  bcTotal:8,  bids:7,  topBid:95,  revenue:380,   status:"active",   haul:"ultra-short" },
];

const INITIAL_BIDS = [
  { id:1,  name:"Иванов А.П.",  tier:"Platinum", bid:620, mult:1.10, channel:"Email", time:"09:14", state:"pending" },
  { id:2,  name:"Ли Вэй",      tier:"Gold",     bid:520, mult:1.05, channel:"App",   time:"13:07", state:"pending" },
  { id:3,  name:"Петрова М.С.", tier:"Silver",   bid:490, mult:1.03, channel:"Email", time:"10:21", state:"pending" },
  { id:4,  name:"Smith J.",     tier:"Standard", bid:580, mult:1.00, channel:"MMB",   time:"11:32", state:"pending" },
  { id:5,  name:"Karimov B.",   tier:"Platinum", bid:400, mult:1.10, channel:"Web",   time:"08:55", state:"pending" },
  { id:6,  name:"Ahmadov F.",   tier:"Standard", bid:470, mult:1.00, channel:"Email", time:"14:45", state:"pending" },
  { id:7,  name:"Brown T.",     tier:"Gold",     bid:380, mult:1.05, channel:"MMB",   time:"07:30", state:"pending" },
  { id:8,  name:"Назаров О.",   tier:"Standard", bid:310, mult:1.00, channel:"Web",   time:"16:02", state:"pending" },
  { id:9,  name:"Юсупова Д.",   tier:"Silver",   bid:345, mult:1.03, channel:"Email", time:"15:18", state:"pending" },
  { id:10, name:"Kim S.",       tier:"Gold",     bid:430, mult:1.05, channel:"App",   time:"12:00", state:"pending" },
];

const DIST_DATA = [
  { range:"$500–750", count:7,  pct:25, color:T.accent  },
  { range:"$400–499", count:10, pct:36, color:"#60A5FA" },
  { range:"$300–399", count:8,  pct:29, color:"#93C5FD" },
  { range:"$262–299", count:3,  pct:10, color:"#BFDBFE" },
];
const EXIT_DATA = [
  { range:"$60–85", count:9, pct:64, color:T.green   },
  { range:"$32–59", count:5, pct:36, color:"#34D399" },
];
const SEAT_MAP_BC = [
  [{ id:"1A",taken:true  },{ id:"1C",taken:true  },null,{ id:"1D",taken:true  },{ id:"1F",taken:true  }],
  [{ id:"2A",taken:true  },{ id:"2C",taken:true  },null,{ id:"2D",taken:true  },{ id:"2F",taken:true  }],
  [{ id:"3A",taken:true  },{ id:"3C",taken:true  },null,{ id:"3D",taken:true  },{ id:"3F",taken:true  }],
  [{ id:"4A",taken:false,bid:true },{ id:"4C",taken:true },null,{ id:"4D",taken:true },{ id:"4F",taken:false,bid:true }],
];

const DEFAULT_RULES = {
  inviteDaysBefore:14, chaserHoursBefore:48, closureHoursBefore:4,
  autoFulfillment:true, requirePurchased:true, blindBids:true, maxUpgradesPerFlight:0,
  multiplierPlatinum:10, multiplierGold:5, multiplierSilver:3,
  minBcUltraShort:93, minBcShort:118, minBcMedium:262, minBcLong:500, minBcUltraLong:569,
  minExitShort:8, minExitMedium:32, minExitLong:35,
  minSeatBlockShort:8, minSeatBlockMedium:32, minSeatBlockLong:35,
  channels:{ email:true, mmb:true, app:true, web:true, webcheckin:true, pushNotif:true },
  paymentMethods:{ visa:true, mastercard:true, amex:true, jcb:false, diners:false },
  use3ds:false, continuousPricing:true, crossAirlineUpgrades:false,
  payWithPoints:false, seatBlocker:true,
};

// ─── Helpers ──────────────────────────────────────────────────
const weighted = b => Math.round(b.bid * b.mult);

const TIER_META = {
  Platinum:{ color:T.amber,    bg:T.amberDim,  label:"Platinum", mult:"+10%" },
  Gold:    { color:T.accent,   bg:T.accentDim, label:"Gold",     mult:"+5%"  },
  Silver:  { color:T.textSub,  bg:"#1E293B",   label:"Silver",   mult:"+3%"  },
  Standard:{ color:T.textMuted,bg:"#111827",   label:"Standard", mult:"—"    },
};
const STATE_META = {
  pending: { label:"Ожидает",   color:T.textMuted, bg:"#1E293B"  },
  approved:{ label:"Принята",   color:T.greenText, bg:T.greenDim },
  rejected:{ label:"Отклонена", color:T.redText,   bg:T.redDim   },
};
const STATUS_META = {
  active:  { label:"Активен",  color:T.greenText, bg:T.greenDim  },
  sold:    { label:"Нет мест", color:T.redText,   bg:T.redDim    },
  upcoming:{ label:"Скоро",    color:T.amberText, bg:T.amberDim  },
};
const HAUL_LABELS = {
  "ultra-short":"Ультракороткий (<1.5ч)", short:"Короткий (1.5–3ч)",
  medium:"Средний (3–5ч)", long:"Длинный (5–8ч)", ultra:"Ультрадальний (8ч+)",
};
const CH_ICONS = { Email:"✉", App:"◉", MMB:"⊞", Web:"◈" };

// ─── UI Primitives ────────────────────────────────────────────
function Pill({ children, color, bg, size=11 }) {
  return <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:size, fontWeight:600, letterSpacing:.3, color, background:bg, whiteSpace:"nowrap" }}>{children}</span>;
}
function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{ background:T.bgElevated, border:`0.5px solid ${T.border}`, borderRadius:10, padding:"16px 18px" }}>
      <div style={{ fontSize:10, color:T.textMuted, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:700, color:accent||T.text, fontFamily:"monospace", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:T.textMuted, marginTop:5 }}>{sub}</div>}
    </div>
  );
}
function SectionLabel({ children }) {
  return <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.textMuted, marginBottom:14 }}>{children}</div>;
}
function BarChart({ data }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {data.map(d => (
        <div key={d.range} style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:68, fontSize:11, color:T.textMuted, flexShrink:0 }}>{d.range}</div>
          <div style={{ flex:1, height:6, background:T.border, borderRadius:3, overflow:"hidden" }}>
            <div style={{ width:`${d.pct}%`, height:"100%", background:d.color, borderRadius:3 }} />
          </div>
          <div style={{ width:18, fontSize:12, fontWeight:600, color:T.text, textAlign:"right" }}>{d.count}</div>
        </div>
      ))}
    </div>
  );
}
function SeatMap() {
  return (
    <div>
      <div style={{ display:"flex", gap:12, marginBottom:10, flexWrap:"wrap" }}>
        {[{c:"#1E3A5F",l:"Занято"},{c:T.accent,l:"Заявка"},{c:T.bgElevated,l:"Свободно",b:T.border}].map(s=>(
          <div key={s.l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:12, height:12, borderRadius:2, background:s.c, border:`0.5px solid ${s.b||s.c}` }} />
            <span style={{ fontSize:11, color:T.textMuted }}>{s.l}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 28px)", gap:4 }}>
        {SEAT_MAP_BC.flatMap((row,ri)=>row.map((seat,ci)=>
          seat===null
            ? <div key={`${ri}-a`} style={{ width:4 }} />
            : <div key={seat.id} style={{ width:28, height:22, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:600, background:seat.bid?T.accent:seat.taken?"#1E3A5F":T.bgElevated, color:seat.bid?"#EFF6FF":seat.taken?"#60A5FA":T.border, border:`0.5px solid ${seat.bid?T.accent:seat.taken?"#2D4E7A":T.border}` }}>{seat.id}</div>
        ))}
      </div>
    </div>
  );
}
function Toggle({ checked, onChange }) {
  return (
    <div onClick={()=>onChange(!checked)} style={{ width:36, height:20, borderRadius:10, cursor:"pointer", flexShrink:0, background:checked?T.accent:T.border, position:"relative", transition:"background .2s" }}>
      <div style={{ position:"absolute", top:3, left:checked?17:3, width:14, height:14, borderRadius:7, background:checked?T.text:"#4B5563", transition:"left .2s" }} />
    </div>
  );
}
function NumInput({ value, onChange, min=0, max=9999, unit="" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <input type="number" value={value} min={min} max={max} onChange={e=>onChange(Number(e.target.value))}
        style={{ width:72, padding:"5px 8px", borderRadius:6, border:`0.5px solid ${T.borderLight}`, background:T.bgElevated, color:T.text, fontSize:13, fontFamily:"monospace", outline:"none" }} />
      {unit && <span style={{ fontSize:11, color:T.textMuted }}>{unit}</span>}
    </div>
  );
}

// ─── PassengerBidUI ───────────────────────────────────────────
function PassengerBidUI() {
  const PASSENGER = { name:"Азиз Каримов", tier:"Platinum", initials:"АК" };
  const PRODUCTS = {
    bc: { label:"Бизнес-класс",         desc:"Раскладное кресло · Лаундж · Питание", icon:"🛋", min:262, max:750, defaultVal:350, color:T.accent,  trackColor:"#3B82F6" },
    ex: { label:"Ряд у аварийного выхода", desc:"+30 см для ног · Ранняя посадка",   icon:"🦵", min:32,  max:85,  defaultVal:46,  color:T.green,   trackColor:"#10B981" },
    sb: { label:"Seat Blocker",          desc:"Заблокировать соседнее место",          icon:"🪑", min:8,   max:45,  defaultVal:18,  color:T.accent,  trackColor:"#3B82F6" },
  };
  const MULT = 1.10;

  const [bids, setBids] = useState({ bc:350, ex:46, sb:18 });
  const [active, setActive] = useState({ bc:true, ex:true, sb:false });
  const [submitted, setSubmitted] = useState(false);

  const calcChance = (prod, val) => {
    const p = PRODUCTS[prod];
    const pct = (val - p.min) / (p.max - p.min);
    return Math.min(Math.max(Math.round(pct * 72 + 8), 5), 90);
  };
  const chanceColor = p => p >= 65 ? T.green : p >= 40 ? T.amber : T.red;

  const base = Object.entries(active).reduce((s,[k,on]) => s + (on ? bids[k] : 0), 0);
  const wt   = Math.round(base * MULT);

  const sliderBg = (prod) => {
    const p = PRODUCTS[prod]; const v = bids[prod];
    const pct = Math.round(((v - p.min) / (p.max - p.min)) * 100);
    return `linear-gradient(to right,${p.trackColor} 0%,${p.trackColor} ${pct}%,${T.border} ${pct}%,${T.border} 100%)`;
  };

  const tierMeta = TIER_META[PASSENGER.tier];

  if (submitted) {
    const prods = Object.entries(active).filter(([,on])=>on).map(([k])=>PRODUCTS[k].label);
    return (
      <div style={{ display:"flex", justifyContent:"center", padding:"24px 16px" }}>
        <div style={{ width:390, background:T.bgCard, borderRadius:16, border:`0.5px solid ${T.border}`, overflow:"hidden" }}>
          {/* Status bar */}
          <div style={{ background:"#080C10", padding:"9px 16px 7px", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:T.textMuted }}>09:41</span>
            <span style={{ fontSize:11, color:T.textMuted }}>uzbekistanairways.uz</span>
            <span style={{ fontSize:11, color:T.textMuted }}>●●●</span>
          </div>
          <div style={{ padding:"32px 20px 24px", textAlign:"center" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:T.greenDim, border:`1.5px solid ${T.green}`, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>✓</div>
            <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:4 }}>Заявка принята!</div>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:22, lineHeight:1.7 }}>Результат будет известен за 4–8 часов до вылета.<br/>Средства спишутся только при подтверждении.</div>
            <div style={{ background:T.bgElevated, border:`0.5px solid ${T.greenDim}`, borderRadius:10, padding:"12px 14px", marginBottom:16, textAlign:"left" }}>
              {[
                ["Рейс", "HY 602 · TAS → IST"],
                ["Апгрейды", prods.join(" + ") || "—"],
                ["Статус оплаты", "Не списано ✓"],
                ["Взвешенная ставка", `$${wt}`],
                ["Уведомление", "Email · App"],
              ].map(([k,v],i,arr) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:i<arr.length-1?`0.5px solid ${T.border}`:"none" }}>
                  <span style={{ fontSize:12, color:T.textMuted }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:k==="Статус оплаты"?T.greenText:k==="Взвешенная ставка"?T.accentText:T.text, fontFamily:"monospace" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:T.textMuted, marginBottom:16, lineHeight:1.6 }}>Изменить или отозвать заявку можно в разделе «Управление бронированием» до закрытия аукциона.</div>
            <button onClick={()=>setSubmitted(false)} style={{ background:"transparent", border:`0.5px solid ${T.border}`, borderRadius:8, padding:"9px 18px", fontSize:13, color:T.textMuted, cursor:"pointer" }}>← Изменить заявку</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", justifyContent:"center", padding:"24px 16px" }}>
      <div style={{ width:390, background:T.bgCard, borderRadius:16, border:`0.5px solid ${T.border}`, overflow:"hidden" }}>
        {/* Status bar */}
        <div style={{ background:"#080C10", padding:"9px 16px 7px", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:T.textMuted }}>09:41</span>
          <span style={{ fontSize:11, color:T.textMuted }}>uzbekistanairways.uz</span>
          <span style={{ fontSize:11, color:T.textMuted }}>●●●</span>
        </div>

        {/* Flight header */}
        <div style={{ background:"#080C10", padding:"12px 16px 14px", borderBottom:`0.5px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
            <div style={{ background:T.accent, borderRadius:4, width:28, height:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:8, fontWeight:800, color:"#EFF6FF", letterSpacing:.5 }}>HY</span>
            </div>
            <span style={{ fontSize:16, fontWeight:700, color:T.text, letterSpacing:-.3 }}>HY 602</span>
            <span style={{ marginLeft:"auto", fontSize:12, color:T.textMuted, fontFamily:"monospace" }}>15 июн · 08:45</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:700, color:T.text }}>TAS</div><div style={{ fontSize:10, color:T.textMuted }}>Ташкент</div></div>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:4 }}><div style={{ flex:1, height:1, background:T.border }} /><span style={{ fontSize:14, color:T.textMuted }}>✈</span><div style={{ flex:1, height:1, background:T.border }} /></div>
            <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:700, color:T.text }}>IST</div><div style={{ fontSize:10, color:T.textMuted }}>Стамбул</div></div>
          </div>
          <div style={{ fontSize:11, color:T.textMuted, marginTop:7 }}>Airbus A321 · 5ч 35м · Эконом → Бизнес</div>
        </div>

        <div style={{ padding:"14px 16px", maxHeight:540, overflowY:"auto" }}>
          {/* Passenger row */}
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14, background:T.bgElevated, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"9px 12px" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:T.amberDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:T.amberText, flexShrink:0 }}>{PASSENGER.initials}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{PASSENGER.name}</div>
              <div style={{ fontSize:10, color:T.textMuted }}>Программа лояльности</div>
            </div>
            <Pill color={tierMeta.color} bg={tierMeta.bg} size={10}>{PASSENGER.tier}</Pill>
          </div>

          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.textMuted, marginBottom:10 }}>Выберите апгрейды</div>

          {/* Product cards */}
          {Object.entries(PRODUCTS).map(([key, prod]) => {
            const on = active[key];
            const val = bids[key];
            const chance = on ? calcChance(key, val) : 0;
            const cc = chanceColor(chance);
            return (
              <div key={key} style={{ background:T.bgElevated, border:`0.5px solid ${on?T.accent:T.border}`, borderRadius:10, padding:"12px 13px", marginBottom:9, opacity:on?1:.55, transition:"opacity .2s, border-color .2s" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:6, background:on?T.accentDim:T.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{prod.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{prod.label}</div>
                      <div style={{ fontSize:10, color:T.textMuted, marginTop:1 }}>{prod.desc}</div>
                    </div>
                  </div>
                  <Toggle checked={on} onChange={v => setActive(a=>({...a,[key]:v}))} />
                </div>

                <div style={{ fontSize:20, fontWeight:700, color:on?T.text:T.textMuted, fontFamily:"monospace", marginBottom:7 }}>
                  ${val} <span style={{ fontSize:12, fontWeight:400, color:T.textMuted }}>USD</span>
                </div>

                <input type="range" min={prod.min} max={prod.max} value={val} step={1} disabled={!on}
                  onChange={e => setBids(b=>({...b,[key]:Number(e.target.value)}))}
                  style={{ width:"100%", height:4, WebkitAppearance:"none", appearance:"none", borderRadius:2, outline:"none", cursor:on?"pointer":"not-allowed", display:"block", marginBottom:5, background:on?sliderBg(key):T.border, opacity:on?1:.5 }} />

                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.textMuted, marginBottom:on&&key!=="sb"?8:0 }}>
                  <span>от ${prod.min}</span><span>до ${prod.max}</span>
                </div>

                {on && key !== "sb" && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:11, color:T.textMuted }}>Шанс принятия</span>
                      <span style={{ fontSize:13, fontWeight:700, color:cc, fontFamily:"monospace" }}>{chance}%</span>
                    </div>
                    <div style={{ height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ width:`${chance}%`, height:"100%", background:cc, borderRadius:2, transition:"width .3s, background .3s" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Divider */}
          <div style={{ height:"0.5px", background:T.border, margin:"12px 0" }} />

          {/* Summary */}
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.textMuted, marginBottom:10 }}>Итого</div>
          <div style={{ background:T.bgElevated, border:`0.5px solid ${T.border}`, borderRadius:10, padding:"11px 13px", marginBottom:11 }}>
            {Object.entries(PRODUCTS).map(([key, prod]) => active[key] && (
              <div key={key} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`0.5px solid ${T.border}` }}>
                <span style={{ fontSize:12, color:T.textMuted }}>{prod.label}</span>
                <span style={{ fontSize:13, fontWeight:600, color:T.text, fontFamily:"monospace" }}>${bids[key]}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 0 3px" }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.text }}>Взвешенная сумма</span>
              <span style={{ fontSize:16, fontWeight:700, color:T.accentText, fontFamily:"monospace" }}>${wt}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, color:T.textMuted }}>× бонус Platinum +10%</span>
              <span style={{ fontSize:11, color:T.textMuted, fontFamily:"monospace" }}>базовая ${base}</span>
            </div>
          </div>

          {/* Info */}
          <div style={{ background:T.accentDim, border:`0.5px solid ${T.accent}`, borderRadius:8, padding:"9px 12px", marginBottom:11, display:"flex", gap:8 }}>
            <span style={{ color:T.accentText, fontSize:13, flexShrink:0, lineHeight:1.5 }}>ℹ</span>
            <div style={{ fontSize:11, color:T.accentText, lineHeight:1.6 }}>Средства <strong style={{ color:"#EFF6FF" }}>не списываются</strong> сразу. Оплата — только при подтверждении апгрейда авиакомпанией.</div>
          </div>

          {/* Submit */}
          <button
            disabled={base === 0}
            onClick={() => setSubmitted(true)}
            style={{ width:"100%", padding:"13px", borderRadius:10, border:"none", fontSize:14, fontWeight:700, cursor:base===0?"not-allowed":"pointer", background:base===0?T.border:T.accent, color:base===0?T.textMuted:"#EFF6FF", letterSpacing:.2, marginBottom:8 }}>
            {base === 0 ? "Выберите хотя бы один апгрейд" : `Подать заявку · $${base}`}
          </button>
          <div style={{ fontSize:10, color:T.textMuted, textAlign:"center", paddingBottom:4 }}>
            Аукцион закрывается через <strong style={{ color:T.amber }}>3ч 20м</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FlightList ───────────────────────────────────────────────
function FlightList({ onSelect }) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [sortCol, setSortCol] = useState("dep");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = col => { if(sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortCol(col); setSortDir("asc"); } };

  const filtered = FLIGHTS_DATA
    .filter(f=>statusF==="all"||f.status===statusF)
    .filter(f=>f.id.toLowerCase().includes(search.toLowerCase())||f.from.includes(search.toUpperCase())||f.to.includes(search.toUpperCase()))
    .sort((a,b)=>{
      const vals={dep:[a.dep,b.dep],bids:[a.bids,b.bids],revenue:[a.revenue,b.revenue],topBid:[a.topBid,b.topBid]};
      const [va,vb]=vals[sortCol]||[a.dep,b.dep];
      return sortDir==="asc"?(va>vb?1:-1):(vb>va?1:-1);
    });

  const totalActive=FLIGHTS_DATA.filter(f=>f.status==="active").length;
  const totalBids=FLIGHTS_DATA.reduce((s,f)=>s+f.bids,0);
  const totalRevenue=FLIGHTS_DATA.reduce((s,f)=>s+f.revenue,0);
  const totalFree=FLIGHTS_DATA.reduce((s,f)=>s+f.bcFree,0);

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <MetricCard label="Активных аукционов" value={String(totalActive)} sub="сегодня" />
        <MetricCard label="Всего заявок" value={String(totalBids)} sub="по всем рейсам" />
        <MetricCard label="Свободных мест BC" value={String(totalFree)} accent={totalFree<10?T.redText:T.greenText} sub="для апгрейда" />
        <MetricCard label="Прогноз выручки" value={`$${Math.round(totalRevenue/1000)}K`} accent={T.greenText} sub="все рейсы" />
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <input placeholder="Поиск: рейс, IATA…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{ padding:"7px 12px", borderRadius:8, border:`0.5px solid ${T.border}`, background:T.bgElevated, color:T.text, fontSize:13, outline:"none", width:200 }} />
        <div style={{ display:"flex", gap:5 }}>
          {[["all","Все"],["active","Активные"],["upcoming","Скоро"],["sold","Нет мест"]].map(([k,l])=>(
            <button key={k} onClick={()=>setStatusF(k)} style={{ padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:`0.5px solid ${statusF===k?T.accent:T.border}`, background:statusF===k?T.accentDim:"transparent", color:statusF===k?T.accentText:T.textMuted }}>{l}</button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", fontSize:12, color:T.textMuted }}>{filtered.length} рейсов</div>
      </div>
      <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, tableLayout:"fixed" }}>
            <thead>
              <tr style={{ borderBottom:`0.5px solid ${T.border}` }}>
                {[["dep","Рейс / маршрут","24%"],[null,"Вылет","13%"],[null,"Борт","8%"],["bids","Заявок","9%"],[null,"Мест BC","9%"],["topBid","Топ ставка","10%"],["revenue","Прогноз","10%"],[null,"Статус","9%"],[null,"","8%"]].map(([col,lbl,w])=>(
                  <th key={lbl} onClick={col?()=>handleSort(col):undefined} style={{ width:w, textAlign:"left", padding:"10px 12px", fontSize:10, fontWeight:600, color:col&&sortCol===col?T.accentText:T.textMuted, textTransform:"uppercase", letterSpacing:.8, cursor:col?"pointer":"default", userSelect:"none", background:T.bgElevated }}>
                    {lbl}{col&&sortCol===col?(sortDir==="asc"?" ↑":" ↓"):""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f=>{
                const sm=STATUS_META[f.status]; const fc=f.bcFree===0?T.red:f.bcFree<4?T.amber:T.green;
                return (
                  <tr key={f.id} style={{ borderBottom:`0.5px solid ${T.border}`, cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.background=T.bgHover}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"12px 12px" }}><div style={{ fontWeight:700, fontSize:14, color:T.text, letterSpacing:.3 }}>{f.id}</div><div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}><span style={{ color:T.textSub, fontWeight:600 }}>{f.from}</span><span style={{ margin:"0 4px" }}>→</span><span style={{ color:T.textSub, fontWeight:600 }}>{f.to}</span><span style={{ marginLeft:6 }}>{f.duration}</span></div></td>
                    <td style={{ padding:"12px 12px", color:T.textSub, fontSize:12, fontFamily:"monospace" }}>{f.dep}</td>
                    <td style={{ padding:"12px 12px" }}><span style={{ fontSize:11, color:T.textMuted, background:T.bgElevated, padding:"2px 6px", borderRadius:4, border:`0.5px solid ${T.border}` }}>{f.aircraft}</span></td>
                    <td style={{ padding:"12px 12px", fontWeight:700, fontFamily:"monospace", color:f.bids>20?T.accentText:T.text }}>{f.bids}</td>
                    <td style={{ padding:"12px 12px" }}><span style={{ fontWeight:700, fontFamily:"monospace", color:fc }}>{f.bcFree}</span><span style={{ color:T.textMuted, fontSize:11 }}> / {f.bcTotal}</span></td>
                    <td style={{ padding:"12px 12px", fontWeight:700, fontFamily:"monospace" }}>${f.topBid}</td>
                    <td style={{ padding:"12px 12px", fontWeight:700, fontFamily:"monospace", color:T.greenText }}>{f.revenue>0?`$${f.revenue.toLocaleString()}`:"—"}</td>
                    <td style={{ padding:"12px 12px" }}><Pill color={sm.color} bg={sm.bg}>{sm.label}</Pill></td>
                    <td style={{ padding:"12px 12px" }}><button onClick={()=>onSelect(f.id)} style={{ padding:"5px 10px", fontSize:11, fontWeight:600, borderRadius:6, cursor:"pointer", background:T.accentDim, border:`0.5px solid ${T.accent}`, color:T.accentText }}>Открыть →</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop:10, fontSize:11, color:T.textMuted }}>Кликните «Открыть» для деталей аукциона. Клик по заголовку — сортировка.</div>
    </div>
  );
}

// ─── GlobalRules ──────────────────────────────────────────────
function GlobalRules() {
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [saved, setSaved] = useState(true);
  const [activeSection, setActiveSection] = useState("timing");

  const set = (key, val) => { setRules(r=>({ ...r, [key]:val })); setSaved(false); };
  const setNested = (key, subkey, val) => { setRules(r=>({ ...r, [key]:{ ...r[key], [subkey]:val } })); setSaved(false); };

  const SECTIONS = [
    {id:"timing",l:"Тайминг"},{id:"pricing",l:"Ценообразование"},{id:"loyalty",l:"Лояльность"},
    {id:"channels",l:"Каналы охвата"},{id:"payment",l:"Платежи"},{id:"features",l:"Функции"},
  ];

  const RuleRow = ({ label, desc, children }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`0.5px solid ${T.border}`, gap:20 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:T.text }}>{label}</div>
        {desc && <div style={{ fontSize:11, color:T.textMuted, marginTop:3, lineHeight:1.5 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  );

  const haulCols=[{k:"UltraShort",lbl:"<1.5ч"},{k:"Short",lbl:"1.5–3ч"},{k:"Medium",lbl:"3–5ч"},{k:"Long",lbl:"5–8ч"},{k:"UltraLong",lbl:"8ч+"}];
  const pricingRows=[
    {product:"Бизнес-класс",keys:{UltraShort:"minBcUltraShort",Short:"minBcShort",Medium:"minBcMedium",Long:"minBcLong",UltraLong:"minBcUltraLong"}},
    {product:"Ряды у выхода",keys:{UltraShort:"minExitShort",Short:"minExitShort",Medium:"minExitMedium",Long:"minExitLong",UltraLong:"minExitLong"}},
    {product:"Блок соседнего",keys:{UltraShort:"minSeatBlockShort",Short:"minSeatBlockShort",Medium:"minSeatBlockMedium",Long:"minSeatBlockLong",UltraLong:"minSeatBlockLong"}},
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", gap:16, alignItems:"start" }}>
      <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"12px 14px", borderBottom:`0.5px solid ${T.border}` }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.textMuted }}>Глобальные правила</div>
          <div style={{ fontSize:11, color:T.textMuted, marginTop:4, lineHeight:1.5 }}>Применяются ко всем рейсам по умолчанию</div>
        </div>
        {SECTIONS.map((s,i)=>(
          <button key={s.id} onClick={()=>setActiveSection(s.id)} style={{ display:"block", width:"100%", textAlign:"left", padding:"11px 14px", fontSize:13, fontWeight:activeSection===s.id?600:400, color:activeSection===s.id?T.accent:T.textSub, background:activeSection===s.id?T.accentDim:"transparent", border:"none", cursor:"pointer", borderBottom:i<SECTIONS.length-1?`0.5px solid ${T.border}`:"none" }}>{s.l}</button>
        ))}
        <div style={{ padding:"10px 12px", borderTop:`0.5px solid ${T.border}` }}>
          <button onClick={()=>setSaved(true)} style={{ width:"100%", padding:"8px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", background:saved?T.greenDim:T.accent, border:`0.5px solid ${saved?T.green:T.accent}`, color:saved?T.greenText:"#EFF6FF", transition:"all .2s" }}>
            {saved?"✓ Сохранено":"Сохранить правила"}
          </button>
          {!saved && <div style={{ fontSize:10, color:T.amber, marginTop:5, textAlign:"center" }}>Есть несохранённые изменения</div>}
        </div>
      </div>

      <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, padding:"20px 24px" }}>
        {activeSection==="timing" && (
          <div>
            <SectionLabel>Тайминг аукциона</SectionLabel>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:14, lineHeight:1.6 }}>Управляет жизненным циклом коммуникаций и автоматическими процессами.</div>
            {[["inviteDaysBefore","Первое приглашение (PTE)","За сколько дней отправить первое письмо",1,60,"дн. до вылета"],["chaserHoursBefore","Напоминание (Chaser)","За сколько часов отправить напоминание без заявки",12,168,"ч. до вылета"],["closureHoursBefore","Закрытие аукциона","За сколько часов прекратить приём заявок",1,48,"ч. до вылета"]].map(([k,l,d,min,max,u])=>(
              <RuleRow key={k} label={l} desc={d}><NumInput value={rules[k]} onChange={v=>set(k,v)} min={min} max={max} unit={u} /></RuleRow>
            ))}
            {[["autoFulfillment","Авто-фулфилмент","Автоматически выбирает победителей и обновляет PNR"],["requirePurchased","Только при наличии билета","Ключевой антидилюционный механизм"],["blindBids","Слепые ставки","Пассажиры не видят ставки других участников"]].map(([k,l,d])=>(
              <RuleRow key={k} label={l} desc={d}><Toggle checked={rules[k]} onChange={v=>set(k,v)} /></RuleRow>
            ))}
            <RuleRow label="Макс. апгрейдов на рейс" desc="0 = без ограничений"><NumInput value={rules.maxUpgradesPerFlight} onChange={v=>set("maxUpgradesPerFlight",v)} min={0} max={50} unit="мест (0=∞)" /></RuleRow>
          </div>
        )}
        {activeSection==="pricing" && (
          <div>
            <SectionLabel>Минимальные ставки по типу хола (USD)</SectionLabel>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:14, lineHeight:1.6 }}>Пассажир не сможет предложить сумму ниже указанной.</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr>
                  <th style={{ textAlign:"left", padding:"8px 10px", color:T.textMuted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:.8, borderBottom:`0.5px solid ${T.border}`, background:T.bgElevated }}>Продукт</th>
                  {haulCols.map(c=><th key={c.k} style={{ textAlign:"center", padding:"8px 10px", color:T.textMuted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:.8, borderBottom:`0.5px solid ${T.border}`, background:T.bgElevated }}>{c.lbl}</th>)}
                </tr></thead>
                <tbody>{pricingRows.map(row=>(
                  <tr key={row.product} style={{ borderBottom:`0.5px solid ${T.border}` }}>
                    <td style={{ padding:"9px 10px", fontWeight:600, color:T.text }}>{row.product}</td>
                    {haulCols.map(c=><td key={c.k} style={{ padding:"9px 10px", textAlign:"center" }}><input type="number" value={rules[row.keys[c.k]]} min={0} onChange={e=>set(row.keys[c.k],Number(e.target.value))} style={{ width:58, padding:"4px 6px", borderRadius:5, textAlign:"center", border:`0.5px solid ${T.borderLight}`, background:T.bgElevated, color:T.text, fontSize:12, fontFamily:"monospace", outline:"none" }} /></td>)}
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{ marginTop:16 }}>
              <RuleRow label="Continuous Pricing (AI)" desc="+12% выручки по A/B-тесту"><Toggle checked={rules.continuousPricing} onChange={v=>set("continuousPricing",v)} /></RuleRow>
            </div>
          </div>
        )}
        {activeSection==="loyalty" && (
          <div>
            <SectionLabel>Множители статуса лояльности</SectionLabel>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:14, lineHeight:1.6 }}>Взвешенная = базовая × (1 + множитель%). При равных ставках побеждает более высокий статус.</div>
            {[["multiplierPlatinum","Platinum",T.amber,T.amberDim],["multiplierGold","Gold",T.accent,T.accentDim],["multiplierSilver","Silver",T.textSub,"#1E293B"]].map(([k,tier,c,bg])=>(
              <RuleRow key={k} label={<span style={{ display:"flex", alignItems:"center", gap:8 }}><Pill color={c} bg={bg}>{tier}</Pill><span style={{ fontSize:13, fontWeight:500, color:T.text }}>{tier}</span></span>} desc="">
                <NumInput value={rules[k]} onChange={v=>set(k,v)} min={0} max={50} unit="%" />
              </RuleRow>
            ))}
            <div style={{ marginTop:16, background:T.bgElevated, borderRadius:10, padding:"14px" }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:T.textMuted, marginBottom:10 }}>Предпросмотр: базовая $400</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {[["Standard",1],["Silver",1+rules.multiplierSilver/100],["Gold",1+rules.multiplierGold/100],["Platinum",1+rules.multiplierPlatinum/100]].map(([tier,mult])=>{
                  const tm=TIER_META[tier];
                  return <div key={tier} style={{ background:T.bg, borderRadius:8, padding:"9px 11px", textAlign:"center" }}><Pill color={tm.color} bg={tm.bg} size={10}>{tier}</Pill><div style={{ fontSize:11, color:T.textMuted, margin:"5px 0 2px" }}>$400</div><div style={{ fontSize:16, fontWeight:700, color:T.accentText, fontFamily:"monospace" }}>${Math.round(400*mult)}</div></div>;
                })}
              </div>
            </div>
          </div>
        )}
        {activeSection==="channels" && (
          <div>
            <SectionLabel>Активные каналы охвата</SectionLabel>
            {[["email","ch","Email (PTE + Chaser + Confirm)","30%+ всех заявок. Базовый канал"],["mmb","ch","Manage My Booking","+25% к объёму. Средняя ставка выше на 77%"],["app","ch","Мобильное приложение + Push","+4% к объёму"],["web","ch","Маркетинговая страница","41% выручки партнёра"],["webcheckin","ch","Онлайн-регистрация","+10% к выручке. 55% уникальных посетителей"],["pushNotif","ch","Push-уведомления","Уведомляет о статусе ставки"]].map(([sk,nk,l,d])=>(
              <RuleRow key={sk} label={l} desc={d}><Toggle checked={rules[nk][sk]} onChange={v=>setNested(nk,sk,v)} /></RuleRow>
            ))}
          </div>
        )}
        {activeSection==="payment" && (
          <div>
            <SectionLabel>Методы оплаты</SectionLabel>
            {[["visa","pm","Visa","Поддерживается всеми PSP-партнёрами"],["mastercard","pm","Mastercard","Поддерживается всеми PSP-партнёрами"],["amex","pm","American Express","Более высокий средний чек"],["jcb","pm","JCB","Актуально для маршрутов в Азию"],["diners","pm","Diners Club","Ограниченная поддержка эквайеров"]].map(([sk,nk,l,d])=>(
              <RuleRow key={sk} label={l} desc={d}><Toggle checked={rules[nk][sk]} onChange={v=>setNested(nk,sk,v)} /></RuleRow>
            ))}
            <RuleRow label="3DS аутентификация" desc="Снижает конверсию. Включайте только при обязательном 3DS в регионе"><Toggle checked={rules.use3ds} onChange={v=>set("use3ds",v)} /></RuleRow>
            {rules.use3ds && <div style={{ marginTop:8, background:T.amberDim, border:`0.5px solid ${T.amber}`, borderRadius:8, padding:"10px 13px" }}><div style={{ fontSize:12, fontWeight:600, color:T.amberText, marginBottom:2 }}>⚠ 3DS включён</div><div style={{ fontSize:11, color:T.amber, lineHeight:1.5 }}>Используйте Plusgrade Community MPI.</div></div>}
          </div>
        )}
        {activeSection==="features" && (
          <div>
            <SectionLabel>Дополнительные функции</SectionLabel>
            {[["seatBlocker","Seat Blocker","+10–20% выручки. Блокировка соседнего места"],["payWithPoints","Pay with Points","Оплата баллами лояльности"],["crossAirlineUpgrades","Cross Airline Upgrades","+21% заявок через альянс/кодшер"],["continuousPricing","Continuous Pricing (AI)","+12% выручки по A/B-тесту"],["autoFulfillment","Авто-фулфилмент","Автовыбор победителей без ручного одобрения"],["blindBids","Слепые ставки","Участники не видят предложения других"]].map(([k,l,d])=>(
              <RuleRow key={k} label={l} desc={d}><Toggle checked={rules[k]} onChange={v=>set(k,v)} /></RuleRow>
            ))}
            <div style={{ marginTop:16, background:T.bgElevated, borderRadius:10, padding:"14px" }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:T.textMuted, marginBottom:10 }}>Статус функций</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:7 }}>
                {["seatBlocker","payWithPoints","crossAirlineUpgrades","continuousPricing","autoFulfillment","blindBids"].map(k=>{
                  const labels={seatBlocker:"Seat Blocker",payWithPoints:"Pay with Points",crossAirlineUpgrades:"Cross Airline",continuousPricing:"Continuous Pricing",autoFulfillment:"Авто-фулфилмент",blindBids:"Слепые ставки"};
                  return <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:T.bg, borderRadius:7, padding:"7px 11px" }}><span style={{ fontSize:12, color:T.textSub }}>{labels[k]}</span><Pill color={rules[k]?T.greenText:T.textMuted} bg={rules[k]?T.greenDim:"#1E293B"} size={10}>{rules[k]?"вкл":"выкл"}</Pill></div>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FlightDetail ─────────────────────────────────────────────
function FlightDetail({ flightId, onBack }) {
  const flight = FLIGHTS_DATA.find(f=>f.id===flightId)||FLIGHTS_DATA[0];
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [filter, setFilter] = useState("all");
  const [autoRan, setAutoRan] = useState(false);
  const [sortCol, setSortCol] = useState("weighted");
  const [sortDir, setSortDir] = useState("desc");

  const sorted = [...bids].filter(b=>filter==="all"?true:b.state===filter).sort((a,b2)=>{
    const va=sortCol==="name"?a.name:sortCol==="bid"?a.bid:sortCol==="time"?a.time:weighted(a);
    const vb=sortCol==="name"?b2.name:sortCol==="bid"?b2.bid:sortCol==="time"?b2.time:weighted(b2);
    return sortDir==="desc"?(vb>va?1:-1):(va>vb?1:-1);
  });

  const approve = id => setBids(bs=>bs.map(b=>b.id===id?{...b,state:"approved"}:b));
  const reject  = id => setBids(bs=>bs.map(b=>b.id===id?{...b,state:"rejected"}:b));
  const autoSelect = () => {
    const top=[...bids].filter(b=>b.state==="pending").sort((a,b)=>weighted(b)-weighted(a)).slice(0,flight.bcFree).map(b=>b.id);
    setBids(bs=>bs.map(b=>top.includes(b.id)?{...b,state:"approved"}:b));
    setAutoRan(true);
  };
  const counts={all:bids.length,pending:bids.filter(b=>b.state==="pending").length,approved:bids.filter(b=>b.state==="approved").length,rejected:bids.filter(b=>b.state==="rejected").length};

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
        <button onClick={onBack} style={{ padding:"6px 12px", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer", background:"transparent", border:`0.5px solid ${T.border}`, color:T.textMuted }}>← Все рейсы</button>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20, fontWeight:800 }}>{flight.id}</span>
          <span style={{ fontSize:13, color:T.textSub }}>{flight.from} → {flight.to}</span>
          <Pill color={T.greenText} bg={T.greenDim}>Аукцион открыт</Pill>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          {!autoRan ? <button onClick={autoSelect} style={{ background:T.accent, border:"none", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:600, color:"#EFF6FF", cursor:"pointer" }}>⚡ Авто-отбор</button> : <Pill color={T.greenText} bg={T.greenDim}>✓ Amadeus RES обновлён</Pill>}
        </div>
      </div>
      <div style={{ fontSize:12, color:T.textMuted, marginBottom:18 }}>{flight.dep} — {flight.arr} · {flight.aircraft} · {flight.duration} · {HAUL_LABELS[flight.haul]}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
        <MetricCard label="Мест в BC" value={`${flight.bcFree} / ${flight.bcTotal}`} accent={flight.bcFree<4?T.redText:T.greenText} sub="свободно" />
        <MetricCard label="Заявок на BC" value={String(bids.length)} sub={`${counts.pending} ожидают`} />
        <MetricCard label="Топ ставка" value={`$${flight.topBid}`} accent={T.accentText} sub={`взвеш. $${Math.round(flight.topBid*1.10)}`} />
        <MetricCard label="Прогноз выручки" value={`$${flight.revenue.toLocaleString()}`} accent={T.greenText} sub={`${flight.bcFree} победителя`} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
        <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}><SectionLabel>Карта мест — бизнес-класс</SectionLabel><SeatMap /><div style={{ marginTop:10, fontSize:11, color:T.textMuted }}>{flight.bcFree} свободных · {bids.length} заявок</div></div>
        <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}><SectionLabel>Распределение ставок</SectionLabel><div style={{ fontSize:10, fontWeight:600, color:T.textMuted, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Бизнес-класс</div><BarChart data={DIST_DATA} /><div style={{ height:1, background:T.border, margin:"12px 0" }} /><div style={{ fontSize:10, fontWeight:600, color:T.textMuted, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Ряды у выхода</div><BarChart data={EXIT_DATA} /></div>
      </div>
      <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <SectionLabel>Заявки на бизнес-класс</SectionLabel>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {[["all","Все"],["pending","Ожидают"],["approved","Принятые"],["rejected","Отклонённые"]].map(([k,lbl])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:`0.5px solid ${filter===k?T.accent:T.border}`, background:filter===k?T.accentDim:"transparent", color:filter===k?T.accentText:T.textMuted }}>{lbl} ({counts[k]})</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, tableLayout:"fixed" }}>
            <thead><tr>
              {[["name","Пассажир","22%"],["tier","Статус","11%"],["bid","Ставка","10%"],["weighted","Взвешенная","11%"],["channel","Канал","9%"],["time","Время","9%"],[null,"Статус","11%"],[null,"Действие","17%"]].map(([col,lbl,w])=>(
                <th key={lbl} onClick={col?()=>{if(sortCol===col)setSortDir(d=>d==="desc"?"asc":"desc");else{setSortCol(col);setSortDir("desc");}}:undefined} style={{ width:w, textAlign:"left", padding:"7px 8px", fontSize:10, fontWeight:600, color:col&&sortCol===col?T.accentText:T.textMuted, textTransform:"uppercase", letterSpacing:.8, borderBottom:`0.5px solid ${T.border}`, cursor:col?"pointer":"default", userSelect:"none" }}>
                  {lbl}{col&&sortCol===col?(sortDir==="desc"?" ↓":" ↑"):""}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {sorted.map((b,i)=>{
                const w=weighted(b); const isTop=b.state==="pending"&&i<flight.bcFree&&filter==="all";
                const tm=TIER_META[b.tier]; const sm=STATE_META[b.state];
                return (
                  <tr key={b.id} style={{ background:isTop?"rgba(59,130,246,.06)":"transparent" }}>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}` }}><div style={{ display:"flex", alignItems:"center", gap:7 }}>{isTop&&<div style={{ width:3, height:28, background:T.accent, borderRadius:2, flexShrink:0 }} />}<div><div style={{ fontWeight:600, color:T.text }}>{b.name}</div>{isTop&&<div style={{ fontSize:10, color:T.accentText }}>→ кандидат</div>}</div></div></td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}` }}><Pill color={tm.color} bg={tm.bg} size={10}>{tm.label}</Pill><div style={{ fontSize:10, color:T.textMuted, marginTop:2 }}>{tm.mult}</div></td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}`, fontWeight:700, fontFamily:"monospace" }}>${b.bid}</td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}`, fontWeight:700, color:T.accentText, fontFamily:"monospace" }}>${w}</td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}`, color:T.textMuted, fontSize:12 }}>{CH_ICONS[b.channel]} {b.channel}</td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}`, color:T.textMuted, fontFamily:"monospace", fontSize:12 }}>{b.time}</td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}` }}><Pill color={sm.color} bg={sm.bg} size={10}>{sm.label}</Pill></td>
                    <td style={{ padding:"9px 8px", borderBottom:`0.5px solid ${T.border}` }}>
                      {b.state==="pending"&&<div style={{ display:"flex", gap:5 }}><button onClick={()=>approve(b.id)} style={{ padding:"4px 9px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", background:T.greenDim, border:`0.5px solid ${T.green}`, color:T.greenText }}>✓ Принять</button><button onClick={()=>reject(b.id)} style={{ padding:"4px 8px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", background:T.redDim, border:`0.5px solid ${T.red}`, color:T.redText }}>✕</button></div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:10, fontSize:11, color:T.textMuted }}>Взвешенная = базовая × множитель статуса. Кликните заголовок для сортировки.</div>
      </div>
    </div>
  );
}

// ─── EmailPreview ─────────────────────────────────────────────
function EmailPreview({ type }) {
  const cfgs={
    pte:{subject:"Азиз, предложите свою цену на бизнес-класс",to:"aziz.karimov@mail.uz",tag:"PTE · за 7–14 дней",tagC:T.accent,tagBg:T.accentDim,hBg:"#0F1F3D",hLine:T.accent,title:"Улучшите перелёт до бизнес-класса",body:"Ваш рейс HY 602 квалифицирован для участия в аукционе. Предложите цену — средства спишутся только при подтверждении.",ctaLabel:"Предложить цену →",ctaBg:T.accent,offers:[{name:"Бизнес-класс",desc:"Раскладное кресло · Лаундж",from:"$262"},{name:"Ряд у выхода",desc:"+30 см для ног",from:"$32"}],footer:"Ставка не гарантирует апгрейд. Оплата только при подтверждении."},
    chaser:{subject:"Последний шанс: мест в бизнес-классе почти нет",to:"j.smith@company.com",tag:"Chaser · за 48–72 часа",tagC:T.amber,tagBg:T.amberDim,hBg:"#1C1200",hLine:T.amber,title:"Аукцион закрывается через 14 часов",body:"Вы не подавали заявку. Осталось ограниченное число мест. Деньги не списываются без подтверждённого апгрейда.",ctaLabel:"Участвовать — осталось мало мест →",ctaBg:T.amber,urgency:true,footer:"Ставка не гарантирует апгрейд. Оплата только при подтверждении."},
    win:{subject:"Поздравляем — вы летите бизнес-классом!",to:"aziz.karimov@mail.uz",tag:"Confirm · за 4–8 часов",tagC:T.green,tagBg:T.greenDim,hBg:"#031C13",hLine:T.green,title:"Ваш апгрейд подтверждён!",body:"Добро пожаловать в бизнес-класс, Азиз! Место 4A забронировано, $580 списано. Приоритетная посадка и лаундж уже доступны.",ctaLabel:"Посмотреть посадочный →",ctaBg:T.green,booking:{Рейс:"HY 602",Маршрут:"Ташкент → Стамбул",Место:"4A · Бизнес-класс",Вылет:"15 июня · 08:45",Списано:"$580"},footer:"Uzbekistan Airways · hy-support@uzbekistanairways.com"},
  };
  const c=cfgs[type];
  const metaRows=type==="pte"?[["Открываемость","~35%"],["Конверсия","18.4%"],["Доля заявок","30%+"],["Отписок","0.4%"]]:type==="chaser"?[["Открываемость","~42%"],["Конверсия","11.2%"],["Срочность","высокая"],["A/B тест","2 варианта"]]:[["Доставлено","100%"],["Открыто","~88%"],["Жалоб","0"],["NPS impact","+12"]];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 330px", gap:20, alignItems:"start" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
          <SectionLabel>Метаданные</SectionLabel>
          {[["Тип",<Pill color={c.tagC} bg={c.tagBg}>{c.tag}</Pill>],["Кому",<span style={{fontSize:12,color:T.textSub}}>{c.to}</span>],["Тема",<span style={{fontSize:12,color:T.text}}>{c.subject}</span>]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"7px 0", borderBottom:`0.5px solid ${T.border}` }}><div style={{ width:44, fontSize:11, color:T.textMuted, flexShrink:0, paddingTop:2 }}>{k}</div><div>{v}</div></div>
          ))}
        </div>
        <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
          <SectionLabel>Метрики канала</SectionLabel>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {metaRows.map(([k,v])=><div key={k} style={{ background:T.bg, borderRadius:7, padding:"9px 11px" }}><div style={{ fontSize:10, color:T.textMuted, textTransform:"uppercase", letterSpacing:.8 }}>{k}</div><div style={{ fontSize:17, fontWeight:700, color:T.text, marginTop:3, fontFamily:"monospace" }}>{v}</div></div>)}
          </div>
        </div>
      </div>
      <div style={{ background:"#080A0E", border:`0.5px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ background:"#0D1117", borderBottom:`0.5px solid ${T.border}`, padding:"7px 12px", display:"flex", alignItems:"center", gap:6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(col=><div key={col} style={{ width:9, height:9, borderRadius:"50%", background:col }} />)}
          <div style={{ flex:1, background:T.bg, borderRadius:4, height:17, marginLeft:8, display:"flex", alignItems:"center", paddingLeft:8 }}><span style={{ fontSize:10, color:T.textMuted }}>mail.uzbekistanairways.uz</span></div>
        </div>
        <div style={{ padding:12 }}>
          <div style={{ borderRadius:7, overflow:"hidden", border:`0.5px solid ${T.border}` }}>
            <div style={{ background:c.hBg, borderBottom:`2px solid ${c.hLine}`, padding:"11px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ background:c.hLine, borderRadius:4, width:24, height:16, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:8, fontWeight:800, color:"#fff" }}>HY</span></div>
              <span style={{ color:"#E2E8F0", fontWeight:600, fontSize:12 }}>Uzbekistan Airways</span>
            </div>
            <div style={{ background:"#0D1117", padding:14 }}>
              <div style={{ background:T.bgElevated, border:`0.5px solid ${T.border}`, borderRadius:6, padding:"8px 10px", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ textAlign:"center" }}><div style={{ fontSize:15, fontWeight:700, color:T.text }}>TAS</div><div style={{ fontSize:9, color:T.textMuted }}>Ташкент</div></div>
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:3 }}><div style={{ flex:1, height:1, background:T.border }} /><span style={{ fontSize:10, color:T.textMuted }}>✈</span><div style={{ flex:1, height:1, background:T.border }} /></div>
                <div style={{ textAlign:"center" }}><div style={{ fontSize:15, fontWeight:700, color:T.text }}>IST</div><div style={{ fontSize:9, color:T.textMuted }}>Стамбул</div></div>
              </div>
              {c.urgency&&<div style={{ background:T.amberDim, border:`0.5px solid ${T.amber}`, borderRadius:5, padding:"6px 9px", marginBottom:9, display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:12 }}>⏳</span><div><div style={{ fontSize:11, fontWeight:600, color:T.amberText }}>Аукцион закрывается через 14 часов</div><div style={{ fontSize:10, color:T.amber }}>HY 602 · 15 июня · 08:45</div></div></div>}
              <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:4 }}>{c.title}</div>
              <div style={{ fontSize:11, color:T.textSub, lineHeight:1.6, marginBottom:9 }}>{c.body}</div>
              {c.offers&&c.offers.map(o=><div key={o.name} style={{ border:`0.5px solid ${T.border}`, borderRadius:5, padding:"6px 9px", marginBottom:5, display:"flex", justifyContent:"space-between", alignItems:"center" }}><div><div style={{ fontSize:11, fontWeight:600, color:T.text }}>{o.name}</div><div style={{ fontSize:10, color:T.textMuted }}>{o.desc}</div></div><div style={{ textAlign:"right" }}><div style={{ fontSize:9, color:T.textMuted }}>от</div><div style={{ fontSize:14, fontWeight:700, color:c.tagC }}>{o.from}</div></div></div>)}
              {c.booking&&<div style={{ background:T.greenDim, border:`0.5px solid ${T.green}`, borderRadius:5, padding:"8px 9px", marginBottom:9 }}>{Object.entries(c.booking).map(([k,v])=><div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, padding:"2px 0", borderBottom:`0.5px solid rgba(16,185,129,.15)` }}><span style={{ color:T.greenText }}>{k}</span><span style={{ fontWeight:600, color:T.greenText }}>{v}</span></div>)}</div>}
              <div style={{ background:c.ctaBg, borderRadius:5, padding:"8px", textAlign:"center", fontSize:11, fontWeight:700, color:"#fff", marginBottom:7, cursor:"pointer" }}>{c.ctaLabel}</div>
              <div style={{ fontSize:10, color:T.textMuted, borderTop:`0.5px solid ${T.border}`, paddingTop:7, lineHeight:1.6 }}>{c.footer}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────
export default function UpgradeAuctionAdmin() {
  const [tab, setTab]           = useState("flights");
  const [emailTab, setEmailTab] = useState("pte");
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSelectFlight = id => { setSelectedFlight(id); setTab("flight"); };
  const handleBack = () => { setSelectedFlight(null); setTab("flights"); };

  const totalActive = FLIGHTS_DATA.filter(f=>f.status==="active").length;
  const totalBids   = FLIGHTS_DATA.reduce((s,f)=>s+f.bids,0);

  const NAV = [
    { id:"flights",   label:"Рейсы" },
    { id:"flight",    label:"Детали рейса", hide:!selectedFlight },
    { id:"rules",     label:"Глобальные правила" },
    { id:"email",     label:"Email-шаблоны" },
    { id:"passenger", label:"Интерфейс пассажира" },
  ].filter(t=>!t.hide);

  return (
    <div style={{ background:T.bg, minHeight:"600px", fontFamily:"system-ui,sans-serif", color:T.text }}>
      <div style={{ borderBottom:`0.5px solid ${T.border}`, padding:"0 24px", display:"flex", alignItems:"center", gap:0, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, padding:"13px 0", marginRight:24 }}>
          <div style={{ width:26, height:17, background:T.accent, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:8, fontWeight:800, color:"#EFF6FF", letterSpacing:.5 }}>HY</span>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:T.text, letterSpacing:.5 }}>Auction Admin</span>
        </div>
        {NAV.map(t=>(
          <button key={t.id} onClick={()=>{ setTab(t.id); if(t.id!=="flight") setSelectedFlight(null); }} style={{ background:"none", border:"none", cursor:"pointer", padding:"14px 14px", fontSize:13, fontWeight:600, color:tab===t.id?T.accent:T.textMuted, borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent", marginBottom:-1, letterSpacing:.3 }}>
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
          <Pill color={T.greenText} bg={T.greenDim}>{totalActive} активных</Pill>
          <Pill color={T.accentText} bg={T.accentDim}>{totalBids} заявок</Pill>
          <div style={{ width:28, height:28, borderRadius:"50%", background:T.accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:T.accentText }}>OP</div>
        </div>
      </div>

      <div style={{ padding:"20px 24px" }}>
        {tab==="flights"   && <FlightList onSelect={handleSelectFlight} />}
        {tab==="flight"    && selectedFlight && <FlightDetail flightId={selectedFlight} onBack={handleBack} />}
        {tab==="flight"    && !selectedFlight && <div style={{ textAlign:"center", padding:"60px 0", color:T.textMuted }}><div style={{ fontSize:28, marginBottom:10 }}>✈</div><div style={{ fontSize:14 }}>Выберите рейс из списка</div></div>}
        {tab==="rules"     && <GlobalRules />}
        {tab==="passenger" && <PassengerBidUI />}
        {tab==="email"     && (
          <>
            <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:`0.5px solid ${T.border}` }}>
              {[["pte","Приглашение (PTE)"],["chaser","Напоминание"],["win","Подтверждение"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setEmailTab(id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontSize:13, fontWeight:600, color:emailTab===id?T.text:T.textMuted, borderBottom:emailTab===id?`2px solid ${T.accent}`:"2px solid transparent", marginBottom:-1 }}>{lbl}</button>
              ))}
            </div>
            <EmailPreview type={emailTab} />
          </>
        )}
      </div>
    </div>
  );
}
