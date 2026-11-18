import type { CategoryId } from "./types";

export interface Category {
  id: CategoryId;
  name: string;
  /** Lowercase phrase for "Let's practise …". */
  phrase: string;
  /** Pastel chip / icon-circle background, sampled from the designs. */
  tint: string;
  /** Icon and label colour. */
  ink: string;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  anatomy: { id: "anatomy", name: "Anatomy", phrase: "anatomy", tint: "#fdece3", ink: "#b3542a" },
  physiology: { id: "physiology", name: "Physiology", phrase: "physiology", tint: "#dcf2f1", ink: "#2a8a86" },
  pharmacology: { id: "pharmacology", name: "Pharmacology", phrase: "pharmacology", tint: "#f0e8fb", ink: "#7d56c8" },
  fon: { id: "fon", name: "FON", phrase: "foundations of nursing", tint: "#e1effb", ink: "#2678b4" },
  antenatal: { id: "antenatal", name: "Antenatal Care", phrase: "antenatal care", tint: "#fdece3", ink: "#c2562d" },
  labour: { id: "labour", name: "Labour & Delivery", phrase: "labour and delivery", tint: "#fbe4ea", ink: "#cd4f72" },
  postnatal: { id: "postnatal", name: "Postnatal Care", phrase: "postnatal care", tint: "#f0e8fb", ink: "#8a4fc8" },
  newborn: { id: "newborn", name: "Newborn Care", phrase: "newborn care", tint: "#e1effb", ink: "#2f7fc2" },
  "family-planning": { id: "family-planning", name: "Family Planning", phrase: "family planning", tint: "#ddf3e6", ink: "#2e9566" },
  medical: { id: "medical", name: "Medical Nursing", phrase: "medical nursing", tint: "#fbe4ea", ink: "#cd4f72" },
  emergency: { id: "emergency", name: "Emergency Care", phrase: "emergency care", tint: "#fcf0d4", ink: "#c98a12" },
  surgical: { id: "surgical", name: "Surgical Care", phrase: "surgical care", tint: "#fdece3", ink: "#c2562d" },
  "mental-health": { id: "mental-health", name: "Mental Health", phrase: "mental health", tint: "#dff4e8", ink: "#2e9566" },
};

/** Home-screen chips, in design order (01 Midwifery, 02 Nursing). */
export const MIDWIFERY_TOPICS: CategoryId[] = ["anatomy", "physiology", "pharmacology", "fon", "antenatal", "labour", "postnatal", "newborn"];
export const NURSING_TOPICS: CategoryId[] = ["anatomy", "physiology", "pharmacology", "fon", "medical", "emergency", "surgical", "mental-health"];

export function topicsFor(course: string | null): CategoryId[] {
  return course && /nurs/i.test(course) && !/midwi/i.test(course) ? NURSING_TOPICS : MIDWIFERY_TOPICS;
}

export interface BankQuestion {
  topic: string;
  question: string;
  examiner: string[];
  workOn: { point: string; trySaying: string }[];
}

const q = (topic: string, question: string, examiner: string[], workOn: BankQuestion["workOn"]): BankQuestion => ({ topic, question, examiner, workOn });

