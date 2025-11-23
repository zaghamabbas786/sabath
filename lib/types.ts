export interface ScriptureAnchor {
  reference: string;
  text: string;
}

export interface DayPlan {
  day_title: string;
  activity: string;
  listening_prompt: string;
  scripture_ref: string;
  declaration: string;
}

export interface HealingResponse {
  what_i_am_hearing: string;
  body_connection: string[];
  emotional_roots: string[];
  spiritual_roots: string[];
  scripture_anchors: ScriptureAnchor[];
  guided_prayer: string[];
  seven_day_program: DayPlan[];
  is_medical_warning: boolean;
}

export interface SymptomCategoryType {
  id: string;
  label: string;
  options: string[];
}

export enum AppState {
  HOME = 'HOME',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  PAYWALL = 'PAYWALL'
}


