import { pkStore } from './pkstore';
import { readFileSync } from 'fs-extra';

let filenames = ["WEB.pkzip"];
let files = [];

for(var i = 0; i<filenames.length; i++) {
    files[i] = readFileSync(filenames[i]).toString();
}

export const pk = pkStore(files);
