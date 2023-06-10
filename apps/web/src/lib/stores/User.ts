import { writable } from 'svelte/store';
import UserService from '$lib/mvc/Service/UserService';
import type { User } from '$lib/mvc/Entity/User';

const user_service = new UserService();

const create_store = () => {
	const { subscribe, set, update } = writable<User | null | undefined>(null);
	return {
		subscribe,
		set,
		update,
		login: async (username: string) => {
			if (!username) {
				return;
			}

			let user = await user_service.get_by_name(username);
			if (!user) {
				user = await user_service.create(username);
			}
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
