import { LocalizedText } from '../localization/types';

export interface DeductionTask {
  id: string;
  title: LocalizedText;
  requiredStatement: string; // statement ID like 'elina.alibi'
  requiredEvidence: string[]; // clue IDs
  solvedFlag: string; // key in state.ratkaistutRistiriidat like 'elina_alibi_murrettu'
  successMessage: LocalizedText;
  failureMessage: LocalizedText;
  hints: LocalizedText[];
  unlockPhase: 'PROLOGUE' | 'VAIHE1' | 'VAIHE2' | 'VAIHE3' | 'ACCUSATION' | 'ENDING';
}

export const DEDUCTIONS: DeductionTask[] = [
  {
    id: 'elina_alibi',
    title: {
      fi: 'Elinan alibin murtaminen',
      en: "Breaking Elina's Alibi"
    },
    requiredStatement: 'elina.alibi',
    requiredEvidence: ['keittion_kello', 'elinan_aani_tallenteella'],
    solvedFlag: 'elina_alibi_murrettu',
    successMessage: {
      fi: 'Elinan kertomus ei voi pitää paikkaansa. Hän väittää olleensa keittiössä seuraamassa kellonaikaa, mutta seinäkelloa on käsitelty ja tallenne sijoittaa hänen äänensä rannalle kesken riidan Antin kanssa. Elinan alibi on murrettu.',
      en: "Elina's story cannot be true. She claims she was in the kitchen keeping track of time, but the wall clock was tampered with and the recording places her voice on the shore during a fight with Antti. Elina's alibi has been broken."
    },
    failureMessage: {
      fi: 'Tämä yhdistelmä ei vielä osoita aukotonta ristiriitaa. Tarkastele lausunnon kellonaikoja ja vertaa niitä löydettyihin havaintoihin.',
      en: 'This combination does not prove a contradiction yet. Examine the times in the statement and compare them with your findings.'
    },
    hints: [
      {
        fi: 'Tarkastele tarkasti, missä Elina väitti olleensa ja mihin kellonaikoihin hänen kertomuksensa perustuu.',
        en: 'Look closely at where Elina claimed she was and what times her story is based on.'
      },
      {
        fi: 'Yksi keittiöstä löytynyt esine herättää epäilyksen siitä, voiko Elinan käyttämään kellonaikaan luottaa.',
        en: 'An item found in the kitchen raises suspicions about whether the time Elina used can be trusted.'
      },
      {
        fi: 'Vertaa Elinan alibia keittiön seinäkelloon ja tallenteeseen, jossa kuuluu hänen äänensä muualla.',
        en: "Compare Elina's alibi with the kitchen wall clock and the recording that places her voice elsewhere."
      }
    ],
    unlockPhase: 'VAIHE1'
  },
  {
    id: 'fyysinen_kamppailu',
    title: {
      fi: 'Fyysinen kamppailu',
      en: 'Physical Struggle'
    },
    requiredStatement: 'elina.alibi',
    requiredEvidence: ['repeytynyt_hiha', 'kangas_antin_kadessa'],
    solvedFlag: 'fyysinen_kamppailu_ratkaistu',
    successMessage: {
      fi: 'Antin kädestä kuoleman jälkeen löytynyt pieni, väkisin revitty kangaspala on täysin samaa harvinaista italialaista kashmirvillaa ja vastaa täydellisesti Elinan takin hihan repeämän muotoa. Uhri repäisi palan Elinan takista kamppailun aikana!',
      en: "The small fabric piece forcibly torn and found in Antti's hand after death is the exact rare Italian cashmere wool and matches perfectly with the tear in Elina's jacket sleeve. The victim tore the piece from Elina's jacket during a struggle!"
    },
    failureMessage: {
      fi: 'Tämä yhdistelmä ei vielä todista fyysistä kamppailua rikospaikalla. Vertaile takin repeämää ja uhrin kädestä löytynyttä todistetta.',
      en: "This combination does not prove a physical struggle at the crime scene yet. Compare the tear in the jacket and the evidence found in the victim's hand."
    },
    hints: [
      {
        fi: 'Tarkastele Elinan takissa olevaa vauriota ja uhrin kädestä löytynyttä esinettä.',
        en: "Look at the damage on Elina's jacket and the object found in the victim's hand."
      },
      {
        fi: 'Molemmat todisteet liittyvät samaan harvinaiseen mustaan kashmirvillaan.',
        en: 'Both pieces of evidence are connected to the same rare black cashmere wool.'
      },
      {
        fi: 'Yhdistä Elinan alibi, repeytynyt hiha ja Antin kädestä löytynyt kangaspala.',
        en: "Combine Elina's alibi, the torn sleeve, and the fabric piece found in Antti's hand."
      }
    ],
    unlockPhase: 'VAIHE2'
  },
  {
    id: 'kulku_rikospaikalle',
    title: {
      fi: 'Kulku rikospaikalle',
      en: 'Access to Crime Scene'
    },
    requiredStatement: 'elina.alibi',
    requiredEvidence: ['elinan_kengat', 'kenganjaljet_venevajalla'],
    solvedFlag: 'kulku_rikospaikalle_ratkaistu',
    successMessage: {
      fi: 'Elinan kalanruotokuvioiset kengät vastaavat täydellisesti venevajan lattialta ja ovelta löytyneitä tuoreita kengänjälkiä. Elina on käynyt venevajalla, vaikka hän väittää toisin.',
      en: "Elina's herringbone-patterned shoes match perfectly with the fresh footprints found on the boathouse floor and entrance. Elina has visited the boathouse, despite claiming otherwise."
    },
    failureMessage: {
      fi: 'Tämä yhdistelmä ei vielä todista liikkumista rikospaikalle. Vertaile epäillyn kenkiä ja rikospaikan jälkiä.',
      en: "This combination does not prove access to the crime scene yet. Compare the suspect's shoes and the footprints at the crime scene."
    },
    hints: [
      {
        fi: 'Etsi todisteita, jotka liittyvät jalkineisiin tai jälkiin.',
        en: 'Look for evidence related to footwear or tracks.'
      },
      {
        fi: 'Venevajan mudassa on kuviollisia jälkiä.',
        en: 'There are patterned tracks in the boathouse mud.'
      },
      {
        fi: 'Yhdistä Elinan alibi, hänen kalanruotokenkänsä ja venevajan kengänjäljet.',
        en: "Combine Elina's alibi, her herringbone shoes, and the footprints in the boathouse."
      }
    ],
    unlockPhase: 'VAIHE2'
  },
  {
    id: 'murha_ase',
    title: {
      fi: 'Murha-ase',
      en: 'Murder Weapon'
    },
    requiredStatement: 'elina.alibi',
    requiredEvidence: ['rikkinainen_lyhty', 'kuitu_lyhdyssa'],
    solvedFlag: 'murha_ase_ratkaistu',
    successMessage: {
      fi: 'Venevajan lattialta löytynyt rikkoutunut metallilyhty on murha-ase. Sen vääntyneeseen sangan metalliosaan on tarttunut tumma kuitu, joka on peräisin Elinan kalliista kashmirvillatakista.',
      en: "The broken metal lantern found on the boathouse floor is the murder weapon. A dark fiber from Elina's expensive cashmere jacket is caught in its bent handle metal parts."
    },
    failureMessage: {
      fi: 'Tämä yhdistelmä ei vielä todista murha-aseen käsittelyä. Vertaile rikospaikalta löytynyttä lyhtyä ja siitä saatuja rikosteknisiä kuitunäytteitä.',
      en: "This combination does not prove handling of the murder weapon yet. Compare the lantern found at the crime scene and the forensic fiber samples taken from it."
    },
    hints: [
      {
        fi: 'Tarkastele venevajan lattialta löytynyttä myrskylyhtyä.',
        en: 'Examine the storm lantern found on the boathouse floor.'
      },
      {
        fi: 'Lyhdyn sangan metalliosiin on tarttunut jotakin.',
        en: "Something is caught in the metal parts of the lantern's handle."
      },
      {
        fi: 'Yhdistä Elinan alibi, rikkoutunut metallilyhty ja lyhdystä löytynyt tumma kangaskuitu.',
        en: "Combine Elina's alibi, the broken metal lantern, and the dark fabric fiber found on the lantern."
      }
    ],
    unlockPhase: 'VAIHE3'
  },
  {
    id: 'motiivi',
    title: {
      fi: 'Motiivi',
      en: 'Motive'
    },
    requiredStatement: 'elina.alibi',
    requiredEvidence: ['tilisiirto_elinalle', 'kirjanpitopaperit'],
    solvedFlag: 'motiivi_ratkaistu',
    successMessage: {
      fi: 'Elinan tekemä suuri tilisiirto Cayman-saarille yhdistettynä salkusta löytyneisiin kirjanpitopapereihin paljastaa kavalluksen. Antti oli saanut selville Elinan petoksen ja aikoi paljastaa sen, mikä antoi Elinalle vahvan motiivin vaientaa hänet.',
      en: "The large bank transfer made by Elina to the Cayman Islands combined with the accounting papers found in the briefcase reveals the embezzlement. Antti had uncovered Elina's fraud and was going to expose it, giving Elina a strong motive to silence him."
    },
    failureMessage: {
      fi: 'Tämä yhdistelmä ei vielä todista murhan taloudellista motiivia. Vertaile tilisiirtotosite- ja kirjanpitodokumentteja.',
      en: 'This combination does not prove a financial motive for the murder yet. Compare the bank transfer receipt and the accounting documents.'
    },
    hints: [
      {
        fi: 'Tarkastele asiakirjoja, jotka liittyvät yrityksen talouteen ja rahojen siirtoihin.',
        en: "Look at the documents related to the company's finances and fund transfers."
      },
      {
        fi: 'Löysit Antin salkusta tärkeitä papereita.',
        en: 'You found important papers in Antti\'s briefcase.'
      },
      {
        fi: 'Yhdistä Elinan alibi, Cayman-saarten tilisiirto ja kirjanpitopaperit.',
        en: "Combine Elina's alibi, the Cayman Islands transfer, and the accounting papers."
      }
    ],
    unlockPhase: 'VAIHE3'
  }
];
