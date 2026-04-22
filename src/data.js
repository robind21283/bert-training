export function getKlimbStage() {
  const day = new Date().getDay();
  if (day >= 3 && day <= 5) return "wf";
  return "sat";
}

export const KLIMB_STAGES = {
  wf: {
    label: "Wed–Fri",
    color: "#facc15",
    steps: [
      "5 reps/day from DIFFERENT locations in the house",
      "4 easy sends (nearby, clear line of sight)",
      "1 hard distance send per day",
      "Treat immediately when he reaches Klimb",
      "Goal: no excitement response when on Klimb",
    ],
  },
  sat: {
    label: "Sat onward",
    color: "#4ade80",
    steps: [
      "Continue 5 reps/day from different locations",
      "After Bert goes to Klimb: pick something up yourself",
      "THEN give the treat",
      "No objects involving Bert at first",
      "Eventually add brief dance party before treating",
    ],
  },
};

export const BEHAVIORS = [
  { id: "klimb", name: "Go to Klimb", cue: "Klimb", hand: "Point (if needed)", level: "3. Good", noTreat: "Mostly", energy: 1,
    kelly: "PRIMARY focus right now. 5x/day from DIFFERENT locations. 4 easy sends, 1 hard distance send. Building this creates safety around guarded objects." },
  { id: "sit", name: "Sit", cue: "Sit", hand: "Raise hand", level: "2. Great", noTreat: "Yes", energy: 1,
    kelly: "Reliable maintenance rep. Good session opener or closer." },
  { id: "down", name: "Down", cue: "Down", hand: "Lower hand", level: "2. Great", noTreat: "Yes", energy: 1,
    kelly: "Solid. Generalize to new locations." },
  { id: "come", name: "Come / Here", cue: "Here / Kanga", hand: "Point (if needed)", level: "2. Great", noTreat: "Mostly", energy: 1,
    kelly: "Lifesaving skill. Practice in ALL new environments. Include maintenance reps." },
  { id: "shake", name: "Shake", cue: "Shake", hand: "Extend hand", level: "1. Expert", noTreat: "Yes", energy: 1,
    kelly: "Expert. Great rapport builder to start a session." },
  { id: "hug", name: "Hug my leg", cue: "Hug", hand: "N/A", level: "1. Expert", noTreat: "Yes", energy: 1,
    kelly: "Expert. Easy connector behavior." },
  { id: "kiss", name: "Kiss", cue: "Kiss", hand: "N/A", level: "1. Expert", noTreat: "Yes", energy: 1,
    kelly: "Expert. Low effort, high reward." },
  { id: "namegame", name: "Name Game", cue: "Bert!", hand: "N/A", level: "Engagement", noTreat: "N/A", energy: 1,
    kelly: "System check. If he can't do this, don't expect cue responses. Always start here." },
  { id: "drop-it", name: "Drop it", cue: "Drop it", hand: "N/A", level: "Building", noTreat: "Varies", energy: 1,
    kelly: "ONLY practice when safe. Protocol: say drop it, throw treat toward him, then IGNORE him. Never tension-react — it intensifies guarding." },
  { id: "touch", name: "Touch", cue: "Touch", hand: "Extend hand", level: "3. Good", noTreat: "Sometimes", energy: 2,
    kelly: "Try BEFORE Klimb if he isn't engaging. Foundational to retrieve. Mark before the lick." },
  { id: "weave-legs", name: "Weave through legs", cue: "Through", hand: "Point", level: "2. Great", noTreat: "Mostly", energy: 2,
    kelly: "Good on walks too. Keep building distance." },
  { id: "heel", name: "Heel", cue: "Heel", hand: "Point", level: "3. Okay", noTreat: "Mostly", energy: 2,
    kelly: "Still building. Mostly on walks." },
  { id: "matwork", name: "Matwork / Relaxation Protocol", cue: "Bed", hand: "N/A", level: "Lifesaving", noTreat: "Mostly", energy: 2,
    kelly: "Practice in all new environments. Maintenance reps to retain." },
  { id: "retrieve", name: "Retrieve", cue: "Get it / Bring it", hand: "Point", level: "3. Good", noTreat: "Sometimes", energy: 2,
    kelly: "Keep it fun. Turning it into a formal task too soon will plateau progress." },
  { id: "someone-here", name: "Someone's here", cue: "Someone's here", hand: "N/A", level: "SD Task", noTreat: "Varies", energy: 2,
    kelly: "Build the association now in calm environments." },
  { id: "spin", name: "Spin left + right", cue: "Go Left / Go Right", hand: "Point his direction", level: "3. Good", noTreat: "Sometimes", energy: 2,
    kelly: "Not reliable on walks yet. Practice indoors first." },
  { id: "wave", name: "Wave", cue: "Wave", hand: "Wave at him", level: "3. Good", noTreat: "Rarely", energy: 2,
    kelly: "Crowd-pleaser. Keep it fun." },
  { id: "bow", name: "Bow", cue: "TBD", hand: "TBD", level: "3. Okay", noTreat: "No", energy: 2,
    kelly: "Most time logged on this. Still building the verbal cue." },
  { id: "cover-eyes", name: "Cover eyes", cue: "Cover", hand: "Cover your own eyes", level: "4. New", noTreat: "Rarely", energy: 3,
    kelly: "Early stage. Short sessions only." },
  { id: "stand-fours", name: "Stand on fours", cue: "Ready", hand: "Fist raised", level: "4. New", noTreat: "No", energy: 3,
    kelly: "New skill. Short sessions only." },
  { id: "muzzle", name: "Muzzle training", cue: "N/A", hand: "N/A", level: "Building", noTreat: "N/A", energy: 3,
    kelly: "Muzzle parties + nose-in reps. Can he do his favorite things while wearing it? If not: short duration, then immediate favorite thing." },
  { id: "123-pattern", name: "1-2-3 Pattern Game", cue: "1, 2, 3", hand: "N/A", level: "Building", noTreat: "N/A", energy: 3,
    kelly: "Build in known environments before using in harder situations." },
];

