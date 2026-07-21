// vite-svg-loader owns bare .svg imports (they become Vue components),
// so icon URLs must be imported with the ?url suffix.
import nodejsIcon from '@/assets/images/languages/nodejs.svg?url';
import csharpIcon from '@/assets/images/languages/csharp.svg?url';
import mysqlIcon from '@/assets/images/languages/mysql.svg?url';
import vueIcon from '@/assets/images/languages/vue.svg?url';
import fsharpIcon from '@/assets/images/languages/fsharp.svg?url';
import phpIcon from '@/assets/images/languages/php.svg?url';

/**
 * Single source of truth for the physics skill sections on /experience.
 *
 * Adding a skill = adding one entry here (plus an SVG in assets/images/languages
 * for program skills). Fields:
 * - id:          unique key
 * - icon:        image drawn on the physics body (program skills only)
 * - label:       short name; drawn inside the shape when there is no icon
 * - description: tooltip text, per locale ({en, nl})
 * - size:        rendered width in px on desktop (mobile renders at 50%)
 * - shape:       collision/visual shape: 'rect' (chamfered) | 'circle' | 'triangle' |
 *                'diamond' (icons with a diamond silhouette, e.g. F#) |
 *                'triangle-down' (icons shaped like a V, e.g. the Vue logo) |
 *                'hexagon' (pointy-top hexagon badges, e.g. Node.js)
 * - color:       fill color for icon-less shapes (brand colors from _variables.scss)
 * - textColor:   label color for icon-less shapes
 * - hitboxScale: shrinks the collision body relative to the drawn size (default 1) —
 *                for icons with transparent padding around the artwork
 */
export const programSkills = [
    {
        id: 'nodejs',
        icon: nodejsIcon,
        label: 'Node.js',
        // The Node.js badge is a pointy-top hexagon.
        shape: 'hexagon',
        size: 170,
        description: {
            en: 'I Learned Node.js during my first internship, I would consider myself as an expert.',
            nl: 'Ik heb Node.js geleerd tijdens mijn eerste stage, ik beschouw mezelf als een expert.',
        },
    },
    {
        id: 'csharp',
        icon: csharpIcon,
        label: 'C#',
        shape: 'rect',
        size: 120,
        description: {
            en: 'I Learned C# during my bachelor degree and got good at it in my final internship at IO Digital.',
            nl: 'Ik heb C# geleerd tijdens mijn bachelor en ben er goed in geworden tijdens mijn afstudeerstage bij iO Digital.',
        },
    },
    {
        id: 'mysql',
        icon: mysqlIcon,
        label: 'MySQL',
        shape: 'rect',
        size: 160,
        description: {
            en: 'I have many years experience with MySql, i would consider myself an expert.',
            nl: 'Ik heb jarenlange ervaring met MySql, ik beschouw mezelf als een expert.',
        },
    },
    {
        id: 'vue',
        icon: vueIcon,
        label: 'Vue.js',
        // The Vue logo is a V: wide at the top, one point at the bottom.
        shape: 'triangle-down',
        size: 140,
        description: {
            en: 'I learned Vue.js at my first intership, I prefer this frontend framework above the others.',
            nl: 'Ik heb Vue.js geleerd tijdens mijn eerste stage, dit frontend framework verkies ik boven de andere.',
        },
    },
    {
        id: 'fsharp',
        icon: fsharpIcon,
        label: 'F#',
        // The F# logo is two facing chevrons: its ink silhouette is a diamond
        // (narrow top/bottom, tips at the sides), not a full square.
        shape: 'diamond',
        size: 120,
        description: {
            en: 'I learned F# during my bachelor degree, i would consider myself as a beginner.',
            nl: 'Ik heb F# geleerd tijdens mijn bachelor, ik beschouw mezelf als een beginner.',
        },
    },
    {
        id: 'php',
        icon: phpIcon,
        label: 'PHP',
        shape: 'rect',
        size: 160,
        description: {
            en: 'I learned PHP during my bachelor degree, i would consider myself an expert.',
            nl: 'Ik heb PHP geleerd tijdens mijn bachelor, ik beschouw mezelf als een expert.',
        },
    },
];

export const socialSkills = [
    {
        id: 'communication',
        label: {en: 'Communication', nl: 'Communicatie'},
        shape: 'circle',
        size: 150,
        color: '#FF6B6B',
        textColor: '#FFFFFF',
        description: {
            en: 'Working on client projects and the Proximus Unity activation taught me how important clear communication between teams is.',
            nl: 'Door klantprojecten en de Proximus Unity-activatie heb ik geleerd hoe belangrijk duidelijke communicatie tussen teams is.',
        },
    },
    {
        id: 'teamwork',
        label: {en: 'Teamwork', nl: 'Samenwerken'},
        shape: 'rect',
        size: 170,
        color: '#1889E6',
        textColor: '#FFFFFF',
        description: {
            en: 'From team sports to dev teams: I love working together towards a shared goal.',
            nl: 'Van teamsporten tot developmentteams: ik werk graag samen naar een gezamenlijk doel.',
        },
    },
    {
        id: 'leadership',
        label: {en: 'Leadership', nl: 'Leiderschap'},
        shape: 'triangle',
        size: 190,
        color: '#0F68B0',
        textColor: '#FFFFFF',
        description: {
            en: 'I like to take ownership of projects and guide them from idea to release.',
            nl: 'Ik neem graag eigenaarschap over projecten en begeleid ze van idee tot release.',
        },
    },
    {
        id: 'adaptability',
        label: {en: 'Adaptability', nl: 'Aanpassen'},
        shape: 'circle',
        size: 150,
        color: '#FFD93D',
        textColor: '#111112',
        description: {
            en: 'New frameworks, new clients, new challenges: I adapt quickly and enjoy it.',
            nl: 'Nieuwe frameworks, nieuwe klanten, nieuwe uitdagingen: ik pas me snel aan en geniet ervan.',
        },
    },
    {
        id: 'problem-solving',
        label: {en: 'Problem solving', nl: 'Problemen oplossen'},
        shape: 'rect',
        size: 180,
        color: '#fcac45',
        textColor: '#111112',
        description: {
            en: 'Debugging a caching layer or fixing hosting issues: digging into hard problems is my favourite part of the job.',
            nl: 'Een cachinglaag debuggen of hostingproblemen oplossen: in moeilijke problemen duiken is mijn favoriete deel van het werk.',
        },
    },
    {
        id: 'honesty',
        label: {en: 'Honesty', nl: 'Eerlijkheid'},
        shape: 'triangle',
        size: 180,
        color: '#9c3660',
        textColor: '#FFFFFF',
        description: {
            en: 'I communicate openly about progress, blockers and mistakes — that is how teams stay fast.',
            nl: 'Ik communiceer open over voortgang, blokkades en fouten — zo blijft een team snel.',
        },
    },
    {
        id: 'loyalty',
        label: {en: 'Loyalty', nl: 'Loyaliteit'},
        shape: 'circle',
        size: 150,
        color: '#FF6BB5',
        textColor: '#111112',
        description: {
            en: 'When an employer is good to me and treats me right, I am truly loyal in return — you can see that in my years at the Friethuys and LiveWall.',
            nl: 'Als mijn werkgever goed voor mij is en mij correct behandelt, ben ik echt loyaal — dat zie je terug in mijn jaren bij het Friethuys en LiveWall.',
        },
    },
];
