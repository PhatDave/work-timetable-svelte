import {writable} from 'svelte/store';
import type {User} from '$lib/Entity/User';
import {get_or_create_user} from "$lib/APIInterface";

const create_store = () => {
    const {subscribe, set, update} = writable<User | null | undefined>(null);
    return {
        subscribe,
        set,
        update,
        login: async (username: string) => {
            if (!username) {
                return;
            }

            const user = await get_or_create_user(username);

            localStorage.setItem('user', username);
            set(user);
        },
        logout: () => {
            set(null);
        },
        initialize: async () => {
            const stored_user = localStorage.getItem('user');
            if (stored_user) {
                await user.login(stored_user);
            }
        }
    };
};

export const user = create_store();
