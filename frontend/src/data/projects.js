/**
 * Single source of truth for ALL project content:
 * - the cards on /projects (and the featured ones on the home page)
 * - the detail/blog pages on /project/:slug
 *
 * Adding a project = one entry here (+ images under assets/images/projects/)
 * + its slug in data/slugs.js once published (for the sitemap).
 *
 * Text fields are per-locale objects {en, nl}, resolved at render time via
 * the localized() helper from @/i18n. Fields:
 * - slug:        route param for /project/:slug
 * - featured:    shown in the home page slider
 * - draft:       hidden everywhere until flipped to false
 * - image:       card banner (null while a draft has no banner yet)
 * - tag:         card badge {color: blue|black|purple|avans, text: {en, nl}}
 * - blocks:      detail page content: title | image | video | paragraph
 */

const TAGS = {
    hobby: {color: 'blue', text: {en: 'Hobby Project', nl: 'Hobbyproject'}},
    livewall: {color: 'black', text: {en: 'Livewall Group', nl: 'LiveWall Group'}},
    livewallInternship: {color: 'black', text: {en: 'Internship at Livewall Group', nl: 'Stage bij LiveWall Group'}},
    ioInternship: {color: 'purple', text: {en: 'Internship at IO', nl: 'Stage bij iO'}},
    avans: {color: 'avans', text: {en: 'Avans university', nl: 'Avans Hogeschool'}},
};

