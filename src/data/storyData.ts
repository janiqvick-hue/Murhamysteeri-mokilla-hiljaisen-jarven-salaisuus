import { Suspect, LocationData, Clue, Contradiction, DialogueTopic, DialogueResponse } from '../types/game';

export const SUSPECTS: Suspect[] = [
  {
    id: 'elina',
    name: 'Elina Koskinen',
    age: 36,
    role: 'Antin liikekumppani',
    description: 'Elinalla ja Antilla oli yhteinen yritys. Elina on ulkoisesti erittäin kylmäpäinen, tyylikäs ja analyyttinen nainen, joka puhuu harkitusti ja pitää tunteensa kurissa. Hän väittää olleensa keittiössä koko illan valmistelemassa ruokaa ja siivoamassa.',
    motive: 'Antti löysi todisteet siitä, että Elina oli kavaltanut satoja tuhansia euroja heidän yhteisestä yrityksestään. Antti aikoi ilmoittaa asiasta viranomaisille heti viikonlopun jälkeen.',
    secret: 'On siirtänyt yrityksen varoja omalle pöytälaatikko-osakeyhtiölleen ulkomaille jo useamman vuoden ajan.',
    alibi: 'Väittää olleensa keittiössä koko illan tekemässä iltapalaa ja siivoamassa kaappeja, eikä poistunut mökistä ulos lainkaan.',
    isGuilty: true,
    portraitSvgSeed: 'elina'
  },
  {
    id: 'markus',
    name: 'Markus Salo',
    age: 39,
    role: 'Antin vanha opiskelukaveri',
    description: 'Markus on suorapuheinen, helposti kiihtyvä ja hieman rähjäinen mies, joka toimii yrittäjänä. Hän oli riidellyt äänekkäästi Antin kanssa suuresta velasta aiemmin päivällä. Hän väittää olleensa saunassa rentoutumassa myöhään yöhön saakka.',
    motive: 'Oli velkaa Antille yli 50 000 euroa, ja Antti oli uhannut viedä asian perintään, mikä olisi ajanut Markuksen henkilökohtaiseen konkurssiin.',
    secret: 'Kärsii vakavasta peliongelmasta ja käytti Antilta lainatut rahat ulkomaisiin nettikasinoihin.',
    alibi: 'Oli saunassa ja vilvoittelemassa terassilla noin klo 22.30 ja 00.30 välisen ajan. Kukaan ei kuitenkaan nähnyt häntä siellä koko aikaa.',
    isGuilty: false,
    portraitSvgSeed: 'markus'
  },
  {
    id: 'laura',
    name: 'Laura Niemi',
    age: 34,
    role: 'Antin entinen vaimo',
    description: 'Laura on herkkä ja hiljainen taiteilija, joka erosi Antista kaksi vuotta sitten. Eron jälkeiset suhteet olivat viileät. Hän väittää menneensä aikaisin nukkumaan vierashuoneeseen saatuaan tarpeeksi yhteisestä illanvietosta. Hän salaa saaneensa Antilta hätäisen viestin yöllä.',
    motive: 'Katkeruus vaikeasta avioerosta ja omaisuuden jaosta. Lisäksi hän tiesi, että Antilla oli suuri henkivakuutus, jonka edunsaajana hän edelleen virallisesti oli.',
    secret: 'Rakastaa Anttia yhä salaa ja toivoi heidän palaavan yhteen, mutta Antti oli tylysti torjunut hänet aiemmin illalla.',
    alibi: 'Meni vierashuoneeseen nukkumaan jo klo 22.00. Kuuli käytävältä askelia myöhään yöllä, mutta ei uskaltanut katsoa, kuka siellä liikkui.',
    isGuilty: false,
    portraitSvgSeed: 'laura'
  },
  {
    id: 'oskari',
    name: 'Oskari Mäkelä',
    age: 41,
    role: 'Mökin omistaja',
    description: 'Oskari on hiljainen ja synkkä paikallinen metsänomistaja, joka vuokrasi mökin ystävyksille ja jäi itse viettämään iltaa heidän kanssaan. Hän tuntee maaston ja rakennukset erinomaisesti. Hän väittää olleensa ulkona korjaamassa sähköjä myrskyn katkaistua ne.',
    motive: 'Antti oli saanut selville, että Oskari oli rakentanut mökin ja rantasaunan täysin ilman rakennuslupia suojellulle ranta-alueelle ja uhkasi ilmoittaa tästä kunnan rakennusvalvontaan.',
    secret: 'On tehnyt pimeitä puukauppoja ja rakennustöitä vuosia välttääkseen veroja.',
    alibi: 'Oli korjaamassa pääsulaketta ja aggregaattia mökin takana olevassa sähkökaapissa ja varastossa klo 23.00 alkaen noin tunnin ajan sähkökatkon aikana.',
    isGuilty: false,
    portraitSvgSeed: 'oskari'
  },
  {
    id: 'sara',
    name: 'Sara Virtanen',
    age: 32,
    role: 'Freelance-taloustoimittaja',
    description: 'Sara on terävä ja utelias toimittaja, joka tuli mökille Antin kutsusta, mutta alkoi heti tutkia ryhmän jäsenten taustoja. Hän kantaa aina mukanaan ammattitason sanelinta ja tekee muistiinpanoja kaikista. Hän salaa haastatelleensa Anttia salaa venevajan lähellä juuri ennen tämän kuolemaa.',
    motive: 'Halusi repäisevän jymyuutisen Antin ja Elinan yrityksen talousrikoksista, mikä olisi pelastanut hänen uransa freelancerina.',
    secret: 'Nauhoitti salaa muiden keskusteluja mökillä koko viikonlopun kerätäkseen materiaalia paljastusartikkeliinsa.',
    alibi: 'Väittää kirjoittaneensa muistiinpanoja omassa huoneessaan lähes koko illan klo 22.30 jälkeen.',
    isGuilty: false,
    portraitSvgSeed: 'sara'
  }
];

