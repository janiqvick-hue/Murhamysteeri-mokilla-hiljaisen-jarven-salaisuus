import { GameState, Accusation } from '../../types/game';
import { ShieldCheck, ShieldAlert, RotateCcw, ArrowRight, Award, FileText, CheckCircle2 } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface EndingProps {
  state: GameState;
  onRestart: () => void;
  onReturnToGame: () => void;
  lastAccusation: Accusation | null;
}

export function Ending({ state, onRestart, onReturnToGame, lastAccusation }: EndingProps) {
  const isCorrect = state.isAccusationCorrect;

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
    // Tell them what parts of their accusation were incorrect/incomplete, but don't spoil who the killer is.
    const feedback: string[] = [];
    if (lastAccusation) {
      if (lastAccusation.suspectId !== 'elina') {
        feedback.push('Syytetty henkilö kiistää jyrkästi syyllisyytensä, eikä hänen alibinsa kumoutunut riittävästi löydetyillä todisteilla. Todellinen tekijä on vielä vapaana.');
      }
      if (lastAccusation.motive !== 'Antti aikoi paljastaa kavalluksen') {
        feedback.push('Motiivi on ristiriidassa talousasiakirjojen ja todellisten taustasyiden kanssa. Johtolankojen syvällisempi analyysi on tarpeen.');
      }
      if (lastAccusation.weapon !== 'metallinen lyhty') {
        feedback.push('Teon välineeksi epäilty esine ei vastaa Antin pään ruhjeiden muotoa tai rikospaikalta löytynyttä ensisijaista esinettä.');
      }
      if (lastAccusation.locationId !== 'venevaja') {
        feedback.push('Tapahtumapaikka on väärä. Ruumiin löytöpaikka ja rikospaikalta kerätty lika ja kengänjäljet viittaavat toiseen sijaintiin.');
      }
      // Check if they included the critical clues (must contain 'tilisiirto_elinalle', 'elinan_aani_tallenteella', 'kangas_antin_kadessa' / 'repeytynyt_hiha' / 'kenganjaljet_venevajalla')
      const correctClues = ['tilisiirto_elinalle', 'elinan_aani_tallenteella', 'kangas_antin_kadessa', 'repeytynyt_hiha', 'kenganjaljet_venevajalla', 'rikkinainen_lyhty'];
      const correctSelected = lastAccusation.clueIds.filter(id => correctClues.includes(id));
      if (correctSelected.length < 3) {
        feedback.push('Valitsemasi kolme todistetta eivät sido syyllistä tekoon riittävän vahvasti. Tarvitset fyysisiä ja teknisiä todisteita, jotka murtavat syytetyn valheet.');
      }
    } else {
      feedback.push('Syytöksesi oli puutteellinen tai väärä. Palaa takaisin tutkimaan paikkoja, yhdistelemään todisteita ja kuulustelemaan epäiltyjä tarkemmin.');
    }

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden" id="ending-failed-container">
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-red-950/10 via-zinc-950 to-zinc-950 pointer-events-none" />
        
        <div className="max-w-xl w-full bg-zinc-900 border border-red-900/40 p-6 md:p-8 rounded-lg shadow-2xl relative z-10 animate-scale-up" id="ending-failed-box">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-950 border border-red-700 rounded-full text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-zinc-100 tracking-tight">
                SYYTÖS KAATUI
              </h2>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Todisteet eivät riitä tuomioon
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm font-sans leading-relaxed text-zinc-300">
            <p>
              Esitit syytöksen ja analysoit todistusaineistoa mökin olohuoneen pöydän äärellä. Syytöksen esittäminen on kuitenkin vakava paikka. Kun järjestät palapelin palasia, huomaat, että jotkin osat teoriastasi murenevat...
            </p>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-md space-y-3">
              <span className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wide">
                Tutkinnan havainnot syytöksestäsi:
              </span>
              <ul className="list-disc pl-5 text-xs space-y-2 text-zinc-400">
                {feedback.map((line, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-zinc-400">
              Muista tutkia tarkkaan kaikki 11 paikkaa, kerätä vähintään 15 johtolankaa ja yhdistää ne Tutkintataululla löytääksesi <strong className="text-zinc-300">ristiriitoja</strong> epäiltyjen alibien välillä.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleReturn}
              className="py-3 px-6 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 font-sans text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              id="btn-return-investigate"
            >
              <span>Palaa tutkimaan mökkiä</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CORRECT ACCUSATION - SUCCESSFUL ENDING RENDER BLOCK
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 relative overflow-y-auto" id="ending-success-container">
      {/* Immersive cinematic background */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-blue-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-lg shadow-2xl relative z-10 animate-fade-in" id="ending-success-box">
        {/* Banner */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-full mb-3 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-12 h-12 animate-bounce" />
          </div>
          <h1 className="text-2xl md:text-4xl font-sans font-bold text-zinc-100 tracking-tight">
            MYSTEERI ON RATKAISTU!
          </h1>
          <p className="text-xs md:text-sm font-mono text-emerald-500 uppercase tracking-widest mt-1.5 font-bold">
            Oikeus on tapahtunut Hiljaisella järvellä
          </p>
          <div className="w-24 h-[1px] bg-emerald-500/30 mt-4" />
        </div>

        {/* Story Reconstruction */}
        <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-zinc-300">
          <section className="space-y-3">
            <h3 className="text-lg font-sans font-semibold text-amber-500 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              Mitä tapahtui? – Tapahtumien rekonstruktio
            </h3>
            <p>
              Lopulta kaikki palaset loksahtivat paikoilleen. Esittämäsi aukoton todistusketju mursi <strong className="text-zinc-100">Elina Koskisen</strong> kylmän julkisivun. Hän puhkesi kyyneliin ja tunnusti teon täydellisesti ennen kuin poliisi ehti raivata tiensä mökille.
            </p>
            <p>
              Antti oli löytänyt yrityksen kirjanpidon syvistä syövereistä kuitit, jotka todistivat Elinan kavaltaneen yli 420 000 euroa yhteisen yrityksen rahoja omalle pöytälaatikko-osakeyhtiölleen ulkomaille. Antti oli tulostanut todisteet ja kutsunut paikalle toimittaja Saran paljastamaan varkauden.
            </p>
            <p>
              Myrskyisenä lauantai-iltana Antti ja Elina sopivat tapaamisen venevajalle klo 23.00 ratkaistakseen tilanteen. Venevajalla syntyi kiivas ja väkivaltainen riita. Antti ilmoitti tekevänsä rikosilmoituksen heti maanantaiaamuna. Paniikissa, nähdessään elämänsä ja uransa murenevan, Elina tarttui venevajan seinällä roikkuneeseen painavaan valurautaiseen metallilyhtyyn ja löi Anttia raivokkaasti päähän.
            </p>
            <p>
              Isku oli heti kuolettava. Kamppailun aikana Antti ehti repäistä palan Elinan kalliista kashmirvillatakista, joka jäi hänen nyrkkiinsä kuolinkamppailussa. Seuraavaksi Elina yritti siivota jälkiään: hän rikkoi venevajan oven lukon antaakseen vaikutelman ryöstöstä tai ulkopuolisesta hyökkääjästä, yritti polttaa kirjanpitopapereita olohuoneen takassa ja lavasti oman keittiöalibinsa poistamalla pariston keittiön seinäkellosta klo 23.15 väittäen katsoneensa kellonajan "keittiössä siivotessaan".
            </p>
          </section>

          {/* Clue Explanations */}
          <section className="bg-zinc-950 border border-zinc-800 p-5 rounded-md space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              Tärkeimpien johtolankojen merkitys tuomiossa:
            </h4>
            <ul className="text-xs space-y-2.5 text-zinc-400 pl-4 list-disc">
              <li>
                <strong className="text-zinc-200">Kavalluksen tilisiirto ja kirjanpito:</strong> Paljasti Elinan taloudellisen motiivin. Antti aikoi tuhota hänen elämänsä maanantaina.
              </li>
              <li>
                <strong className="text-zinc-200">Saran äänitallenne:</strong> Kumosi Elinan keittiöalibin täysin todistamalla, että hän oli venevajalla riitelemässä Antin kanssa klo 23.10.
              </li>
              <li>
                <strong className="text-zinc-200">Musta kangaspala ja kuitu lyhdyssä:</strong> Sitoivat Elinan fyysisesti kamppailuun. Kallis kashmirvilla vastasi tismalleen hänen repeytynyttä takkiansa.
              </li>
              <li>
                <strong className="text-zinc-200">Venevajan kengänjäljet:</strong> Kalanruotokuviot mudassa vastasivat täydellisesti Elinan omia kenkiä mökin eteisessä, todistaen hänen käyneen venevajassa.
              </li>
              <li>
                <strong className="text-zinc-200">Rikkoutunut lyhty:</strong> Toimi murha-aseena, johon oli takertunut Elinan takin kuitua ja uhrin hiuksia.
              </li>
            </ul>
          </section>

          {/* Character Epilogues */}
          <section className="space-y-3 border-t border-zinc-800 pt-6">
            <h3 className="text-lg font-sans font-semibold text-amber-500">
              Mitä ystäville tapahtui myöhemmin?
            </h3>
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">Elina Koskinen</strong> tuomittiin myöhemmin oikeudessa taposta ja törkeästä kavalluksesta pitkään vankeusrangaistukseen. Yrityksen varat palautettiin perikunnalle.
            </p>
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">Markus Salo</strong> pelastui vankeusepäilyiltä esittämäsi selvityksen ansiosta. Antin kuolema kosketti häntä syvästi, ja hän haki apua peliongelmaansa päästen vihdoin jaloilleen.
            </p>
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">Laura Niemi</strong> sai vihdoin rauhan pitkän surun jälkeen. Henkivakuutuksen korvauksella hän perusti pienen taidegallerian Antin muistoksi.
            </p>
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">Sara Virtanen</strong> kirjoitti tapahtumista bestseller-tietokirjan "Hiljaisen järven murha", joka nosti hänen uransa valtakunnalliseksi menestykseksi.
            </p>
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">Oskari Mäkelä</strong> sai sakkoja luvattomista rakennustöistään, mutta oli ennen kaikkea huojentunut, että syyllinen saatiin kiinni ja hänen rakas perintömökkinsä puhdistui synkästä varjosta.
            </p>
          </section>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-md">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">TUTKINNAN YHTEENVETO</p>
              <p className="text-sm font-sans text-zinc-300">
                Arvosanasi: <span className="text-emerald-500 font-bold">Mestarietsivä</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span>Syytösyritykset: </span>
              <span className="text-zinc-200 font-bold">{state.accusationAttempts}</span>
            </div>
            <div>
              <span>Johtolangat löydetty: </span>
              <span className="text-zinc-200 font-bold">{state.discoveredClues.length}/20</span>
            </div>
          </div>
        </div>

        {/* Play Again button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRestart}
            className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-sans font-semibold rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_10px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
            id="btn-play-again"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Pelaa uudelleen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Ending;
