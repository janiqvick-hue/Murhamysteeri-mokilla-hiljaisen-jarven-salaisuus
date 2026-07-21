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
}

export interface InspectableObject {
  id: string;
  name: string;
  description: string;
  x: number; // Percentage from left (0-100) for positioning on image/canvas
  y: number; // Percentage from top (0-100) for positioning on image/canvas
  clueIdTrigger?: string; // If inspecting reveals a clue
  requiredPhase?: GamePhase; // Only visible from this phase
  revealText?: string; // Text shown when inspected
  isInspected?: boolean; // Temporary helper
}

export interface LocationData {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  bgGradient: string; // CSS gradient representation of ambiance
  weatherAmbiance: string; // Rain/wind/fog description
  inspectables: InspectableObject[];
  unlockedAtPhase: GamePhase;
}

export interface Clue {
  id: string;
  name: string;
  description: string;
  iconType: 'lantern' | 'fiber' | 'sleeve' | 'phone' | 'message' | 'paper' | 'account' | 'tape' | 'voice' | 'footprint' | 'shoe' | 'clothes' | 'flashlight' | 'lock' | 'fabric' | 'clock' | 'keys' | 'ash' | 'tools' | 'pills';
  locationId: string;
  foundInObject?: string; // Inspectable object name
  suspectId?: string; // Linked suspect if any
  isMisleading: boolean;
  detailedAnalysis: string; // For Case File detail view
  
  // Optional rich metadata for forensic panels
  forensicAnalysis?: string;
  investigativeSignificance?: string;
  connectedClues?: string[];
  imageUrl?: string;
  evidenceValueStars?: number;
  category?: string;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  role: string;
  description: string;
  motive: string;
  secret: string;
  alibi: string;
  isGuilty: boolean;
  portraitSvgSeed: string; // Custom SVG generation seed/attributes
}

export interface DialogueTopic {
  id: string;
  label: string; // e.g. "Suhde Anttiin", "Tapahtumat illalla"
  requiredClueId?: string; // Clue needed to unlock
  requiredPhase?: GamePhase; // Phase needed to unlock
}

export interface DialogueResponse {
  suspectId: string;
  topicId: string;
  response: string; // Character's verbal response in Finnish
}

export interface Contradiction {
  id: string;
  title: string;
  description: string;
  itemA: { type: 'clue' | 'topic' | 'alibi'; id: string; name: string };
  itemB: { type: 'clue' | 'topic' | 'alibi'; id: string; name: string };
  discoveryMessage: string;
}

export interface Accusation {
  suspectId: string;
  motive: string;
  weapon: string;
  locationId: string;
  clueIds: string[]; // exactly 3 clues
}