export const LOCATIONS: LocationData[] = [
  {
    id: 'olohuone',
    name: 'Mökin olohuone',
    shortDesc: 'Kodikas mutta varjoinen olohuone, jossa takka hiipuu hiljalleen.',
    longDesc: 'Olohuoneessa tuoksuu savu ja vanha puu. Seinillä on metsästystrofeita ja vanhoja valokuvia. Myrskyn jälkeinen hämärä siivilötyy likaisista ikkunoista. Lattialankut narisevat astuessasi niiden päälle. Nurkassa on naulakko, ja takassa kytee vielä muutama hiillos.',
    bgGradient: 'from-slate-900 via-stone-950 to-amber-950/20',
    weatherAmbiance: 'Sade piiskaa kattoa laimeasti, ja ikkunan takaa näkyy sumuinen piha.',
    unlockedAtPhase: 'PROLOGUE',
    inspectables: [
      {
        id: 'takka',
        name: 'Hiipuva takka',
        description: 'Takan tuhassa näkyy jotain puolittain palanutta. Kasa hiiltyneitä papereita.',
        x: 45,
        y: 65,
        clueIdTrigger: 'poltettu_paperi',
        revealText: 'Kaivelet tuhkaa varovasti takkakohentimella. Löydät osittain palaneen asiakirjan palasen! Siinä näkyy sana "KAVALLUS" ja summatietoja.'
      },
      {
        id: 'naulakko',
        name: 'Eteisen naulakko',
        description: 'Naulakossa roikkuu märkiä takkeja ja lattialla on useita kenkäpareja.',
        x: 16,
        y: 50,
        clueIdTrigger: 'elinan_kengat',
        revealText: 'Tarkastelet lattialla olevia kenkiä. Huomaat Elinan tyylikkäät vaelluskengät, joiden pohjassa on hyvin omaperäinen, kalanruotomainen ja tähtimäinen kumikuviointi. Ne ovat yhä hieman kosteat.'
      }
    ]
  },
  {
    id: 'keittio',
    name: 'Keittiö',
    shortDesc: 'Mökin vanhanaikainen keittiö, jossa Elina sanoo viettäneensä iltansa.',
    longDesc: 'Keittiö on siisti ja astiat on pesty huolellisesti. Kaikki on hieman liiankin järjestyksessä. Seinällä tikittää vanha vetokello, ja avaimenperä roikkuu naulassa oven vieressä.',
    bgGradient: 'from-slate-900 via-slate-950 to-stone-900',
    weatherAmbiance: 'Pieni vedon tunne vetää ikkunanraosta.',
    unlockedAtPhase: 'VAIHE1',
    inspectables: [
      {
        id: 'keittion_kello',
        name: 'Seinäkello',
        description: 'Vanhanaikainen puinen seinäkello, joka on pysähtynyt omituiseen aikaan.',
        x: 75,
        y: 30,
        clueIdTrigger: 'keittion_kello',
        revealText: 'Kello on pysähtynyt tarkalleen aikaan 23:15. Huomaat, että kellon takana oleva paristo on poistettu tahallaan ja jätetty kellon yläpuolelle pölyiselle hyllylle.'
      },
      {
        id: 'avainnaula',
        name: 'Avainnaulakko',
        description: 'Oven vieressä on pieni puinen lauta, jossa roikkuu avaimia.',
        x: 30,
        y: 45,
        clueIdTrigger: 'auton_avaimet',
        revealText: 'Naulakossa roikkuu useita avaimia. Huomiosi kiinnittyy upouuden maastoauton avaimiin, joiden perässä on Elinan nimikirjaimet. Avaimenperässä on pienenpieniä naarmuja ja kuivunutta mutaa.'
      }
    ]
  },
  {
    id: 'vierashuone',
    name: 'Vierashuone',
    shortDesc: 'Huone, jossa Laura ja Sara yöpyvät. Nurkassa on matkalaukkuja.',
    longDesc: 'Huoneessa on kaksi kapeaa sänkyä ja vanha vaatekaappi. Tunnelma on tunkkainen. Matkalaukut ovat auki lattialla, ja pöydällä on taidetarvikkeita sekä käsilaukkuja.',
    bgGradient: 'from-slate-900 via-stone-950 to-slate-950',
    weatherAmbiance: 'Myrskytuuli ujeltaa talon nurkissa.',
    unlockedAtPhase: 'VAIHE2',
    inspectables: [
      {
        id: 'saran_laukku',
        name: 'Saran käsilaukku',
        description: 'Saran avoinna oleva reppu sängyn vieressä.',
        x: 74,
        y: 86,
        clueIdTrigger: 'saran_tallennin',
        revealText: 'Kurkistat varovasti Saran reppuun, kun hän ei katso. Löydät sieltä pienen digitaalisen äänitallentimen. Se on edelleen päällä ja näyttää tallentaneen tunteja ääntä!'
      },
      {
        id: 'elinan_kaappi',
        name: 'Elinan vaatekaappi',
        description: 'Elinan käyttämä puoli vaatekaapista. Siellä roikkuu hänen tyylikäs musta ulkotakkinsa.',
        x: 28,
        y: 38,
        clueIdTrigger: 'repeytynyt_hiha',
        revealText: 'Tutkit Elinan mustaa villakangastakkia. Huomaat, että oikean hihan suu on repeytynyt pahasti, ja siitä puuttuu pala kangasta. Repeämän reunoilla on pienenpieniä tummanpunaisia tahroja, jotka näyttävät vereltä!'
      }
    ]
  },
  {
    id: 'antinhuone',
    name: 'Antin huone',
    shortDesc: 'Uhrin tyhjä makuuhuone, joka on jäänyt koskemattomaksi.',
    longDesc: 'Antin vaatteet on viikattu siististi tuolille. Sängyn vieressä yöpöydällä on puhelin ja lukulasit. Lattialla sängyn alla näkyy musta nahkainen salkku.',
    bgGradient: 'from-slate-900 via-blue-950/20 to-stone-950',
    weatherAmbiance: 'Huone on kylmä, sillä tuuletusikkuna on jäänyt raolleen.',
    unlockedAtPhase: 'VAIHE1',
    inspectables: [
      {
        id: 'yopoyta',
        name: 'Yöpöytä',
        description: 'Pöydällä on Antin lukulasit ja hänen lukittu älypuhelimensa.',
        x: 70,
        y: 55,
        clueIdTrigger: 'antin_puhelin',
        revealText: 'Otat Antin puhelimen. Se vaatii pääsykoodin, mutta näytöllä näkyy saapunut viesti Lauralta klo 22.45: "Meidän täytyy puhua tästä heti. Älä tee mitään tyhmää." Otat puhelimen mukaasi tarkempaa tutkimusta varten.'
      },
      {
        id: 'salkku',
        name: 'Nahkasalkku sängyn alla',
        description: 'Antin lukittu nahkainen asiakirjasalkku.',
        x: 40,
        y: 80,
        clueIdTrigger: 'kirjanpitopaperit',
        revealText: 'Vedät salkun esiin. Se on lukittu numerolukolla, mutta kokeilet Oskarin mainitsemaa mökin osoitteen loppunumeroa (1988). Salkku aukeaa! Sisällä on paksu nippu heidän yrityksensä kirjanpitoasiakirjoja, joihin on tehty punaisella kynällä merkintöjä epäselvistä tilisiirroista.'
      },
      {
        id: 'tilisiirto',
        name: 'Asiakirjojen välistä löytynyt kuitti',
        description: 'Erillinen taiteltu paperi kirjanpitomateriaalin seassa.',
        x: 45,
        y: 82,
        clueIdTrigger: 'tilisiirto_elinalle',
        revealText: 'Asiakirjojen joukosta löytyy pankin virallinen vahvistus satojen tuhansien eurojen siirrosta Elinan omistamalle peiteyhtiölle ulkomaille. Antti oli kirjoittanut päälle: "ELINA!! KAVALLUS!! ILMOITA POLIISILLE MAANANTAINA!"'
      }
    ]
  },
  {
    id: 'sauna',
    name: 'Sauna',
    shortDesc: 'Rantasauna, jossa lauteet ovat jo kylmenneet, mutta ilmassa on vielä kosteutta.',
    longDesc: 'Saunassa tuoksuu koivu ja savu. Kiuas on kylmä. Lauteilla on tyhjiä oluttölkkejä ja lattialla lojuu myttyyn heitettyjä pyyhkeitä sekä vaatekasa naulakon alla.',
    bgGradient: 'from-stone-900 via-stone-950 to-amber-950/10',
    weatherAmbiance: 'Aallot loiskivat aivan saunan ulkoseinän takana.',
    unlockedAtPhase: 'VAIHE1',
    inspectables: [
      {
        id: 'vaatekasa',
        name: 'Naulakon vaatekasa',
        description: 'Myttyyn heitetyt märät vaatteet naulakossa.',
        x: 20,
        y: 65,
        clueIdTrigger: 'markuksen_saunavaatteet',
        revealText: 'Tutkit vaatekasaa. Ne ovat Markuksen saunavaatteet ja uimahousut. Ne ovat edelleen läpimärät ja tuoksuvat vahvasti savulta ja koivulta, mikä tukee hänen väitettään pitkästä saunomisesta.'
      },
      {
        id: 'lauteet',
        name: 'Lauteiden alle jäänyt esine',
        description: 'Hämärässä lauteiden alla näkyy jotain sinistä.',
        x: 80,
        y: 75,
        clueIdTrigger: 'tyhja_laakepakkaus',
        revealText: 'Kurkotat lauteiden alle ja löydät tyhjän reseptilääkepakkauksen. Se on voimakasta unilääkettä, kirjoitettu Antti Lehtosen nimelle. Oliko joku yrittänyt huumata hänet, vai kärsikö hän unettomuudesta?'
      }
    ]
  },
  {
    id: 'rantapolku',
    name: 'Rantapolku',
    shortDesc: 'Kosteuden liukastama polku mökin ja venevajan välillä.',
    longDesc: 'Polun reunoilla kasvaa korkeaa mustikanvarvustoa ja saniaisia, jotka roikkuvat raskaina vedestä. Myrsky on repinyt puista oksia maahan. Maaperä on mutaista ja pehmeää.',
    bgGradient: 'from-sky-950 via-slate-950 to-stone-950',
    weatherAmbiance: 'Sumu nousee järveltä ja tekee näkyvyyden huonoksi. Ilma on kylmä.',
    unlockedAtPhase: 'VAIHE1',
    inspectables: [
      {
        id: 'puskikko',
        name: 'Polun reunan puskikko',
        description: 'Yksi pensaista on selvästi murtunut, aivan kuin joku olisi rynnännyt siitä läpi pimeässä.',
        x: 50,
        y: 50,
        clueIdTrigger: 'oskarin_taskulamppu',
        revealText: 'Pensaiden seasta löydät raskaan, metallisen ja vedenkestävän taskulampun. Se on kytketty pois päältä, mutta sen pinnassa on tuoretta mutaa. Kylkeen on kaiverrettu kirjaimet "O.M." – Oskari Mäkelä!'
      }
    ]
  },
  {
    id: 'laituri',
    name: 'Laituri',
    shortDesc: 'Usvaisen järven ylle ulottuva vanha ja hutera puulaituri.',
    longDesc: 'Laiturin päässä on puinen penkki. Vesi liplattaa mustana ja kylmänä laiturin lankkuja vasten. Järven yllä leijuu paksu sumu, joka peittää vastarannan kokonaan näkyvistä.',
    bgGradient: 'from-blue-950 via-slate-950 to-teal-950/20',
    weatherAmbiance: 'Sumu on niin tiheää, että laiturilta tuskin näkee rantaan.',
    unlockedAtPhase: 'VAIHE2',
    inspectables: [
      {
        id: 'laiturin_paa',
        name: 'Laiturin päätylankut',
        description: 'Laiturin päässä on tumma jälki puussa, aivan kuin jotain painavaa olisi vedetty siitä.',
        x: 50,
        y: 70,
        clueIdTrigger: 'tekstiviesti_lauralle',
        revealText: 'Laiturin lankkujen välistä löydät pudonneen paperilapun, johon on kirjoitettu luonnos tekstiviestistä: "Laura, olen pahoillani aiemmasta. Elina on tehnyt jotain kamalaa yrityksemme rahoilla. En tiedä mitä tehdä. Tule venevajalle." Tämä selittää Lauran saaman viestin taustan!'
      }
    ]
  },
  {
    id: 'venevaja',
    name: 'Venevaja',
    shortDesc: 'Synkkä venevaja, jonka lattialta Antin ruumis löydettiin.',
    longDesc: 'Rikospaikka. Ruumis on jo siirretty kylmälaitteeseen poliisin ohjeiden mukaan, mutta lattialla näkyy edelleen halkeama ja kuivunutta verta. Venevaja on pölyinen ja täynnä vanhoja verkkoja, airoja ja moottoreita. Ilmassa tuoksuu bensiini ja järvivesi.',
    bgGradient: 'from-slate-950 via-neutral-900 to-amber-950/20',
    weatherAmbiance: 'Ulkona sumu tiivistyy entisestään, ja sade alkaa jälleen roiskia seiniä.',
    unlockedAtPhase: 'PROLOGUE',
    inspectables: [
      {
        id: 'rikospaikka_lattia',
        name: 'Verijälki lattialla',
        description: 'Paikka, jossa Antti makasi pää vammoilla. Lähellä lojuu rikkoutunut lyhty.',
        x: 50,
        y: 60,
        clueIdTrigger: 'rikkinainen_lyhty',
        revealText: 'Veritahran vieressä on raskas metallinen myrskylyhty, jonka lasi on sirpaleina ja kahva vääntynyt. Se on selvästi toiminut murha-aseena. Lyhdyssä on edelleen kuivunutta verta.'
      },
      {
        id: 'lyhyn_kahva',
        name: 'Lyhdyn sanka',
        description: 'Lyhdyn vääntyneen metallikahvan tarkempi tarkastelu.',
        x: 52,
        y: 63,
        clueIdTrigger: 'kuitu_lyhdyssa',
        revealText: 'Katsot vääntynyttä metallikahvaa hyvin läheltä suurennuslasilla. Huomaat, että kahvaan on takertunut karkea, tumma villakuitu. Se näyttää olevan peräisin jostain kalliista villakangastakista!'
      },
      {
        id: 'lattia_kengat',
        name: 'Kengänjäljet mudassa',
        description: 'Venevajan oviaukon lähellä olevassa kosteassa mudassa on kengänjälkiä.',
        x: 30,
        y: 75,
        clueIdTrigger: 'kenganjaljet_venevajalla',
        revealText: 'Tutkit lattian liejuisimpia kohtia. Löydät kaksi eri kengänjälkityyppiä. Toiset ovat raskaat ja kuuluvat uhrille (Antti). Toiset taas ovat pienemmät, tyylikkäät ja niissä on hyvin erikoinen kalanruotomainen kuviointi, joka sopii naisten kalliisiin ulkoilukenkiin.'
      },
      {
        id: 'ruumiin_tarkastelu',
        name: 'Antin käsi (rekonstruktio)',
        description: 'Antin löytöhetken asento. Hänen oikea kätensä oli puristettu tiukasti nyrkkiin.',
        x: 48,
        y: 40,
        clueIdTrigger: 'kangas_antin_kadessa',
        revealText: 'Valokuvista ja muistiinpanoista käy ilmi, että Antin nyrkkiin oli puristunut pieni kangaspala. Se on repäisty jostain vaatteesta riidan aikana. Se on laadukasta, mustaa villakangasta – tismalleen samanlaista kuin kuitu lyhdyssä.'
      },
      {
        id: 'venevajan_ovi',
        name: 'Venevajan ovi ja lukko',
        description: 'Oven lukko näyttää vaurioituneelta.',
        x: 10,
        y: 45,
        clueIdTrigger: 'venevajan_lukko',
        revealText: 'Oven lukitus on rikottu ulkopuolelta käsin lyömällä lukko rikki jollain painavalla esineellä. Lattialla on tuoreita metallinsiruja. Ovi oli murrettu auki illalla.'
      }
    ]
  },
  {
    id: 'vanhavarasto',
    name: 'Vanha varasto',
    shortDesc: 'Työkaluja ja polttopuita täynnä oleva kylmä pihavarasto.',
    longDesc: 'Varastossa tuoksuu bensiini, terva ja moottoriöljy. Seinillä roikkuu sahoja, kirveitä ja puutarhatyökaluja. Nurkassa on vanha polkupyörä ja puuhyllyköitä täynnä ruosteisia ruuvipurkkeja.',
    bgGradient: 'from-neutral-900 via-stone-950 to-neutral-950',
    weatherAmbiance: 'Tuuli paukuttaa varaston irrallista kattopeltiä.',
    unlockedAtPhase: 'VAIHE2',
    inspectables: [
      {
        id: 'tyokalulaatikko',
        name: 'Raskas työkalupakki',
        description: 'Hyllyllä oleva metallinen työkalulaatikko, joka on pölyn peitossa.',
        x: 45,
        y: 50,
        clueIdTrigger: 'tyokalulaatikko',
        revealText: 'Avaat työkalulaatikon. Sieltä löytyy kaikenlaista rautatavaraa, mutta huomaat, että yksi iso sorkkarauta on hiljattain pyyhitty puhtaaksi pölystä ja siinä on pienenpieniä maalijäämiä, jotka täsmäävät venevajan oven rikkoutuneeseen lukkoon.'
      }
    ]
  },
  {
    id: 'metsapolku',
    name: 'Metsäpolku',
    shortDesc: 'Synkkä polku, joka johtaa syvemmälle mökkiä ympäröivään metsään.',
    longDesc: 'Polun molemmin puolin kohoaa tiheä kuusimetsä, joka estää lähes kaiken valon pääsyn maahan. Polku on täynnä liukkaita puunjuuria ja märkiä lehtiä. Ilma on täällä täysin tyyni, mutta puiden latvat humisevat tuulessa.',
    bgGradient: 'from-emerald-950/20 via-stone-950 to-slate-950',
    weatherAmbiance: 'Metsässä on täysin pimeää ja hiljaista, vain sateen ropinan ääni kuuluu puiden lehvästön läpi.',
    unlockedAtPhase: 'VAIHE3',
    inspectables: [
      {
        id: 'kuusenoksa',
        name: 'Katkennut kuusenoksa',
        description: 'Polun sivussa oleva terävä kuusenoksa, jossa näkyy jotain omituista.',
        x: 35,
        y: 45,
        revealText: 'Tarkastelet oksaa. Siinä ei ole mitään rikokseen suoraan liittyvää, mutta huomaat sen olevan erittäin terävä ja tahrainen. Elina väitti takkinsa revenneen täällä, mutta täältä ei löydy lainkaan takista irronneita kuituja tai paloja.'
      }
    ]
  },
  {
    id: 'autopaikka',
    name: 'Autopaikka',
    shortDesc: 'Sora-alue mökin takana, jonne vieraiden autot on pysäköity.',
    longDesc: 'Kolme autoa seisoo pysäköitynä rinnakkain. Sora on mutaista ja lätäköitä täynnä. Autojen päällä on pudonneita lehtiä ja pieniä oksia myrskyn jäljiltä.',
    bgGradient: 'from-stone-900 via-slate-950 to-neutral-950',
    weatherAmbiance: 'Tuuli heiluttaa pihan suuria koivuja rajusti.',
    unlockedAtPhase: 'VAIHE1',
    inspectables: [
      {
        id: 'auton_renkaat',
        name: 'Maastoauton tavaratila',
        description: 'Elinan maastoauton takakontti, joka näyttää olevan lukitsematta.',
        x: 70,
        y: 60,
        clueIdTrigger: 'elinan_kengat', // Points to existing elinan_kengat clue
        revealText: 'Avaat auton takakontin varovasti. Löydät sieltä tyylikkään mustan ulkoilutakin suojapussin ja tyhjän kenkälaatikon, joka vahvistaa Elinan ostaneen juuri ne kalanruotokuvioiset vaelluskengät, jotka ovat mökin eteisessä!'
      }
    ]
  }
];

