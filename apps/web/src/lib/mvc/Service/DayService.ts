import DayRepository from '$lib/mvc/Repository/DayRepository';
import type { Day } from '$lib/mvc/Entity/Day';
import { build_month } from '$lib/utils/DateUtils';
import type { DayDTO, RequestDayDTO } from '$lib/mvc/DTO/DayDTO';
import type { APIResponseDTO } from '$lib/mvc/DTO/APIResponseDTO';
import Mapper from '$lib/mvc/Mapper/Mapper';

export default class DayService {
	public static readonly cached_now: Date = new Date();
	private readonly mapper: Mapper = new Mapper();
	private readonly repository: DayRepository = new DayRepository();

	public static is_same_month(datetime1: Date, datetime2: Date) {
		return (
			datetime1.getMonth() === datetime2.getMonth() &&
			datetime1.getFullYear() === datetime2.getFullYear()
		);
	}

	public static is_same_day(datetime1: Date, datetime2: Date) {
		return (
			datetime1.getDate() === datetime2.getDate() &&
			datetime1.getMonth() === datetime2.getMonth() &&
			datetime1.getFullYear() === datetime2.getFullYear()
		);
	}

	public static is_transient(day: Day): boolean {
		return !day.id;
	}

	public async get_days_of_month_full(datetime: Date): Promise<Day[]> {
		const this_month: Day[] = build_month(
			datetime.getMonth() + 1,
			datetime.getFullYear()
		);

		// if (!get(user)) {
		// 	return Promise.resolve(this_month);
		// }

		const first_day: Date = new Date(this_month[0].datetime);
		const last_day: Date = new Date(
			this_month[this_month.length - 1].datetime
		);

		first_day.setHours(0, 0, 0, 0);
		last_day.setHours(23, 59, 59, 999);

		const api_days: Day[] = await this.get_all_days_full(
			first_day,
			last_day
		);
		for (let i = 0; i < api_days.length; i++) {
			const api_day: Day = api_days[i];
			const existing_day: Day | undefined = this_month.find(
				(day: Day) => day.date === api_day.date
			);
			if (existing_day) {
				existing_day.id = api_day.id;
				existing_day.work_time = api_day.work_time;
				existing_day.overtime = api_day.overtime;
			}
		}

		return Promise.resolve(this_month);
	}

	public async get_all_days_full(start: Date, end: Date): Promise<Day[]> {
		const api_data: APIResponseDTO =
			await this.repository.get_all_days_full(start, end);
		return this.mapper.to_entity(api_data);
	}

	public async get_by_date(date: Date): Promise<Day> {
		const dto: APIResponseDTO = await this.repository.get_by_date(date);
		if (dto.totalItems === 0) {
			return this.create({ name: date.toISOString() });
		}
		return this.mapper.to_entity_1(dto.items[0] as DayDTO);
	}

	public async create(day: RequestDayDTO): Promise<Day> {
		const dto: DayDTO = await this.repository.create(day);
		return this.mapper.to_entity_1(dto);
	}

	public async create_1(day: Day): Promise<Day> {
		const dto: DayDTO = await this.repository.create_1(day);
		return this.mapper.to_entity_1(dto);
	}

	public is_current_month(day: Day) {
		return (
			day.datetime.getMonth() === DayService.cached_now.getMonth() &&
			day.datetime.getFullYear() === DayService.cached_now.getFullYear()
		);
	}

	public is_current_day(day: Day) {
		return (
			day.datetime.getDate() === DayService.cached_now.getDate() &&
			day.datetime.getMonth() === DayService.cached_now.getMonth() &&
			day.datetime.getFullYear() === DayService.cached_now.getFullYear()
		);
	}
}
