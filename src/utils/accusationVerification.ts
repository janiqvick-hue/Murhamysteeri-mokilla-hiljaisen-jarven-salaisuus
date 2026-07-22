import { GameState, Accusation } from '../types/game';
import { DEDUCTIONS } from '../data/deductionData';

export type AccusationResultType =
  | 'FULL_CORRECT'
  | 'RIGHT_SUSPECT_WEAK_EVIDENCE'
  | 'WRONG_SUSPECT'
  | 'TOO_EARLY';

export interface AccusationFeedback {
  fi: string;
  en: string;
}

export interface VerificationResult {
  isCorrect: boolean;
  resultType: AccusationResultType;
  feedbacks: AccusationFeedback[];
}

/**
 * Generic verification function for Final Accusation.
 * Compares selected suspect, weapon, motive, crime scene location, and key evidence (3-5 items)
 * against the correct murder solution.
 */
export function verifyAccusation(
  accusation: Accusation,
  state: GameState
): VerificationResult {
  const solvedFlags = state.ratkaistutRistiriidat || [];
  const requiredSolvedFlags = DEDUCTIONS.map((task) => task.solvedFlag);
  const allDeductionsSolved = requiredSolvedFlags.every((flag) =>
    solvedFlags.includes(flag)
  );

  // 1. Check if attempted too early:
  // - Kaikkia viittä päättelytehtävää ei ole ratkaistu
  // - Pelaajalla on alle 5 löydettyä johtolankaa
  // - Pelaaja on valinnut alle 3 todistetta
  if (!allDeductionsSolved) {
    return {
      isCorrect: false,
      resultType: 'TOO_EARLY',
      feedbacks: [
        {
          fi: 'Tutkintasi päättelyketju on vielä keskeneräinen. Ratkaise avoimet kysymykset tutkintataululla ennen virallisen syytöksen esittämistä.',
          en: 'Your chain of reasoning is still incomplete. Resolve the open questions on the investigation board before presenting an official accusation.',
        },
      ],
    };
  }

  if (state.discoveredClues.length < 5 || accusation.clueIds.length < 3) {
    return {
      isCorrect: false,
      resultType: 'TOO_EARLY',
      feedbacks: [
        {
          fi: 'Olet tekemässä syytöstä liian varhaisessa vaiheessa. Mökiltä ja epäillyiltä puuttuu vielä kriittisiä todisteita. Jatka tutkimuksia ennen lopullista ratkaisua.',
          en: 'You are making an accusation too early. Critical evidence is still missing from the cottage and suspects. Continue investigating before making a final decision.',
        },
      ],
    };
  }

  // Correct parameters:
  // Murderer: Elina Koskinen (id: 'elina')
  // Weapon: 'metallinen lyhty' / 'Valurautainen metallinen myrskylyhty'
  // Motive: 'Antti aikoi paljastaa kavalluksen' / 'Antti aikoi paljastaa Elinan tekemän suuren kavalluksen'
  // Crime Scene Location: 'venevaja'
  // Core Critical Clues: tilisiirto_elinalle, elinan_aani_tallenteella, kangas_antin_kadessa, repeytynyt_hiha, kenganjaljet_venevajalla, rikkinainen_lyhty, kirjanpitopaperit
  const CORRECT_SUSPECT = 'elina';
  const CORRECT_LOCATION = 'venevaja';
  const VALID_MOTIVES = [
    'Antti aikoi paljastaa kavalluksen',
    'Antti aikoi paljastaa Elinan tekemän suuren kavalluksen',
  ];
  const VALID_WEAPONS = [
    'metallinen lyhty',
    'Valurautainen metallinen myrskylyhty',
    'rikkinainen_lyhty',
  ];
  const CORE_CRITICAL_CLUES = [
    'tilisiirto_elinalle',
    'elinan_aani_tallenteella',
    'kangas_antin_kadessa',
    'repeytynyt_hiha',
    'kenganjaljet_venevajalla',
    'rikkinainen_lyhty',
    'kirjanpitopaperit',
  ];

  const isSuspectCorrect = accusation.suspectId === CORRECT_SUSPECT;
  const isMotiveCorrect = VALID_MOTIVES.includes(accusation.motive);
  const isWeaponCorrect = VALID_WEAPONS.includes(accusation.weapon);
  const isLocationCorrect = accusation.locationId === CORRECT_LOCATION;

  // Count how many valid core critical clues were provided
  const matchedCoreClues = accusation.clueIds.filter((id) =>
    CORE_CRITICAL_CLUES.includes(id)
  );
  // Must select between 3 and 5 clues, and at least 3 of them must be from the core critical set
  const isEvidenceCorrect =
    accusation.clueIds.length >= 3 &&
    accusation.clueIds.length <= 5 &&
    matchedCoreClues.length >= 3;

  // Outcome 1: WRONG SUSPECT
  if (!isSuspectCorrect) {
    return {
      isCorrect: false,
      resultType: 'WRONG_SUSPECT',
      feedbacks: [
        {
          fi: 'Syytetty henkilö kiistää jyrkästi syyllisyytensä, eikä hänen alibinsa kumoutunut esitetyillä todisteilla. Todellinen tekijä on edelleen vapaana.',
          en: 'The accused suspect strongly denies guilt, and their alibi was not disproven by the presented evidence. The real perpetrator remains free.',
        },
      ],
    };
  }

  // Outcome 2: FULLY CORRECT SOLUTION
  if (
    isSuspectCorrect &&
    isMotiveCorrect &&
    isWeaponCorrect &&
    isLocationCorrect &&
    isEvidenceCorrect
  ) {
    return {
      isCorrect: true,
      resultType: 'FULL_CORRECT',
      feedbacks: [
        {
          fi: 'Aukoton syytös! Kaikki palaset loksahtivat paikoilleen ja todisteet osoittavat kiistatta syyllisen.',
          en: 'Flawless accusation! All pieces fell into place and the evidence conclusively points to the culprit.',
        },
      ],
    };
  }

  // Outcome 3: RIGHT SUSPECT BUT WEAK OR INCOMPLETE EVIDENCE / WRONG DETAILS
  const weakFeedbacks: AccusationFeedback[] = [];

  if (!isMotiveCorrect) {
    weakFeedbacks.push({
      fi: 'Epäilet oikeaa henkilöä, mutta esittämäsi motiivi on virheellinen. Mökiltä löytyneet talousasiakirjat viittaavat toisenlaiseen syyhyökkäykseen.',
      en: 'You suspect the correct person, but the proposed motive is incorrect. Financial documents indicate a different trigger.',
    });
  }

  if (!isWeaponCorrect) {
    weakFeedbacks.push({
      fi: 'Epäilet oikeaa henkilöä, mutta valitsemasi murha-ase ei vastaa uhrin pään ruhjeita tai rikospaikan havaintoja.',
      en: 'You suspect the correct person, but the chosen weapon does not match the victim’s injuries or crime scene observations.',
    });
  }

  if (!isLocationCorrect) {
    weakFeedbacks.push({
      fi: 'Epäilet oikeaa henkilöä, mutta rikoksen suorituspaikka on väärä. Lattian kengänjäljet ja kamppailun merkit sijaitsevat toisaalla.',
      en: 'You suspect the correct person, but the crime scene location is incorrect. Footprints and signs of struggle are located elsewhere.',
    });
  }

  if (!isEvidenceCorrect) {
    weakFeedbacks.push({
      fi: 'Epäilet oikeaa henkilöä, mutta valitsemasi 3–5 todistetta eivät vakuuta syyttäjää. Tarvitset vahvempia teknisiä tai fyysisiä todisteita, jotka murtavat syytetyn alibin.',
      en: 'You suspect the correct person, but your 3–5 selected evidence items do not convince the prosecutor. You need stronger technical or physical clues that break the alibi.',
    });
  }

  return {
    isCorrect: false,
    resultType: 'RIGHT_SUSPECT_WEAK_EVIDENCE',
    feedbacks: weakFeedbacks,
  };
}