export const CLUES: Clue[] = [
  {
    id: 'rikkinainen_lyhty',
    name: 'Rikkoutunut metallilyhty',
    description: 'Venevajan lattialta kuolleen Antin vierestä löytynyt painava metallinen myrskylyhty.',
    iconType: 'lantern',
    locationId: 'venevaja',
    foundInObject: 'Verijälki lattialla',
    isMisleading: false,
    detailedAnalysis: 'Tämä on murha-ase. Lyhty on erittäin painavaa valurautaa, ja sen lasisuojus on mennyt pirstaleiksi voimakkaasta iskusta. Sangan juuressa ja metalliosissa on uhrin verta ja hiuksia. Lyhdyn kahva on vääntynyt, mikä osoittaa, että sitä on puristettu ja lyöty erittäin kovaa voimaa käyttäen.',
    category: 'Murha-ase',
    evidenceValueStars: 5,
    forensicAnalysis: 'Raskas metallinen myrskylyhty löytyi venevajan lattialta aivan Antin ruumiin vierestä. Lyhdyn lasi oli rikkoutunut ja metallirungossa havaittiin voimakkaan iskun aiheuttamia vaurioita. Rikosteknisessä tutkimuksessa siitä löydettiin uhrin verta, hiuksia sekä mikroskooppisia kudosjäämiä. Iskun korkeus, voima ja vauriot vastaavat uhrin pään vammoja, minkä perusteella lyhty tunnistettiin murha-aseeksi.',
    investigativeSignificance: 'Rikkoutunut metallilyhty on tutkinnan keskeinen fyysinen todiste ja todennäköinen murha-ase. Se yhdistyy analysoidun äänitallenteen lopussa kuuluvaan voimakkaaseen iskuun ja lasin rikkoutumiseen. Yhdessä repeytyneen takin hihan, Antin kädessä olleen kangaspalan ja tumman kangaskuidun kanssa lyhty muodostaa vahvan todisteketjun, joka osoittaa rikospaikalla käydyn väkivaltaisen kamppailun.',
    connectedClues: ['elinan_aani_tallenteella', 'kangas_antin_kadessa', 'repeytynyt_hiha', 'kuitu_lyhdyssa']
  },
  {
    id: 'kuitu_lyhdyssa',
    name: 'Tumma kangaskuitu',
    description: 'Lyhdyn vääntyneen kahvan metalliosiin tarttunut tumma kuitu.',
    iconType: 'fiber',
    locationId: 'venevaja',
    foundInObject: 'Lyhdyn sanka',
    isMisleading: false,
    detailedAnalysis: 'Suurennuslasitutkimus paljastaa kuitujen olevan harvinaista, erittäin kallista kashmirvillaa, joka on värjätty syvän mustaksi. Tämä kuitu ei täsmää Antin omiin vaatteisiin tai kenenkään muun paitsi Elinan ylellisen talvitakin materiaaliin.',
    category: 'Fyysinen todiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Mikroskooppisessa ja spektrofotometrisessä vertailussa sangan metalliurista löydetty kuitunäyte paljastui hienoksi, syvänmustaksi kashmirvillaksi. Kuitujen laatu, paksuus ja värjäysmenetelmä täsmäävät täydellisesti Elina Koskisen vaatekaapista löytyneeseen mustaan villakankaaseen. Kuidut eivät ole voineet siirtyä lyhtyyn pelkän ilmavirran mukana, vaan ne ovat hiertyneet metalliin voimakkaassa hankauksessa.',
    investigativeSignificance: 'Kangaskuitu murha-aseen kahvassa osoittaa, että mustaan kashmirvillatakkkiin pukeutunut henkilö on käsitellyt lyhtyä tai ollut sen välittömässä läheisyydessä, kun sitä puristettiin tai sillä lyötiin. Tämä linkittää Elinan villatakin suoraan murha-aseeseen. Yhdessä Antin kädestä löytyneen kangaspalan, takin repeytyneen hihan ja rikkoutuneen metallilyhdyn kanssa se muodostaa aukottoman fyysisen todisteketjun.',
    connectedClues: ['repeytynyt_hiha', 'kangas_antin_kadessa', 'rikkinainen_lyhty', 'elinan_aani_tallenteella']
  },
  {
    id: 'repeytynyt_hiha',
    name: 'Repeytynyt takin hiha',
    description: 'Elinan kaapissa roikkuvan kalliin mustan villakangastakin repeämä ja puuttuva pala oikeassa hihassa.',
    iconType: 'sleeve',
    locationId: 'vierashuone',
    foundInObject: 'Elinan vaatekaappi',
    suspectId: 'elina',
    isMisleading: false,
    detailedAnalysis: 'Elinan takin oikean hihan suu on repeytynyt karkeasti. Puuttuva pala vastaa kooltaan ja muodoltaan täydellisesti kangaspalaa, joka löydettiin uhrin kädestä. Repeämän reunoilta löytyy mikroskooppisia veriroiskeita, jotka ovat peräisin uhrin veriryhmästä.',
    category: 'Fyysinen todiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Elina Koskisen takista löytynyt repeytynyt hiha tutkittiin rikosteknisessä laboratoriossa. Repeämän reunat vastaavat täydellisesti Antin kädestä löytynyttä kangaspalaa. Hihan kuiturakenne on identtinen ja reunoilta löytyi pieniä verijäämiä, jotka vastaavat uhrin veriryhmää. Löydökset osoittavat, että vaurio syntyi väkivaltaisen kamppailun aikana eikä luonnollisen kulumisen seurauksena.',
    investigativeSignificance: 'Repeytynyt hiha muodostaa suoran fyysisen yhteyden Elinan ja uhrin välille. Se kumoaa Elinan väitteen siitä, että takki olisi revennyt metsäpolulla. Yhdessä Antin kädestä löytyneen kangaspalan kanssa tämä johtolanka todistaa, että heidän välillään käytiin fyysinen kamppailu juuri ennen murhaa.',
    connectedClues: ['kangas_antin_kadessa', 'kuitu_lyhdyssa', 'elinan_aani_tallenteella', 'rikkinainen_lyhty']
  },
  {
    id: 'antin_puhelin',
    name: 'Antin puhelin',
    description: 'Antin yöpöydältä löytynyt älypuhelin, jossa on näkyvissä Lauralta saapunut viesti.',
    iconType: 'phone',
    locationId: 'antinhuone',
    foundInObject: 'Yöpöytä',
    isMisleading: false,
    detailedAnalysis: 'Puhelin on lukittu, mutta näytön ilmoituksista käy ilmi Lauran klo 22.45 lähettämä varoitus. Kun puhelin myöhemmin saadaan auki, sieltä paljastuu myös useita vastaamattomia puheluita Elinalta sekä Elinan lähettämä kylmä viesti aiemmalta illalta: "Meidän on sovittava tämä ennen aamua, tai tästä seuraa katastrofi molemmille."',
    category: 'Digitaalinen todiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Antin lukittu puhelin löytyi hänen yöpöydältään. Rikostekninen analyysi onnistui palauttamaan viimeisimmät viestit. Puhelimesta löytyi Lauran klo 22.45 lähettämä varoitusviesti sekä Elina Koskisen uhkaava viesti: "Meidän on sovittava tämä ennen aamua, tai tästä seuraa katastrofi molemmille." Viestit osoittavat, että Antti tiesi tilanteen vakavuuden juuri ennen kuolemaansa.',
    investigativeSignificance: 'Puhelimen viestit osoittavat, että Anttiin kohdistui voimakasta painostusta juuri ennen murhaa. Erityisesti Elinan lähettämä viesti tukee teoriaa siitä, että heidän välillään oli vakava konflikti liittyen yrityksen talousrikoksiin. Todiste muodostaa tärkeän yhteyden muihin taloudellisiin johtolankoihin.',
    connectedClues: ['tilisiirto_elinalle', 'kirjanpitopaperit', 'elinan_aani_tallenteella', 'tekstiviesti_lauralle']
  },
  {
    id: 'tekstiviesti_lauralle',
    name: 'Antin viestiluonnos',
    description: 'Laiturin lankkujen välistä löytynyt taiteltu paperiluonnos viestistä Lauralle.',
    iconType: 'message',
    locationId: 'laituri',
    foundInObject: 'Laiturin päätylankut',
    isMisleading: false,
    detailedAnalysis: 'Paperilapussa on Antin käsialalla kirjoitettu viestiluonnos, jota hän ei koskaan ehtinyt lähettää puhelimellaan. Siinä hän varoittaa Lauraa Elinan tekemistä talousrikoksista ja pyytää tätä tulemaan venevajalle tapaamaan häntä. Tämä vahvistaa, että Antti tiesi kavalluksesta ja aikoi kohdata Elinan venevajalla.',
    category: 'Asiakirjatodiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Rikostekninen tutkimus osoittaa, että Antti oli kirjoittamassa viestiä Lauralle juuri ennen kuolemaansa. Viestissä hän varoittaa Elinan talousrikoksista ja pyytää Lauraa tulemaan kiireellisesti venevajalle. Viesti jäi lähettämättä, mikä viittaa siihen, että Antti keskeytettiin ennen kuin hän ehti lähettää sen.',
    investigativeSignificance: 'Viestiluonnos osoittaa, että Antti oli valmis paljastamaan Elinan tekemän kavalluksen. Se tukee teoriaa siitä, että murhan motiivina oli estää talousrikosten paljastuminen. Viesti muodostaa tärkeän yhteyden puhelimeen, kirjanpitopapereihin ja tilisiirtotositteeseen.',
    connectedClues: ['antin_puhelin', 'tilisiirto_elinalle', 'kirjanpitopaperit', 'elinan_aani_tallenteella']
  },
  {
    id: 'kirjanpitopaperit',
    name: 'Yrityksen kirjanpitopaperit',
    description: 'Antin lukitusta salkusta löytyneet viralliset tilinpäätösasiakirjat.',
    iconType: 'paper',
    locationId: 'antinhuone',
    foundInObject: 'Nahkasalkku sängyn alla',
    isMisleading: false,
    detailedAnalysis: 'Paperit osoittavat, että heidän yhteisen konsulttiyrityksensä tileiltä on kadonnut epämääräisten konsultointilaskujen varjolla yli 420 000 euroa viimeisen kahden vuoden aikana. Kaikki laskut on hyväksynyt Elina Koskinen ilman Antin allekirjoitusta.',
    category: 'Talousrikostodiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Yrityksen alkuperäiset kirjanpitopaperit sisältävät useita ristiriitoja virallisiin tilinpäätöstietoihin verrattuna. Asiakirjoista löytyi puuttuvia maksusuorituksia, muutettuja laskusummia sekä useita siirtoja ulkomaisille tileille ilman liiketaloudellista perustetta. Antin omat käsin kirjoitetut merkinnät osoittavat hänen havainneen epäselvyydet ja aloittaneen niiden selvittämisen juuri ennen kuolemaansa.',
    investigativeSignificance: 'Kirjanpitopaperit muodostavat tutkinnan taloudellisen perustan. Ne osoittavat, että yrityksessä oli tapahtunut pitkäkestoista kavallusta, jonka Antti oli paljastamassa. Yhdessä tilisiirtotositteen, osittain palaneen kirjanpitopaperin ja analysoidun äänitallenteen kanssa asiakirjat muodostavat vahvan kokonaisuuden, joka selittää murhan taloudellisen motiivin.',
    connectedClues: ['tilisiirto_elinalle', 'poltettu_paperi', 'elinan_aani_tallenteella', 'tekstiviesti_lauralle']
  },
  {
    id: 'tilisiirto_elinalle',
    name: 'Tilisiirtotosite',
    description: 'Pankin vahvistus varojen siirrosta Elinan hallinnoimalle pöytälaatikko-osakeyhtiölle.',
    iconType: 'account',
    locationId: 'antinhuone',
    foundInObject: 'Nahkasalkku sängyn alla',
    suspectId: 'elina',
    isMisleading: false,
    detailedAnalysis: 'Tämä asiakirja on "savuava ase" taloudellisesta motiivista. Siinä näkyy reaaliaikainen tilisiirto yrityksen päätililtä Cayman-saarille rekisteröidylle yhtiölle, jonka ainoa nimenkirjoitusoikeus on Elina Koskisella. Antti oli löytänyt tämän kuitin juuri ennen mökkimatkaa.',
    category: 'Talousrikostodiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Yrityksen asiakirjojen välistä löytynyt pankin virallinen tilisiirtotosite vahvistaa, että huomattava rahasumma on siirretty Elina Koskisen hallitsemaan peiteyhtiöön Cayman-saarille. Asiakirjassa näkyvät siirron tiedot, päivämäärä sekä Antin käsin kirjoittama huomautus, jossa hän ilmoittaa aikovansa tehdä asiasta rikosilmoituksen. Tutkimus vahvistaa asiakirjan olevan aito eikä siinä havaittu merkkejä väärentämisestä.',
    investigativeSignificance: 'Tilisiirtotosite paljastaa murhan todennäköisen motiivin. Asiakirja osoittaa, että Antti oli saanut haltuunsa kiistattomat todisteet kavalluksesta ja aikoi ilmoittaa asiasta poliisille. Yhdessä kirjanpitopapereiden, analysoidun äänitallenteen ja osittain palaneen kirjanpitopaperin kanssa tämä johtolanka muodostaa tutkinnan vahvimman talousrikoksiin liittyvän todistekokonaisuuden.',
    connectedClues: ['kirjanpitopaperit', 'poltettu_paperi', 'elinan_aani_tallenteella', 'tekstiviesti_lauralle']
  },
  {
    id: 'saran_tallennin',
    name: 'Äänitallennin',
    description: 'Saran repusta löytynyt ammattitason sanelema, joka oli päällä koko illan.',
    iconType: 'tape',
    locationId: 'vierashuone',
    foundInObject: 'Saran käsilaukku',
    suspectId: 'sara',
    isMisleading: false,
    detailedAnalysis: 'Äänitallennin sisältää useita tunteja mökillä nauhoitettuja taustakeskusteluja. Yksi nauhoitustiedosto on tallennettu myöhään illalla ulkona, kun tallennin oli jätetty Saran takin taskuun kuistille. Tiedosto sisältää erittäin paljastavaa ääntä rannan suunnasta.',
    category: 'Digitaalinen todiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Digitaalinen äänitallennin löytyi rikospaikan läheisyydestä maahan pudonneena. Laitteen muisti saatiin palautettua onnistuneesti, eikä tallenteessa havaittu merkkejä editoinnista tai manipuloinnista. Tallenne sisältää Antin ja Elina Koskisen välisen kiivaan riidan, jossa keskustellaan yrityksen kadonneista varoista ja poliisille ilmoittamisesta. Tallenteen lopussa kuuluu voimakas isku, metalliesineen osuminen, rikkoutuvan lasin ääni sekä Antin kaatuminen. Äänitallenne tukee muuta rikosteknistä näyttöä ja vahvistaa tapahtumien aikajärjestyksen.',
    investigativeSignificance: 'Äänitallennin tarjoaa objektiivisen tapahtumakuvauksen juuri ennen murhaa. Tallenne yhdistää talousrikokset, epäiltyjen välisen riidan ja murha-aseen käyttöön viittaavat äänet yhdeksi yhtenäiseksi tapahtumaketjuksi. Yhdessä analysoidun äänitallenteen, rikkoutuneen metallilyhdyn, tilisiirtotositteen ja repeytyneen takin hihan kanssa tämä johtolanka muodostaa yhden tutkinnan vahvimmista kokonaisuuksista.',
    connectedClues: ['elinan_aani_tallenteella', 'rikkinainen_lyhty', 'tilisiirto_elinalle', 'repeytynyt_hiha']
  },
  {
    id: 'elinan_aani_tallenteella',
    name: 'Analysoitu äänitallenne',
    description: 'Äänitallenteen tiedosto "REC_004.WAV", jossa kuuluu Elinan ja Antin äänekäs riita.',
    iconType: 'voice',
    locationId: 'vierashuone',
    foundInObject: 'Saran käsilaukku',
    suspectId: 'elina',
    isMisleading: false,
    detailedAnalysis: 'Nauhoite on tallennettu klo 23.10. Taustalla kuuluu selvästi myrskyn humina ja aaltojen loiske, mikä todistaa nauhoituksen tapahtuneen ulkona rannassa. Ajassa 12:45 Antti huutaa: "Sinä varastit ne rahat, Elina! Huomenna kaikki saavat tietää!" johon Elina vastaa vihaisesti ja kylmästi: "Et tule pilaamaan elämääni, Antti. Lopeta tuo heti!" Tämän jälkeen kuuluu kolahdus ja lasin rikkoutumisen ääni.',
    category: 'Digitaalinen analyysi',
    evidenceValueStars: 5,
    forensicAnalysis: 'Äänitallenne on puhdistettu taustamelusta rikosteknisellä analyysiohjelmistolla. Tallenteelta tunnistetaan selvästi Elina Koskisen ääni sekä Antin kanssa käyty sanallinen riita juuri ennen arvioitua kuolinaikaa. Tallenteen lopussa kuuluu voimakas isku ja rikkoutuvan lasin ääni, jotka vastaavat rikospaikalta löytynyttä rikkoutunutta metallilyhtyä. Tallenne osoittaa, että Elinan kertomus tapahtumien kulusta ei pidä paikkaansa.',
    investigativeSignificance: 'Tämä johtolanka kumoaa Elinan alibin. Äänitallenne todistaa hänen olleen rikospaikalla juuri ennen murhaa. Tallenne muodostaa yhden tutkinnan vahvimmista todisteista ja yhdistyy talousrikoksia koskeviin asiakirjoihin sekä muihin fyysisiin todisteisiin.',
    connectedClues: ['saran_tallennin', 'auton_avaimet', 'tilisiirto_elinalle', 'kirjanpitopaperit'],
    imageUrl: '/images/ui/elinan_aani_tallenteella.png'
  },
  {
    id: 'kenganjaljet_venevajalla',
    name: 'Märkä kengänjälki',
    description: 'Venevajan ovella olleet tuoreet kalanruotokuvioiset kengänjäljet.',
    iconType: 'footprint',
    locationId: 'venevaja',
    foundInObject: 'Kengänjäljet mudassa',
    isMisleading: false,
    detailedAnalysis: 'Jäljet ovat syntyneet vähän ennen kuin sade huuhtoi osan polusta mennessään. Se tarkoittaa, että joku naispuolinen henkilö, jolla on pienehkö jalka ja tyylikkäät vaelluskengät, käveli venevajan sisään ja sieltä pois myrskyn aikana.',
    category: 'Rikostekninen jälkitodiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Venevajan sisäänkäynniltä löytynyt märkä kengänjälki dokumentoitiin ja analysoitiin rikosteknisessä laboratoriossa. Jäljen kalanruotokuvio, koko ja kulumajäljet vastaavat täydellisesti Elina Koskisen vaelluskenkien pohjaa. Jäljen ympäriltä löytynyt kostea järvimuta osoittaa, että se on syntynyt juuri ennen rikoksen tapahtuma-aikaa eikä ole vanha jälki.',
    investigativeSignificance: 'Märkä kengänjälki sijoittaa Elinan rikospaikalle murhan tapahtuma-aikaan. Yhdessä vaelluskenkien, analysoidun äänitallenteen ja Antin kädessä olleen kangaspalan kanssa se muodostaa yhden tutkinnan vahvimmista todistekokonaisuuksista.',
    connectedClues: ['elinan_kengat', 'elinan_aani_tallenteella', 'kangas_antin_kadessa', 'auton_avaimet']
  },
  {
    id: 'elinan_kengat',
    name: 'Elinan vaelluskengät',
    description: 'Elinan kosteat vaelluskengät mökin eteisessä.',
    iconType: 'shoe',
    locationId: 'olohuone',
    foundInObject: 'Eteisen naulakko',
    suspectId: 'elina',
    isMisleading: false,
    detailedAnalysis: 'Elinan kenkien pohjien kalanruoto- ja tähtikuvio on täydellinen pari venevajan ovelta kipsattujen kengänjälkien kanssa. Kenkien pohjien urissa on yhä pienenpieniä puun sälöjä, jotka ovat peräisin venevajan rikotusta puulattiasta.',
    category: 'Fyysinen todiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Elinan vaelluskengät löytyivät mökin eteisestä. Kengät olivat edelleen kosteat, ja niiden pohjakuvio vastaa täydellisesti venevajan edustalta löydettyjä märkiä kengänjälkiä. Pohjien uriin oli lisäksi tarttunut pieniä puusäleitä, joiden rakenne vastaa venevajan rikkoutunutta lattiaa. Rikostekninen vertailu osoittaa erittäin vahvan yhteyden rikospaikkaan.',
    investigativeSignificance: 'Vaelluskengät kumoavat Elinan väitteen siitä, ettei hän poistunut mökistä murhan aikaan. Ne muodostavat yhdessä märkien kengänjälkien, analysoidun äänitallenteen ja auton avainten kanssa yhden tutkinnan vahvimmista todistekokonaisuuksista.',
    connectedClues: ['kenganjaljet_venevajalla', 'auton_avaimet', 'elinan_aani_tallenteella', 'kangas_antin_kadessa']
  },
  {
    id: 'markuksen_saunavaatteet',
    name: 'Markuksen märät saunavaatteet',
    description: 'Saunan naulakosta löytyneet Markuksen edelleen läpimärät vaatteet.',
    iconType: 'clothes',
    locationId: 'sauna',
    foundInObject: 'Naulakon vaatekasa',
    suspectId: 'markus',
    isMisleading: true,
    detailedAnalysis: 'Nämä vaatteet tuoksuvat voimakkaasti koivulta ja puusaunan savulta. Vaatteet ovat läpimärät, mikä tukee Markuksen kertomusta siitä, että hän vietti pitkiä aikoja saunoen ja vilvoitellen ulkona vesisateessa. Niistä ei löydy jälkiä mudasta tai venevajan bensiinistä.',
    category: 'Alibia tukeva todiste',
    evidenceValueStars: 3,
    forensicAnalysis: 'Markuksen saunavaatteet löytyivät rantasaunalta edelleen kosteina. Rikostekninen tutkimus havaitsi niissä runsaasti kosteutta sekä savun ja saunan tuoksua, mutta ei rikospaikalle tyypillistä mutaa, verta, puunsäleitä tai muita väkivaltaiseen tapahtumaan viittaavia jälkiä. Löydökset tukevat Markuksen kertomusta siitä, että hän vietti murhan tapahtuma-aikaan aikaa saunassa ja sen terassilla.',
    investigativeSignificance: 'Johtolanka vahvistaa Markuksen alibia eikä tue hänen osallisuuttaan murhaan. Vaikka Markus oli aiemmin riidellyt Antin kanssa, rikostekniset löydökset eivät yhdistä häntä rikospaikkaan. Tämä auttaa rajaamaan epäiltyjen joukkoa ja ohjaa tutkintaa muihin henkilöihin.',
    connectedClues: ['markus', 'elinan_aani_tallenteella', 'rikkinainen_lyhty', 'kenganjaljet_venevajalla']
  },
  {
    id: 'oskarin_taskulamppu',
    name: 'Oskarin metallinen taskulamppu',
    description: 'Rantapolun pensaikosta löydetty raskas taskulamppu, jossa on Oskarin nimikirjaimet.',
    iconType: 'flashlight',
    locationId: 'rantapolku',
    foundInObject: 'Polun reunan puskikko',
    suspectId: 'oskari',
    isMisleading: true,
    detailedAnalysis: 'Taskulampussa on Oskari Mäkelän nimikirjaimet "O.M.". Taskulamppu on sammutettu, ja sen päällä on mutaa. Oskari myöntää pudottaneensa sen pimeässä, kun sähköt katkesivat ja hän kävi tarkastamassa sähkökaappia rannan lähellä. Lamppu on täysin ehjä, eikä siinä ole verijälkiä.',
    category: 'Alibia tukeva todiste',
    evidenceValueStars: 3,
    forensicAnalysis: 'Metallinen taskulamppu löytyi rantapolun puskikosta. Taskulampussa on kaiverrus "O.M.", joka yhdistää sen Oskari Mäkelään. Rikostekninen tutkimus ei löytänyt siitä verta, kudosjäämiä eikä muita väkivallan merkkejä. Lampuissa havaittu kosteus, muta ja pintavauriot vastaavat Oskarin kertomusta siitä, että hän pudotti taskulampun kiirehtiessään tarkistamaan sähkökatkon aiheuttanutta vikaa.',
    investigativeSignificance: 'Taskulamppu tukee Oskarin alibia eikä yhdistä häntä murhaan. Todiste vahvistaa hänen kertomustaan liikkumisesta sähkökatkon aikana ja auttaa rajaamaan tutkinnan painopisteen muihin epäiltyihin. Se toimii tärkeänä poissulkevana todisteena tutkinnan kokonaisuudessa.',
    connectedClues: ['oskari', 'elinan_aani_tallenteella', 'markuksen_saunavaatteet', 'kenganjaljet_venevajalla']
  },
  {
    id: 'venevajan_lukko',
    name: 'Venevajan rikottu lukko',
    description: 'Sorkkaraudalla tai vastaavalla väkisin murrettu venevajan lukko.',
    iconType: 'lock',
    locationId: 'venevaja',
    foundInObject: 'Venevajan ovi ja lukko',
    isMisleading: false,
    detailedAnalysis: 'Venevajan lukon vauriot osoittavat, että ovi oli lukittu, ja joku murtautui sinne väkisin. Lukon metalli on vääntynyt voimakkaan iskun ja vääntämisen seurauksena. Tämä selittää sen, miksi työkaluja tarvittiin sisäänpääsyyn.',
    category: 'Rikostekninen työkalutodiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Venevajan oven lukon murtokohtien metallivauriot ja iskujäljet tutkittiin laboratoriossa. Vääntymisjäljet osoittavat lukituksen pettäneen ulkopuolelta kohdistetun vipuvoiman vaikutuksesta. Työkalun kärjen muoto ja lukon reunaan jääneet punaiset maalijäämät täsmäävät täydellisesti varastosta löytyneeseen sorkkarautaan. Lukituksen murtaminen on vaatinut merkittävää voimaa ja sopivan työkalun käyttöä.',
    investigativeSignificance: 'Rikottu lukko vahvistaa, että venevajaan oli lukittu sisäänpääsy, joka piti murtaa väkisin ennen surmatyötä. Tämä osoittaa rikoksessa suunnitelmallisuutta, sillä tekijän on täytynyt hakea sorkkarauta vanhasta varastosta ennen tekoa. Lukko linkittyy suoraan varaston sorkkarautaan (tyokalulaatikko) ja rikkoutuneeseen metallilyhtyyn.',
    connectedClues: ['tyokalulaatikko', 'rikkinainen_lyhty', 'elinan_aani_tallenteella', 'kangas_antin_kadessa']
  },
  {
    id: 'kangas_antin_kadessa',
    name: 'Antin kädessä oleva kangaspala',
    description: 'Antin kylmenneestä oikeasta kädestä löydetty pieni repeytynyt kankaanpalanen.',
    iconType: 'fabric',
    locationId: 'venevaja',
    foundInObject: 'Antin käsi (rekonstruktio)',
    isMisleading: false,
    detailedAnalysis: 'Tämä pieni, musta kangaspala on repäisty erittäin kovaa vetämällä. Kangas on poikkeuksellisen hienoa ja kallista italialaista kashmirvillaa. Se täsmää täydellisesti Elinan repeytyneen takin hihan kankaaseen ja lyhdyn kahvasta löytyneeseen kuituun.',
    category: 'Fyysinen todiste',
    evidenceValueStars: 5,
    forensicAnalysis: 'Antin oikeasta kädestä löytynyt musta kangaspala irrotettiin rikosteknisessä tutkimuksessa. Kuituanalyysi osoittaa sen olevan laadukasta kashmirvillaa. Repeämän reunat vastaavat täydellisesti Elina Koskisen takista löytynyttä repeämää. Löydös osoittaa, että uhri ja hyökkääjä joutuivat fyysiseen kamppailuun juuri ennen kuolemaa.',
    investigativeSignificance: 'Kangaspala muodostaa suoran fyysisen yhteyden uhrin ja Elina Koskisen välillä. Todiste kumoaa Elinan selityksen siitä, että hänen takkinsa olisi revennyt metsäpolulla. Yhdessä repeytyneen hihan kanssa tämä johtolanka osoittaa väkivaltaisen kamppailun tapahtuneen rikospaikalla.',
    connectedClues: ['repeytynyt_hiha', 'rikkinainen_lyhty', 'elinan_aani_tallenteella', 'kenganjaljet_venevajalla']
  },
  {
    id: 'keittion_kello',
    name: 'Keittiön pysäytetty seinäkello',
    description: 'Seinäkello, joka on pysähtynyt kello 23.15, koska akku on otettu pois.',
    iconType: 'clock',
    locationId: 'keittio',
    foundInObject: 'Seinäkello',
    isMisleading: true,
    detailedAnalysis: 'Kello on pysäytetty tarkoituksella klo 23.15 poistamalla sen paristo ja asettamalla se hyllylle. Tämä näyttää olleen kömpelö yritys luoda lavastettu alibi tapahtuma-ajalle, jotta epäilty voisi väittää olleensa keittiössä tiettyyn aikaan, kun "kello yhä kävi".',
    category: 'Lavastettu todiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Keittiön seinäkello oli pysähtynyt tarkalleen klo 23.15. Rikostekninen tutkimus osoittaa, ettei kyse ollut pariston tyhjenemisestä, vaan paristo oli poistettu kellosta käsin ja asetettu huolellisesti viereiselle hyllylle. Sormenjälkijäämät viittaavat siihen, että kelloa on käsitelty pian murhan jälkeen. Tutkinnan perusteella kello on pysäytetty tarkoituksellisena yrityksenä vääristää tapahtumien aikajanaa ja tukea väärää alibia.',
    investigativeSignificance: 'Seinäkello osoittaa, että rikospaikkaa on pyritty lavastamaan murhan jälkeen. Löydös heikentää Elinan kertomusta siitä, että hän olisi ollut koko illan keittiössä valmistamassa iltapalaa. Yhdessä analysoidun äänitallenteen ja muiden fyysisten todisteiden kanssa kello auttaa muodostamaan tarkan tapahtuma-aikajanan.',
    connectedClues: ['elinan_aani_tallenteella', 'antin_puhelin', 'elinan_kengat', 'tilisiirto_elinalle']
  },
  {
    id: 'auton_avaimet',
    name: 'Elinan auton avaimet',
    description: 'Elinan upouuden maastoauton avaimet, joissa on mutajälkiä.',
    iconType: 'keys',
    locationId: 'keittio',
    foundInObject: 'Avainnaulakko',
    suspectId: 'elina',
    isMisleading: false,
    detailedAnalysis: 'Elinan avaimenperässä on kuivunutta järvimutaa ja pieniä raaputusjälkiä. Tämä viittaa siihen, että avaimet olivat hänen taskussaan, kun hän poistui pimeään ja sateiseen yöhön rantaan, vaikka hän väittää olleensa koko ajan sisätiloissa puhtaassa keittiössä.',
    category: 'Fyysinen todiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Avaimet löytyivät mökin eteisen naulakosta. Avaimenperässä on Elina Koskisen nimikirjaimet, ja rikostekninen tutkimus havaitsi avaimissa kuivunutta järvimutaa sekä hienojakoista maa-ainesta. Löydös viittaa siihen, että avaimia on käsitelty ulkona juuri ennen niiden palauttamista sisälle. Havainto ei yksin todista syyllisyyttä, mutta se on ristiriidassa Elinan kertomuksen kanssa, jonka mukaan hän ei poistunut mökistä illan aikana.',
    investigativeSignificance: 'Avaimet heikentävät Elinan alibia osoittamalla, että hän on todennäköisesti liikkunut ulkona murhan tapahtuma-aikaan. Yhdessä analysoidun äänitallenteen, kengänjälkien ja vaelluskengistä löytyneiden jälkien kanssa ne vahvistavat tutkinnan kokonaiskuvaa.',
    connectedClues: ['elinan_aani_tallenteella', 'elinan_kengat', 'kenganjaljet_venevajalla', 'tilisiirto_elinalle']
  },
  {
    id: 'poltettu_paperi',
    name: 'Osittain palanut kirjanpitopaperi',
    description: 'Takan tuhkan joukosta löydetty osittain hiiltynyt paperinpala.',
    iconType: 'ash',
    locationId: 'olohuone',
    foundInObject: 'Hiipuva takka',
    isMisleading: false,
    detailedAnalysis: 'Hiiltyneestä paperista on luettavissa sanat "...YITYKSEN KAVALL... ...KOSKINEN... ...350 000 EUR...". Tämä todistaa, että joku yritti kiireesti hävittää taloudellisia todisteita polttamalla niitä olohuoneen takassa myöhään yöllä tai varhain aamulla ennen muiden heräämistä.',
    category: 'Asiakirjatodiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Takan tuhkasta löytynyt asiakirja on vaurioitunut voimakkaasti tulessa, mutta rikostekninen kuvankäsittely ja infrapunatutkimus mahdollistivat osan tekstistä palauttamisen. Asiakirjasta voidaan tunnistaa viittauksia yrityksen kirjanpitoon, Elina Koskisen nimeen sekä huomattaviin rahasummiin. Löydökset viittaavat siihen, että joku yritti hävittää talousrikoksiin liittyviä todisteita pian murhan jälkeen.',
    investigativeSignificance: 'Osittain palanut kirjanpitopaperi tukee teoriaa siitä, että murhan motiivina oli talousrikosten peittely. Asiakirjan hävitysyritys osoittaa tietoista pyrkimystä estää rikosten paljastuminen. Yhdessä kirjanpitopapereiden, tilisiirtotositteen ja analysoidun äänitallenteen kanssa se muodostaa vahvan todistekokonaisuuden.',
    connectedClues: ['kirjanpitopaperit', 'tilisiirto_elinalle', 'elinan_aani_tallenteella', 'tekstiviesti_lauralle']
  },
  {
    id: 'tyokalulaatikko',
    name: 'Sorkkarauta varastossa',
    description: 'Varaston vanhasta työkalulaatikosta löytynyt äskettäin käytetty sorkkarauta.',
    iconType: 'tools',
    locationId: 'vanhavarasto',
    foundInObject: 'Raskas työkalupakki',
    isMisleading: false,
    detailedAnalysis: 'Sorkkaraudan päässä on punaista maalia ja metallisälöjä, jotka vastaavat täydellisesti venevajan rikottua oven lukkoa ja sen punaiseksi maalattua karmia. Varaston omistajan Oskarin mukaan sorkkarauta oli aiemmin siisti ja pölyinen, mutta nyt siitä on pyyhitty sormenjäljet kiireisesti kankaalla.',
    category: 'Rikostekninen työkalutodiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Varaston työkalupakista löytynyt sorkkarauta tutkittiin rikosteknisessä laboratoriossa. Työkalun kärjessä havaittiin punaista maalia sekä pieniä metallisäleitä, jotka vastaavat venevajan rikotun lukon ja ovenkarmien materiaaleja. Työkalun pinnalta ei löytynyt käyttökelpoisia sormenjälkiä, mikä viittaa siihen, että ne on pyyhitty pois tarkoituksellisesti pian käytön jälkeen.',
    investigativeSignificance: 'Sorkkarauta osoittaa, että venevajan lukitus murrettiin väkisin ennen rikoksen tapahtumista. Työkalu yhdistyy rikottuun lukkoon ja tukee tapahtumaketjua, jossa tekijä hankki pääsyn venevajaan ennen murhaa. Vaikka sorkkarauta ei yksin osoita tekijää, se vahvistaa rikoksen suunnitelmallisuutta.',
    connectedClues: ['venevajan_lukko', 'rikkinainen_lyhty', 'elinan_aani_tallenteella', 'kangas_antin_kadessa']
  },
  {
    id: 'tyhja_laakepakkaus',
    name: 'Tyhjä unilääkepakkaus',
    description: 'Saunan lauteiden alle hylätty tyhjä unilääkepakkaus Antin nimellä.',
    iconType: 'pills',
    locationId: 'sauna',
    foundInObject: 'Lauteiden alle jäänyt esine',
    isMisleading: false,
    detailedAnalysis: 'Tämä on voimakas reseptilääkepakkaus "Somnium 10mg", joka on määrätty Antti Lehtoselle. Se on täysin tyhjä. Myöhempi tutkimus paljastaa, että Antti kärsi vakavasta työstressistä ja unettomuudesta. Reseptilääkettä löytyi myös uhrin elimistöstä, mikä viittaa siihen, että hänet oli saatu heikennettyyn tai väsyneeseen tilaan ennen hyökkäystä.',
    category: 'Lääketieteellinen todiste',
    evidenceValueStars: 4,
    forensicAnalysis: 'Tyhjä unilääkepakkaus löytyi venevajan läheisyydestä kasvillisuuden seasta. Laboratoriotutkimuksessa pakkauksesta tunnistettiin reseptilääke, jonka vaikuttavaa ainetta löytyi myös Antin verinäytteistä. Lääkkeen pitoisuus ei yksin aiheuttanut kuolemaa, mutta se on voinut hidastaa uhrin reaktiokykyä ja heikentää hänen mahdollisuuksiaan puolustautua hyökkäyksen aikana. Pakkauksesta ei löytynyt käyttökelpoisia sormenjälkiä.',
    investigativeSignificance: 'Tyhjä unilääkepakkaus viittaa siihen, että rikos saattoi olla osittain ennalta suunniteltu. Se tukee teoriaa, jonka mukaan uhria pyrittiin heikentämään ennen väkivaltaista yhteenottoa. Yhdessä analysoidun äänitallenteen, rikkoutuneen metallilyhdyn ja muiden rikosteknisten todisteiden kanssa lääkepakkaus täydentää tapahtumaketjua ja auttaa selittämään, miksi Antti ei kyennyt puolustautumaan tehokkaasti.',
    connectedClues: ['elinan_aani_tallenteella', 'rikkinainen_lyhty', 'antin_puhelin', 'tilisiirto_elinalle']
  }
];

