import { thaw } from 'proskomma-freeze';
import {Proskomma} from 'proskomma';
import { readable } from 'svelte/store';
import { readFileSync } from 'fs-extra';

export const pk = readable(
    new Proskomma(),
    () => thaw(this, readFileSync("./WEB.pkzip").toString());
);
