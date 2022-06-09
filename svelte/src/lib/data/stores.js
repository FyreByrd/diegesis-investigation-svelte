import { pkStore } from './pkstore';
import { writable } from 'svelte/store';

export const pk = pkStore();
export const docSet = writable("eng_web");
export const book = writable("JHN");
export const chapter = writable(1);