export const CONTRADICTIONS: Contradiction[] = [
  {
    id: 'alibi_vs_tallenne',
    title: 'Elinan alibi vs. Äänitallenne',
    description: 'Yhdistä Elinan väite siitä, että hän oli koko illan keittiössä, ja Saran äänitallenne, jolla kuuluu Elinan ääni rannassa myöhään illalla.',
    itemA: { type: 'alibi', id: 'elina', name: 'Elina Koskisen alibi (Keittiö)' },
    itemB: { type: 'clue', id: 'elinan_aani_tallenteella', name: 'Äänitallenteessa kuuluva Elinan ääni' },
    discoveryMessage: 'Ristiriita havaittu! Elina väitti kivenkovaan olleensa keittiössä koko illan eikä poistuneensa lainkaan ulos. Kuitenkin Saran äänitallenteella, joka on nauhoitettu rannassa noin klo 23.10, Elinan ääni kuuluu selvästi, kun hän huutaa ja riitelee Antin kanssa. Elina on valehdellut alibistaan!'
  },
  {
    id: 'kengat_vs_jäljet',
    title: 'Elinan kengänkuvio vs. Venevajan jäljet',
    description: 'Yhdistä Elinan kalanruotokengät mökin eteisestä ja venevajan kosteasta mudasta löytyneet tuoreet kengänjäljet.',
    itemA: { type: 'clue', id: 'elinan_kengat', name: 'Elinan kalanruotokengät' },
    itemB: { type: 'clue', id: 'kenganjaljet_venevajalla', name: 'Kengänjäljet venevajan lattialla' },
    discoveryMessage: 'Ristiriita havaittu! Elina väittää, ettei ole koskaan edes käynyt lähellä venevajaa tämän viikonlopun aikana. Kuitenkin venevajan mudasta löytyneet tuoreet ja selkeät kengänjäljet vastaavat täydellisesti hänen tyylikkäitä kalanruotokuvioisia vaelluskenkiään, joiden pohjissa on samanlaiset urat ja puunsälöt. Elina oli venevajalla!'
  },
  {
    id: 'hiha_vs_kangas',
    title: 'Repeytynyt hiha vs. Kangaspala Antin kädessä',
    description: 'Yhdistä Elinan takin repeytynyt hiha vierashuoneen kaapista ja Antin nyrkistä löytynyt kangaspala.',
    itemA: { type: 'clue', id: 'repeytynyt_hiha', name: 'Elinan takin repeytynyt hiha' },
    itemB: { type: 'clue', id: 'kangas_antin_kadessa', name: 'Kangas Antin kädessä' },
    discoveryMessage: 'Ristiriita havaittu! Elina väitti, että hänen kallis kashmirvillatakkinsa repesi aikaisemmin iltapäivällä metsässä kuusenoksaan. Antin kädestä kuoleman jälkeen löytynyt pieni, väkisin revitty kangaspala on kuitenkin täysin samaa harvinaista italialaista kashmirvillaa ja vastaa täydellisesti Elinan takin hihan repeämän muotoa. Antti repäisi palan Elinan takista kamppailun aikana!'
  },
  {
    id: 'markus_sauna_vahvistus',
    title: 'Markuksen alibi vs. Märät saunavaatteet',
    description: 'Yhdistä Markuksen väite pitkästä saunomisesta ja hänen edelleen kosteat, savuntuoksuiset vaatteensa saunalla.',
    itemA: { type: 'alibi', id: 'markus', name: 'Markus Salon alibi (Sauna)' },
    itemB: { type: 'clue', id: 'markuksen_saunavaatteet', name: 'Markuksen märät saunavaatteet' },
    discoveryMessage: 'Johtolanka vahvistettu! Markuksen saunavaatteet ovat todellakin täysin märät, ja ne tuoksuvat voimakkaasti puukiukaan savulta ja koivulta. Ne eivät sisällä mutaa rannasta tai venevajan bensiiniä, mikä tukee hänen kertomustaan siitä, että hän saunoi myöhään ja oli vilvoittelemassa terassilla, eikä osallistunut venevajan kamppailuun.'
  },
  {
    id: 'oskasi_taskulamppu_selitys',
    title: 'Oskarin alibi vs. Taskulamppu rantapolulla',
    description: 'Yhdistä Oskarin alibi sähköjen tarkistamisesta ja hänen rantapolun varrelta löytynyt taskulamppunsa.',
    itemA: { type: 'alibi', id: 'oskari', name: 'Oskari Mäkelän alibi (Sähkökatko)' },
    itemB: { type: 'clue', id: 'oskarin_taskulamppu', name: 'Oskarin taskulamppu' },
    discoveryMessage: 'Yhteys selvitetty! Oskarin taskulampun löytyminen rantapolun pensaista täsmää hänen kertomukseensa. Hän kertoi, että sähkökatkon aikana klo 23.00 hän kiirehti mökin takana sijaitsevalle sähkökaapille rannan lähelle ja kadotti taskulamppunsa pimeässä myrskyssä joutuessaan käsikopelolla korjaamaan aggregaattia. Lampussa ei ole verijälkiä tai kamppailun merkkejä.'
  }
];

