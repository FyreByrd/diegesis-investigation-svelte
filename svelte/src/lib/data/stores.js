import { pkStore } from './pkstore';
import { readable } from 'svelte/store';

export const pk = pkStore();
export const test = readable(1);
