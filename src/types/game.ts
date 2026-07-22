import { LocalizedText } from '../localization/types';

export type GamePhase = 'PROLOGUE' | 'VAIHE1' | 'VAIHE2' | 'VAIHE3' | 'ACCUSATION' | 'ENDING';

export interface Settings {
  musicOn: boolean;
  soundOn: boolean;
  textSize: 'normal' | 'large' | 'huge';
  reducedMotion: boolean;
}

export interface GameState {
  currentPhase: GamePhase;
  currentLocationId: string | null;
  visitedLocations: string[]; // Location IDs
  discoveredClues: string[]; // Clue IDs
  unlockedDialogueTopics: Record<string, string[]>; // suspectId -> list of topicIds
  completedDialogueTopics: Record<string, string[]>; // suspectId -> list of topicIds
  discoveredContradictions: string[]; // Contradiction IDs
  notes: string; // Player custom notes
  accusationAttempts: number;
  gameCompleted: boolean;
  isAccusationCorrect: boolean;
  settings: Settings;
  showIntro: boolean; // false if they clicked 'pelaa'
  ratkaistutRistiriidat: string[];
  vihjeTaso: number;
  hasSeenRecorderNotice?: boolean;
}

export interface InspectableObject {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  x: number; // Percentage from left (0-100) for positioning on image/canvas
  y: number; // Percentage from top (0-100) for positioning on image/canvas
  clueIdTrigger?: string; // If inspecting reveals a clue
  requiredPhase?: GamePhase; // Only visible from this phase
  revealText?: LocalizedText; // Text shown when inspected
  isInspected?: boolean; // Temporary helper
}

export interface LocationData {
  id: string;
  name: LocalizedText;
  shortDesc: LocalizedText;
  longDesc: LocalizedText;
  bgGradient: string; // CSS gradient representation of ambiance
  weatherAmbiance: LocalizedText; // Rain/wind/fog description
  inspectables: InspectableObject[];
  unlockedAtPhase: GamePhase;
}

export interface Clue {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  iconType: 'lantern' | 'fiber' | 'sleeve' | 'phone' | 'message' | 'paper' | 'account' | 'tape' | 'voice' | 'footprint' | 'shoe' | 'clothes' | 'flashlight' | 'lock' | 'fabric' | 'clock' | 'keys' | 'ash' | 'tools' | 'pills' | 'branch';
  locationId: string;
  foundInObject?: string; // Inspectable object name
  suspectId?: string; // Linked suspect if any
  isMisleading: boolean;
  detailedAnalysis: LocalizedText; // For Case File detail view
  
  // Optional rich metadata for forensic panels
  forensicAnalysis?: LocalizedText;
  investigativeSignificance?: LocalizedText;
  connectedClues?: string[];
  imageUrl?: string;
  evidenceValueStars?: number;
  category?: string;
}

export interface Suspect {
  id: string;
  name: string; // Do not localize suspect names
  age: number;
  role: LocalizedText;
  description: LocalizedText;
  motive: LocalizedText;
  secret: LocalizedText;
  alibi: LocalizedText;
  isGuilty: boolean;
  portraitSvgSeed: string; // Custom SVG generation seed/attributes
}

export interface DialogueTopic {
  id: string;
  label: LocalizedText; // e.g. "Suhde Anttiin", "Tapahtumat illalla"
  requiredClueId?: string; // Clue needed to unlock
  requiredPhase?: GamePhase; // Phase needed to unlock
}

export interface DialogueResponse {
  suspectId: string;
  topicId: string;
  response: LocalizedText; // Character's verbal response
}

export interface Contradiction {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  itemA: { type: 'clue' | 'topic' | 'alibi'; id: string; name: string };
  itemB: { type: 'clue' | 'topic' | 'alibi'; id: string; name: string };
  discoveryMessage: LocalizedText;
}

export interface Accusation {
  suspectId: string;
  motive: string;
  weapon: string;
  locationId: string;
  clueIds: string[]; // 3 to 5 clues
  resultType?: 'FULL_CORRECT' | 'RIGHT_SUSPECT_WEAK_EVIDENCE' | 'WRONG_SUSPECT' | 'TOO_EARLY';
  feedbacks?: { fi: string; en: string }[];
}

export interface GameState {
  currentPhase: GamePhase;
  currentLocationId: string | null;
  visitedLocations: string[]; // Location IDs
  discoveredClues: string[]; // Clue IDs
  unlockedDialogueTopics: Record<string, string[]>; // suspectId -> list of topicIds
  completedDialogueTopics: Record<string, string[]>; // suspectId -> list of topicIds
  discoveredContradictions: string[]; // Contradiction IDs
  notes: string; // Player custom notes
  accusationAttempts: number;
  gameCompleted: boolean;
  isAccusationCorrect: boolean;
  lastAccusation: Accusation | null;
  settings: Settings;
  showIntro: boolean; // false if they clicked 'pelaa'
  ratkaistutRistiriidat: string[];
  vihjeTaso: number;
}