export const DIALOGUE_TOPICS: DialogueTopic[] = [
  { id: 'relation', label: 'Suhde uhriin (Anttiin)' },
  { id: 'evening_events', label: 'Tapahtumat illalla' },
  { id: 'alibi', label: 'Alibi tapahtumahetkellä (klo 23.00)' },
  { id: 'motive', label: 'Mahdollinen motiivi' },
  
  // Clue-based topics (unlocked when the specific clue is found)
  { id: 'clue_accounting', label: 'Yrityksen kirjanpitopaperit', requiredClueId: 'kirjanpitopaperit' },
  { id: 'clue_transfer', label: 'Elinan tekemä tilisiirto', requiredClueId: 'tilisiirto_elinalle' },
  { id: 'clue_recording', label: 'Saran äänitallenne', requiredClueId: 'saran_tallennin' },
  { id: 'clue_recording_voice', label: 'Elinan ääni tallenteella', requiredClueId: 'elinan_aani_tallenteella' },
  { id: 'clue_sleeve', label: 'Takin repeytynyt hiha', requiredClueId: 'repeytynyt_hiha' },
  { id: 'clue_lantern', label: 'Venevajan rikkinäinen lyhty', requiredClueId: 'rikkinainen_lyhty' },
  { id: 'clue_footprints', label: 'Venevajan kengänjäljet', requiredClueId: 'kenganjaljet_venevajalla' },
  { id: 'clue_flashlight', label: 'Rantapolun taskulamppu', requiredClueId: 'oskarin_taskulamppu' },
  { id: 'clue_burned_paper', label: 'Poltettu paperi takassa', requiredClueId: 'poltettu_paperi' }
];

