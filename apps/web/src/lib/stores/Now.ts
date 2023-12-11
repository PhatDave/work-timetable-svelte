import { readable } from 'svelte/store';

export const now = readable(new Date());
