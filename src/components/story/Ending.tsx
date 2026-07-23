import { useEffect } from 'react';
import { GameState, Accusation } from '../../types/game';
import { ShieldCheck, ShieldAlert, RotateCcw, ArrowRight, Award, FileText, CheckCircle2, AlertOctagon, Stamp, UserCheck } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

interface EndingProps {
  state: GameState;
  onRestart: () => void;
  onReturnToGame: () => void;
  lastAccusation: Accusation | null;
}

export function Ending({ state, onRestart, onReturnToGame, lastAccusation }: EndingProps) {
  const { language } = useLanguage();
  const isFi = language === 'fi';
  const isCorrect = state.isAccusationCorrect;

  useEffect(() => {
    if (isCorrect) {
      audioSynth.playInvestigationStinger();
    } else {
      audioSynth.playMetalClink();
    }
  }, [isCorrect]);

  const handleRestart = () => {
    audioSynth.playClick();
    onRestart();
  };

  const handleReturn = () => {
    audioSynth.playClick();
    onReturnToGame();
  };

  if (!isCorrect) {
    // INCORRECT ACCUSATION RENDER BLOCK
    const resultType = lastAccusation?.resultType || 'WRONG_SUSPECT';
    const feedbacks = lastAccusation?.feedbacks || [];

    let titleText = isFi ? 'SYYTÖS KAATUI' : 'ACCUSATION COLLAPSED';
    let subtitleText = isFi ? 'Todisteet eivät riitä tuomioon' : 'Evidence insufficient for conviction';

    if (resultType === 'TOO_EARLY') {
      titleText = isFi ? 'SYYTÖS TEHTIIN LIIAN VARHAIN' : 'ACCUSATION TOO EARLY';
      subtitleText = isFi ? 'Tutkinta on vielä pahasti kesken' : 'Investigation is incomplete';
    } else if (resultType === 'RIGHT_SUSPECT_WEAK_EVIDENCE') {
      titleText = isFi ? 'OIKEA EPÄILTY – PUUTTEELLINEN NÄYTTÖ' : 'RIGHT SUSPECT – WEAK PROOF';
      subtitleText = isFi ? 'Syyte ei kestä oikeudessa ilman aukotonta todistusaineistoa' : 'Case fails in court without solid evidence';
    } else if (resultType === 'WRONG_SUSPECT') {
      titleText = isFi ? 'VÄÄRÄ SYYLLINEN' : 'WRONG SUSPECT';
      subtitleText = isFi ? 'Syytetyn alibi pitää – todellinen murhaaja on vapaana' : 'Suspect alibi holds – real killer is free';
    }

    return (
      <div className="min-h-screen bg-[#110c08] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden select-none" id="ending-failed-container">
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-red-950/30 via-[#110c08] to-[#110c08] pointer-events-none" />

        <div className="max-w-xl w-full bg-[#1c130d] border-2 border-red-900/80 p-6 md:p-8 rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.95)] relative z-10 animate-scale-up space-y-6" id="ending-failed-box">
          
          {/* OFFICIAL STAMP HEADER */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-950 border border-red-700/80 rounded-full text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100 tracking-tight">
                  {titleText}
                </h2>
                <p className="text-xs font-mono text-red-400 uppercase tracking-wider">
                  {subtitleText}
                </p>
              </div>
            </div>

            {/* Official Rejection Stamp */}
            <div className="border-2 border-red-700 text-red-600 font-mono text-[10px] font-extrabold px-3 py-1 rounded-2xs uppercase tracking-widest bg-red-950/50 shadow-sm hidden sm:flex items-center gap-1.5 rotate-3 animate-stamp-in">
              <Stamp className="w-4 h-4" />
              <span>SYYTE HYLÄTTY</span>
            </div>
          </div>

          <div className="space-y-4 text-sm font-sans leading-relaxed text-stone-300">
            <p>
              {isFi
                ? 'Esitit syytöksen ja järjestit todistusaineiston pöydälle. Syyttäjä ja poliisijohto kävivät teoriasi läpi ja päätyivät seuraavaan lausuntoon:'
                : 'You presented your accusation and evidence. The prosecutor reviewed your theory and concluded the following:'}
            </p>

            <div className="bg-[#120b07] border border-red-900/60 p-4 rounded-xs space-y-3 shadow-inner">
              <span className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wide flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-500" />
                {isFi ? 'Poliisin ja syyttäjän havainnot:' : 'Prosecution feedback:'}
              </span>
              <ul className="list-disc pl-5 text-xs space-y-2 text-stone-300">
                {feedbacks.map((fb, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {isFi ? fb.fi : fb.en}
                  </li>
                ))}
                {feedbacks.length === 0 && (
                  <li className="leading-relaxed">
                    {isFi
                      ? 'Syytös ei kestänyt rikostutkinnan syynissä. Palaa tutkimaan paikkoja ja yhdistelemään todisteita.'
                      : 'The accusation did not withstand forensic examination. Return to investigate and combine clues.'}
                  </li>
                )}
              </ul>
            </div>

            <p className="text-xs text-stone-400 italic">
              {isFi
                ? 'Muista tutkia mökin paikkoja, yhdistää johtolangat Tutkintataululla ja varmistaa, että valitset täsmälleen oikean henkilön, motiivin, tekovälineen, paikan ja 3–5 kiistatonta todistetta.'
                : 'Investigate locations, combine discovered clues on the Investigation Board, and ensure you select the correct suspect, motive, weapon, crime scene, and 3–5 undeniable clues.'}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleReturn}
              className="py-3 px-6 bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:-translate-y-0.5 border border-amber-600/40"
              id="btn-return-investigate"
            >
              <span>{isFi ? 'Palaa tutkimaan mökkiä' : 'Return to Investigation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CORRECT ACCUSATION - SUCCESSFUL ENDING RENDER BLOCK
  return (
    <div className="min-h-screen bg-[#0f1410] text-stone-100 py-10 px-4 relative overflow-y-auto select-none" id="ending-success-container">
      {/* Immersive cinematic background */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-emerald-950/25 via-[#0f1410] to-[#0f1410] pointer-events-none" />

      <div className="max-w-3xl mx-auto bg-[#161f18] border-2 border-emerald-800/80 p-6 md:p-10 rounded-xs shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative z-10 animate-fade-in space-y-8" id="ending-success-box">
        
        {/* Banner with Official Solved Stamp */}
        <div className="flex flex-col items-center text-center relative border-b border-stone-800 pb-8">
          
          <div className="absolute top-0 right-0 border-2 border-emerald-500 text-emerald-400 font-mono text-xs font-extrabold px-3.5 py-1.5 rounded-2xs uppercase tracking-widest bg-emerald-950/80 shadow-md hidden sm:flex items-center gap-1.5 rotate-6 animate-stamp-in">
            <Stamp className="w-4 h-4" />
            <span>TAPAUS RATKAISTU</span>
          </div>

          <div className="p-4 bg-emerald-950 border border-emerald-500 rounded-full mb-3 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-stone-100 tracking-tight">
            {isFi ? 'TAPAUS RATKAISTU – SYYTE HYVÄKSYTTY!' : 'CASE SOLVED – CHARGES ACCEPTED!'}
          </h1>
          <p className="text-xs md:text-sm font-mono text-emerald-400 uppercase tracking-widest mt-2 font-bold">
            {isFi ? 'Oikeus on tapahtunut Hiljaisella järvellä' : 'Justice has been served at Silent Lake'}
          </p>
        </div>

        {/* Story Reconstruction */}
        <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-stone-300">
          <section className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-amber-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              {isFi ? 'Mitä tapahtui? – Tapahtumien virallinen rekonstruktio' : 'Crime Reconstruction'}
            </h3>
            <p>
              {isFi
                ? 'Lopulta kaikki palaset loksahtivat paikoilleen. Esittämäsi aukoton todistusketju mursi Elina Koskisen kylmän julkisivun. Hän puhkesi kyyneliin ja tunnusti teon täydellisesti ennen kuin poliisi ehti raivata tiensä mökille.'
                : 'Finally all pieces fell into place. Your flawless evidence broken down Elina Koskinen’s cold façade. She burst into tears and confessed completely before police reached the cottage.'}
            </p>
            <p>
              {isFi
                ? 'Antti oli löytänyt yrityksen kirjanpidon syvistä syövereistä kuitit, jotka todistivat Elinan kavaltaneen yli 420 000 euroa yhteisen yrityksen rahoja omalle pöytälaatikko-osakeyhtiölleen ulkomaille. Antti oli tulostanut todisteet ja kutsunut paikalle toimittaja Saran paljastamaan varkauden.'
                : 'Antti had uncovered receipts showing Elina embezzled over 420,000 euros of company funds to her offshore shell company. Antti printed the evidence and invited journalist Sara to expose the theft.'}
            </p>
            <p>
              {isFi
                ? 'Myrskyisenä lauantai-iltana Antti ja Elina sopivat tapaamisen venevajalle klo 23.00 ratkaistakseen tilanteen. Venevajalla syntyi kiivas ja väkivaltainen riita. Antti ilmoitti tekevänsä rikosilmoituksen heti maanantaiaamuna. Paniikissa, nähdessään elämänsä ja uransa murenevan, Elina tarttui venevajan seinällä roikkuneeseen painavaan valurautaiseen metallilyhtyyn ja löi Anttia raivokkaasti päähän.'
                : 'On a stormy Saturday night, Antti and Elina met at the boathouse at 23:00. A fierce struggle ensued. Panicking as her life unraveled, Elina grabbed the heavy cast iron lantern and struck Antti.'}
            </p>
            <p>
              {isFi
                ? 'Isku oli heti kuolettava. Kamppailun aikana Antti ehti repäistä palan Elinan kalliista kashmirvillatakista, joka jäi hänen nyrkkiinsä kuolinkamppailussa. Seuraavaksi Elina yritti siivota jälkiään: hän rikkoi venevajan oven lukon antaakseen vaikutelman ryöstöstä tai ulkopuolisesta hyökkääjästä, yritti polttaa kirjanpitopapereita olohuoneen takassa ja lavasti oman keittiöalibinsa poistamalla pariston keittiön seinäkellosta klo 23.15 väittäen katsoneensa kellonajan "keittiössä siivotessaan".'
                : 'The blow was fatal. During the struggle, Antti tore a fabric piece from Elina’s cashmere coat. Elina then staged a break-in, burned ledger papers, and faked her kitchen alibi by stopping the clock at 23:15.'}
            </p>
          </section>

          {/* Clue Explanations */}
          <section className="bg-[#0e1711] border border-emerald-900/60 p-5 rounded-xs space-y-3">
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              {isFi ? 'Tärkeimpien johtolankojen merkitys tuomiossa:' : 'Key Evidence Significance:'}
            </h4>
            <ul className="text-xs space-y-2.5 text-stone-300 pl-4 list-disc">
              <li>
                <strong className="text-stone-100">{isFi ? 'Kavalluksen tilisiirto ja kirjanpito:' : 'Embezzlement transfer & ledgers:'}</strong> {isFi ? 'Paljasti Elinan taloudellisen motiivin.' : 'Revealed Elina’s financial motive.'}
              </li>
              <li>
                <strong className="text-stone-100">{isFi ? 'Saran äänitallenne:' : 'Sara’s recording:'}</strong> {isFi ? 'Kumosi Elinan keittiöalibin täysin todistamalla hänen olleen venevajalla.' : 'Completely disproved Elina’s kitchen alibi.'}
              </li>
              <li>
                <strong className="text-stone-100">{isFi ? 'Musta kangaspala ja kuitu lyhdyssä:' : 'Fabric torn & fiber on lantern:'}</strong> {isFi ? 'Sitoivat Elinan fyysisesti kamppailuun.' : 'Physically bound Elina to the struggle.'}
              </li>
              <li>
                <strong className="text-stone-100">{isFi ? 'Venevajan kengänjäljet:' : 'Boathouse footprints:'}</strong> {isFi ? 'Kalanruotokuviot vastasivat täydellisesti Elinan kenkiä.' : 'Herringbone patterns matched Elina’s shoes.'}
              </li>
              <li>
                <strong className="text-stone-100">{isFi ? 'Rikkoutunut lyhty:' : 'Broken lantern:'}</strong> {isFi ? 'Toimi murha-aseena, josta löytyi kuitua ja hiuksia.' : 'Served as the murder weapon.'}
              </li>
            </ul>
          </section>

          {/* Character Epilogues */}
          <section className="space-y-3 border-t border-stone-800 pt-6">
            <h3 className="text-lg font-serif font-bold text-amber-400 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              {isFi ? 'Mitä ystäville tapahtui myöhemmin?' : 'Epilogue'}
            </h3>
            <p className="text-sm text-stone-300">
              <strong className="text-stone-100">Elina Koskinen</strong> {isFi ? 'tuomittiin pitkään vankeusrangaistukseen.' : 'was sentenced to prison for manslaughter and embezzlement.'}
            </p>
            <p className="text-sm text-stone-300">
              <strong className="text-stone-100">Markus Salo</strong> {isFi ? 'pelastui vankeusepäilyiltä ja hakeutui hoitoon peliongelmaansa.' : 'was cleared of suspicion and sought treatment for his gambling addiction.'}
            </p>
            <p className="text-sm text-stone-300">
              <strong className="text-stone-100">Laura Niemi</strong> {isFi ? 'perusti pienen taidegallerian Antin muistoksi.' : 'opened a small art gallery in Antti’s memory.'}
            </p>
            <p className="text-sm text-stone-300">
              <strong className="text-stone-100">Sara Virtanen</strong> {isFi ? 'kirjoitti bestseller-kirjan tapahtumista.' : 'wrote a bestselling book about the case.'}
            </p>
            <p className="text-sm text-stone-300">
              <strong className="text-stone-100">Oskari Mäkelä</strong> {isFi ? 'oli huojentunut, että mökin synkkä varjo haihtui.' : 'was relieved the dark shadow over the cottage was cleared.'}
            </p>
          </section>
        </div>

        {/* Stats Summary */}
        <div className="pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0e1711] p-4 rounded-xs border border-emerald-900/40">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">{isFi ? 'TUTKINNAN LOPPUARVOSANA' : 'FINAL RANK'}</p>
              <p className="text-base font-serif font-bold text-emerald-400">
                {isFi ? 'Mestarietsivä (Aukoton syyte)' : 'Master Detective'}
              </p>
            </div>
          </div>
          <div className="flex gap-5 text-xs font-mono text-stone-300">
            <div>
              <span>{isFi ? 'Syytösyritykset:' : 'Attempts:'} </span>
              <span className="text-amber-400 font-bold">{state.accusationAttempts}</span>
            </div>
            <div>
              <span>{isFi ? 'Johtolangat löydetty:' : 'Clues:'} </span>
              <span className="text-emerald-400 font-bold">{state.discoveredClues.length}/20</span>
            </div>
          </div>
        </div>

        {/* Play Again button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleRestart}
            className="py-3.5 px-10 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-serif font-bold uppercase tracking-wider text-xs rounded-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 border border-emerald-500/50"
            id="btn-play-again"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isFi ? 'Aloita uusi tutkinta' : 'Play Again'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ending;
