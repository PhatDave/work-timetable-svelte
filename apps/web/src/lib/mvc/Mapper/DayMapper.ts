import type {Day} from "$lib/mvc/Entity/Day";
import type {APIResponseDTO} from "$lib/mvc/DTO/APIResponseDTO";
import type {DayDTO} from "$lib/mvc/DTO/DayDTO";
import type {Overtime} from "$lib/mvc/Entity/Overtime";
import type {OvertimeDTO} from "$lib/mvc/DTO/OvertimeDTO";
import type {Worktime} from "$lib/mvc/Entity/Worktime";
import type {WorktimeDTO} from "$lib/mvc/DTO/WorktimeDTO";
import {datetime_to_date} from "$lib/utils/DateUtils";

export default class DayMapper {
    to_entity(data: APIResponseDTO): Day[] {
        const out: Day[] = [];

        for (const element of data.items) {
            out.push(this.to_entity_1(element));
        }

        return out;
    }

    to_entity_1(data: DayDTO): Day {
        const date: Date = new Date(data.name);
        return {
            id: data.id,
            datetime: date,
            date: datetime_to_date(date),
            overtime: this.to_entity_4(data),
            work_time: this.to_entity_5(data)
        }
    }

    to_entity_4(data: DayDTO): Overtime[] {
        const out: Overtime[] = [];

        if (data.expand && data.expand["overtime(day)"]) {
            for (const dto of data.expand["overtime(day)"]) {
                out.push(this.to_entity_2(dto))
            }
        }

        return out;
    }

    to_entity_2(data: OvertimeDTO): Overtime {
        return {
            hours: data.hours,
            id: data.id
        }
    }

    to_entity_5(data:DayDTO): Worktime[] {
        const out: Overtime[] = [];

        if (data.expand && data.expand["work_time(day)"]) {
            for (const dto of data.expand["work_time(day)"]) {
                out.push(this.to_entity_3(dto))
            }
        }

        return out;
    }

    to_entity_3(data: WorktimeDTO): Worktime {
        return {
            hours: data.hours,
            id: data.id,
        };
    }
}
