import type { Day } from '$lib/mvc/Entity/Day';
import OvertimeRepository from '$lib/mvc/Repository/OvertimeRepository';
import type { OvertimeDTO } from '$lib/mvc/DTO/OvertimeDTO';
import type { Overtime } from '$lib/mvc/Entity/Overtime';
import Mapper from '$lib/mvc/Mapper/Mapper';

export default class OvertimeService {
	private readonly mapper: Mapper = new Mapper();
	private readonly repository: OvertimeRepository = new OvertimeRepository();

	public async create(
		hours: number,
		description: string,
		day: Day
	): Promise<Overtime> {
		const dto: OvertimeDTO = await this.repository.create(
			hours,
			description,
			day
		);
		return this.mapper.to_entity_2(dto);
	}

	public async delete(id: string) {
		await this.repository.delete(id);
	}
}
