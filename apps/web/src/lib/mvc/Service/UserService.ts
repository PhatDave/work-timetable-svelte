import UserRepository from '$lib/mvc/Repository/UserRepository';
import type { User } from '$lib/mvc/Entity/User';
import type { APIResponseDTO } from '$lib/mvc/DTO/APIResponseDTO';
import type { UserDTO } from '$lib/mvc/DTO/UserDTO';
import Mapper from '$lib/mvc/Mapper/Mapper';
import { get, writable } from 'svelte/store';

export default class UserService {
	public static logged_user = writable<User | null | undefined>(null);
	private readonly user_repository = new UserRepository();
	private readonly mapper: Mapper = new Mapper();

	public static is_logged_in(): boolean {
		return get(UserService.logged_user) !== undefined;
	}

	public async get_by_name(name: string): Promise<User | undefined> {
		const res: APIResponseDTO =
			await this.user_repository.get_by_name(name);
		if (res.totalItems > 0) {
			return this.mapper.to_entity_7(res.items[0] as UserDTO);
		}
		return undefined;
	}

	public async create(name: string): Promise<User> {
		const res: UserDTO = await this.user_repository.create(name);
		return this.mapper.to_entity_7(res);
	}

	public async update_logged_user(name: string) {
		let user = await this.get_by_name(name);
		if (!user) {
			user = await this.create(name);
		}
		UserService.logged_user.set(user);
		localStorage.setItem('user', name);
		console.log(`Update user ${name} - ${get(UserService.logged_user)}`);
	}
}
