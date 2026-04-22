import { useState } from "react";
import {
  BEHAVIORS, ENRICHMENT, GUARDING_RULES, KLIMB_STAGES, SESSION_NOTES,
  getKlimbStage, levelColor, todayISO,
} from "./data.js";
import { logRep } from "./api.js";

function KlimbTracker() {
  const today = todayISO();
  const lsKey = `bert_Klimb_${today}`;

  const [reps, setReps] = useState(() => {
    try { const s = localStorage.getItem(lsKey); return s ? JSON.parse(s) : Array(5).fill(null); }
    catch { return Array(5).fill(null); }
  });
  const [active, setActive] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const save = (u) => {
    setReps(u);
    try { localStorage.setItem(lsKey, JSON.stringify(u)); } catch {}
  };

  const mark = async (i, status, detail = "") => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = [...reps];
    updated[i] = { status, detail, time, synced: false };
    save(updated);
    setActive(null);
    setSyncing(true);
    const ok = await logRep({
      behavior: "Go to Klimb",
      status: status === "done" ? "Done" : status === "skip" ? "Skipped" : "Snoozed",
      repNumber: i + 1,
      repType: i === 4 ? "Distance" : "Easy",
      snoozeDetail: detail,
      date: today,
      loggedAt: time,
    });
    setSyncing(false);
    if (ok) {
      const synced = [...updated];
      synced[i] = { ...synced[i], synced: true };
      save(synced);
    }
  };

  const clear = (i) => { const u = [...reps]; u[i] = null; save(u); };

  const done = reps.filter(r => r?.status === "done").length;
  const snoozed = reps.filter(r => r?.status === "snooze").length;
  const skipped = reps.filter(r => r?.status === "skip").length;
  const stage = KLIMB_STAGES[getKlimbStage()];

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={label}>Daily Goal · Go to Klimb</div>
          <div style={heading}>5 reps · different spots</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: stage.color + "20", color: stage.color, border: `1px solid ${stage.color}44`, borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>{stage.label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: done >= 5 ? "#4ade80" : "#e2d9f3" }}>{done}<span style={{ fontSize: 13, color: "#7c6fcd", fontWeight: 400 }}>/5</span></div>
          {syncing && <div style={{ fontSize: 9, color: "#7c6fcd" }}>syncing…</div>}
        </div>
      </div>
      <div style={{ background: "#12122a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${stage.color}` }}>
        {stage.steps.map((s, i) => (
          <div key={i} style={{ fontSize: 12, color: "#9d8ec8", marginBottom: i < stage.steps.length - 1 ? 5 : 0, display: "flex", gap: 8 }}>
            <span style={{ color: stage.color, flexShrink: 0 }}>›</span>{s}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {reps.map((rep, i) => {
          const isHard = i === 4;
          return (
            <div key={i} style={{ flex: 1 }}>
              {rep === null ? (
                <button onClick={() => setActive(active === i ? null : i)} style={{
                  width: "100%", padding: "10px 0", borderRadius: 10, cursor: "pointer",
                  background: active === i ? "#2d1b69" : "#12122a",
                  border: `1px solid ${isHard ? "#4a2080" : "#2d2d4a"}`,
                  color: isHard ? "#c084fc" : "#5a5a8a", fontSize: 13, fontWeight: isHard ? 700 : 400,
                }}>{i + 1}{isHard ? "*" : ""}</button>
              ) : (
                <button onClick={() => clear(i)} title="Tap to undo" style={{
                  width: "100%", padding: "10px 0", borderRadius: 10, cursor: "pointer", border: "none", fontSize: 16,
                  background: rep.status === "done" ? "#14532d" : rep.status === "skip" ? "#3b1515" : "#1e1040",
                  color: rep.status === "done" ? "#4ade80" : rep.status === "skip" ? "#f87171" : "#c084fc",
                }}>{rep.status === "done" ? "✓" : rep.status === "skip" ? "–" : "z"}</button>
              )}
              {rep?.time && <div style={{ fontSize: 9, color: "#4a4a7a", textAlign: "center", marginTop: 2 }}>{rep.time}</div>}
              {isHard && !rep && <div style={{ fontSize: 8, color: "#4a2080", textAlign: "center", marginTop: 1 }}>DISTANCE</div>}
            </div>
          );
        })}
      </div>
      {active !== null && reps[active] === null && (
        <div style={{ background: "#12122a", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#7c6fcd", marginBottom: 10 }}>Rep {active + 1}{active === 4 ? " — DISTANCE SEND" : ""}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => mark(active, "done")} style={btnGreen}>✓ Done</button>
            <button onClick={() => mark(active, "skip")} style={btnRed}>– Skip</button>
            {["15 min", "30 min", "1 hour", "Not home"].map(opt => (
              <button key={opt} onClick={() => mark(active, "snooze", opt)} style={btnPurple}>z {opt}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#4a4a7a" }}>
        <span>✓ {done} done</span>
        <span>z {snoozed} snoozed</span>
        <span>– {skipped} skipped</span>
        {done < 5 && <span style={{ color: "#7c6fcd" }}>{5 - done - snoozed} more needed</span>}
        {done >= 5 && <span style={{ color: "#4ade80", fontWeight: 700 }}>Goal hit! 🎉</span>}
      </div>
    </div>
  );
}

function GuardingPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...card, background: "#170d10", border: "1px solid #4a1a2a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen(!open)}>
        <div>
          <div style={{ ...label, color: "#f87171" }}>Active Safety Protocol</div>
          <div style={{ ...heading, color: "#fca5a5" }}>Resource Guarding Management</div>
        </div>
        <div style={{ color: "#f87171", fontSize: 16 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ marginTop: 14 }}>
          <div style={{ background: "#0e060a", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#fca5a5", lineHeight: 1.65 }}>
            Bert's primary reinforcement is now the act of guarding itself. Reinforcement decreased + exercise decreased = this escalation. Both are being corrected. Stay the course.
          </div>
          {GUARDING_RULES.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "#f87171", flexShrink: 0 }}>›</span>
              <span style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.55 }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BehaviorSelector() {
  const [energy, setEnergy] = useState(null);
  const [pool, setPool] = useState([]);
  const [idx, setIdx] = useState(0);
  const [showRef, setShowRef] = useState(false);

  const start = (e) => {
    setEnergy(e);
    const filtered = [...BEHAVIORS, ...ENRICHMENT].filter(b => b.energy <= e);
    setPool(filtered.sort(() => Math.random() - 0.5));
    setIdx(0); setShowRef(false);
  };

  const current = pool[idx];
  const isEnrichment = current && !current.cue;
  const isPrimary = current?.id === "Klimb";

  return (
    <div style={card}>
      <div style={label}>What Can We Do Now?</div>
      <div style={{ fontSize: 14, color: "#9d8ec8", marginBottom: 16 }}>Pick energy level · swipe through options</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[[1, "🌙", "Low", "Maintenance"], [2, "🌤", "Medium", "Building"], [3, "⚡", "High", "Full menu"]].map(([e, icon, lbl, sub]) => (
          <button key={e} onClick={() => start(e)} style={{
            flex: 1, padding: "11px 6px", borderRadius: 12, cursor: "pointer",
            background: energy === e ? "#2d1b69" : "#12122a",
            border: `1px solid ${energy === e ? "#7c6fcd" : "#2d2d4a"}`,
            color: energy === e ? "#c4b5fd" : "#4a4a7a",
          }}>
            <div style={{ fontSize: 18 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 3 }}>{lbl}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>{sub}</div>
          </button>
        ))}
      </div>
      {current && (
        <div style={{ background: isPrimary ? "#12082a" : "#12122a", border: `1px solid ${isPrimary ? "#4a2080" : "#1e1e3f"}`, borderRadius: 14, padding: 18 }}>
          {isPrimary && <div style={{ fontSize: 10, letterSpacing: 2, color: "#c084fc", marginBottom: 8 }}>★ PRIMARY FOCUS THIS WEEK</div>}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10, background: levelColor(current.level) + "22", color: levelColor(current.level), border: `1px solid ${levelColor(current.level)}44`, marginBottom: 7 }}>
                {isEnrichment ? "ENRICHMENT" : current.level?.toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#e2d9f3", fontFamily: "Georgia, serif" }}>{current.name}</div>
            </div>
            <div style={{ fontSize: 11, color: "#4a4a7a" }}>{idx + 1}/{pool.length}</div>
          </div>
          {!isEnrichment && (
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["VERBAL", `"${current.cue}"`, "#c4b5fd"], ["HAND", current.hand, "#a78bfa"], ["TREAT-FREE?", current.noTreat, current.noTreat === "Yes" ? "#4ade80" : "#facc15"]].map(([lbl, val, color]) => (
                <div key={lbl} style={{ background: "#1e1e3f", borderRadius: 8, padding: "8px 10px", flex: 1 }}>
                  <div style={{ fontSize: 9, color: "#7c6fcd", letterSpacing: 1, marginBottom: 2 }}>{lbl}</div>
                  <div style={{ fontSize: 12, color, fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
          )}
          {isEnrichment && current.examples && (
            <div style={{ background: "#1e1e3f", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: "#7c6fcd", letterSpacing: 1, marginBottom: 3 }}>OPTIONS</div>
              <div style={{ fontSize: 12, color: "#c4b5fd" }}>{current.examples}</div>
            </div>
          )}
          {current.kelly && (
            <div style={{ borderLeft: "2px solid #4a2080", paddingLeft: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "#7c6fcd", letterSpacing: 1, marginBottom: 3 }}>KELLY'S NOTE</div>
              <div style={{ fontSize: 12, color: "#9d8ec8", lineHeight: 1.55 }}>{current.kelly}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setIdx((idx + 1) % pool.length); setShowRef(false); }} style={{ flex: 1, padding: "11px 0", borderRadius: 10, background: "#1e1e3f", border: "1px solid #3d3d6a", color: "#7c6fcd", fontSize: 13, cursor: "pointer" }}>→ Next</button>
            <button onClick={() => setShowRef(!showRef)} style={{ flex: 2, padding: "11px 0", borderRadius: 10, background: "#2d1b69", border: "none", color: "#e2d9f3", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>Let's do it ✓</button>
          </div>
          {showRef && (
            <div style={{ marginTop: 14, borderTop: "1px solid #2d2d4a", paddingTop: 14, fontSize: 12, color: "#9d8ec8", lineHeight: 1.75 }}>
              {!isEnrichment ? <>
                1. Name Game first — check he's with you.<br />
                2. Cue: <strong style={{ color: "#c4b5fd" }}>"{current.cue}"</strong>{current.hand !== "N/A" ? ` + ${current.hand}` : ""}<br />
                3. Mark the moment, treat.<br />
                4. Release: "Keen".<br />
                {current.kelly && <><br /><span style={{ color: "#7c6fcd" }}>Note:</span> {current.kelly}</>}
              </> : <>
                Set up and let Bert work independently.<br />
                {current.examples}
                {current.kelly && <><br /><br /><span style={{ color: "#7c6fcd" }}>Note:</span> {current.kelly}</>}
              </>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotesPanel() {
  const [tab, setTab] = useState("session");
  const REFERENCE = [
    { title: "Lifesaving Skills", note: "Practice in ALL new environments. Maintenance reps required to retain.", items: ["Come / Here (Kanga)", "Matwork / Relaxation Protocol", "Someone's Here", "1-2-3 Pattern Game", "Muzzle Training"] },
    { title: "Enrichment (daily)", note: "More food enrichment = more reinforcement = better training engagement.", items: ["Long lasting chews — container, same time daily", "Frozen enrichment (rotate Toppl/Kong)", "Food puzzles (rotate)", "SniffSpot / decompression walk", "Treadmill (coming soon)"] },
    { title: "Engagement (check before cueing)", note: "If Bert can't play these, don't expect cue responses.", items: ["Name Game", "Up and Down", "Superbowl", "Whiplash Turn"] },
    { title: "Husbandry (2x/week)", note: "Build comfort for when procedures actually need to happen.", items: ["Nails", "Ears", "Teeth / Brushing", "Chin handling", "Muzzle conditioning"] },
    { title: "Service Dog Goals", note: "Keep fun. Don't formalize too soon.", items: ["Retrieve (specific objects)", "Body pressure (legs)", "Body location in public", "Barking alert (scratch cue only)", "Under-table behavior", "Deep pressure therapy"] },
    { title: "Public / Walking", note: "Calmer environments first. Short woot (3–5 sec) for wins, then move on.", items: ["Heel", "Come on walks", "Sniff breaks as decompression", "Busy areas: monitor arousal"] },
  ];

  return (
    <div style={card}>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {[["session", "Session Notes"], ["email", "Kelly's Email"], ["reference", "Full Plan"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: tab === id ? "#2d1b69" : "transparent",
            border: `1px solid ${tab === id ? "#7c6fcd" : "#2d2d4a"}`,
            color: tab === id ? "#c4b5fd" : "#5a5a8a",
          }}>{lbl}</button>
        ))}
      </div>
      {tab === "session" && (
        <div>
          <div style={{ fontSize: 10, color: "#7c6fcd", letterSpacing: 2, marginBottom: 10 }}>
            SESSION · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, fontSize: 12, color: "#9d8ec8", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
            {SESSION_NOTES}
          </div>
        </div>
      )}
      {tab === "email" && (
        <div>
          <div style={{ fontSize: 10, color: "#7c6fcd", letterSpacing: 2, marginBottom: 10 }}>KELLY'S EMAIL</div>
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, fontSize: 12, color: "#9d8ec8", lineHeight: 1.7, fontStyle: "italic", border: "1px dashed #2d2d4a" }}>
            Waiting on Kelly's follow-up email — paste it here to update this section.
          </div>
        </div>
      )}
      {tab === "reference" && (
        <div style={{ maxHeight: 420, overflowY: "auto" }}>
          {REFERENCE.map(section => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd", marginBottom: 3 }}>{section.title}</div>
              {section.note && <div style={{ fontSize: 11, color: "#7c6fcd", marginBottom: 8, lineHeight: 1.5 }}>{section.note}</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {section.items.map(item => (
                  <span key={item} style={{ background: "#12122a", border: "1px solid #2d2d4a", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#9d8ec8" }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const card = { background: "#1a1a2e", border: "1px solid #2d2d4a", borderRadius: 16, padding: "20px 22px", marginBottom: 18 };
const label = { fontSize: 10, letterSpacing: 3, color: "#7c6fcd", textTransform: "uppercase", marginBottom: 3 };
const heading = { fontSize: 19, fontWeight: 800, color: "#e2d9f3", fontFamily: "Georgia, serif" };
const btnGreen = { padding: "8px 16px", borderRadius: 8, background: "#14532d", border: "none", color: "#4ade80", fontSize: 13, cursor: "pointer", fontWeight: 700 };
const btnRed = { padding: "8px 16px", borderRadius: 8, background: "#3b1515", border: "none", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600 };
const btnPurple = { padding: "8px 12px", borderRadius: 8, border: "1px solid #4a2080", background: "#1e1040", color: "#c084fc", fontSize: 12, cursor: "pointer" };

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a18 0%, #10101f 60%, #0a0a18 100%)",
      padding: "24px 16px 40px",
      fontFamily: "'Trebuchet MS', sans-serif",
      maxWidth: 520, margin: "0 auto",
    }}>
      <div style={{ marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #4a2080, #2d1b69)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🐾</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#e2d9f3", fontFamily: "Georgia, serif", letterSpacing: -0.5 }}>Bert's Training</div>
          <div style={{ fontSize: 10, color: "#7c6fcd", letterSpacing: 2 }}>KELLY KEEBLER · APR 22 SESSION</div>
        </div>
      </div>
      <KlimbTracker />
      <GuardingPanel />
      <BehaviorSelector />
      <NotesPanel />
      <div style={{ marginTop: 20, textAlign: "center", fontSize: 10, color: "#2d2d4a" }}>
        Rep data resets at midnight · Tap any rep to undo · * = distance send
      </div>
    </div>
  );
}