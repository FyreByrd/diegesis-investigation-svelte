//import { pkWithDocs } from '../scripts/load';
import { readable } from 'svelte/store';

const pk = readable(
    /*
	pkWithDocs(import.meta.url,[
        ['./usfm/02-GENeng-web.usfm', {
            lang: 'eng',
            abbr: 'web',
        }],
        ['./usfm/03-EXOeng-web.usfm', {
            lang: 'eng',
            abbr: 'web',
        }],
        ['./usfm/04-LEVeng-web.usfm', {
            lang: 'eng',
            abbr: 'web',
        }],
        ['./usfm/05-NUMeng-web.usfm', {
            lang: 'eng',
            abbr: 'web',
        }],
        ['./usfm/06-DEUeng-web.usfm', {
            lang: 'eng',
            abbr: 'web',
        }],
    ]),*/
    () => {}
);

export { pk }