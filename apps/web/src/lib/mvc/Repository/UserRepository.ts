import type {APIResponseDTO} from '$lib/mvc/DTO/APIResponseDTO';
import type {UserDTO} from '$lib/mvc/DTO/UserDTO';

export default class UserRepository {
    private readonly user_api_url: string =
        'https://pocketbase-work-timetable.site.quack-lab.dev/api/collections/user/records';
    private readonly default_filter = `?filter=(name = '{}')`;

    public async get_by_name(name: string): Promise<APIResponseDTO> {
        const res = await fetch(
            this.user_api_url + this.default_filter.replace('{}', name)
        );
        return await res.json();
    }

    public async create(name: string): Promise<UserDTO> {
        const res = await fetch(this.user_api_url, {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await res.json();
    }
}
