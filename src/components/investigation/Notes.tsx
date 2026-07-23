import { ChangeEvent } from 'react';
import { GameState } from '../../types/game';
import { FilePenLine, Save, Sparkles, FileText, CheckCircle2, Bookmark, ShieldAlert, Stamp } from 'lucide-react';

interface NotesProps {
  state: GameState;
  onSaveNotes: (text: string) => void;
}

export function Notes({ state, onSaveNotes }: NotesProps) {
  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onSaveNotes(e.target.value);
  };

  const handleNotesKeyDown = () => {
    // Keypress handler preserved
  };

  const solvedContradictions = state.discoveredContradictions || state.ratkaistutRistiriidat || [];
  const discoveredClues = state.discoveredClues || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="notes-view-container">
      {/* Header Banner */}
      <div className="bg-[#1c1613] border-y-2 border-amber-800/60 p-4 md:p-5 rounded-xs shadow-[0_8px_20px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/40 text-amber-400 font-mono text-[10px] font-bold tracking-widest uppercase">
              HILJAISEN JÄRVEN POLIISI • TAPAUSKIRJANPITO
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              TAPAUSNUMERO: HJ-2026-071
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
            <FilePenLine className="w-5 h-5 text-amber-500 shrink-0" />
            Etsivän Kenttämuistikirja & Fact-Sheet
          </h3>
          <p className="text-xs font-sans text-stone-400 max-w-3xl leading-relaxed">
            Tutkijan oma vapaamuotoinen muistikirja ja tutkinnan aikana vahvistetut riidattomat havainnot. Muistiinpanosi tallentuvat automaattisesti.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-black/40 p-3 rounded border border-stone-800">
          <Bookmark className="w-8 h-8 text-amber-600/80 shrink-0" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">Tallennustila</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Automaattitallennus aktiivinen</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETECTIVE'S FIELD NOTEBOOK (DESK ATMOSPHERE WITH OPEN 2-PAGE NOTEBOOK SPREAD) */}
      <div className="relative bg-[#221812] p-3 sm:p-5 md:p-8 rounded-sm border-4 border-[#140e0a] shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden select-none">
        
        {/* Leather Notebook Outer Frame & Double Fine Stitching */}
        <div className="absolute inset-1.5 border border-dashed border-amber-900/50 rounded-2xs pointer-events-none" />
        <div className="absolute inset-2.5 border border-amber-950/30 rounded-2xs pointer-events-none" />

        {/* Realistic Detective Pencil Resting on Top Edge of Notebook Spread */}
        <div className="absolute -top-1 right-12 sm:right-28 z-30 pointer-events-none transform rotate-12 drop-shadow-[4px_12px_14px_rgba(0,0,0,0.85)] hidden sm:block">
          <div className="flex items-center">
            {/* Rubber Eraser Top */}
            <div className="w-3.5 h-4 bg-amber-800 rounded-l-xs border-y border-l border-amber-950 shadow-inner" />
            {/* Metal Ferrule Ring */}
            <div className="w-2.5 h-4 bg-gradient-to-b from-amber-200 via-stone-400 to-amber-300 border-y border-stone-600" />
            {/* Hexagonal Wooden Pencil Shaft */}
            <div className="w-36 md:w-44 h-4 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-600 border-y border-amber-700 flex items-center justify-between px-2">
              <span className="text-[7.5px] font-mono font-extrabold text-amber-950/80 tracking-widest uppercase select-none">
                SUOMI 2B • POLIISI
              </span>
            </div>
            {/* Sharpened Wooden Cone */}
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[16px] border-l-[#d2a679]" />
            {/* Dark Graphite Lead Tip */}
            <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-stone-900 -ml-[22px]" />
          </div>
        </div>

        {/* Center Spine Binding, Metal Staples & Deep Crease (Desktop) */}
        <div className="hidden lg:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 flex-col justify-between py-10 items-center pointer-events-none z-20">
          <div className="w-3 h-7 bg-gradient-to-r from-stone-500 via-stone-200 to-stone-600 rounded-2xs shadow-lg border border-stone-700" />
          <div className="w-3 h-7 bg-gradient-to-r from-stone-500 via-stone-200 to-stone-600 rounded-2xs shadow-lg border border-stone-700" />
          <div className="w-3 h-7 bg-gradient-to-r from-stone-500 via-stone-200 to-stone-600 rounded-2xs shadow-lg border border-stone-700" />
          <div className="w-3 h-7 bg-gradient-to-r from-stone-500 via-stone-200 to-stone-600 rounded-2xs shadow-lg border border-stone-700" />
        </div>

        {/* Center Fold Crease Shadow for 2-Page Book Spread */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-14 bg-gradient-to-r from-black/20 via-black/45 to-black/20 pointer-events-none z-10" />

        {/* 2-PAGE GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 relative z-10">

          {/* ========================================================================= */}
          {/* LEFT PAGE: Detective's Handwritten Field Notebook Textarea                */}
          {/* ========================================================================= */}
          <div className="bg-[#f7f1e3] text-[#211811] rounded-xs border border-[#d8caa8] p-5 md:p-6 shadow-[0_10px_25px_rgba(0,0,0,0.45)] relative flex flex-col justify-between min-h-[560px] lg:min-h-[630px] overflow-hidden">
            
            {/* Subtle Paper Texture Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_27px,#e4dac6_28px)] bg-[size:100%_28px] pointer-events-none rounded-xs opacity-75" />

            {/* Red Left Margin Line */}
            <div className="absolute top-0 bottom-0 left-10 md:left-12 w-0.5 bg-red-700/40 pointer-events-none z-10" />

            {/* Coffee Ring Stain Accent in Corner */}
            <svg className="absolute -bottom-8 -left-8 w-36 h-36 opacity-15 pointer-events-none text-amber-950 blur-[0.3px]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="12 4 8 3" />
              <circle cx="52" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 6" />
            </svg>

            {/* Subtle Corner Fold Overlay */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-900/20 via-amber-200/40 to-transparent pointer-events-none" />

            {/* Handwritten Marginalia (Decorative Pencil Notes in Margins) */}
            <div className="absolute top-20 -left-1 sm:left-1 rotate-[-6deg] text-[10.5px] font-serif italic text-amber-950 font-bold bg-[#f3e6ce]/90 px-1.5 py-0.5 rounded border border-amber-800/25 shadow-2xs pointer-events-none z-20">
              ✏️ "Tarkista alibi."
            </div>
            <div className="absolute bottom-20 right-3 rotate-[3deg] text-[10.5px] font-serif italic text-red-900 font-bold bg-[#f2e2cb]/90 px-1.5 py-0.5 rounded border border-red-900/25 shadow-2xs pointer-events-none z-20">
              📌 "Kuka valehtelee?"
            </div>

            {/* Page Header */}
            <div className="space-y-3 relative z-10 flex-1 flex flex-col">
              <div className="pl-6 md:pl-8 border-b border-[#c8bba3] pb-2 space-y-0.5">
                <div className="flex items-center justify-between pr-12 sm:pr-0">
                  <span className="text-[10px] font-mono font-extrabold text-[#523f2f] uppercase tracking-widest flex items-center gap-1.5">
                    <FilePenLine className="w-3.5 h-3.5 text-amber-900" />
                    ETSIVÄN KENTTÄMUISTIINPANOT
                  </span>
                  
                  {/* Auto-save Stamp Indicator */}
                  <span className="text-[9.5px] font-mono text-emerald-900 font-bold bg-emerald-100/90 border border-emerald-700/50 px-2 py-0.5 rounded-2xs flex items-center gap-1 shadow-2xs">
                    <Save className="w-3 h-3 text-emerald-700" />
                    <span>✓ TALLENNETTU AUTOMAATTISESTI</span>
                  </span>
                </div>
                <div className="text-[9px] font-mono text-[#735f4c] font-bold tracking-wider">
                  TAPAUS: MURHA MÖKILLÄ • TAPAUSNUMERO HJ-2026-071
                </div>
              </div>

              {/* Textarea Notebook Writing Sheet */}
              <div className="flex-1 pl-6 md:pl-8 pt-1">
                <textarea
                  value={state.notes}
                  onChange={handleNotesChange}
                  onKeyDown={handleNotesKeyDown}
                  placeholder="Kirjoita tähän havaintojasi epäillyistä, outoja lausuntoja tai mahdollisia teorioita murhasta... Esimerkki: 'Elina vaikuttaa liiankin rauhalliselta, vaikka Antti oli hänen liikekumppaninsa...'"
                  className="w-full h-full min-h-[400px] lg:min-h-[460px] bg-transparent border-none text-sm md:text-base text-[#1c140d] font-sans font-medium leading-[28px] focus:outline-none resize-none placeholder:text-[#887664] placeholder:italic select-text"
                  id="notes-textarea"
                />
              </div>

              {/* Handwritten Lead Pencil Note in Bottom Margin */}
              <div className="pl-6 md:pl-8 pt-2 border-t border-[#c8bba3]/80 flex items-center justify-between text-[10px] font-mono text-[#63503f]">
                <span className="italic font-serif font-bold text-amber-950">
                  ✏️ "Mikä lausunnoissa ei täsmää? Tarkista alibit."
                </span>
                <span className="text-[9px] font-sans italic text-stone-600">
                  Tallentuu automaattisesti
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT PAGE: Investigation Findings & Official Police Attachment          */}
          {/* ========================================================================= */}
          <div className="bg-[#f3edd9] text-[#211811] rounded-xs border border-[#d8caa8] p-5 md:p-6 shadow-[0_10px_25px_rgba(0,0,0,0.45)] relative flex flex-col justify-between min-h-[560px] lg:min-h-[630px]">
            
            {/* Metallic Paperclip Accent Top Right */}
            <div className="absolute -top-3.5 right-10 z-30 pointer-events-none drop-shadow-md">
              <svg className="w-6 h-10 text-stone-500" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 8v16a4 4 0 008 0V6a3 3 0 00-6 0v16a1 1 0 002 0V10" />
              </svg>
            </div>

            {/* Official Stamp Overlay Top Right */}
            <div className="absolute top-4 right-14 -rotate-6 pointer-events-none z-20 hidden sm:block">
              <div className="border-2 border-red-800/80 text-red-800 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-2xs uppercase tracking-widest bg-red-100/40 shadow-2xs flex items-center gap-1">
                <Stamp className="w-3 h-3 text-red-800" />
                <span>VAHVISTETTU • VIRALLINEN</span>
              </div>
            </div>

            {/* Marginalia Note on Right Page */}
            <div className="absolute top-20 left-2 rotate-[-2deg] text-[10px] font-serif italic text-stone-800 font-bold bg-[#e8deca]/90 px-1.5 py-0.5 rounded border border-stone-400/40 pointer-events-none z-20">
              ✏️ "Venevaja uudelleen."
            </div>

            {/* Official Report Header */}
            <div className="space-y-4">
              <div className="border-b-2 border-stone-800 pb-3 space-y-1">
                <div className="flex items-center justify-between pr-8 sm:pr-0">
                  <span className="text-[10px] font-mono font-extrabold text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-900" />
                    TUTKINNAN HAVAINNOT JA VAHVISTETUT FAKTAT
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-stone-600 uppercase tracking-wider">
                  <span>HILJAISEN JÄRVEN POLIISI • TAPAUSRAPORTTI</span>
                  <span>REF: HJ-2026-071/A1</span>
                </div>
              </div>

              {/* Scrollable Facts Section */}
              <div className="space-y-3.5 max-h-[410px] lg:max-h-[450px] overflow-y-auto pr-1">
                <p className="text-[11px] font-sans text-stone-700 leading-relaxed italic">
                  Tähän osioon on koottu automaattisesti tärkeimpiä riidattomia faktoja, jotka olet onnistunut todistamaan korkkitaululla tai kuulusteluissa:
                </p>

                {/* FACT 1: Core Case Info */}
                <div className="p-3.5 bg-[#e5dbc7] border border-[#cfc1a8] rounded-xs text-xs space-y-1 shadow-2xs">
                  <span className="text-[9.5px] font-mono font-extrabold text-stone-800 block uppercase tracking-widest border-b border-stone-300 pb-1">
                    📋 PERUSTIEDOT (TAPAUKSEN ALKUPISTE)
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-900 font-sans pt-1">
                    <li>Uhri: <strong className="text-stone-950 font-bold">Antti Lehtonen</strong> (kuollut)</li>
                    <li>Vammat: Kallonmurtuma päähän kohdistuneesta iskusta</li>
                    <li>Katoamisaika: Lauantai-ilta noin klo 23.00</li>
                  </ul>
                </div>

                {/* FACT 2: Embezzlement Proven */}
                {discoveredClues.includes('tilisiirto_elinalle') && (
                  <div className="p-3.5 bg-[#e8d8b8] border-l-4 border-amber-800 rounded-r text-xs space-y-1 shadow-2xs">
                    <span className="text-[9.5px] font-mono font-extrabold text-amber-950 block uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                      MOTIIVI TODISTETTU
                    </span>
                    <p className="text-stone-900 font-sans leading-relaxed">
                      Löytyi todiste, että <strong className="text-stone-950 font-bold">Elina Koskinen</strong> on kavaltanut yli 420 000 euroa yhteisen konsulttiyrityksen varoja Cayman-saarille omalle tililleen.
                    </p>
                  </div>
                )}

                {/* FACT 3: Footprints Proven */}
                {solvedContradictions.includes('kengat_vs_jäljet') && (
                  <div className="p-3.5 bg-[#e8d8b8] border-l-4 border-amber-800 rounded-r text-xs space-y-1 shadow-2xs">
                    <span className="text-[9.5px] font-mono font-extrabold text-amber-950 block uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-800" />
                      SIJAINTI KUMOTTU
                    </span>
                    <p className="text-stone-900 font-sans leading-relaxed">
                      Elinan kalanruotokenkien pohjat vastaavat täydellisesti venevajan liejusta löytyneitä kengänjälkiä. Elina oli venevajalla, vaikka kiistää sen.
                    </p>
                  </div>
                )}

                {/* FACT 4: Voice Recording Proven */}
                {solvedContradictions.includes('alibi_vs_tallenne') && (
                  <div className="p-3.5 bg-[#ebd8d0] border-l-4 border-red-800 rounded-r text-xs space-y-1 shadow-2xs">
                    <span className="text-[9.5px] font-mono font-extrabold text-red-950 block uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-800" />
                      ALIBI KUMOTTU
                    </span>
                    <p className="text-stone-900 font-sans leading-relaxed">
                      Saran tallentimella REC_004.WAV kuuluu Elinan ja Antin äänekäs ja vihainen riippa rannassa klo 23.10. Elina ei ollut keittiössä tiskaamassa.
                    </p>
                  </div>
                )}

                {/* FACT 5: Torn Sleeve Proven */}
                {solvedContradictions.includes('hiha_vs_kangas') && (
                  <div className="p-3.5 bg-[#ebd8d0] border-l-4 border-red-800 rounded-r text-xs space-y-1 shadow-2xs">
                    <span className="text-[9.5px] font-mono font-extrabold text-red-950 block uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-800" />
                      KAMPPAILU TODISTETTU
                    </span>
                    <p className="text-stone-900 font-sans leading-relaxed">
                      Antin kädestä kuoleman jälkeen löytynyt musta kangaspala vastaa tismalleen Elinan mustan kashmirvillatakin repeytynyttä hihaa. Heillä oli fyysinen kamppailu.
                    </p>
                  </div>
                )}

                {/* Placeholder when no contradictions found yet */}
                {solvedContradictions.length === 0 && !discoveredClues.includes('tilisiirto_elinalle') && (
                  <div className="bg-[#e4d8c2]/80 p-4 rounded border border-stone-300 text-center space-y-1.5">
                    <span className="text-[10px] font-mono text-stone-600 block uppercase font-bold">
                      ✏️ TILA: EI YHDISTETTYJÄ RISTIRIITOJA YET
                    </span>
                    <p className="text-xs font-serif italic text-stone-700 leading-relaxed">
                      Et ole vielä todistanut ristiriitoja korkkitaululla. Etsi todisteiden ja alibien välisiä aukkoja ja palaa katsomaan tähän muodostuvia faktoja.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Official Footer & Signature Line */}
            <div className="pt-3 border-t border-stone-300/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-stone-600">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest font-bold text-stone-700">
                  ALLEKIRJOITUS:
                </span>
                <span className="font-serif italic font-extrabold text-stone-900 text-xs text-amber-950 border-b border-stone-400 px-2 pb-0.5">
                  Etsivä H. Vatanen
                </span>
              </div>
              <span className="text-[#802318] font-serif font-bold italic text-[11px]">
                "Tutki jokainen vihje"
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Notes;