export const projects = [
    {
        slug: 'shooting-stars',
        type: 'image',
        image: new URL(`../assets/images/projects/shooting-stars-banner.png`, import.meta.url).href,
        tag: TAGS.hobby,
        title: {
            en: 'Shooting stars meme generator',
            nl: 'Shooting stars meme-generator',
        },
        description: {
            en: 'Learn how a backflip fail inspired the creation of a Shooting Stars meme generator!',
            nl: 'Lees hoe een mislukte backflip leidde tot een Shooting Stars meme-generator!',
        },
        blocks: [
            {type: 'title', content: {en: 'Shooting Stars Meme Generator', nl: 'Shooting Stars meme-generator'}},
            {
                type: 'image',
                src: new URL(`../assets/images/projects/shooting-stars-banner.png`, import.meta.url).href,
                alt: 'Shooting stars meme generator'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'During my vacation on Palma de Mallorca, I broke my skull while attempting a backflip. My friend jokingly called it an "op je bek flip". This incident was filmed, so I thought it would be fun to create a Shooting Stars meme using this video.',
                    nl: 'Tijdens mijn vakantie op Palma de Mallorca brak ik mijn schedel bij een poging tot een backflip. Mijn vriend noemde het gekscherend een "op je bek flip". Het incident was gefilmd, dus het leek me leuk om er een Shooting Stars-meme van te maken.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'However, when I searched online for a generator to make a Shooting Stars meme, I couldn’t find a good one. So, I decided to create my own generator by developing a Python Flask API. This API processes an uploaded video and turns it into a Shooting Stars meme.',
                    nl: 'Toen ik online zocht naar een generator om een Shooting Stars-meme te maken, kon ik echter geen goede vinden. Dus besloot ik mijn eigen generator te bouwen met een Python Flask API. Deze API verwerkt een geüploade video en maakt er een Shooting Stars-meme van.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Creating this generator was a lot of fun because I had never manipulated video using programming before. Additionally, it was my first time setting up an automatic deployment for a Python API on my own VPS. It turned out to be a really rewarding learning experience.',
                    nl: 'Het bouwen van deze generator was erg leuk, omdat ik nog nooit eerder video had bewerkt met code. Daarnaast was het de eerste keer dat ik een automatische deployment voor een Python API op mijn eigen VPS opzette. Het bleek een erg leerzame ervaring.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'You can find the meme generator <a href="https://meme-creator.milovanderpas.nl">here</a>.',
                    nl: 'De meme-generator vind je <a href="https://meme-creator.milovanderpas.nl">hier</a>.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'If you want to see my personal meme, you’ll need to meet me in real life ;)',
                    nl: 'Wil je mijn persoonlijke meme zien, dan zul je me in het echt moeten ontmoeten ;)',
                }
            },
        ],
    },
    {
        slug: 'player0.0',
        type: 'image',
        featured: true,
        image: new URL(`../assets/images/projects/player0.0.png`, import.meta.url).href,
        tag: TAGS.livewall,
        title: {
            en: 'Player 0.0',
            nl: 'Player 0.0',
        },
        description: {
            en: 'Player 0.0 is a cool gaming experience that we developed for Heineken 0.0 and has been released in 16 countries',
            nl: 'Player 0.0 is een gave game-experience die we voor Heineken 0.0 hebben ontwikkeld en die in 16 landen is uitgebracht',
        },
        blocks: [
            {type: 'title', content: {en: 'Player 0.0 Heineken', nl: 'Player 0.0 Heineken'}},
            {
                type: 'image',
                src: new URL(`../assets/images/projects/player0.0.png`, import.meta.url).href,
                alt: 'image'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Player 0.0 is a cool gaming experience that we developed for Heineken 0.0 and has been released in many markets, including Poland, Ecuador, Croatia, Slovenia, Bosnia, Spain, Japan, Australia, Ireland, Chile, Malaysia, Panama, Singapore, Paraguay, Bulgaria, and the United States.',
                    nl: 'Player 0.0 is een gave game-experience die we voor Heineken 0.0 hebben ontwikkeld en die in veel markten is uitgebracht, waaronder Polen, Ecuador, Kroatië, Slovenië, Bosnië, Spanje, Japan, Australië, Ierland, Chili, Maleisië, Panama, Singapore, Paraguay, Bulgarije en de Verenigde Staten.',
                }
            },
            {
                type: 'video',
                src: new URL(`../assets/videos/projects/player0.0.mp4`, import.meta.url).href,
                background: '#008200',
                width: 750
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Due to the game\'s release in so many markets, we had to create a robust backend and database capable of serving a large number of users simultaneously. During the development of this backend, I learned a lot about creating the right indexes in a database and how to efficiently handle large volumes of data.',
                    nl: 'Doordat de game in zoveel markten is uitgebracht, moesten we een robuuste backend en database bouwen die een groot aantal gebruikers tegelijk aankan. Tijdens de ontwikkeling van deze backend heb ik veel geleerd over het aanmaken van de juiste indexes in een database en het efficiënt verwerken van grote hoeveelheden data.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'For example, we had to store duplicate data in our database to make the leaderboard endpoint faster.',
                    nl: 'Zo moesten we bijvoorbeeld dubbele data opslaan in onze database om het leaderboard-endpoint sneller te maken.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'It’s really fun and exciting to see how many people are playing this game. The best players will compete against each other in a sim racing experience, and the winner of this final race will win two tickets to the Dutch Grand Prix and have a chance to sim race against F1 triple world champion Max Verstappen.',
                    nl: 'Het is superleuk en spannend om te zien hoeveel mensen deze game spelen. De beste spelers nemen het tegen elkaar op in een simrace-experience, en de winnaar van deze finalerace wint twee tickets voor de Dutch Grand Prix en maakt kans om te simracen tegen drievoudig F1-wereldkampioen Max Verstappen.',
                }
            },
        ],
    },
    {
        slug: 'soundzam',
        type: 'image',
        featured: true,
        image: new URL(`../assets/images/projects/soundzam-app.png`, import.meta.url).href,
        tag: TAGS.hobby,
        title: {
            en: 'SoundZam app',
            nl: 'SoundZam-app',
        },
        description: {
            en: 'After graduating I made an app for recognizing SoundCloud songs.',
            nl: 'Na mijn afstuderen maakte ik een app om SoundCloud-nummers te herkennen.',
        },
        blocks: [
            {type: 'title', content: {en: 'SoundZam App', nl: 'SoundZam-app'}},
            {
                type: 'image',
                src: new URL(`../assets/images/projects/soundzam-app.png`, import.meta.url).href,
                alt: 'image'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'When I was watching a YouTube video I heard a song that was on SoundCloud and I wanted to know what the name of song was. So I started looking in the comment section for answers, to my disappointment nobody knew what the name of the song was. So than I thought maybe Shazam can recognize this song, but I found out that Shazam could only recognize Spotify, ITunes and YouTube.',
                    nl: 'Toen ik een YouTube-video keek, hoorde ik een nummer dat op SoundCloud stond en ik wilde weten hoe het heette. Ik zocht in de comments naar antwoorden, maar tot mijn teleurstelling wist niemand de naam van het nummer. Toen dacht ik: misschien kan Shazam dit nummer herkennen, maar ik kwam erachter dat Shazam alleen Spotify, iTunes en YouTube herkent.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Than I thought to myself if there is no solution for this problem, why not make it myself! So I started researching how I could solve this problem. There were 2 options. The first was to use the SoundCloud api to get all the fragments of the most popular songs of each day with a cron job. Or data mine the site every day with a cron job and a python script. The first option was eliminated when I found out that SoundCloud was not giving new access to the SoundCloud API, because the were rethinking the process of giving access to the API. So than I was only left with the second option <strong>data mining</strong>, so I started developing a python script that would go on the homepage, than would redirect to every hitlist and here would data mine every song in the hitlist.',
                    nl: 'Toen dacht ik bij mezelf: als er geen oplossing voor dit probleem is, waarom maak ik die dan niet zelf! Ik begon te onderzoeken hoe ik dit kon oplossen. Er waren twee opties: de SoundCloud API gebruiken om met een cronjob alle fragmenten van de populairste nummers van de dag op te halen, of de site elke dag dataminen met een cronjob en een Python-script. De eerste optie viel af toen ik ontdekte dat SoundCloud geen nieuwe toegang tot de API gaf, omdat ze het toegangsproces aan het herzien waren. Dus bleef alleen de tweede optie over: <strong>datamining</strong>. Ik ontwikkelde een Python-script dat naar de homepage ging, doorklikte naar elke hitlijst en daar elk nummer uit de hitlijst datamijnde.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'After developing this python script, I started with a prototype of the app. So that I would have more leverage at asking for a partnership or cooperation with SoundCloud. In the video below you can see the flow of the app.',
                    nl: 'Na het ontwikkelen van dit Python-script begon ik aan een prototype van de app, zodat ik sterker zou staan bij het vragen om een partnership of samenwerking met SoundCloud. In de video hieronder zie je de flow van de app.',
                }
            },
            {
                type: 'video',
                src: new URL(`../assets/videos/projects/soundzam-clip.mp4`, import.meta.url).href,
                background: '#75627B',
                width: 250,
            },
            {
                type: 'paragraph',
                content: {
                    en: 'After sending the prototype and idea to SoundCloud support, they notified me that the could not give me access to the API nor would they allow me to data mine there website. Because it was against their policy.',
                    nl: 'Nadat ik het prototype en het idee naar SoundCloud-support had gestuurd, lieten ze me weten dat ze me geen toegang tot de API konden geven en dat ik hun website ook niet mocht dataminen, omdat dat tegen hun beleid was.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'After this I made a simple Node.js API, that used an Audd API to recognize songs so that I for now could finish the project.',
                    nl: 'Daarna maakte ik een simpele Node.js API die een Audd API gebruikte om nummers te herkennen, zodat ik het project voorlopig kon afronden.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'I may revisited this project, when SoundCloud reopens access to their API. The project is open source so can be found on this <a href="https://github.com/milovdpas/SoundZam" target="_blank">repository</a>.',
                    nl: 'Misschien pak ik dit project weer op wanneer SoundCloud de toegang tot hun API weer opent. Het project is open source en te vinden in deze <a href="https://github.com/milovdpas/SoundZam" target="_blank">repository</a>.',
                }
            },
        ],
    },
    {
        slug: 'internship-io',
        type: 'image',
        featured: true,
        image: new URL(`../assets/images/projects/internship/banner.png`, import.meta.url).href,
        tag: TAGS.ioInternship,
        title: {
            en: 'Real-Time flex place reservation app',
            nl: 'Realtime flexplek-reserveringsapp',
        },
        description: {
            en: 'For my final internship of school, me and Wessel made a real-time app for reserving a flex workplace for the office of IO.',
            nl: 'Voor mijn afstudeerstage maakten Wessel en ik een realtime app om een flexwerkplek te reserveren op het kantoor van iO.',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'Our Internship at iO: Driving Innovation in Workplace Efficiency',
                    nl: 'Onze stage bij iO: innovatie in werkplek-efficiëntie',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship/banner.png`, import.meta.url).href,
                alt: 'Image of the internship project'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'From January to June 2023, Wessel van Tilburg and I, embarked on an exciting internship at iO, an end-to-end agency known for its expertise in marketing, technology, and strategy. Together, we tackled a real-world challenge and gained invaluable professional experience along the way.',
                    nl: 'Van januari tot juni 2023 liepen Wessel van Tilburg en ik een mooie stage bij iO, een end-to-end bureau dat bekendstaat om zijn expertise in marketing, technologie en strategie. Samen pakten we een echte praktijkuitdaging aan en deden we onderweg waardevolle professionele ervaring op.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Our project aimed to solve inefficiencies in finding available workspaces in busy office environments. Employees often spent up to 20 minutes searching for desks, wasting over 87 hours annually.',
                    nl: 'Ons project moest het inefficiënt zoeken naar beschikbare werkplekken in drukke kantooromgevingen oplossen. Medewerkers waren vaak tot 20 minuten bezig met het zoeken van een bureau, goed voor ruim 87 verloren uren per jaar.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship/image23.png`, import.meta.url).href,
                alt: 'Image of the internship project',
                width: 500,
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship/image24.png`, import.meta.url).href,
                alt: 'Image of the internship project',
                width: 200,
            },
            {
                type: 'paragraph',
                content: {
                    en: 'To address this, we developed a user-friendly real-time app, a comprehensive web portal, and a scalable backend system.',
                    nl: 'Om dit op te lossen ontwikkelden we een gebruiksvriendelijke realtime app, een uitgebreid webportaal en een schaalbaar backend-systeem.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship/architecture-2.png`, import.meta.url).href,
                alt: 'Image of the internship project'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'By the end of our internship, we achieved a remarkable 90% improvement in booking efficiency, allowing employees to reserve workspaces in just 30-45 seconds.',
                    nl: 'Aan het einde van onze stage hadden we een indrukwekkende verbetering van 90% in boekingsefficiëntie gerealiseerd, waardoor medewerkers in slechts 30-45 seconden een werkplek konden reserveren.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Key technologies and methods included React Native for cross-platform app development, a microservices backend architecture using RabbitMQ, multiple databases (sql and nosql) and CI/CD pipelines with GitHub Actions, Docker and Kubernetes.',
                    nl: 'Belangrijke technologieën en methodes waren React Native voor cross-platform appontwikkeling, een microservices-backendarchitectuur met RabbitMQ, meerdere databases (SQL en NoSQL) en CI/CD-pipelines met GitHub Actions, Docker en Kubernetes.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship/technologies.png`, import.meta.url).href,
                alt: 'Image of the technologies that were used'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'This experience was transformative for both of us. I honed my skills in backend development and DevOps, while Wessel focused on app development and UX design, both of us growing significantly as developers and professionals.',
                    nl: 'Deze ervaring was voor ons allebei vormend. Ik verdiepte mijn skills in backend-development en DevOps, terwijl Wessel zich richtte op appontwikkeling en UX-design. We zijn allebei flink gegroeid als developers en professionals.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: `Here are some demo's of the applications:`,
                    nl: `Hier zijn een paar demo's van de applicaties:`,
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/videos/projects/io-portal-demo-1.gif`, import.meta.url).href,
                alt: 'Demo of the web portal',
                background: '#E5D2E0',
            },
            {
                type: 'image',
                src: new URL(`../assets/videos/projects/io-portal-demo-2.gif`, import.meta.url).href,
                alt: 'Demo of the web portal',
                background: '#E5D2E0',
            },
            {
                type: 'image',
                src: new URL(`../assets/videos/projects/io-app-demo.gif`, import.meta.url).href,
                alt: 'Demo of the app',
                background: '#E5D2E0',
                width: 200,
            },
        ],
    },
    {
        slug: 'dpg-motm',
        type: 'image',
        image: new URL(`../assets/images/projects/motm.jpg`, import.meta.url).href,
        tag: TAGS.livewall,
        title: {
            en: 'Line-up, Substitution and MOTM tool',
            nl: 'Opstelling-, wissel- en MOTM-tool',
        },
        description: {
            en: 'During my part-time job I made a line-up, substitution and player of the match tool for DPG Media for the 2022 World Cup.',
            nl: 'Tijdens mijn bijbaan maakte ik voor DPG Media een opstelling-, wissel- en man-of-the-match-tool voor het WK van 2022.',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'DPG Media Line-up, Substitution and MOTM tool',
                    nl: 'DPG Media opstelling-, wissel- en MOTM-tool',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/motm.jpg`, import.meta.url).href,
                alt: 'image'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'My role in this project was as a Backend developer at LiveWall Group.',
                    nl: 'Mijn rol in dit project was backend developer bij LiveWall Group.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'For this project we had to make 3 tools: the Line-up tool, the substitution tool and the Man of the match tool. And these tools would be used for all the games of Belgium and the Netherlands during the WK of 2022.',
                    nl: 'Voor dit project moesten we drie tools maken: de opstellingstool, de wisseltool en de man-of-the-match-tool. Deze tools werden gebruikt voor alle wedstrijden van België en Nederland tijdens het WK van 2022.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The line-up tool would be used before the games, supporters could guess or input their favorite squad in the tool. And news websites could use a widget that we developed to show the favourite line-up of the supporters.',
                    nl: 'De opstellingstool werd vóór de wedstrijden gebruikt: supporters konden hun favoriete opstelling raden of invoeren. Nieuwswebsites konden een door ons ontwikkelde widget gebruiken om de favoriete opstelling van de supporters te tonen.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The substitution tool would be used during the game and supporters could chose every 5 minutes three substitutes. News websites could use a widget to show which three players the supporters wanted to be substituted off.',
                    nl: 'De wisseltool werd tijdens de wedstrijd gebruikt: supporters konden elke 5 minuten drie wissels kiezen. Nieuwswebsites konden met een widget tonen welke drie spelers de supporters gewisseld wilden zien.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/motm-list.jpg`, import.meta.url).href,
                alt: 'image'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'And last the man of the match tool would be used after the game ended and supporters could chose one man of the match. News websites could use a widget to show the top man of the match of that game and the percentage of the votes that the player got.',
                    nl: 'Tot slot werd de man-of-the-match-tool na afloop van de wedstrijd gebruikt: supporters kozen één man of the match. Nieuwswebsites konden met een widget de populairste man of the match van die wedstrijd tonen, inclusief het percentage stemmen dat de speler kreeg.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'This project was really fun, because I had to study a <a href="http://persgroep.api.infostradasports.com" target="_blank">sport API</a> and with cron jobs I would get data out of the API and store it into an own designed database. I also learned to minimize my SQL query length and to use indexes in my database, because on one occasion all the databases crashed. Oopsie🤦🏻‍♂️',
                    nl: 'Dit project was erg leuk, omdat ik een <a href="http://persgroep.api.infostradasports.com" target="_blank">sport-API</a> moest bestuderen en met cronjobs data uit de API haalde en opsloeg in een zelf ontworpen database. Ik leerde ook mijn SQL-query’s korter te maken en indexes te gebruiken in mijn database, want op een gegeven moment crashten alle databases. Oepsie🤦🏻‍♂️',
                }
            },
        ],
    },
    {
        slug: 'accessibility',
        type: 'image',
        image: new URL(`../assets/images/projects/accessibility/banner.png`, import.meta.url).href,
        tag: TAGS.avans,
        title: {
            en: 'Accessibility questionnaire app',
            nl: 'Accessibility vragenlijst-app',
        },
        description: {
            en: 'We build a questionnaire app for the dutch accessibility organization',
            nl: 'We bouwden een vragenlijst-app voor de Nederlandse organisatie Accessibility',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'Accessibility Questionnaire App',
                    nl: 'Accessibility vragenlijst-app',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/accessibility/banner.png`, import.meta.url).href,
                alt: 'Banner image of the internship'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'During my third year of college, my classmates and I worked on a school project for a real organization. Our task was to create an app for people with visual impairments to fill out questionnaires about buildings they visited. This project was done for Accessibility, an organization based in the Netherlands. Additionally, we were required to develop a web portal to manage all the questionnaires. The exciting part of this project was that it was open-source, and the codebase is still available <a href="https://github.com/Project-Accessibility" target="_blank">here</a>.',
                    nl: 'In mijn derde studiejaar werkten mijn studiegenoten en ik aan een schoolproject voor een echte organisatie. Onze opdracht was een app te maken waarmee mensen met een visuele beperking vragenlijsten konden invullen over gebouwen die ze bezochten. Dit project deden we voor Accessibility, een organisatie in Nederland. Daarnaast moesten we een webportaal ontwikkelen om alle vragenlijsten te beheren. Het mooie van dit project was dat het open source was. De codebase is nog steeds <a href="https://github.com/Project-Accessibility" target="_blank">hier</a> beschikbaar.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Our app had several key features that made it easy to use for people with visual impairments:',
                    nl: 'Onze app had een aantal belangrijke functies die hem makkelijk bruikbaar maakten voor mensen met een visuele beperking:',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: '<strong>1. Geofencing for Building Zones</strong><br>We implemented geofencing, which could be configured for different sections of a questionnaire through the web portal. When a user entered a specific zone, the relevant sections of the questionnaire would automatically appear on their screen.',
                    nl: '<strong>1. Geofencing voor gebouwzones</strong><br>We implementeerden geofencing, dat via het webportaal per onderdeel van een vragenlijst geconfigureerd kon worden. Zodra een gebruiker een specifieke zone binnenkwam, verschenen de relevante onderdelen van de vragenlijst automatisch op het scherm.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/accessibility/geofencing.jpg`, import.meta.url).href,
                alt: 'Illustration of geofencing in a building'
            },
            {
                type: 'paragraph',
                content: {
                    en: '<strong>2. Support for Various Question Types</strong><br>The app supported a range of question formats, which could all be defined via the web portal. These included open-ended questions, image-based questions, video and audio responses, multiple-choice questions, and range sliders. This made the app highly versatile and adaptive to different needs.',
                    nl: '<strong>2. Ondersteuning voor verschillende vraagtypen</strong><br>De app ondersteunde uiteenlopende vraagvormen, die allemaal via het webportaal konden worden ingesteld: open vragen, vragen met afbeeldingen, video- en audio-antwoorden, meerkeuzevragen en schuifbalken. Dat maakte de app erg veelzijdig en flexibel.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/accessibility/question-options.png`, import.meta.url).href,
                alt: 'Question options in web portal'
            },
            {
                type: 'paragraph',
                content: {
                    en: '<strong>3. WCAG Compliance</strong><br>Both the app and the web portal were WCAG (Web Content Accessibility Guidelines) approved. This ensured that users with visual impairments or color blindness could easily navigate the app and portal using a screen reader.',
                    nl: '<strong>3. WCAG-conformiteit</strong><br>Zowel de app als het webportaal waren WCAG-goedgekeurd (Web Content Accessibility Guidelines). Zo konden gebruikers met een visuele beperking of kleurenblindheid de app en het portaal makkelijk bedienen met een schermlezer.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/accessibility/wcag.png`, import.meta.url).href,
                alt: 'WCAG illustration'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'This project taught me a lot about accessibility and app development, as it was my first time working with React Native. Additionally, I gained valuable experience in client communication and learned how to maintain structure and organization in a project-oriented approach.',
                    nl: 'Dit project heeft me veel geleerd over toegankelijkheid en appontwikkeling; het was mijn eerste keer met React Native. Daarnaast deed ik waardevolle ervaring op in klantcommunicatie en leerde ik structuur en organisatie te bewaren in een projectmatige aanpak.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Overall, I am really proud of how the web portal and app turned out. It was a rewarding experience to work on something that could have a meaningful impact instead of just projects for school that will never be used again.',
                    nl: 'Al met al ben ik echt trots op hoe het webportaal en de app zijn geworden. Het was een dankbare ervaring om aan iets te werken dat echt impact kan hebben, in plaats van schoolprojecten die nooit meer gebruikt worden.',
                }
            },
            {
                type: 'paragraph',
                content: {en: 'Demo:', nl: 'Demo:'}
            },
            {
                type: 'video',
                src: new URL(`../assets/videos/projects/accessibility.mp4`, import.meta.url).href,
            },
        ],
    },
    {
        slug: 'nh-samen-veilig',
        type: 'image',
        image: new URL(`../assets/images/projects/trainingsplatform.png`, import.meta.url).href,
        tag: TAGS.livewall,
        title: {
            en: 'Trainingsplatform',
            nl: 'Trainingsplatform',
        },
        description: {
            en: 'During my part-time job, I created a training platform that enables local police officers, BOAs and bailiffs to recognize the signals of unusual possession better, faster and more effectively.',
            nl: 'Tijdens mijn bijbaan bouwde ik een trainingsplatform waarmee wijkagenten, boa’s en deurwaarders signalen van onverklaarbaar bezit beter, sneller en effectiever leren herkennen.',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'NH Samen Veilig Trainingsplatform',
                    nl: 'NH Samen Veilig Trainingsplatform',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/trainingsplatform.png`, import.meta.url).href,
                alt: 'image'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'My role in this project was a Full Stack developer at LiveWall Group. So I made the front- and backend for this project. LiveWall has also written an <a href="https://www.livewall.nl/cases/noordholland-samen-veilig-e-learning-content-productie" target="_blank">article</a> about this project.',
                    nl: 'Mijn rol in dit project was fullstack developer bij LiveWall Group; ik maakte dus de front- en backend voor dit project. LiveWall heeft ook een <a href="https://www.livewall.nl/cases/noordholland-samen-veilig-e-learning-content-productie" target="_blank">artikel</a> over dit project geschreven.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'This project was made in cooperation with NH Samen Veilig. NH Samen Veilig is the partnership between 32 different municipalities, the police and the Public Prosecution Service, within the North Holland unit. FIT, the Financial Intelligence Team, approached LiveWall with a clear request: "Help local police officers, BOAs and bailiffs recognize the signals of unusual possession better, faster and more effectively."',
                    nl: 'Dit project is gemaakt in samenwerking met NH Samen Veilig, het samenwerkingsverband tussen 32 gemeenten, de politie en het Openbaar Ministerie binnen de eenheid Noord-Holland. FIT, het Financieel Intelligence Team, kwam bij LiveWall met een duidelijke vraag: "Help wijkagenten, boa’s en deurwaarders de signalen van onverklaarbaar bezit beter, sneller en effectiever te herkennen."',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/trainingsplatform-2.png`, import.meta.url).href,
                alt: 'image'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'During this project I made 2 different modules for the training platform, were in the first module they needed to detect signals of unusual possession by tagging a signal at the right moment in the video. And in the second module they always would get 2 options in a interactive video and depending on the option they would chose the would get a different outcome.',
                    nl: 'Voor dit project maakte ik twee verschillende modules voor het trainingsplatform. In de eerste module moesten deelnemers signalen van onverklaarbaar bezit herkennen door op het juiste moment in de video een signaal te taggen. In de tweede module kregen ze in een interactieve video steeds twee opties, en afhankelijk van hun keuze kregen ze een andere uitkomst.',
                }
            },
        ],
    },
    {
        slug: 'internship-livewall',
        type: 'image',
        image: new URL(`../assets/images/projects/internship-livewall/banner.jpg`, import.meta.url).href,
        tag: TAGS.livewallInternship,
        title: {
            en: 'My first internship',
            nl: 'Mijn eerste stage',
        },
        description: {
            en: 'My first internship at LiveWall: backend development, exciting projects, and real-world growth!',
            nl: 'Mijn eerste stage bij LiveWall: backend-development, gave projecten en groeien in de praktijk!',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'My First Internship: A Journey of Code, Challenges, and Growth',
                    nl: 'Mijn eerste stage: een reis van code, uitdagingen en groei',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship-livewall/banner.jpg`, import.meta.url).href,
                alt: 'Banner image of the internship'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Over a few months at LiveWall Group BV, I dove headfirst into the world of backend development, tackling challenges, learning new tech, and working on some pretty cool projects.',
                    nl: 'In een paar maanden bij LiveWall Group BV dook ik met mijn hoofd vooruit de wereld van backend-development in: uitdagingen aangaan, nieuwe technologie leren en werken aan behoorlijk gave projecten.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship-livewall/node.png`, import.meta.url).href,
                alt: 'Image of Node.js'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'LiveWall had recently adopted the Laravel framework for many of its projects. However, performance bottlenecks became apparent when handling high user traffic, particularly for applications like “Man Of The Match,” where the system needed to process over 10,000 requests in a span of minutes. My primary objective was clear: find a more efficient framework that could support large-scale performance requirements and deliver a boilerplate and documentation to streamline future projects.',
                    nl: 'LiveWall was kort daarvoor voor veel projecten overgestapt op het Laravel-framework. Bij veel gebruikersverkeer werden echter performance-knelpunten zichtbaar, vooral bij applicaties als “Man Of The Match”, waar het systeem binnen enkele minuten meer dan 10.000 requests moest verwerken. Mijn hoofddoel was duidelijk: een efficiënter framework vinden dat grootschalige performance aankan, en een boilerplate plus documentatie opleveren om toekomstige projecten te versnellen.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship-livewall/edit-performance.png`, import.meta.url).href,
                alt: 'Image of performance results'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Spoiler alert: We ended up going with Express.js, a Node.js framework that’s as fast as it is flexible. It was a perfect fit for what LiveWall needed. And I created a boilerplate for this framework which is still being used to this day for all the projects of team Engagement.',
                    nl: 'Spoiler: het werd Express.js, een Node.js-framework dat net zo snel als flexibel is. Het paste perfect bij wat LiveWall nodig had. Ik maakte een boilerplate voor dit framework die tot op de dag van vandaag wordt gebruikt voor alle projecten van team Engagement.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'While the framework research was my main gig, I also got to work on a ton of side projects, 17 to be exact. Some of the most fun ones included:<br/>- <b>DPG Speler van de Wedstrijd</b>: Developing APIs and managing match data.<br/>- <b>StukTV Website</b>: Adding features for video content and viewer submissions.<br/>- <b>Legacy of Music</b>: Building a dynamic comment section with moderator tools.<br/>- <b>McDonald\'s Games</b>: Creating leaderboards for Belgian and Spanish campaigns.<br/>- <b>Donald Duck Personalized Comic</b>: Letting users create their own comic strip, with over 13,000 registrations in the first week!',
                    nl: 'Het frameworkonderzoek was mijn hoofdtaak, maar ik mocht ook aan een hoop nevenprojecten werken, 17 om precies te zijn. Een paar van de leukste:<br/>- <b>DPG Speler van de Wedstrijd</b>: API’s ontwikkelen en wedstrijddata beheren.<br/>- <b>StukTV-website</b>: features toevoegen voor videocontent en inzendingen van kijkers.<br/>- <b>Legacy of Music</b>: een dynamische commentsectie bouwen met moderatortools.<br/>- <b>McDonald\'s Games</b>: leaderboards maken voor Belgische en Spaanse campagnes.<br/>- <b>Donald Duck gepersonaliseerde strip</b>: gebruikers hun eigen stripverhaal laten maken, met ruim 13.000 registraties in de eerste week!',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship-livewall/donald-duck.jpg`, import.meta.url).href,
                alt: 'Image of Donald Duck personalized comic project'
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship-livewall/motm.jpg`, import.meta.url).href,
                alt: 'Image of DPG Motm project'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'These projects weren’t just fun, they were incredibly educational. From setting up APIs to dealing with legacy code, each task helped me level up my skills.',
                    nl: 'Deze projecten waren niet alleen leuk, ze waren ook ontzettend leerzaam. Van API’s opzetten tot omgaan met legacy code: elke taak hielp me mijn skills naar een hoger niveau te tillen.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'One of the biggest lessons I learned was the value of flexibility and clear communication. Using Scrum helped me adapt to evolving project needs, and open communication with the team ensured we avoided misalignment in project requirements.',
                    nl: 'Een van de grootste lessen was de waarde van flexibiliteit en duidelijke communicatie. Scrum hielp me om te gaan met veranderende projectbehoeften, en open communicatie met het team voorkwam dat we langs elkaar heen werkten bij projectvereisten.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The LiveWall team was amazing: always willing to teach, help, or just share a laugh after hours. Shoutout to my mentors, the backend Platforms team, and the other interns for making every day enjoyable.',
                    nl: 'Het LiveWall-team was geweldig: altijd bereid om iets uit te leggen, te helpen of gewoon te lachen na werktijd. Shout-out naar mijn mentoren, het backend Platforms-team en de andere stagiairs die elke dag leuk maakten.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'If I had to sum it up, my first internship was a mix of fun, late nights, and big wins. It wasn’t always smooth sailing, but every challenge taught me something new and pushed me to grow. Plus, seeing my code live in action was an awesome feeling.',
                    nl: 'Als ik het moet samenvatten: mijn eerste stage was een mix van plezier, late avonden en grote overwinningen. Het ging niet altijd vanzelf, maar elke uitdaging leerde me iets nieuws en liet me groeien. En mijn code live in actie zien was een geweldig gevoel.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/internship-livewall/stuktv.jpg`, import.meta.url).href,
                alt: 'Image of the StukTV project'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'For anyone starting their first internship, here’s my advice: ask questions, try new things, and don’t stress too much if something breaks. Every mistake is just another step toward becoming better.',
                    nl: 'Voor iedereen die aan een eerste stage begint, mijn advies: stel vragen, probeer nieuwe dingen en stress niet te veel als er iets stukgaat. Elke fout is gewoon een stap dichter bij beter worden.',
                }
            },
        ],
    },
    {
        slug: 'tegelogy',
        type: 'image',
        image: new URL(`../assets/images/projects/tegelogy/banner.png`, import.meta.url).href,
        tag: TAGS.hobby,
        title: {
            en: 'Tegelogy',
            nl: 'Tegelogy',
        },
        description: {
            en: 'How a fake university course helped my friend crash student parties and score cheap beer. Meet Tegelogy!',
            nl: 'Hoe een nep-studierichting mijn vriend studentenfeesten binnenloodste met goedkoop bier. Dit is Tegelogy!',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'Fake University Course Website for a Friend',
                    nl: 'Nep-studierichtingwebsite voor een vriend',
                }
            },
            {
                type: 'video',
                src: new URL(`../assets/videos/projects/tegelogy-demo.mp4`, import.meta.url).href,
                alt: 'Demo video of the fake Tegelogy website'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'When I was in college, I had a few friends who were already working full-time in their respective fields. Every year, our college would host an introduction week for new students, filled with parties at various student houses. However, the catch was that you could only attend these parties if you were an active student.',
                    nl: 'Toen ik studeerde, had ik een paar vrienden die al fulltime in hun vakgebied werkten. Elk jaar organiseerde onze school een introductieweek voor nieuwe studenten, vol feesten bij verschillende studentenhuizen. De catch: je mocht alleen naar deze feesten als je een actieve student was.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'One of my friends was a professional tile setter (*tegelleger*), and he felt left out during these intro weeks. So, as a joke, I created a fake university course called "Tegelogy" just for him. The website looked professional enough to convince real students that he was also studying at the university.',
                    nl: 'Een van mijn vrienden was professioneel tegellegger en voelde zich buitengesloten tijdens deze introweken. Dus maakte ik als grap speciaal voor hem een nep-studierichting genaamd "Tegelogy". De website zag er professioneel genoeg uit om echte studenten ervan te overtuigen dat hij ook aan de hogeschool studeerde.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/tegelogy/quote.png`, import.meta.url).href,
                alt: 'Quote of friend'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'It became a running joke within our friend group, and to our surprise, the website worked like a charm. Students totally fell for it, and my friend managed to join the parties, enjoying cheap beer and great company, all thanks to his (fake) course!',
                    nl: 'Het werd een running gag in onze vriendengroep, en tot onze verrassing werkte de website perfect. Studenten trapten er volledig in en mijn vriend kon gewoon mee naar de feesten, genietend van goedkoop bier en goed gezelschap, allemaal dankzij zijn (nep)studie!',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'This small project was just meant as a bit of fun, but it turned into a hilarious and memorable story. Thank you, students, for unknowingly contributing to the legend of Tegelogy!',
                    nl: 'Dit kleine project was gewoon voor de lol bedoeld, maar het werd een hilarisch en onvergetelijk verhaal. Bedankt, studenten, voor jullie onbewuste bijdrage aan de legende van Tegelogy!',
                }
            },
        ],
    },
    {
        slug: 'city-life-game',
        type: 'image',
        image: new URL(`../assets/images/projects/city-life/banner.png`, import.meta.url).href,
        tag: TAGS.hobby,
        title: {
            en: 'Monopoly Simulation Game',
            nl: 'Monopoly-simulatiegame',
        },
        description: {
            en: 'Building a Java game inspired by CityInc: huge numbers, save systems, and a summer of coding!',
            nl: 'Een Java-game bouwen geïnspireerd op CityInc: gigantische getallen, savesystemen en een zomer vol programmeren!',
        },
        blocks: [
            {
                type: 'title',
                content: {
                    en: 'Monopoly Simulation Game: My Summer Project',
                    nl: 'Monopoly-simulatiegame: mijn zomerproject',
                }
            },
            {
                type: 'video',
                src: new URL(`../assets/videos/projects/city-life-demo.mp4`, import.meta.url).href,
                alt: 'Demo video of the Monopoly Simulation Game'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'After finishing my first year of college, I was super motivated to keep making cool stuff. During my summer vacation, I worked on two projects: a Unity app and a Java game.',
                    nl: 'Na mijn eerste studiejaar was ik supergemotiveerd om gave dingen te blijven maken. In mijn zomervakantie werkte ik aan twee projecten: een Unity-app en een Java-game.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The Java game was inspired by a game I used to play all the time on spele.nl called CityInc. I loved the original game, so I decided to make my own version. It was fun figuring out how to recreate it while adding some of my own ideas along the way.',
                    nl: 'De Java-game was geïnspireerd op een spel dat ik vroeger constant op spele.nl speelde: CityInc. Ik was gek op het origineel, dus besloot ik mijn eigen versie te maken. Het was leuk om uit te vogelen hoe ik het kon nabouwen en er onderweg eigen ideeën aan toe te voegen.',
                }
            },
            {
                type: 'image',
                src: new URL(`../assets/images/projects/city-life/cityinc.jpg`, import.meta.url).href,
                alt: 'City inc screenshot'
            },
            {
                type: 'paragraph',
                content: {
                    en: 'One of the wildest parts of the project was working with absolutely massive numbers, like nonillions (yeah, that’s a 1 followed by 30 zeros!). Handling those kinds of numbers was a challenge, but it pushed me to learn how to manage big calculations without crashing the game.',
                    nl: 'Een van de wildste onderdelen van het project was het werken met absurd grote getallen, zoals quintiljoenen (jep, een 1 met 30 nullen!). Met zulke getallen omgaan was een uitdaging, maar het dwong me te leren hoe je grote berekeningen uitvoert zonder de game te laten crashen.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Another cool thing I added was a file system for saving progress. Players could save and load their game, which made it feel more complete and polished. It was my first time implementing something like that, and it taught me a lot about how games store data.',
                    nl: 'Iets anders gaafs dat ik toevoegde was een bestandssysteem om voortgang op te slaan. Spelers konden hun spel opslaan en laden, waardoor het completer en gepolijster aanvoelde. Het was de eerste keer dat ik zoiets bouwde en ik leerde er veel van over hoe games data opslaan.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Even though it’s a simple game, making it was a great way to experiment and improve my skills. Diving into a project like this was a fun way to spend the summer and learn by doing.',
                    nl: 'Ook al is het een simpele game, het maken ervan was een geweldige manier om te experimenteren en mijn skills te verbeteren. In zo’n project duiken was een leuke zomerbesteding en leren door te doen.',
                }
            },
        ],
    },

    // ------------------------------------------------------------------
    // DRAFTS — hidden until a banner image is supplied (assets/images/
    // projects/<slug>/banner.png), the copy is approved and draft: false.
    // Remember to add the slug to data/slugs.js when publishing!
    // ------------------------------------------------------------------
    {
        slug: 'jet-cache',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/jet-cache/banner.png
        tag: TAGS.livewall,
        title: {
            en: 'JET write-through cache',
            nl: 'JET write-through cache',
        },
        description: {
            en: 'A write-through caching layer for Just Eat Takeaway campaigns that keeps responses fast and the backend healthy under heavy load.',
            nl: 'Een write-through cachinglaag voor Just Eat Takeaway-campagnes die responses snel houdt en de backend gezond onder hoge druk.',
        },
        blocks: [
            {type: 'title', content: {en: 'JET write-through cache', nl: 'JET write-through cache'}},
            {
                type: 'paragraph',
                content: {
                    en: 'For Just Eat Takeaway campaigns at LiveWall I built a write-through caching layer: every write updates both the cache and the database, so reads are served from cache at full speed without ever going stale.',
                    nl: 'Voor Just Eat Takeaway-campagnes bij LiveWall bouwde ik een write-through cachinglaag: elke write werkt zowel de cache als de database bij, zodat reads razendsnel uit de cache komen zonder ooit verouderd te raken.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The interesting challenges were cache invalidation strategies, keeping the cache and the database transactionally in sync, and proving with load tests that the layer actually held up at campaign-level traffic.',
                    nl: 'De interessante uitdagingen zaten in cache-invalidatiestrategieën, het transactioneel synchroon houden van cache en database, en met loadtests aantonen dat de laag campagneverkeer echt aankon.',
                }
            },
        ],
    },
    {
        slug: 'rituals-launches',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/rituals-launches/banner.png
        tag: TAGS.livewall,
        title: {
            en: 'Rituals product launches',
            nl: 'Rituals productlaunches',
        },
        description: {
            en: 'The platform behind all Rituals launch campaigns: repeatable infrastructure built to survive launch-day traffic spikes.',
            nl: 'Het platform achter alle Rituals-launches: herbruikbare infrastructuur gebouwd om launch-pieken te overleven.',
        },
        blocks: [
            {type: 'title', content: {en: 'Rituals product launches', nl: 'Rituals productlaunches'}},
            {
                type: 'paragraph',
                content: {
                    en: 'At LiveWall I worked on the platform powering all Rituals product launches. Launch days are unforgiving: everything has to scale instantly the moment a campaign goes live.',
                    nl: 'Bij LiveWall werkte ik aan het platform achter alle productlaunches van Rituals. Launchdagen zijn onverbiddelijk: alles moet direct schalen zodra een campagne live gaat.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'Building launch after launch on the same foundation taught me how to design infrastructure for repeatability: what should be configuration, what should be code, and what should never have to be rebuilt again.',
                    nl: 'Launch na launch bouwen op hetzelfde fundament leerde me infrastructuur te ontwerpen voor herhaalbaarheid: wat configuratie moet zijn, wat code moet zijn en wat nooit opnieuw gebouwd zou moeten hoeven worden.',
                }
            },
        ],
    },
    {
        slug: 'proximus-monopoly',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/proximus-monopoly/banner.png
        tag: TAGS.livewall,
        title: {
            en: 'Proximus Monopoly activation',
            nl: 'Proximus Monopoly-activatie',
        },
        description: {
            en: 'Our first big Unity activation, where I learned how a Unity game and a backend should really talk to each other.',
            nl: 'Onze eerste grote Unity-activatie, waar ik leerde hoe een Unity-game en een backend écht met elkaar moeten communiceren.',
        },
        blocks: [
            {type: 'title', content: {en: 'Proximus Monopoly activation', nl: 'Proximus Monopoly-activatie'}},
            {
                type: 'paragraph',
                content: {
                    en: 'The Proximus Monopoly activation was our first big Unity production and my first close cooperation with a Unity team. My side: the backend that the game talked to for authentication, game state and rewards.',
                    nl: 'De Proximus Monopoly-activatie was onze eerste grote Unity-productie en mijn eerste nauwe samenwerking met een Unity-team. Mijn kant: de backend waar de game mee praatte voor authenticatie, gamestatus en rewards.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The biggest lesson was communication between disciplines: agreeing early on contracts between the game and the backend (endpoints, payloads, error behaviour) saves days of debugging later. This project shaped how we set up Unity-to-backend cooperation ever since.',
                    nl: 'De grootste les was communicatie tussen disciplines: vroeg afspraken maken over de contracten tussen game en backend (endpoints, payloads, foutafhandeling) scheelt later dagen debuggen. Dit project heeft bepaald hoe we sindsdien Unity-backend-samenwerkingen opzetten.',
                }
            },
        ],
    },
    {
        slug: 'heineken-fhmf',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/heineken-fhmf/banner.png
        tag: TAGS.livewall,
        title: {
            en: 'Heineken FHMF rebuild',
            nl: 'Heineken FHMF rebuild',
        },
        description: {
            en: 'A big platform rebuild: lots of new functionality on top of the previous Heineken project and a more complex hosting setup.',
            nl: 'Een grote platform-rebuild: veel nieuwe functionaliteit bovenop het vorige Heineken-project en een complexere hosting-opzet.',
        },
        blocks: [
            {type: 'title', content: {en: 'Heineken FHMF rebuild', nl: 'Heineken FHMF rebuild'}},
            {
                type: 'paragraph',
                content: {
                    en: 'For Heineken FHMF we rebuilt the existing platform from the ground up, adding a lot of new functionality on top of what the previous project offered.',
                    nl: 'Voor Heineken FHMF hebben we het bestaande platform van de grond af opnieuw opgebouwd, met veel nieuwe functionaliteit bovenop wat het vorige project bood.',
                }
            },
            {
                type: 'paragraph',
                content: {
                    en: 'The hosting setup also became considerably more complex, a great exercise in designing infrastructure that stays manageable while the platform around it grows.',
                    nl: 'Ook de hosting-opzet werd flink complexer, een mooie oefening in infrastructuur ontwerpen die beheersbaar blijft terwijl het platform eromheen groeit.',
                }
            },
        ],
    },
    {
        slug: 'wehkamp',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/wehkamp/banner.png
        tag: TAGS.livewall,
        title: {
            en: 'Wehkamp',
            nl: 'Wehkamp',
        },
        description: {
            en: 'A project defined by a really nice cooperation with the client: short lines and fast iterations.',
            nl: 'Een project gekenmerkt door een hele fijne samenwerking met de klant: korte lijntjes en snelle iteraties.',
        },
        blocks: [
            {type: 'title', content: {en: 'Wehkamp', nl: 'Wehkamp'}},
            {
                type: 'paragraph',
                content: {
                    en: 'What made the Wehkamp project stand out was the cooperation with the client: short lines, quick decisions and fast iterations made this one of the smoothest projects I have worked on.',
                    nl: 'Wat het Wehkamp-project bijzonder maakte was de samenwerking met de klant: korte lijntjes, snelle beslissingen en vlotte iteraties maakten dit een van de soepelste projecten waaraan ik heb gewerkt.',
                }
            },
        ],
    },
    {
        slug: 'espressions',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/espressions/banner.png
        tag: TAGS.hobby,
        title: {
            en: 'Espressions',
            nl: 'Espressions',
        },
        description: {
            en: 'A personal hobby app project. More details coming soon.',
            nl: 'Een persoonlijk hobby-appproject. Meer details volgen binnenkort.',
        },
        blocks: [
            {type: 'title', content: {en: 'Espressions', nl: 'Espressions'}},
            {
                type: 'paragraph',
                content: {
                    en: 'A hobby app project. Full write-up coming soon.',
                    nl: 'Een hobby-appproject. Uitgebreid verhaal volgt binnenkort.',
                }
            },
        ],
    },
    {
        slug: 'drinking-games',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/drinking-games/banner.png
        tag: TAGS.hobby,
        title: {
            en: 'Drinking games app',
            nl: 'Drankspelletjes-app',
        },
        description: {
            en: 'A party app full of drinking games, built as a hobby project with its own privacy policy on this site.',
            nl: 'Een party-app vol drankspelletjes, gebouwd als hobbyproject met een eigen privacybeleid op deze site.',
        },
        blocks: [
            {type: 'title', content: {en: 'Drinking games app', nl: 'Drankspelletjes-app'}},
            {
                type: 'paragraph',
                content: {
                    en: 'A hobby app packed with drinking games for parties. Its privacy policy lives on this site: <a href="/privacy_policy_drinking_games">privacy policy</a>. Full write-up coming soon.',
                    nl: 'Een hobby-app vol drankspelletjes voor feestjes. Het privacybeleid staat op deze site: <a href="/privacy_policy_drinking_games">privacybeleid</a>. Uitgebreid verhaal volgt binnenkort.',
                }
            },
        ],
    },
    {
        slug: 'marathon-planner',
        type: 'image',
        draft: true,
        image: null, // TODO: assets/images/projects/marathon-planner/banner.png
        tag: TAGS.hobby,
        title: {
            en: 'Marathon training planner',
            nl: 'Marathon-trainingsplanner',
        },
        description: {
            en: 'An app that builds marathon training schedules: my running hobby combined with code.',
            nl: 'Een app die marathon-trainingsschema’s genereert: mijn hardloophobby gecombineerd met code.',
        },
        blocks: [
            {type: 'title', content: {en: 'Marathon training planner', nl: 'Marathon-trainingsplanner'}},
            {
                type: 'paragraph',
                content: {
                    en: 'A hobby project that generates marathon training schedules, combining my running hobby with code. Full write-up coming soon.',
                    nl: 'Een hobbyproject dat marathon-trainingsschema’s genereert en zo mijn hardloophobby met code combineert. Uitgebreid verhaal volgt binnenkort.',
                }
            },
        ],
    },
];

export const publishedProjects = projects.filter(project => !project.draft);

export const featuredProjects = publishedProjects.filter(project => project.featured);

export function getProject(slug) {
    return publishedProjects.find(project => project.slug === slug) || null;
}