export const DIALOGUE_RESPONSES: Record<string, Record<string, string>> = {
  elina: {
    relation: 'Antti oli minun pitkäaikainen liikekumppanimme. Perustimme yrityksen neljä vuotta sitten. Meillä oli toki välillä ammatillisia erimielisyyksiä, kuten yrityksissä aina, mutta arvostimme toisiamme suuresti. En voi uskoa, että hän on poissa.',
    evening_events: 'Söimme yhdessä illallista. Myrskyn noustua ja sähköjen katketessa iltapäivällä tunnelma alkoi hieman kiristyä. Antti sanoi, että häntä väsyttää ja hän haluaa vetäytyä omaan huoneeseensa lepäämään. Se oli viimeinen kerta, kun näin hänet hengissä.',
    alibi: 'Minä olin mökin keittiössä lähes koko illan noin klo 22.30 alkaen. Siivosin päivällisen jälkiä, tiskasin ja valmistelin aamupalaa. Keittiön kello tikitti seinällä ja katsoin siitä, että olin siellä ainakin puoli kahteentoista asti. En poistunut mökistä ulos sekunniksikaan, myrskyhän oli aivan hirveä!',
    motive: 'Minulla? Ei mitään syytä! Miksi olisin halunnut vahingoittaa omaa liikekumppaniani? Yrityksemme teki hyvää tulosta ja meillä oli suuria tulevaisuudensuunnitelmia. Jos jollakulla oli motiivi, se oli Markus, joka oli Antille pahasti velkaa, tai Laura, joka oli katkera erosta.',
    clue_accounting: 'Ahaa, olet siis penkonut Antin salkkua. Nuo ovat normaaleja yrityksen sisäisiä kirjanpitoasiakirjoja. Niissä on joitain selvittämättömiä kulueriä, mutta ne olivat vain rutiinitarkastuksessa. Antti otti ne mukaan mökille, jotta voisimme katsoa niitä yhdessä rauhassa.',
    clue_transfer: '(Elinan ilme värähtää hetkeksi, mutta hän palauttaa nopeasti kylmän ilmeensä) Tuo tilisiirto... se oli täysin laillinen siirto yrityksen ulkomaiselle alihankkijalle tulevaa projektia varten. Antti vain ymmärsi asian väärin ja hätäili suotta. Meidän oli tarkoitus keskustella siitä maanantaina toimistolla, ei täällä.',
    clue_recording: 'Saran tallennin? En tiennytkään, että se tyttö vakoilee meitä kaikkia. Toimittajat tekevät mitä tahansa saadakseen skandaalin. En tiedä, mitä hän on nauhoittanut, enkä ole kiinnostunut hänen höpinöistään.',
    clue_recording_voice: '(Puristaa kätensä nyrkkiin ja katsoo sinua vihaisesti) Se tallenne on väärennös tai huonolaatuinen väärinkäsitys! En ole ollut venevajalla riitelemässä Antin kanssa. Se ääni... se on saattanut olla joku vanha keskustelu tai myrskyn äänet ovat vääristäneet sen. En suostu kommentoimaan tuollaista laitonta urkintamateriaalia enempää!',
    clue_sleeve: 'Takkini? Se repesi iltapäivällä, kun kävin kävelyllä metsäpolulla ja takerrun tiheään kuusikkoon. Se oli vahinko, kallis takki pilalla. Mitä tekemistä sillä on tämän asian kanssa?',
    clue_lantern: 'Rikkinäinen lyhty? Se taitaa olla mökin vanha lyhty, joka oli venevajalla valaisemassa. En tiedä siitä mitään.',
    clue_footprints: 'Venevajan kengänjäljet? Kaikilla meillä on vaelluskengät täällä mökillä. Minun kenkäni ovat olleet eteisessä koko yön. Kenellä tahansa voi olla samanlaiset kengät, niitä myydään joka urheilukaupassa.',
    clue_burned_paper: 'Poltettuja papereita takassa? Oskari tai joku muu on varmasti polttanut vanhoja roskia tai sanomalehtiä sytykkeenä. Minulla ei ole aavistustakaan, mitä siellä on poltettu.',
    clue_flashlight: 'Oskarin taskulamppu? Oskari sanoi korjanneensa sähköjä pimeässä, joten on loogista, että hän käytti taskulamppua.'
  },
  markus: {
    relation: 'Olimme Antin kanssa parhaita ystäviä opiskeluajoista lähtien. Antti oli menestynyt elämässä minua paremmin, mutta olimme silti läheisiä. Viime aikoina meillä oli vähän kireämpää, myönnetään se.',
    evening_events: 'Olin saunassa juomassa olutta ja rentoutumassa. Myrsky ujelsi ja sähkökatkon takia saunassa oli pimeää, vain kynttilän valo ja puukiukaan loimu. Poistuin saunasta vilvoittelemaan terassille muutaman kerran. Palasin mökkiin nukkumaan vasta puolenyön jälkeen ja menin suoraan omaan huoneeseeni.',
    alibi: 'Olin tosiaan saunassa koko tuon ajan. Kukaan ei ollut saunomassa kanssani, sillä muut olivat kuulemma liian väsyneitä tai halusivat olla sisällä. Voit kysyä keneltä tahansa – vaatteeni olivat saunan naulakossa läpimärkinä aamulla, koska juoksin vesisateessa vilvoittelemassa.',
    motive: 'Joo, meillä oli Antin kanssa riita rahasta, siitä on turha valehdella, kun kaikki kuitenkin kuulivat sen. Olin velkaa hänen yritykselleen. Antti vaati rahoja takaisin heti, mikä oli minulle vaikeaa. Mutta en minä häntä sen takia tappaisi! Hän oli ystäväni, ja olisimme varmasti löytäneet jonkin ratkaisun.',
    clue_accounting: 'Noita papereita en ole nähnytkään. Mutta tiedän, että Antti oli huolissaan yrityksen tilanteesta. Hän sanoi minulle illallisen alussa, että yrityksestä "valuu vettä pohjasta" ja että hänen täytyy tehdä radikaaleja päätöksiä.',
    clue_transfer: 'Elinan tekemä tilisiirto? En tiedä siitä mitään, mutta Elina on aina pitänyt yrityksen talouslangat tiukasti omissa käsissään. Antti oli enemmänkin asiantuntija, Elina pyöritti numeroita. Jos jotain hämärää on tehty, se on Elinan käsialaa.',
    clue_recording: 'Saran nauhuri? Se tyttö nauhoittaa kaikkea. Hän yritti tentata minultakin veloistani aiemmin päivällä. En pidä siitä, että salaa nauhoitetaan ystävien kesken.',
    clue_recording_voice: 'Elinan ääni rannassa? Huh, jos Elina oli rannassa Antin kanssa, hänen keittiöalibinsa on täyttä valetta. Kuulin itsekin huutoa myrskyn yli, kun olin saunan kuistilla, mutta luulin sitä vain tuulen ujellukseksi.',
    clue_sleeve: 'Elinan takki rikki? Huomasin aamulla, kun hän laittoi takkia päälle, että hän yritti peitellä hihan repeämää. Hän näytti erittäin hermostuneelta, mikä on hänelle hyvin epätavallista.',
    clue_lantern: 'Rikkinäinen metallilyhty? Oskari pitää sellaista lyhtyä yleensä venevajan seinällä roikkumassa. Se on painava kuin mikä.',
    clue_footprints: 'Kengänjäljet venevajan mudassa? Elinalla on ne kalliit design-kengät. Hän kehui niitä eilen, kuinka ne ovat erikoisvalmisteiset ja pitävät vettä parhaiten. Kyllä ne pohjat olivat kalanruotokuvioiset.',
    clue_burned_paper: 'Poltettuja asiakirjoja? Joku on yrittänyt siivota todisteita takassa. Se ei ollut minä, minulla ei ole mitään paperitöitä mukana täällä.',
    clue_flashlight: 'Oskarin lamppu? Oskari sanoi etsineensä jotain työkalua pimeässä sähkökatkon aikana. Ehkä hän pudotti sen rantapolulle.'
  },
  laura: {
    relation: 'Antti oli entinen aviomieheni. Ero oli vaikea, ja meillä oli pitkään erittäin huonot välit. Suostuin tulemaan mökille vain siksi, että Oskari sanoi kaikkien vanhojen ystävien kokoontuvan ja toivoin, että voisimme vihdoin sopia menneet ja haudata sotakirveen.',
    evening_events: 'Ilta oli ahdistava. Antti oli kylmä ja etäinen, ja Markus ja hän riitelivät rahasta. Meni huoneeseeni jo ennen kymmentä, koska minulla oli kova päänsärky. Otin särkylääkkeen ja yritin nukkua.',
    alibi: 'Makasin huoneessani sängyllä klo 22.00 alkaen. Noin klo yksitoista kuulin käytävältä kevyitä, hiipiviä askeleita mökin ovelta ulos. En tiedä kuka se oli, mutta hetken päästä kuulin ulko-oven sulkeutuvan vaimeasti myrskyn keskellä. Itse en poistunut huoneestani ennen aamua.',
    motive: 'Olen Antin entinen vaimo, joten ihmiset tietysti ajattelevat, että minulla on kaunaa. Mutta olen päässyt elämässäni eteenpäin. Henkivakuutus? En edes muistanut koko asiaa ennen kuin poliisi mainitsi siitä puhelimessa aamulla. Se vakuutus tehtiin kymmenen vuotta sitten, kun ostimme asunnon.',
    clue_accounting: 'Nämä paperit liittyvät Antin yritykseen. Antti oli erittäin stressaantunut viime viikkoina ja mainitsi minullekin, että hänellä on "luottamusongelmia" työkumppaninsa kanssa.',
    clue_transfer: 'Tämä tilisiirto... se selittää miksi Antti oli niin poissa toltaan. Hän oli saanut selville Elinan petoksen. Elina on aina ollut erittäin kunnianhimoinen ja valmis tekemään mitä tahansa menestyksensä eteen.',
    clue_recording: 'Saran tallennin? Sara sanoi minulle tekevänsä juttua yrittäjyydestä, mutta hän näytti utelevan liikaa meidän kaikkien yksityisasioita. Pelottavaa, että hän nauhoitti meitä salaa.',
    clue_recording_voice: 'Elinan ääni tallenteella riitelemässä Antin kanssa... Voi luoja. Se siis oli Elina, joka poistui mökistä silloin kun kuulin askeleita! Ja hän väittää olleensa koko ajan keittiössä!',
    clue_sleeve: 'Elinan takin hiha revennyt? Ja Antin kädessä oli pala mustaa kangasta? Se... se todistaa heidän kamppailleen! Elinan takki on erittäin kallista kashmirvillaa, hän korosti sitä useasti matkalla.',
    clue_lantern: 'Rikkinäinen lyhty? Se lyhty roikkui yleensä venevajan naulassa. Muistan sen, koska se oli aina tiellä, kun siellä yritti liikkua.',
    clue_footprints: 'Kengänjäljet mudassa? Elinan kenkien pohjakuvio on hyvin tunnistettava, sellainen tähtimäinen kalanruotokuvio. Huomasin ne, kun hän laittoi ne jalkaansa mökille saapuessamme.',
    clue_burned_paper: 'Poltettu paperi takassa? Joku on yrittänyt tuhota todisteita tästä kavalluksesta. Elina oli olohuoneessa aamulla ensimmäisenä keittämässä kahvia, kun minä tulin käytävästä. Hän oli takan edessä siivoamassa jotain.',
    clue_flashlight: 'Oskarin taskulamppu? Oskari juoksi sähkökatkon aikana ulos sateeseen taskulampun kanssa. Hän näytti erittäin huolestuneelta sähkölaitteistaan.'
  },
  oskari: {
    relation: 'Minä omistan tämän mökin ja metsäalueen tässä ympärillä. Olen Antin ja Markuksen vanha tuttu. Vuokrasin mökin heille täksi viikonlopuksi ja he pyysivät minua jäämään viettämään iltaa heidän kanssaan. Antti oli suora ja vaativa mies, joskus vähän liiankin.',
    evening_events: 'Myrsky katkaisi mökiltä sähköt vähän ennen klo 23.00. Laitoin sadetakin niskaani ja lähdin ulos tarkistamaan pääsulaketta ja aggregaattia, joka on mökin takana olevassa varastossa. Työskentelin siellä pimeässä sateessa jonkin aikaa. Taskulamppuni putosi polun varteen kiireessä. Palasin sisään puolenyön maissa, kun sain varavirran päälle.',
    alibi: 'Olin mökin sähkökaapilla ja varastolla noin klo 23.00–00.00. Näin pimeässä rannassa venevajan suunnalla vilkkuvan valon, aivan kuin joku olisi liikkunut siellä taskulampun kanssa. Luulin, että joku ystävyksistä oli mennyt katsomaan venettä myrskyssä, joten en kiinnittänyt siihen sen enempää huomiota.',
    motive: 'Minulla ei ole mitään riitaa Antin kanssa. Rakennusluvat? No jaa, tämä mökki on rakennettu vähän omin luvin suojelualueelle, mutta se on tässä seissyt jo kymmenen vuotta. Antti sai siitä vihiä ja alkoi prässätä minua, mutta se oli vain sellaista kaverillista piikittelyä, ei mitään sellaista, minkä takia ketään pitäisi satuttaa.',
    clue_accounting: 'Nämä ovat yrityksen papereita, en minä näistä mitään ymmärrä. Mutta sen tiedän, että Antti ja Elina puhuivat hyvin viileään sävyyn keskenään ennen kuin Antti meni huoneeseensa.',
    clue_transfer: 'Tämä kuitti näyttää siirron ulkomaille. Elina näytti hoitavan kaiken heidän yrityksensä rahaliikenteen. Antti oli enemmänkin tekniikan puolen mies.',
    clue_recording: 'Saran tallennin? Se nainen pyöri täällä kyselemässä kaikkea ja piteli käsiään taskuissa. Nauhoittiko hän meitä salaa? Omituista käytöstä toimittajalta.',
    clue_recording_voice: 'Elinan ääni tallenteella... Ja venevajan suunnalla. Se täsmää siihen valoon, jonka näin venevajan luona, kun olin korjaamassa sähköjä! Se valo liikkui siellä juuri yhdentoista jälkeen.',
    clue_sleeve: 'Elinan takin hiha revennyt? Ja Antilla kangasta kädessä? Se on paha todiste. Kashmirvilla on kallista tavaraa, ei sellaista kenellä tahansa ole täällä korvessa mukana.',
    clue_lantern: 'Rikkinäinen lyhty? Se on minun valurautainen myrskylyhtyni. Se roikkui aina venevajan seinällä naulassa siltä varalta, että pimeässä pitää hakea airoja tai verkkoja. Se oli erittäin painava, vanhaa kotimaista tekoa.',
    clue_footprints: 'Kengänjäljet venevajan mudassa? Lattia on siellä aina vähän kostea ja mutainen, kun ovi ei pidä kunnolla vettä. Jos sieltä on löytynyt Elinan kenkien jälkiä, hänen on täytynyt käydä siellä myrskyn aikana.',
    clue_burned_paper: 'Poltettuja papereita takassa? Minä sytytin takan aamulla varhain, koska täällä oli erittäin kylmä sähkökatkon jälkeen. Tuhassa oli jotain mustia palaneita liuskoja, mutta luulin niitä vain sytykepaperien jätteiksi. Joku oli siis laittanut ne sinne yön aikana.',
    clue_flashlight: 'Taskulamppuni! Kyllä, kadotin sen sinä iltana rantapolulle, kun sähköt menivät ja juoksin sateessa sähkökaapille. Se varmaan liukui kädestäni mutaisessa rinteessä. Onneksi löysit sen.'
  },
  sara: {
    relation: 'Olen freelance-toimittaja. Antti otti minuun yhteyttä kaksi viikkoa sitten ja kertoi, että hänellä on minulle jymyuutinen koskien suurta konsultointiyritystä ja rahanpesua. Hän kutsui minut tänne mökille "ystävänä", jotta voisimme sopia haastattelusta ja materiaalin luovuttamisesta ilman, että Elina tietää.',
    evening_events: 'Meni huoneeseeni muka kirjoittamaan juttua, mutta todellisuudessa pidin korvani auki. Jätin takkini ja sen taskussa olleen tallentimen kuistille, jotta se tallentaisi mahdolliset ulkona käytävät keskustelut. Itse pysyttelin huoneessani klo 22.30 alkaen. Aamulla heräsin huutoon, kun Antti löydettiin.',
    alibi: 'Olin omassa huoneessani koko illan klo 22.30 jälkeen. Minulla ei ole tähän todistajia, mutta tallentimeni nauhoitus rannasta todistaa ainakin sen, missä muut liikkuivat tuohon aikaan, ja se on minun paras alibini!',
    motive: 'Minä halusin vain hyvän uutisen. Kuollut lähde ei paljasta mitään, joten Antin kuolema oli minulle suuri ammatillinen takaisku. Tarvitsin häntä todistamaan ne asiakirjat oikeiksi. Minulla ei todellakaan ollut mitään syytä tappaa häntä.',
    clue_accounting: 'Nämä ovat juuri ne paperit, joista Antti minulle puhui! Ne todistavat massiivisen ja järjestelmällisen kavalluksen, jota on pyöritetty vuosia yrityksen tileiltä. Antti oli vihdoin saanut niistä täydet todisteet käsiinsä.',
    clue_transfer: 'Tämä tilisiirto on ratkaiseva todiste. Se osoittaa rahojen päätyneen Elinan hallinnoimalle tilille Cayman-saarille. Antti aikoi näyttää tämän minulle viikonlopun aikana ja antaa minun julkaista jutun maanantaina.',
    clue_recording: 'Löysit siis tallentimeni. Pyydän anteeksi, että salasin sen, mutta toimittajana minun on suojeltava työtäni ja lähteitäni. Nauhoitus "REC_004.WAV" on erittäin tärkeä todiste. Kuuntelitko sen jo?',
    clue_recording_voice: 'Äänitallenteella kuuluu selvästi Elinan kylmä ääni riitelemässä Antin kanssa venevajalla juuri ennen yhtätoista. "Et tule pilaamaan elämääni, Antti." Ja sen jälkeen kuuluu se isku. Elina murhasi hänet suojellakseen kavallustaan!',
    clue_sleeve: 'Elinan takin hiha revennyt? Ja Antin kädessä pala kashmirvillaa... Se osoittaa, että Antti yritti puolustautua ja repi palaa Elinan takista, kun tämä hyökkäsi hänen kimppuunsa lyhdyllä. Elina yritti varmasti hävittää takin tai peitellä sitä.',
    clue_lantern: 'Rikkinäinen lyhty? Se metallilyhty oli venevajan seinällä. Se on todella painava ase, jolla lyöminen aiheuttaa kuolemaan johtavan kallonmurtuman. Se sopii täydellisesti vammoihin.',
    clue_footprints: 'Venevajan kengänjäljet? Ne täsmäävät Elinan kalanruotokenkiin. Hänellä oli ne jalassa, kun hän aamulla teki alibi-suunnitelmiaan keittiössä ja yritti näyttää rauhalliselta.',
    clue_burned_paper: 'Poltettu paperi takassa? Elina yritti polttaa osan Antin mukanaan tuomista kirjanpitopapereista, jotta kukaan ei löytäisi niitä. Mutta hänellä oli kiire ja paperit eivät palaneet kokonaan tuhkaksi.',
    clue_flashlight: 'Oskarin taskulamppu? Oskari oli ulkona tuohon aikaan korjaamassa sähköjä, joten hän oli lähellä. Mutta nauhoitteesta kuuluu, että riita käytiin vain Antin ja Elinan välillä.'
  }
};