export const ENRICHMENT = [
  { id: "frozen", name: "Frozen enrichment", examples: "Toppl or Kong — pumpkin, yogurt, applesauce. Rotate recipes. Bert now requests Toppls with buttons!", energy: 1,
    kelly: "More reinforcement = better training engagement. Lean into food enrichment now that you're cleared for exercise." },
  { id: "puzzle", name: "Food puzzle", examples: "Tornado, Gatorade bottles, cardboard, food trails. Rotate.", energy: 1,
    kelly: "Bert needs puzzle variety like we need game variety." },
  { id: "chews", name: "Long lasting chew", examples: "Nylabone, marrow bone, bully stick", energy: 1,
    kelly: "PUT IN THE CONTAINER at the same time every day. Predictable bone pickup removes guarding triggers." },
  { id: "sniffspot", name: "SniffSpot / decompression walk", examples: "More exhausting than fast-paced walks. Great reset.", energy: 1,
    kelly: "Combine with food enrichment to build up reinforcement value overall." },
  { id: "hide-seek", name: "Hide and seek", examples: "Classic engagement. Good low-energy option.", energy: 2 },
];

export const GUARDING_RULES = [
  "Put bones in the container at the SAME TIME every day — predictability removes triggers",
  "Don't look directly at guarded items when Bert has them",
  "Don't tension-react (tense body, quick movement) — it intensifies his awareness",
  "If he has something and won't drop: say 'drop it', throw treat toward him, then IGNORE him",
  "Use 'want to go outside?' as emergency redirect to safely clear the space",
];

export const SESSION_NOTES = `Session: Kelly Keebler · 1 hour · April 22, 2026

FOCUS: Resource guarding escalation + building Klimb as safety behavior.

RESOURCE GUARDING STATUS
Bert has generalized guarding across socks, buttons, bones, and bowls. Escalating: he moves items to mouth immediately when Robin looks at them, carries items for entire walks. "Leave it" is no longer reliable — now object-dependent. The act of guarding has become his primary reinforcement.

Root cause: reinforcement decreased (fewer treats) + exercise decreased simultaneously. Both are now being corrected: exercise clearance + treadmill coming + food enrichment increasing.

KEY INCIDENTS
- Stephanie visit: Bert pinched Robin's hand then Stephanie's arm (bruise) while repositioning near his bone. Managed with leash, then "want to go outside?" to clear the space safely.
- Florida thumb bite: Bert mistook Robin's thumb for a bully stick during earmuff application. Released immediately. Robin correctly did NOT pull away.

TRAINING PRIORITIES
1. Go to Klimb — 5x/day, different locations, 1 distance send. This is the safety infrastructure.
2. Drop it — practice ONLY when safe. Throw treat, ignore.
3. Bone management — container, same time, every day.

KEY NOTE FROM KELLY
Tensing or reacting to guarding intensifies Bert's awareness and escalates the behavior. Stay neutral. If Bert isn't engaging at the start of a session, try "touch" first before asking for Klimb.`;

export function levelColor(level) {
  if (!level) return "#888";
  if (level.includes("Expert") || level.includes("1.")) return "#4ade80";
  if (level.includes("Great") || level.includes("2.")) return "#a3e635";
  if (level.includes("Good") || level.includes("3.")) return "#facc15";
  if (level.includes("Okay")) return "#fb923c";
  return "#c084fc";
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}   