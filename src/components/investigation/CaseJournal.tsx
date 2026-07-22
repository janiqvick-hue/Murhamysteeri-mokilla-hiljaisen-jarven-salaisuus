import { useState } from 'react';
import { GameState, Clue } from '../../types/game';
import { CLUES, SUSPECTS, DIALOGUE_RESPONSES, LOCATIONS } from '../../data/storyData';
import { DEDUCTIONS } from '../../data/deductionData';
import { useLanguage } from '../../localization/useLanguage';
import { audioSynth } from '../../hooks/useAudio';
import { BookOpen, FileText, CheckCircle2, Award, ClipboardList, Eye } from 'lucide-react';

interface CaseJournalProps {
  state: GameState;
  setActiveInspectClue: (clue: Clue | null) => void;
}

export function CaseJournal({ state, setActiveInspectClue }: CaseJournalProps) {
  const { t, tText } = useLanguage();
  const [activeSection, setActiveSection] = useState<'clues' | 'statements' | 'observations' | 'deductions'>('clues');

  const isFinnish = t('settings.textSizeNormal') === 'Normaali';

  // Resolve location name
  const getClueLocationName = (locationId: string): string => {
    const loc = LOCATIONS.find(l => l.id === locationId);
    return loc ? tText(loc.name) : locationId;
  };

  // Check if a suspect's alibi is unlocked
  const isAlibiUnlocked = (suspectId: string): boolean => {
    return !!state.completedDialogueTopics[suspectId]?.includes('alibi');
  };

  // Check if Elina's contradiction is resolved
  const isElinaAlibiBroken = !!state.ratkaistutRistiriidat?.includes('elina_alibi_murrettu');

  // Filter out clues that are discovered
  const discoveredClues = CLUES.filter(clue => state.discoveredClues.includes(clue.id));

  // Render Section Selector (Protruding vintage index tabs)
  const renderIndexTabs = () => {
    const sections = [
      { id: 'clues', label: isFinnish ? 'I. Todisteet' : 'I. Evidence', icon: <FileText className="w-3 h-3" /> },
      { id: 'statements', label: isFinnish ? 'II. Lausunnot' : 'II. Statements', icon: <BookOpen className="w-3 h-3" /> },
      { id: 'observations', label: isFinnish ? 'III. Tutkijan havainnot' : 'III. Detective\'s Observations', icon: <Eye className="w-3 h-3" /> },
      { id: 'deductions', label: isFinnish ? 'IV. Ratkaistut päättelyt' : 'IV. Solved Deductions', icon: <ClipboardList className="w-3 h-3" /> },
    ] as const;

    return (
      <div className="flex flex-wrap md:flex-nowrap gap-1 border-b border-[#30241b] pb-2 relative z-20">
        {sections.map(sec => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                audioSynth.playClick();
                setActiveSection(sec.id);
              }}
              className={`flex items-center gap-2 py-2 px-4 text-[11px] md:text-xs font-mono tracking-wider transition-all duration-200 select-none cursor-pointer rounded-t-lg border-t border-x ${
                isActive
                  ? 'bg-[#1a1410] text-[#dfb875] border-[#5a4435] font-bold shadow-[0_-2px_10px_rgba(0,0,0,0.5)] translate-y-[1px]'
                  : 'bg-[#0d0a08]/70 text-[#7a6455] border-[#2b1f17] hover:text-[#bca493] hover:bg-[#120e0a]'
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Render individual sections
  const renderActiveSectionContent = () => {
    switch (activeSection) {
      case 'clues':
        return (
          <div className="space-y-6 animate-scale-up">
            <div className="border-b border-[#3e2e22]/50 pb-2">
              <h4 className="text-sm font-serif italic text-[#dfb875] uppercase tracking-wide">
                {isFinnish ? 'LÖYDETYT JOHTOLANGAT' : 'DISCOVERED CLUES'}
              </h4>
              <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                {isFinnish 
                  ? 'Luettelo rikostutkinnassa löydetyistä ja luetteloiduista esineistä ja jäljistä.' 
                  : 'A list of items and traces found and cataloged during the investigation.'}
              </p>
            </div>

            {discoveredClues.length === 0 ? (
              <div className="text-center py-12 text-[#604a3c] font-sans italic text-xs">
                {isFinnish ? 'Ei vielä löydettyjä johtolankoja.' : 'No clues found yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {discoveredClues.map(clue => (
                  <div
                    key={clue.id}
                    onClick={() => {
                      audioSynth.playClick();
                      setActiveInspectClue(clue);
                    }}
                    className="border border-[#35271e] bg-[#110d0a] hover:bg-[#16110d] p-4 rounded-md transition-all duration-200 cursor-pointer group shadow-[1px_2px_5px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-500 shrink-0 font-bold select-none text-xs">✔</span>
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs md:text-sm font-serif italic font-bold text-stone-200 group-hover:text-amber-400 transition-colors">
                            {tText(clue.name)}
                          </h5>
                          <span className="text-[8px] font-mono text-[#8c6d56] uppercase tracking-widest bg-[#221811] px-1.5 py-0.5 rounded border border-[#3c2a1d]">
                            {isFinnish ? 'Johtolanka' : 'Clue'}
                          </span>
                        </div>
                        
                        <div className="text-[10px] text-stone-400 font-sans space-y-1">
                          <p>
                            <strong className="text-[#8c6d56] font-mono uppercase tracking-wider text-[9px] mr-1">
                              {isFinnish ? 'Löytynyt:' : 'Found:'}
                            </strong>
                            <span className="text-stone-300 font-medium">{getClueLocationName(clue.locationId)}</span>
                          </p>
                          <div className="pt-1.5 border-t border-[#2a1d14] mt-1.5">
                            <strong className="text-[#8c6d56] font-mono uppercase tracking-wider text-[9px] block mb-0.5">
                              {isFinnish ? 'Muistiinpano:' : 'Notes:'}
                            </strong>
                            <p className="leading-relaxed text-[#cbb8a9] font-serif italic text-xs">
                              {tText(clue.description)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'statements':
        return (
          <div className="space-y-6 animate-scale-up">
            <div className="border-b border-[#3e2e22]/50 pb-2">
              <h4 className="text-sm font-serif italic text-[#dfb875] uppercase tracking-wide">
                {isFinnish ? 'KUULUSTELULAUSUNNOT JA ALIBIT' : 'INTERROGATION STATEMENTS AND ALIBIS'}
              </h4>
              <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                {isFinnish 
                  ? 'Epäiltyjen antamat selvitykset alibeistaan sekä muista tapahtumista.' 
                  : 'Statements and alibis provided by the suspects.'}
              </p>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
              {SUSPECTS.map(suspect => {
                const isAlibiOpen = isAlibiUnlocked(suspect.id);
                const hasResolvedContradiction = suspect.id === 'elina' && isElinaAlibiBroken;
                
                // Get all completed dialogue topics for this suspect
                const completedTopics = state.completedDialogueTopics[suspect.id] || [];

                return (
                  <div key={suspect.id} className="border-b border-[#2d2118] pb-5 last:border-b-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500/80">👤</span>
                        <h5 className="text-sm font-serif italic font-bold text-stone-100">
                          {suspect.name}
                        </h5>
                        <span className="text-[9px] text-[#8c6d56] font-sans">({tText(suspect.role)})</span>
                      </div>
                      
                      {isAlibiOpen && hasResolvedContradiction && (
                        <span className="flex items-center gap-1 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded text-[10px] font-serif italic text-[#dfb875] shadow-sm select-none">
                          <span>✓</span> {isFinnish ? 'Ristiriita havaittu' : 'Contradiction detected'}
                        </span>
                      )}
                    </div>

                    {completedTopics.length === 0 ? (
                      <p className="text-xs text-stone-600 font-sans italic pl-6 select-none">
                        {isFinnish ? 'Ei vielä kuulusteltu.' : 'Not interrogated yet.'}
                      </p>
                    ) : (
                      <div className="pl-6 space-y-3">
                        {completedTopics.map(topic => {
                          const statementText = DIALOGUE_RESPONSES[suspect.id]?.[topic];
                          if (!statementText) return null;

                          // Helper to format topic titles
                          const getTopicTitle = (tId: string) => {
                            if (tId === 'alibi') return isFinnish ? 'Alibi' : 'Alibi';
                            if (tId === 'relation') return isFinnish ? 'Suhde Anttiin' : 'Relation to Antti';
                            if (tId === 'evening_events') return isFinnish ? 'Illan tapahtumat' : 'Evening Events';
                            if (tId === 'motive') return isFinnish ? 'Motiivi' : 'Motive';
                            
                            // If it asks about a clue
                            if (tId.startsWith('clue_')) {
                              const clueId = tId.replace('clue_', '');
                              const clue = CLUES.find(c => c.id === clueId);
                              const clueName = clue ? tText(clue.name) : clueId;
                              return isFinnish ? `Lausunto koskien todistetta: ${clueName}` : `Statement regarding clue: ${clueName}`;
                            }
                            return tId;
                          };

                          return (
                            <div key={topic} className="space-y-1">
                              <span className="text-[9px] font-mono text-[#8c6d56] uppercase tracking-wider block font-bold">
                                {getTopicTitle(topic)}
                              </span>
                              <p className="text-xs font-serif italic text-stone-300 leading-relaxed border-l-2 border-[#4e3c31] pl-3 py-0.5">
                                "{statementText}"
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'observations':
        return (
          <div className="space-y-6 animate-scale-up">
            <div className="border-b border-[#3e2e22]/50 pb-2">
              <h4 className="text-sm font-serif italic text-[#dfb875] uppercase tracking-wide">
                {isFinnish ? 'TUTKIJAN HAVAINNOT' : 'DETECTIVE’S OBSERVATIONS'}
              </h4>
              <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                {isFinnish 
                  ? 'Tutkinnan edetessä ja ristiriitoja ratkaistaessa muodostuvat tärkeät päätelmät.' 
                  : 'Key deductions made during the investigation as contradictions are resolved.'}
              </p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {isElinaAlibiBroken ? (
                <div className="border border-dashed border-[#5a4435] bg-[#1a1410] p-5 rounded-md shadow-md space-y-2 relative">
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500/30" />
                  <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                    {isFinnish ? 'HAVAINTO #1' : 'OBSERVATION #1'}
                  </span>
                  <h5 className="text-xs md:text-sm font-serif italic font-bold text-stone-200">
                    {isFinnish ? 'Elinan kertomus tapahtumien kulusta ei vaikuta enää uskottavalta.' : 'Elina’s account of events no longer seems credible.'}
                  </h5>
                  <p className="text-xs text-stone-400 font-sans leading-relaxed pt-1 border-t border-[#30241a]">
                    {isFinnish 
                      ? 'Hänen keittiöalibinsa ja aikajanan selostuksensa on osoitettu virheelliseksi kerätyn aineiston pohjalta.' 
                      : 'Her kitchen alibi and timeline explanation have been proven false based on the evidence gathered.'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-[#604a3c] font-sans italic text-xs">
                  {isFinnish 
                    ? 'Ei vielä kirjattuja havaintoja. Ratkaise päättelytehtäviä tehdäksesi havaintoja.' 
                    : 'No observations recorded yet. Solve deduction tasks to form observations.'}
                </div>
              )}
            </div>
          </div>
        );

      case 'deductions':
        return (
          <div className="space-y-6 animate-scale-up">
            <div className="border-b border-[#3e2e22]/50 pb-2">
              <h4 className="text-sm font-serif italic text-[#dfb875] uppercase tracking-wide">
                {isFinnish ? 'RATKAISTUT PÄÄTTELYT' : 'SOLVED DEDUCTIONS'}
              </h4>
              <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                {isFinnish 
                  ? 'Kokonaiskuva ratkaistuista ja vielä ratkaistavista rikostutkinnan kysymyksistä.' 
                  : 'An overview of solved and pending questions in the criminal investigation.'}
              </p>
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {DEDUCTIONS.map(item => {
                const resolved = !!state.ratkaistutRistiriidat?.includes(item.solvedFlag);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded border flex items-center justify-between ${
                      resolved
                        ? 'bg-amber-950/20 border-amber-900/60 text-stone-200 shadow-sm'
                        : 'bg-[#100d0a] border-[#221b14] text-[#6d5b4e] select-none'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-base font-serif font-bold ${resolved ? 'text-amber-500' : 'text-[#44352b]'}`}>
                        {resolved ? '☑' : '☐'}
                      </span>
                      <span className={`text-xs md:text-sm font-serif font-medium ${resolved ? 'text-stone-200' : 'text-stone-500'}`}>
                        {tText(item.title)}
                      </span>
                    </div>
                    
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${
                      resolved
                        ? 'bg-[#2b1f15] text-amber-500 border border-[#4a3625]'
                        : 'bg-[#120e0a] text-stone-600 border border-[#221912]'
                    }`}>
                      {resolved 
                        ? (isFinnish ? 'Ratkaistu' : 'Resolved') 
                        : (isFinnish ? 'Avoinna' : 'Pending')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 animate-scale-up" id="case-journal-binder">
      {/* Immersive Binder Outer Leather Cover Frame */}
      <div className="relative rounded-3xl p-4 md:p-8 bg-[#1f1712] border-[12px] border-[#130d09] shadow-[inset_0_4px_25px_rgba(0,0,0,0.95),_0_15px_35px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Soft atmospheric highlights */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Vintage Ring Binder Center Seam Graphic - hidden on small screens */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/60 via-transparent to-black/60 border-x border-[#3a2c20]/40 z-10 hidden md:block" />

        {/* Protruding Index Tabs */}
        {renderIndexTabs()}

        {/* Binder Paper Sheet Pages */}
        <div className="relative z-10 bg-[#16120e] border border-[#3c2e23] rounded-b-xl rounded-tr-xl md:rounded-r-xl p-5 md:p-8 min-h-[460px] flex flex-col justify-between mt-[-1px] shadow-[inset_0_2px_15px_rgba(0,0,0,0.85)]">
          {/* Paper overlay grain */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.015] pointer-events-none mix-blend-overlay" />

          {/* Page contents */}
          <div className="space-y-4 relative z-10">
            {renderActiveSectionContent()}
          </div>

          {/* Book bottom index footer */}
          <div className="border-t border-[#2b1f16] pt-4 mt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#745e4d] select-none gap-2">
            <div>
              {isFinnish 
                ? 'KESKUSRIKOSPOLIISI — REKISTERÖITY TUTKINTAPÄIVÄKIRJA' 
                : 'NATIONAL BUREAU OF INVESTIGATION — OFFICIAL CASE JOURNAL'}
            </div>
            <div>
              {isFinnish ? 'SIVU' : 'PAGE'} {activeSection === 'clues' ? '1' : activeSection === 'statements' ? '2' : activeSection === 'observations' ? '3' : '4'}/4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