/** Mock question bank. Real questions come from theround-service's catalog. */
export const QUESTIONS: Record<CategoryId, BankQuestion[]> = {
  labour: [
    q("Postpartum haemorrhage", "How would you recognise and manage a postpartum haemorrhage?",
      ["Call for help early", "ABCDE and haemodynamic status", "Cause-based management (the 4 Ts)", "Escalation and documentation"],
      [{ point: "Say your escalation point out loud — who you call, and when.", trySaying: "I'd escalate to the senior midwife and obstetric registrar straight away, using SBAR." },
       { point: "Close with a one-line summary of your plan.", trySaying: "So in summary: assess, call for help, treat the cause, and document as I go." }]),
    q("Shoulder dystocia", "Talk me through your response to a shoulder dystocia.",
      ["Recognise the turtle sign", "Call for help and note the time", "McRoberts and suprapubic pressure", "Debrief and document"],
      [{ point: "Name the manoeuvres in order, not all at once.", trySaying: "First McRoberts, then suprapubic pressure, then internal manoeuvres if needed." },
       { point: "Mention the time of head-to-body delivery.", trySaying: "I'd ask someone to call out the time every 30 seconds." }]),
    q("Partograph", "How do you use a partograph to monitor labour?",
      ["Cervical dilatation and alert line", "Fetal heart and liquor", "Maternal observations", "Action when the action line is crossed"],
      [{ point: "Explain what crossing the alert line means for your plan.", trySaying: "If progress crosses the alert line, I'd review and inform the doctor." },
       { point: "Link observations to action.", trySaying: "Every finding I chart has a next step attached to it." }]),
  ],
  newborn: [
    q("Neonatal resuscitation", "Describe the initial steps of newborn resuscitation.",
      ["Dry, warm and stimulate", "Assess tone, breathing and heart rate", "Open the airway and give inflation breaths", "Reassess every 30 seconds"],
      [{ point: "Keep the timeline clear.", trySaying: "Within the first minute I'd dry, assess and open the airway." },
       { point: "State when you call for help.", trySaying: "If there's no response to inflation breaths, I call the neonatal team." }]),
    q("Neonatal jaundice", "How would you assess a baby with jaundice on day two?",
      ["History and timing", "Visual and bilirubin assessment", "Feeding and hydration", "Escalation thresholds"],
      [{ point: "Mention why day of onset matters.", trySaying: "Jaundice in the first 24 hours is pathological until proven otherwise." },
       { point: "Finish with what you tell the parents.", trySaying: "I'd explain the plan and when we'll recheck." }]),
  ],
  "family-planning": [
    q("Counselling", "How would you counsel a client choosing a contraceptive method?",
      ["Explore needs and history", "Explain options fairly", "Check eligibility", "Agree follow-up"],
      [{ point: "Lead with the client's priorities.", trySaying: "I'd start by asking what matters most to her in a method." },
       { point: "Confirm understanding at the end.", trySaying: "Can you tell me in your own words how you'll use it?" }]),
  ],
  antenatal: [
    q("Pre-eclampsia", "What signs of pre-eclampsia would you look for at an antenatal visit?",
      ["Blood pressure and proteinuria", "Headache, visual changes, epigastric pain", "Oedema and reflexes", "Referral pathway"],
      [{ point: "Give your blood pressure thresholds.", trySaying: "A reading of 140/90 or above on two occasions needs review." },
       { point: "Say who you refer to.", trySaying: "I'd refer to the obstetric team the same day." }]),
  ],
  postnatal: [
    q("Postnatal check", "What would you cover in a day-one postnatal check?",
      ["Vital signs and lochia", "Uterine involution", "Perineum, bladder and bowels", "Mood and feeding support"],
      [{ point: "Structure it head to toe.", trySaying: "I'd work top to bottom so nothing gets missed." },
       { point: "Include emotional wellbeing.", trySaying: "I'd also ask how she's feeling in herself." }]),
  ],
  anatomy: [
    q("Female pelvis", "Describe the features of the female pelvis that matter in labour.",
      ["Inlet, cavity and outlet", "Diameters", "Pelvic types", "Clinical relevance"],
      [{ point: "Tie each feature to labour.", trySaying: "The wider inlet matters because it lets the head engage." },
       { point: "Use numbers where you can.", trySaying: "The transverse diameter of the inlet is about 13 cm." }]),
  ],
  physiology: [
    q("Cardiac changes", "Explain the cardiovascular changes in pregnancy.",
      ["Increased blood volume", "Cardiac output and heart rate", "Blood pressure pattern", "Clinical implications"],
      [{ point: "Explain why the changes happen.", trySaying: "Blood volume rises to meet the placenta's needs." },
       { point: "Link to what you'd see in practice.", trySaying: "That's why a mild tachycardia can be normal." }]),
  ],
  pharmacology: [
    q("Oxytocin", "What should you know before giving oxytocin?",
      ["Indication and dose", "Route and timing", "Side effects", "Monitoring"],
      [{ point: "State the dose clearly.", trySaying: "For active management, 10 units IM after delivery." },
       { point: "Mention what you monitor afterwards.", trySaying: "I'd watch uterine tone and blood loss." }]),
  ],
  fon: [
    q("Vital signs", "How do you take and interpret a set of vital signs?",
      ["Preparation and consent", "Correct technique", "Normal ranges", "Escalation using early warning scores"],
      [{ point: "Say what you do with an abnormal value.", trySaying: "If the score triggers, I escalate straight away." },
       { point: "Mention documentation.", trySaying: "I'd chart it and note who I informed." }]),
  ],
  medical: [
    q("Diabetic patient", "How would you care for a patient admitted with hyperglycaemia?",
      ["Assessment and blood glucose", "Fluids and insulin per protocol", "Monitoring", "Education"],
      [{ point: "Name the observations you'd repeat.", trySaying: "Hourly glucose and fluid balance to start with." },
       { point: "End with patient education.", trySaying: "Before discharge I'd check they understand their insulin." }]),
  ],
  emergency: [
    q("Primary survey", "Walk me through a primary survey.",
      ["Airway with c-spine", "Breathing", "Circulation and haemorrhage control", "Disability and exposure"],
      [{ point: "Keep strictly to the ABCDE order.", trySaying: "I don't move to B until A is secure." },
       { point: "Say when you reassess.", trySaying: "After every intervention, I go back to A." }]),
  ],
  surgical: [
    q("Post-op care", "What are your priorities in the first hour after surgery?",
      ["Airway and observations", "Pain and nausea", "Wound and drains", "Fluid balance"],
      [{ point: "Prioritise out loud.", trySaying: "Airway first, then observations, then comfort." },
       { point: "Mention handover.", trySaying: "I'd confirm the plan at handover from theatre." }]),
  ],
  "mental-health": [
    q("Risk assessment", "How would you approach a patient expressing suicidal thoughts?",
      ["Safe, calm environment", "Ask directly about intent and plan", "Assess risk and protective factors", "Escalate and keep safe"],
      [{ point: "Show you'd ask directly.", trySaying: "I'd ask, 'Are you thinking about ending your life?'" },
       { point: "Say what you do next.", trySaying: "I'd stay with them and inform the team immediately." }]),
  ],
};
