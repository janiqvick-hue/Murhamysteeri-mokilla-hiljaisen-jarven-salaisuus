import { useState } from 'react';
import { Suspect, DialogueTopic, GameState } from '../../types/game';
import { DIALOGUE_TOPICS, DIALOGUE_RESPONSES } from '../../data/storyData';
import { CharacterPortrait } from './SuspectList';
import { ArrowLeft, MessageSquare, Check, HelpCircle, Flame, Eye } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface InterrogationViewProps {
  suspect: Suspect;
  state: GameState;
  onBackToList: () => void;
  onCompleteTopic: (suspectId: string, topicId: string) => void;
}

export function InterrogationView({ suspect, state, onBackToList, onCompleteTopic }: InterrogationViewProps) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  
  const handleBack = () => {
    audioSynth.playClick();
    onBackToList();
  };

  // Get only the topics unlocked for this suspect in the current state
  const unlockedTopicIds = state.unlockedDialogueTopics[suspect.id] || [];
  const completedTopicIds = state.completedDialogueTopics[suspect.id] || [];

  const availableTopics = DIALOGUE_TOPICS.filter((topic) => {
    // Must be in the list of unlocked topics for this suspect
    return unlockedTopicIds.includes(topic.id);
  });

  const handleTopicClick = (topicId: string) => {
    audioSynth.playClick();
    setActiveTopicId(topicId);
    onCompleteTopic(suspect.id, topicId);
  };

  const getTopicQuestionText = (topic: DialogueTopic) => {
    switch (topic.id) {
      case 'relation':
        return `Millainen oli suhteesi Anttiin?`;
      case 'evening_events':
        return `Mitä teit tarkalleen eilen illalla?`;
      case 'alibi':
        return `Mikä on alibisi sähkökatkon aikana klo 23.00 maissa?`;
      case 'motive':
        return `Oliko sinulla syytä haluta Antin kuolemaa?`;
      case 'clue_accounting':
        return `Löysin Antin salkusta nämä yrityksen kirjanpitopaperit. Mitä osaat sanoa niistä?`;
      case 'clue_transfer':
        return `Miksi yrityksen tileiltä on siirretty satoja tuhansia euroja Cayman-saarille sinun yhtiöllesi?`;
      case 'clue_recording':
        return `Saran repusta löytyi äänitallennin. Tiesitkö, että hän nauhoitti teitä?`;
      case 'clue_recording_voice':
        return `Miksi sinun äänesi kuuluu Antin viimeisellä tallenteella rannan suunnalla klo 23.10?`;
      case 'clue_sleeve':
        return `Elinan mustan takin hiha on repeytynyt ja siitä puuttuu pala. Miksi?`;
      case 'clue_lantern':
        return `Rikospaikalta venevajasta löytyi rikkinäinen metallilyhty. Tunnistatko sen?`;
      case 'clue_footprints':
        return `Venevajan kosteasta mudasta löytyi sinun kalanruotokuvioisia kengänjälkiäsi. Miten selität tämän?`;
      case 'clue_flashlight':
        return `Löysin rannasta taskulampun, jossa on nimikirjaimet "O.M.". Onko se sinun?`;
      case 'clue_burned_paper':
        return `Tuhkasta löytyi poltetun asiakirjan pala, jossa näkyy yrityksesi kavallus. Kuka yritti polttaa sen?`;
      default:
        return `Osaatko kertoa tästä aiheesta: ${topic.label}?`;
    }
  };

  const currentResponse = activeTopicId ? DIALOGUE_RESPONSES[suspect.id]?.[activeTopicId] : null;
  const activeTopicObj = availableTopics.find(t => t.id === activeTopicId);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="interrogation-view-container">
      {/* Back button and title */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 py-2 px-4 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-md text-xs font-sans font-medium transition-colors cursor-pointer"
          id="btn-back-to-suspects"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Epäillyt</span>
        </button>

        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
          / Kuulustelu: {suspect.name}
        </span>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Suspect portrait and topics selection (40%) */}
        <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between space-y-6 backdrop-blur-sm">
          
          <div className="space-y-5">
            {/* Suspect summary card */}
            <div className="flex gap-4 items-center pb-4 border-b border-zinc-800">
              <CharacterPortrait seed={suspect.portraitSvgSeed} className="w-20 h-20 shrink-0" />
              <div>
                <h3 className="text-lg font-sans font-bold text-zinc-100">{suspect.name}</h3>
                <p className="text-xs font-mono text-zinc-500">{suspect.age} vuotta • {suspect.role}</p>
                <p className="text-[10px] text-zinc-400 mt-1">{suspect.secret ? 'Salaisuus avattavissa' : ''}</p>
              </div>
            </div>

            {/* List of available topics */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Valitse kuulustelun aihe:
              </span>

              <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
                {availableTopics.map((topic) => {
                  const isActive = activeTopicId === topic.id;
                  const isRead = completedTopicIds.includes(topic.id);
                  const isClueBased = topic.id.startsWith('clue_');

                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                      className={`w-full p-3 border rounded text-xs font-sans font-medium transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-red-950/20 border-red-700 text-red-400 shadow-[0_2px_8px_rgba(239,68,68,0.05)]'
                          : isClueBased
                          ? 'bg-amber-950/10 border-amber-900/40 hover:border-amber-700/60 text-amber-400'
                          : 'bg-zinc-950/80 border-zinc-850 hover:bg-zinc-900 text-zinc-300'
                      }`}
                      id={`topic-btn-${topic.id}`}
                    >
                      <div className="flex items-center gap-2">
                        {isClueBased ? (
                          <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                        ) : (
                          <HelpCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        )}
                        <span className="leading-snug">{topic.label}</span>
                      </div>

                      {isRead && (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Kysytty" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick instructions / count info */}
          <div className="pt-4 border-t border-zinc-800 text-left text-[10px] text-zinc-500 font-mono">
            <span>Kysymykset käyty: {completedTopicIds.length} / {unlockedTopicIds.length} aiheesta</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Dialogue log and interactive transcript (60%) */}
        <div className="lg:col-span-7 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between backdrop-blur-sm relative">
          
          <div className="space-y-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Kuulustelupöytäkirja
              </span>
            </div>

            {activeTopicId && activeTopicObj ? (
              <div className="space-y-6 flex-1 flex flex-col justify-center animate-fade-in py-4">
                {/* Question from detective */}
                <div className="space-y-1 bg-zinc-950 border border-zinc-850 p-4 rounded-md">
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wide">
                    Sinä kysyt:
                  </span>
                  <p className="text-xs md:text-sm text-zinc-200 font-sans font-medium leading-relaxed italic">
                    "{getTopicQuestionText(activeTopicObj)}"
                  </p>
                </div>

                {/* Response from suspect */}
                <div className="space-y-2 pl-4 border-l-2 border-emerald-500 bg-emerald-950/5 p-4 rounded-r-md">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wide">
                    {suspect.name} vastaa:
                  </span>
                  <p className="text-xs md:text-sm text-zinc-300 font-sans leading-relaxed">
                    {currentResponse || 'Ei vastausta tähän aiheeseen...'}
                  </p>
                </div>
              </div>
            ) : (
              /* Dialogue empty state */
              <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-600 space-y-3 select-none flex-1">
                <HelpCircle className="w-12 h-12 text-zinc-700 animate-pulse" />
                <div>
                  <p className="text-xs font-sans font-medium text-zinc-500">
                    Aloita kuulustelu
                  </p>
                  <p className="text-[10px] text-zinc-600 max-w-[260px] mt-1 mx-auto leading-relaxed">
                    Valitse vasemmasta palstasta jokin aihe kysyäksesi sitä henkilöltä. Uusia aiheita paljastuu, kun löydät tärkeitä johtolankoja ympäristöstä.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-sans leading-tight bg-zinc-950/20 p-2 rounded">
              * Vastausten sävy ja tiedot saattavat vaihdella ja muuttua sen mukaan, miten paljon todisteita olet löytänyt hänestä. Huomaa mahdolliset hermostumisen merkit ja suorat ristiriidat.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
export default InterrogationView;
