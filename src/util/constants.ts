import { 
    SiJavascript,
    SiHtml5,
    SiCss3,
    SiJson,
    SiGnubash,

} from 'react-icons/si'
import {
    AiFillFileText,
    AiFillFileMarkdown,
    AiOutlineFunction
} from 'react-icons/ai'
import { VscBracketDot } from 'react-icons/vsc'
import { IconType } from 'react-icons'

export const tlds: {[key: string]: string} = {
    'COM': 'com',
    'NET': 'net',
    'ORG': 'org',
    'EDU': 'edu',
    'GOV': 'gov',
    'DEV': 'dev',
    'IO': 'io',
    'GG': 'gg',
}

export const sites: {[key: string]: string} = {
    'GITHUB': 'github',
    'DISCORD': 'discord',
}

export const routes: {[key: string]: string} = {
    'BLOB': '/blob/',
    'CONTRIBUTORS_LIST': '/contributors-list/',
}

interface LangStyle {
    shortName: string;
    backgroundColor: string;
    textColor: string;
    icon: IconType
}

export const langStyles: { [key: string]: LangStyle } = {
    'language-javascript': {
        shortName: 'JS',
        backgroundColor: "#f7df1e",
        textColor: 'black',
        icon: SiJavascript,
    },
    'language-js': {
        shortName: 'JS',
        backgroundColor: "#f7df1e",
        textColor: 'black',
        icon: SiJavascript,
    },
    'language-html': {
        shortName: 'HTML',
        backgroundColor: "#005a9c",
        textColor: 'white',
        icon: SiHtml5,
    },
    'language-css': {
        shortName: 'CSS',
        backgroundColor: "#ff9800",
        textColor: 'white',
        icon: SiCss3,
    },
    'language-json': {
        shortName: 'JSON',
        backgroundColor: "#09a859",
        textColor: 'white',
        icon: SiJson,
    },
    'language-bash': {
        shortName: 'BASH',
        backgroundColor: "#4f11e0",
        textColor: 'white',
        icon: SiGnubash,
    },
    'language-text': {
        shortName: 'TEXT',
        backgroundColor: "#ececec",
        textColor: 'black',
        icon: AiFillFileText,
    },
    'language-md': {
        shortName: 'MD',
        backgroundColor: "#0991cf",
        textColor: 'white',
        icon: AiFillFileMarkdown,
    },
    'language-mdx': {
        shortName: 'MDX',
        backgroundColor: "#ffd900",
        textColor: 'black',
        icon: AiFillFileMarkdown,
    },
    'language-mcfunction': {
        shortName: 'MCFUNCTION',
        backgroundColor: "#04f38f",
        textColor: 'white',
        icon: AiOutlineFunction,
    },
    'language-molang': {
        shortName: 'MOLANG',
        backgroundColor: "#b00029",
        textColor: 'white',
        icon: VscBracketDot,
    }
}