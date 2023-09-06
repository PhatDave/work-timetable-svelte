import type { Day } from '$lib/mvc/Entity/Day';
import type { WorktimeDTO } from '$lib/mvc/DTO/WorktimeDTO';
import type { Worktime } from '$lib/mvc/Entity/Worktime';
import WorktimeRepository from '$lib/mvc/Repository/WorktimeRepository';
import Mapper from '$lib/mvc/Mapper/Mapper';

export default class WorktimeService {
	private readonly mapper: Mapper = new Mapper();
	private readonly repository: WorktimeRepository = new WorktimeRepository();

	public async create(hours: number, day: Day): Promise<Worktime> {
		const dto: WorktimeDTO = await this.repository.create(hours, day);
		return this.mapper.to_entity_3(dto);
	}

	public async delete(id: string) {
		await this.repository.delete(id);
	}
}