// Automaattinen hiljainen validointi pelin datalle (kehitysaikainen tarkistus)
(() => {
  const errors: string[] = [];

  // 1. Epäiltyjen määrä = 5
  if (SUSPECTS.length !== 5) {
    errors.push(`Epäiltyjen määrä on ${SUSPECTS.length}, pitäisi olla täsmälleen 5.`);
  }

  // 2. Kaikilla epäillyillä on yksilöllinen ID ja nimi
  const suspectIds = new Set<string>();
  SUSPECTS.forEach((s) => {
    if (!s.id) errors.push(`Epäillyltä puuttuu ID.`);
    else if (suspectIds.has(s.id)) errors.push(`Moninkertainen epäillyn ID: ${s.id}`);
    else suspectIds.add(s.id);

    if (!s.name) errors.push(`Epäillyllä (ID: ${s.id || 'tuntematon'}) puuttuu nimi.`);
    if (!s.alibi && !s.description) errors.push(`Epäillyllä ${s.name || s.id} puuttuu alibi tai kuvaus.`);
  });

  // 3. Kaikki kuulustelukysymykset viittaavat olemassa olevaan epäiltyyn
  Object.keys(DIALOGUE_RESPONSES).forEach((sId) => {
    if (!suspectIds.has(sId)) {
      errors.push(`DIALOGUE_RESPONSES sisältää epäillyn ID:n ${sId}, jota ei löydy SUSPECTS-listalta.`);
    }
  });

  // 4. Kaikki johtolankavaatimukset viittaavat olemassa olevaan johtolankaan
  const clueIds = new Set(CLUES.map(c => c.id));
  DIALOGUE_TOPICS.forEach((topic) => {
    if (topic.requiredClueId && !clueIds.has(topic.requiredClueId)) {
      errors.push(`DIALOGUE_TOPIC ${topic.id} vaatii olemattoman johtolangan: ${topic.requiredClueId}`);
    }
  });

  // 5. Kaikki ristiriidat viittaavat olemassa olevaan epäiltyyn tai johtolankaan
  CONTRADICTIONS.forEach((contra) => {
    if (contra.itemA.type === 'alibi' && !suspectIds.has(contra.itemA.id)) {
      errors.push(`Ristiriita ${contra.id} viittaa olemattomaan epäillyn alibiin: ${contra.itemA.id}`);
    }
    if (contra.itemA.type === 'clue' && !clueIds.has(contra.itemA.id)) {
      errors.push(`Ristiriita ${contra.id} viittaa olemattomaan johtolankaan A: ${contra.itemA.id}`);
    }
    if (contra.itemB.type === 'clue' && !clueIds.has(contra.itemB.id)) {
      errors.push(`Ristiriita ${contra.id} viittaa olemattomaan johtolankaan B: ${contra.itemB.id}`);
    }
  });

  if (errors.length > 0) {
    console.error('⚠️ [PELI-VALIDOINTI VIRHEET]:', errors);
  } else {
    console.log('✅ [PELI-VALIDOINTI]: Kaikki 5 epäiltyä, kuulustelut, ristiriidat ja johtolankayhteydet ovat valideja!');
  }
})();
