import DayMapper from "$lib/mvc/Mapper/DayMapper";
import DayRepository from "$lib/mvc/Repository/DayRepository";
import type {Day} from "$lib/mvc/Entity/Day";
import {build_month} from "$lib/utils/DateUtils";
import type {DayDTO, RequestDayDTO} from "$lib/mvc/DTO/DayDTO";

export default class DayService {
    private readonly mapper: DayMapper = new DayMapper();
    private readonly repository: DayRepository = new DayRepository();

    public async get_this_month_days_full(): Promise<Day[]> {
        const now = new Date();
        const this_month = build_month(now.getMonth(), now.getFullYear());
        console.log(this_month);

        return Promise.resolve([]);
    }

    public async get_all_days(start: Date, end: Date): Promise<Day[]> {
        const api_data = await this.repository.get_all_days(start, end);
        return this.mapper.to_entity(api_data);
    }

    public async get_all_days_full(start: Date, end: Date): Promise<Day[]> {
        const api_data = await this.repository.get_all_days_full(start, end);
        return this.mapper.to_entity(api_data);
    }

    public async create(day: RequestDayDTO): Promise<Day> {
        const dto: DayDTO = await this.repository.create(day);
        return this.mapper.to_entity_1(dto);
    }
}
