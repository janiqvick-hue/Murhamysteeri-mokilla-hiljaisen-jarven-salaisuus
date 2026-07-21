import { useState } from 'react';
import { ShieldAlert, MapPin, Eye, ArrowRight, Skull } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface PrologueProps {
  onStartGame: () => void;
}

export function Prologue({ onStartGame }: PrologueProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'MYRSKYINEN ILTA',
      icon: ShieldAlert,
      color: 'text-amber-500',
      bgGradient: 'from-blue-950/40 via-stone-950 to-zinc-950',
      text: [
        'Mökin olohuoneessa kynttilät värisevät ikkunasta siivilöityvän vedon voimasta. Ulkona myrsky piiskaa ikkunoita ja sähköt ovat olleet katkenneena jo tuntikausia.',
        'Kuusi vanhaa opiskelukaveria oli kokoontunut viettämään rentouttavaa viikonloppua Hiljaisen järven rannalla sijaitsevalle syrjäiselle mökille. Mutta vanhat kaunat ja jännitteet alkoivat nousta pintaan jo heti saapumispäivänä.',
        'Myöhään illalla ryhmän näkyvin jäsen, menestynyt yritysjohtaja Antti Lehtonen, riitelee äänekkäästi muiden kanssa ja poistuu sitten vihaisena olohuoneesta. Kukaan ei osaa aavistaa, että se on viimeinen kerta, kun hänet nähdään elossa...'
      ]
    },
    {
      title: 'KOLKKO AAMU',
      icon: Skull,
      color: 'text-red-500',
      bgGradient: 'from-slate-950 via-stone-950 to-zinc-950',
      text: [
        'Aamu sarastaa harmaana ja usvaisena. Myrsky on vihdoin laantunut, mutta jättänyt jälkeensä vain aavemaisen hiljaisuuden ja kostean sumun järven ylle.',
        'Anttia ei näy aamupalalla. Hänen huoneensa on tyhjä, sänky koskematon.',
        'Lopulta mökin omistaja Oskari suuntaa kohti rantaa ja huomaa venevajan oven olevan raollaan. Sisältä, kylmältä ja märältä lankkulattialta, hän löytää Antin liikkumattomana kuivuneen veritahran keskeltä. Antti on kuollut, ja hänen päässään on massiivinen ruhjevamma.'
      ]
    },
    {
      title: 'TUTKINNAN ALKU',
      icon: MapPin,
      color: 'text-blue-400',
      bgGradient: 'from-indigo-950/30 via-stone-950 to-zinc-950',
      text: [
        'Paniikki leviää ystävysten keskuudessa. Joku yrittää soittaa apua, mutta puhelinverkot ovat maassa. Oskari käy tarkistamassa ajotien, mutta suuri myrskyn kaatama kuusi tukkii ainoan poistumisreitin.',
        'Olette saarroksissa Hiljaisen järven mökillä, ja murhaaja on edelleen keskuudessanne.',
        'Koska sinulla on taustaa rikostutkijana, otat vastuun tilanteesta. Tehtäväsi on tutkia mökki ja ranta-alueet, kerätä johtolangat, haastatella epäiltyjä ja selvittää murha ennen kuin syyllinen ehtii tuhota loputkin todisteet tai paeta paikalta.'
      ]
    }
  ];

  const handleNext = () => {
    audioSynth.playClick();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onStartGame();
    }
  };

  const current = steps[step];
  const IconComponent = current.icon;

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden transition-all duration-1000 bg-gradient-to-b ${current.bgGradient}`} id="prologue-container">
      {/* Immersive fog background particles simulation using css overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><filter id=%22f%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.015%22 numOctaves=%223%22/></filter><rect width=%22100%22 height=%22100%22 filter=%22url(%23f)%22 opacity=%220.04%22/></svg>')] pointer-events-none" />

      <div className="max-w-2xl w-full bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-10 rounded-lg backdrop-blur-md shadow-2xl relative z-10 animate-scale-up" id="prologue-content-box">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            JOHDANTO • {step + 1} / {steps.length}
          </span>
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-6 bg-red-600' : 'w-1.5 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Narrative Title */}
        <div className="flex items-center gap-3 mb-6">
          <IconComponent className={`w-7 h-7 ${current.color}`} />
          <h2 className="text-xl md:text-2xl font-sans font-bold tracking-tight text-zinc-100 uppercase">
            {current.title}
          </h2>
        </div>

        {/* Paragraphs with delay and line transitions */}
        <div className="space-y-4 md:space-y-6 text-sm md:text-base text-zinc-300 font-sans leading-relaxed">
          {current.text.map((paragraph, index) => (
            <p key={index} className="animate-fade-in-delayed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-zinc-800/60 flex justify-end">
          <button
            onClick={handleNext}
            className="py-3 px-6 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-sans text-xs font-semibold rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_10px_rgba(185,28,28,0.2)] hover:shadow-[0_4px_15px_rgba(185,28,28,0.3)] hover:-translate-y-0.5"
            id="btn-prologue-next"
          >
            <span>{step === steps.length - 1 ? 'Aloita tutkimus' : 'Jatka tarinaa'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
