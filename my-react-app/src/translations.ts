export type Lang = 'en' | 'de' | 'nl' | 'fr'

export const supportedLangs: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'fr', label: 'Français' },
]

// Keys used across the app
export type TKey =
  | 'app.title'
  | 'home.welcome'
  | 'home.moreComing'
  | 'room1.title'
  | 'room1.card.title'
  | 'room1.card.desc'
  | 'home.startRoom'
  | 'back'
  | 'countdown.waiting'
  | 'countdown.label'
  | 'pass.label'
  | 'pass.placeholder'
  | 'pass.submit'
  | 'hint.lockToStart'
  | 'error.badPass'
  | 'success.title'
  | 'success.desc'
  | 'success.sub'
  | 'timeout.title'
  | 'timeout.desc'
  | 'story.1'
  | 'story.2'
  | 'story.3'
  | 'story.4'
  | 'story.5'
  | 'story.6'
  | 'story.7'
  | 'story.lists'
  | 'elf1.name'
  | 'elf1.desc'
  | 'elf2.name'
  | 'elf2.desc'
  | 'elf3.name'
  | 'elf3.desc'
  | 'elf4.name'
  | 'elf4.desc'
  | 'password'

export type Dict = Record<TKey, string>

export const dicts: Record<Lang, Dict> = {
  en: {
    'app.title': 'ESCAPE ROOMS',
    'home.welcome': 'Welcome! Choose an escape room to begin your adventure.',
    'home.moreComing': 'More rooms will be available soon. One room is available now.',
    'room1.title': 'CHRISTMAS ARCHIVE',
    'room1.card.title': 'Christmas Archive',
    'room1.card.desc': 'The Christmas computer is compromised. Start recovery before time runs out.',
    'home.startRoom': 'Start Christmas Archive',
    back: '← Back',
    'countdown.waiting': 'WAITING FOR COMPUTER TO BE LOCKED/UNLOCKED …',
    'countdown.label': 'COUNTDOWN',
    'pass.label': 'PASSWORD',
    'pass.placeholder': '••••••••••',
    'pass.submit': 'Enter',
    'hint.lockToStart': 'Lock and unlock the computer briefly to start the countdown.',
    'error.badPass': 'Wrong password! Unauthorized access detected.',
    'success.title': 'Christmas is saved!',
    'success.desc': 'Access confirmed. Systems booting, routes syncing, security restored.',
    'success.sub': 'Mission accomplished.',
    'timeout.title': 'TIME IS UP',
    'timeout.desc': 'The Christmas computer is shutting down …',
    'story.1': 'Christmas Eve.',
    'story.2': 'The world awaits the miracle of Christmas.',
    'story.3': 'But this year everything is at stake. We once built the Christmas computer — but Santa took the glory.',
    'story.4': 'Each of us holds a fragment of the code. Alone, meaningless. Together, your only hope.',
    'story.5': '⏳ Time is running.',
    'story.6': 'When the countdown ends, we will erase everything.',
    'story.7': 'Prove your wit. Or watch the lights go out.',
    'story.lists': 'Wish lists. Routes. Christmas.',
    'elf1.name': 'Pixelina Glimmer — Mistress of Signs',
    'elf1.desc': 'She left traces visible only in faint light. They laughed at her methods. Now they fear them.',
    'elf2.name': 'Twinklebolt — Chronicler of Secret Scripts',
    'elf2.desc': 'He kept memories, days, and thoughts in invisible patterns. No one wanted his order — until it vanished.',
    'elf3.name': 'Flinka Frostfinger — Master of Code',
    'elf3.desc': 'Colors, numbers, encrypted signs — she brought order to chaos. Perfection was mandatory. Gratitude was absent.',
    'elf4.name': 'Grumblebeard — Navigator of World Maps',
    'elf4.desc': 'He connected countries and continents with invisible lines. When everything worked, nobody remembered him.',
    password: 'Together we are one',
  },
  de: {
    'app.title': 'ESCAPE ROOMS',
    'home.welcome': 'Willkommen! Wähle einen Escape Room, um das Abenteuer zu starten.',
    'home.moreComing': 'Du kannst künftig aus mehreren Rätseln auswählen. Aktuell ist ein Raum verfügbar.',
    'room1.title': 'WEIHNACHTS-ARCHIV',
    'room1.card.title': 'Weihnachts-Archiv',
    'room1.card.desc': 'Der Weihnachtscomputer wurde kompromittiert. Starte die Wiederherstellung, bevor die Zeit abläuft.',
    'home.startRoom': 'Weihnachts-Archiv starten',
    back: '← Zurück',
    'countdown.waiting': 'WARTET AUF ENTSPERRUNG DES RECHNERS …',
    'countdown.label': 'COUNTDOWN',
    'pass.label': 'PASSWORT',
    'pass.placeholder': '••••••••••',
    'pass.submit': 'Eingeben',
    'hint.lockToStart': 'Sperre den Computer kurz und entsperre ihn wieder, um den Countdown zu starten.',
    'error.badPass': 'Falsches Passwort! Unbefugter Zugriff erkannt.',
    'success.title': 'Weihnachten ist gerettet!',
    'success.desc': 'Zugang bestätigt. Systeme werden hochgefahren, Routen synchronisiert, Sicherheit wiederhergestellt.',
    'success.sub': 'Die Mission ist abgeschlossen.',
    'timeout.title': 'ZEIT ABGELAUFEN',
    'timeout.desc': 'Der Weihnachtscomputer fährt herunter …',
    'story.1': 'Heiligabend.',
    'story.2': 'Die Welt wartet auf das Wunder von Weihnachten.',
    'story.3': 'Doch in diesem Jahr steht alles auf dem Spiel. Einst erschufen wir den Weihnachtscomputer – doch der Weihnachtsmann nahm den Ruhm für sich.',
    'story.4': 'Jeder von uns besitzt ein Fragment des Codes. Getrennt bedeutungslos. Gemeinsam eure einzige Hoffnung.',
    'story.5': '⏳ Die Zeit läuft.',
    'story.6': 'Wenn der Countdown endet, löschen wir alles.',
    'story.7': 'Beweist euren Verstand. Oder seht zu, wie das Licht erlischt.',
    'story.lists': 'Wunschlisten. Routen. Weihnachten.',
    'elf1.name': 'Pixelina Glanzlicht – Schattenmeisterin der Zeichen',
    'elf1.desc': 'Sie hinterließ Spuren, die nur im schwachen Licht sichtbar wurden. Man lachte über ihre Methoden. Jetzt fürchtet man sie.',
    'elf2.name': 'Twinkelbolt – Chronist der Geheimschriften',
    'elf2.desc': 'Er bewahrte Erinnerungen, Tage und Gedanken in unsichtbaren Mustern. Niemand wollte seine Ordnung – bis sie verschwand.',
    'elf3.name': 'Flinka Frostfinger – Meisterin des Codes',
    'elf3.desc': 'Farben, Zahlen, verschlüsselte Zeichen – sie brachte Ordnung ins Chaos. Perfektion war Pflicht. Dank blieb aus.',
    'elf4.name': 'Grummelbart – Navigator der Weltkarten',
    'elf4.desc': 'Er verband Länder und Kontinente mit unsichtbaren Linien. Als alles funktionierte, erinnerte sich niemand an ihn.',
    password: 'Gemeinsam sind wir eins',
  },
  nl: {
    'app.title': 'ESCAPE ROOMS',
    'home.welcome': 'Welkom! Kies een escaperoom om je avontuur te beginnen.',
    'home.moreComing': 'Binnenkort komen er meer kamers. Er is nu één kamer beschikbaar.',
    'room1.title': 'KERSTARCHIEF',
    'room1.card.title': 'Kerstarchief',
    'room1.card.desc': 'De kerstcomputer is gecompromitteerd. Start het herstel voordat de tijd om is.',
    'home.startRoom': 'Kerstarchief starten',
    back: '← Terug',
    'countdown.waiting': 'WACHT OP VERGRENDELEN/ONTGRENDELEN VAN DE COMPUTER …',
    'countdown.label': 'COUNTDOWN',
    'pass.label': 'WACHTWOORD',
    'pass.placeholder': '••••••••••',
    'pass.submit': 'Invoeren',
    'hint.lockToStart': 'Vergrendel en ontgrendel de computer kort om de countdown te starten.',
    'error.badPass': 'Onjuist wachtwoord! Ongeautoriseerde toegang gedetecteerd.',
    'success.title': 'Kerstmis is gered!',
    'success.desc': 'Toegang bevestigd. Systemen starten op, routes synchroniseren, beveiliging hersteld.',
    'success.sub': 'Missie volbracht.',
    'timeout.title': 'TIJD VOORBIJ',
    'timeout.desc': 'De kerstcomputer wordt afgesloten …',
    'story.1': 'Kerstavond.',
    'story.2': 'De wereld wacht op het wonder van Kerstmis.',
    'story.3': 'Maar dit jaar staat alles op het spel. Ooit bouwden we de kerstcomputer — maar de Kerstman kreeg de eer.',
    'story.4': 'Ieder van ons heeft een fragment van de code. Alleen betekenisloos. Samen jullie enige hoop.',
    'story.5': '⏳ De tijd tikt.',
    'story.6': 'Als de countdown eindigt, wissen we alles.',
    'story.7': 'Bewijs je scherpzinnigheid. Of zie hoe het licht dooft.',
    'story.lists': 'Verlanglijsten. Routes. Kerstmis.',
    'elf1.name': 'Pixelina Glinstering — Meesteres van Tekens',
    'elf1.desc': 'Ze liet sporen achter die alleen in zwak licht zichtbaar waren. Men lachte om haar methodes. Nu vreest men ze.',
    'elf2.name': 'Twinkelbout — Kroniekschrijver van Geheime Schriften',
    'elf2.desc': 'Hij bewaarde herinneringen, dagen en gedachten in onzichtbare patronen. Niemand wilde zijn orde — tot die verdween.',
    'elf3.name': 'Flinka Vingerfrost — Meesteres van Code',
    'elf3.desc': 'Kleuren, cijfers, versleutelde tekens — zij bracht orde in de chaos. Perfectie was verplicht. Dank bleef uit.',
    'elf4.name': 'Mopperbaard — Navigator van Wereldkaarten',
    'elf4.desc': 'Hij verbond landen en continenten met onzichtbare lijnen. Toen alles werkte, herinnerde niemand zich hem.',
    password: 'Samen zijn we één',
  },
  fr: {
    'app.title': 'ESCAPE ROOMS',
    'home.welcome': 'Bienvenue ! Choisissez une salle pour commencer l\'aventure.',
    'home.moreComing': 'D\'autres salles arriveront bientôt. Une salle est disponible pour le moment.',
    'room1.title': 'ARCHIVE DE NOËL',
    'room1.card.title': 'Archive de Noël',
    'room1.card.desc': 'L\'ordinateur de Noël est compromis. Lancez la restauration avant la fin du temps.',
    'home.startRoom': 'Lancer l\'Archive de Noël',
    back: '← Retour',
    'countdown.waiting': 'EN ATTENTE DU VERROUILLAGE/DÉVERROUILLAGE DE L\'ORDINATEUR …',
    'countdown.label': 'COMPTE À REBOURS',
    'pass.label': 'MOT DE PASSE',
    'pass.placeholder': '••••••••••',
    'pass.submit': 'Valider',
    'hint.lockToStart': 'Verrouillez puis déverrouillez brièvement l\'ordinateur pour démarrer le compte à rebours.',
    'error.badPass': 'Mauvais mot de passe ! Accès non autorisé détecté.',
    'success.title': 'Noël est sauvé !',
    'success.desc': 'Accès confirmé. Démarrage des systèmes, synchronisation des routes, sécurité rétablie.',
    'success.sub': 'Mission accomplie.',
    'timeout.title': 'TEMPS ÉCOULÉ',
    'timeout.desc': 'L\'ordinateur de Noël s\'éteint …',
    'story.1': 'La veille de Noël.',
    'story.2': 'Le monde attend le miracle de Noël.',
    'story.3': 'Mais cette année tout est en jeu. Nous avons construit l\'ordinateur de Noël — mais le Père Noël a pris la gloire.',
    'story.4': 'Chacun de nous détient un fragment du code. Seuls, insignifiants. Ensemble, votre seul espoir.',
    'story.5': '⏳ Le temps file.',
    'story.6': 'Quand le compte à rebours se termine, nous effaçons tout.',
    'story.7': 'Prouvez votre esprit. Ou regardez la lumière s\'éteindre.',
    'story.lists': 'Listes de souhaits. Itinéraires. Noël.',
    'elf1.name': 'Pixelina Scintillante — Maîtresse des signes',
    'elf1.desc': 'Elle a laissé des traces visibles seulement sous une faible lumière. On se moquait de ses méthodes. Maintenant, on les craint.',
    'elf2.name': 'Étincelobolt — Chroniqueur des écritures secrètes',
    'elf2.desc': 'Il a gardé souvenirs, jours et pensées dans des motifs invisibles. Personne ne voulait de son ordre — jusqu\'à ce qu\'il disparaisse.',
    'elf3.name': 'Flinka Doigt-de-Givre — Maîtresse du code',
    'elf3.desc': 'Couleurs, chiffres, signes chiffrés — elle a mis de l\'ordre dans le chaos. La perfection était obligatoire. La gratitude absente.',
    'elf4.name': 'Barbagrin — Navigateur des cartes du monde',
    'elf4.desc': 'Il reliait pays et continents par des lignes invisibles. Quand tout fonctionnait, personne ne se souvenait de lui.',
    password: 'Ensemble, nous ne faisons qu\'un',
  },
}
