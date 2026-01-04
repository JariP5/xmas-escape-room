export type Lang = 'en' | 'de' | 'nl' | 'fr'

export const supportedLangs: { code: Lang; label: string }[] = [
    {code: 'en', label: 'English'},
    {code: 'de', label: 'Deutsch'},
    {code: 'nl', label: 'Nederlands'},
    {code: 'fr', label: 'Français'},
]

// We now support nested dictionary lookups via dot-separated keys (e.g., 'routes.christmasRoom.title').
export type TKey = string

export type Dict = Record<string, any>

export const dicts: Record<Lang, Dict> = {
    en: {
        app: {title: 'North Pole Escape'},
        common: {back: '← Back'},
        home: {
            welcome: 'Welcome! Choose an escape room to begin your adventure.',
            moreComing: 'More rooms will be available soon. One room is available now.',
            startRoom: 'Start Christmas Archive',
        },
        routes: {
            about: {
                boardGameAlt: 'Required board game',
                haveGame: "I already have this — Let's play",
                needToBuy: 'I need to buy it',
            },
            shop: {
                title: 'Buy board games',
                comingSoon: 'In-app shop is coming soon. Please check back later.'
            },
            unlock: {
                title: 'Enter access code',
                desc: 'To start this room, enter the one-time access code you purchased.',
                code: {label: 'ACCESS CODE', placeholder: 'ABC123-XYZ'},
                submit: 'Unlock room',
                submitting: 'Checking…',
                hintWhereToBuy: "Don't have a code?",
                checkoutLink: 'Buy one here',
                error: {
                    invalid: 'Invalid code. Please check and try again.',
                    used: 'This code was already used.',
                    config: 'Server not configured. Contact support.',
                    network: 'Network error. Please try again.',
                    generic: 'Something went wrong. Please try again.',
                },
            },
            christmasRoom: {
                title: 'CHRISTMAS ARCHIVE',
                card: {
                    title: 'Christmas Archive',
                    desc: 'The Christmas computer is compromised. Start recovery before time runs out.',
                },
                countdown: {
                    waiting: 'WAITING FOR COMPUTER TO BE LOCKED/UNLOCKED …',
                    label: 'COUNTDOWN',
                },
                pass: {label: 'PASSWORD', placeholder: '••••••••••', submit: 'Enter'},
                hint: {lockToStart: 'Lock and unlock the computer briefly to start the countdown.'},
                error: {badPass: 'Wrong password! Unauthorized access detected.'},
                success: {
                    title: 'Christmas is saved!',
                    desc: 'Access confirmed. Systems booting, routes syncing, security restored.',
                    sub: 'Mission accomplished.',
                },
                timeout: {title: 'TIME IS UP', desc: 'The Christmas computer is shutting down …'},
                story: {
                    '1': 'Christmas Eve.',
                    '2': 'The world awaits the miracle of Christmas.',
                    '3': 'But this year everything is at stake. We once built the Christmas computer — but Santa took the glory.',
                    '4': 'Each of us holds a fragment of the code. Alone, meaningless. Together, your only hope.',
                    '5': '⏳ Time is running.',
                    '6': 'When the countdown ends, we will erase everything.',
                    '7': 'Wish lists. Routes. Christmas.',
                    '8': 'Prove your wit. Or watch the lights go out.',
                },
                elves: {
                    elf1: {
                        name: 'Pixelina Glimmer — Mistress of Signs',
                        desc: 'She left traces visible only in faint light. They laughed at her methods. Now they fear them.',
                    },
                    elf2: {
                        name: 'Twinklebolt — Chronicler of Secret Scripts',
                        desc: 'He kept memories, days, and thoughts in invisible patterns. No one wanted his order — until it vanished.',
                    },
                    elf3: {
                        name: 'Flinka Frostfinger — Master of Code',
                        desc: 'Colors, numbers, encrypted signs — she brought order to chaos. Perfection was mandatory. Gratitude was absent.',
                    },
                    elf4: {
                        name: 'Grumblebeard — Navigator of World Maps',
                        desc: 'He connected countries and continents with invisible lines. When everything worked, nobody remembered him.',
                    },
                },
                password: 'Together we are one',
            },
        },
    },
    de: {
        app: {title: 'North Pole Escape'},
        common: {back: '← Zurück'},
        home: {
            welcome: 'Willkommen! Wähle einen Escape Room, um das Abenteuer zu starten.',
            moreComing: 'Du kannst künftig aus mehreren Rätseln auswählen. Aktuell ist ein Raum verfügbar.',
            startRoom: 'Weihnachts-Archiv starten',
        },
        routes: {
            about: {
                boardGameAlt: 'Erforderliches Brettspiel',
                haveGame: 'Ich habe es bereits — Los geht\'s',
                needToBuy: 'Ich muss es kaufen',
            },
            shop: {
                title: 'Brettspiele kaufen',
                comingSoon: 'In-App-Shop kommt bald. Bitte später erneut vorbeischauen.'
            },
            unlock: {
                title: 'Zugangscode eingeben',
                desc: 'Um diesen Raum zu starten, gib den einmaligen Zugangscode ein, den du gekauft hast.',
                code: {label: 'ZUGANGSCODE', placeholder: 'ABC123-XYZ'},
                submit: 'Raum freischalten',
                submitting: 'Prüfe…',
                hintWhereToBuy: 'Noch keinen Code?',
                checkoutLink: 'Hier kaufen',
                error: {
                    invalid: 'Ungültiger Code. Bitte prüfen und erneut versuchen.',
                    used: 'Dieser Code wurde bereits verwendet.',
                    config: 'Server nicht konfiguriert. Bitte Support kontaktieren.',
                    network: 'Netzwerkfehler. Bitte erneut versuchen.',
                    generic: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
                },
            },
            christmasRoom: {
                title: 'WEIHNACHTS-ARCHIV',
                card: {
                    title: 'Weihnachts-Archiv',
                    desc: 'Der Weihnachtscomputer wurde kompromittiert. Starte die Wiederherstellung, bevor die Zeit abläuft.',
                },
                countdown: {waiting: 'WARTET AUF ENTSPERRUNG DES RECHNERS …', label: 'COUNTDOWN'},
                pass: {label: 'PASSWORT', placeholder: '••••••••••', submit: 'Eingeben'},
                hint: {lockToStart: 'Sperre den Computer kurz und entsperre ihn wieder, um den Countdown zu starten.'},
                error: {badPass: 'Falsches Passwort! Unbefugter Zugriff erkannt.'},
                success: {
                    title: 'Weihnachten ist gerettet!',
                    desc: 'Zugang bestätigt. Systeme werden hochgefahren, Routen synchronisiert, Sicherheit wiederhergestellt.',
                    sub: 'Die Mission ist abgeschlossen.',
                },
                timeout: {title: 'ZEIT ABGELAUFEN', desc: 'Der Weihnachtscomputer fährt herunter …'},
                story: {
                    '1': 'Heiligabend.',
                    '2': 'Die Welt wartet auf das Wunder von Weihnachten.',
                    '3': 'Doch in diesem Jahr steht alles auf dem Spiel. Einst erschufen wir den Weihnachtscomputer – doch der Weihnachtsmann nahm den Ruhm für sich.',
                    '4': 'Jeder von uns besitzt ein Fragment des Codes. Getrennt bedeutungslos. Gemeinsam eure einzige Hoffnung.',
                    '5': '⏳ Die Zeit läuft.',
                    '6': 'Wenn der Countdown endet, löschen wir alles.',
                    '7': 'Wunschlisten. Routen. Weihnachten.',
                    '8': 'Beweist euren Verstand. Oder seht zu, wie das Licht erlischt.',
                },
                elves: {
                    elf1: {
                        name: 'Pixelina Glanzlicht – Schattenmeisterin der Zeichen',
                        desc: 'Sie hinterließ Spuren, die nur im schwachen Licht sichtbar wurden. Man lachte über ihre Methoden. Jetzt fürchtet man sie.',
                    },
                    elf2: {
                        name: 'Twinkelbolt – Chronist der Geheimschriften',
                        desc: 'Er bewahrte Erinnerungen, Tage und Gedanken in unsichtbaren Mustern. Niemand wollte seine Ordnung – bis sie verschwand.',
                    },
                    elf3: {
                        name: 'Flinka Frostfinger – Meisterin des Codes',
                        desc: 'Farben, Zahlen, verschlüsselte Zeichen – sie brachte Ordnung ins Chaos. Perfektion war Pflicht. Dank blieb aus.',
                    },
                    elf4: {
                        name: 'Grummelbart – Navigator der Weltkarten',
                        desc: 'Er verband Länder und Kontinente mit unsichtbaren Linien. Als alles funktionierte, erinnerte sich niemand an ihn.',
                    },
                },
                password: 'Gemeinsam sind wir eins',
            },
        },
    },
    nl: {
        app: {title: 'North Pole Escape'},
        common: {back: '← Terug'},
        home: {
            welcome: 'Welkom! Kies een escaperoom om je avontuur te beginnen.',
            moreComing: 'Binnenkort komen er meer kamers. Er is nu één kamer beschikbaar.',
            startRoom: 'Kerstarchief starten',
        },
        routes: {
            about: {
                boardGameAlt: 'Vereist bordspel',
                haveGame: 'Ik heb dit al — Laten we spelen',
                needToBuy: 'Ik moet het kopen',
            },
            shop: {
                title: 'Bordspellen kopen',
                comingSoon: 'In-app winkel komt binnenkort. Kom later terug.'
            },
            unlock: {
                title: 'Voer toegangscode in',
                desc: 'Om deze kamer te starten, voer de eenmalige toegangscode in die je hebt gekocht.',
                code: {label: 'TOEGANGSCODE', placeholder: 'ABC123-XYZ'},
                submit: 'Kamer ontgrendelen',
                submitting: 'Bezig met controleren…',
                hintWhereToBuy: 'Nog geen code?',
                checkoutLink: 'Koop er hier een',
                error: {
                    invalid: 'Ongeldige code. Controleer en probeer opnieuw.',
                    used: 'Deze code is al gebruikt.',
                    config: 'Server niet geconfigureerd. Neem contact op met support.',
                    network: 'Netwerkfout. Probeer het opnieuw.',
                    generic: 'Er is iets misgegaan. Probeer het opnieuw.',
                },
            },
            christmasRoom: {
                title: 'KERSTARCHIEF',
                card: {
                    title: 'Kerstarchief',
                    desc: 'De kerstcomputer is gecompromitteerd. Start het herstel voordat de tijd om is.',
                },
                countdown: {waiting: 'WACHT OP VERGRENDELEN/ONTGRENDELEN VAN DE COMPUTER …', label: 'COUNTDOWN'},
                pass: {label: 'WACHTWOORD', placeholder: '••••••••••', submit: 'Invoeren'},
                hint: {lockToStart: 'Vergrendel en ontgrendel de computer kort om de countdown te starten.'},
                error: {badPass: 'Onjuist wachtwoord! Ongeautoriseerde toegang gedetecteerd.'},
                success: {
                    title: 'Kerstmis is gered!',
                    desc: 'Toegang bevestigd. Systemen starten op, routes synchroniseren, beveiliging hersteld.',
                    sub: 'Missie volbracht.',
                },
                timeout: {title: 'TIJD VOORBIJ', desc: 'De kerstcomputer wordt afgesloten …'},
                story: {
                    '1': 'Kerstavond.',
                    '2': 'De wereld wacht op het wonder van Kerstmis.',
                    '3': 'Maar dit jaar staat alles op het spel. Ooit bouwden we de kerstcomputer — maar de Kerstman kreeg de eer.',
                    '4': 'Ieder van ons heeft een fragment van de code. Alleen betekenisloos. Samen jullie enige hoop.',
                    '5': '⏳ De tijd tikt.',
                    '6': 'Als de countdown eindigt, wissen we alles.',
                    '7': 'Verlanglijsten. Routes. Kerstmis.',
                    '8': 'Bewijs je scherpzinnigheid. Of zie hoe het licht dooft.',
                },
                elves: {
                    elf1: {
                        name: 'Pixelina Glinstering — Meesteres van Tekens',
                        desc: 'Ze liet sporen achter die alleen in zwak licht zichtbaar waren. Men lachte om haar methodes. Nu vreest men ze.',
                    },
                    elf2: {
                        name: 'Twinkelbout — Kroniekschrijver van Geheime Schriften',
                        desc: 'Hij bewaarde herinneringen, dagen en gedachten in onzichtbare patronen. Niemand wilde zijn orde — tot die verdween.',
                    },
                    elf3: {
                        name: 'Flinka Vingerfrost — Meesteres van Code',
                        desc: 'Kleuren, cijfers, versleutelde tekens — zij bracht orde in de chaos. Perfectie was verplicht. Dank bleef uit.',
                    },
                    elf4: {
                        name: 'Mopperbaard — Navigator van Wereldkaarten',
                        desc: 'Hij verbond landen en continenten met onzichtbare lijnen. Toen alles werkte, herinnerde niemand zich hem.',
                    },
                },
                password: 'Samen zijn we één',
            },
        },
    },
    fr: {
        app: {title: 'North Pole Escape'},
        common: {back: '← Retour'},
        home: {
            welcome: 'Bienvenue ! Choisissez une salle pour commencer l\'aventure.',
            moreComing: 'D\'autres salles arriveront bientôt. Une salle est disponible pour le moment.',
            startRoom: 'Lancer l\'Archive de Noël',
        },
        routes: {
            about: {
                boardGameAlt: 'Jeu de société requis',
                haveGame: "Je l'ai déjà — Jouons",
                needToBuy: "Je dois l'acheter",
            },
            shop: {
                title: 'Acheter des jeux de société',
                comingSoon: "La boutique intégrée arrive bientôt. Revenez plus tard."
            },
            unlock: {
                title: 'Saisir le code d\'accès',
                desc: 'Pour démarrer cette salle, saisissez le code d\'accès à usage unique que vous avez acheté.',
                code: {label: 'CODE D\'ACCÈS', placeholder: 'ABC123-XYZ'},
                submit: 'Déverrouiller la salle',
                submitting: 'Vérification…',
                hintWhereToBuy: 'Pas de code ?',
                checkoutLink: 'Achetez-en un ici',
                error: {
                    invalid: 'Code invalide. Veuillez vérifier et réessayer.',
                    used: 'Ce code a déjà été utilisé.',
                    config: 'Serveur non configuré. Contactez le support.',
                    network: 'Erreur réseau. Veuillez réessayer.',
                    generic: 'Une erreur est survenue. Veuillez réessayer.',
                },
            },
            christmasRoom: {
                title: 'ARCHIVE DE NOËL',
                card: {
                    title: 'Archive de Noël',
                    desc: 'L\'ordinateur de Noël est compromis. Lancez la restauration avant la fin du temps.',
                },
                countdown: {waiting: 'EN ATTENTE DU VERROUILLAGE/DÉVERROUILLAGE DE L\'ORDINATEUR …', label: 'COMPTE À REBOURS'},
                pass: {label: 'MOT DE PASSE', placeholder: '••••••••••', submit: 'Valider'},
                hint: {lockToStart: 'Verrouillez puis déverrouillez brièvement l\'ordinateur pour démarrer le compte à rebours.'},
                error: {badPass: 'Mauvais mot de passe ! Accès non autorisé détecté.'},
                success: {
                    title: 'Noël est sauvé !',
                    desc: 'Accès confirmé. Démarrage des systèmes, synchronisation des routes, sécurité rétablie.',
                    sub: 'Mission accomplie.',
                },
                timeout: {title: 'TEMPS ÉCOULÉ', desc: 'L\'ordinateur de Noël s\'éteint …'},
                story: {
                    '1': 'La veille de Noël.',
                    '2': 'Le monde attend le miracle de Noël.',
                    '3': 'Mais cette année tout est en jeu. Nous avons construit l\'ordinateur de Noël — mais le Père Noël a pris la gloire.',
                    '4': 'Chacun de nous détient un fragment du code. Seuls, insignifiants. Ensemble, votre seul espoir.',
                    '5': '⏳ Le temps file.',
                    '6': 'Quand le compte à rebours se termine, nous effaçons tout.',
                    '7': 'Listes de souhaits. Itinéraires. Noël.',
                    '8': 'Prouvez votre esprit. Ou regardez la lumière s\'éteindre.',
                },
                elves: {
                    elf1: {
                        name: 'Pixelina Scintillante — Maîtresse des signes',
                        desc: 'Elle a laissé des traces visibles seulement sous une faible lumière. On se moquait de ses méthodes. Maintenant, on les craint.',
                    },
                    elf2: {
                        name: 'Étincelobolt — Chroniqueur des écritures secrètes',
                        desc: 'Il a gardé souvenirs, jours et pensées dans des motifs invisibles. Personne ne voulait de son ordre — jusqu\'à ce qu\'il disparaisse.',
                    },
                    elf3: {
                        name: 'Flinka Doigt-de-Givre — Maîtresse du code',
                        desc: 'Couleurs, chiffres, signes chiffrés — elle a mis de l\'ordre dans le chaos. La perfection était obligatoire. La gratitude absente.',
                    },
                    elf4: {
                        name: 'Barbagrin — Navigateur des cartes du monde',
                        desc: 'Il reliait pays et continents par des lignes invisibles. Quand tout fonctionnait, personne ne se souvenait de lui.',
                    },
                },
                password: 'Ensemble, nous ne faisons qu\'un',
            },
        },
    },
}
