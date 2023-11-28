import type { Day } from '$lib/mvc/Entity/Day';
import DayService from '$lib/mvc/Service/DayService';
import type { WorktimeDTO } from '$lib/mvc/DTO/WorktimeDTO';
import { user } from '$stores/User';
import { get } from 'svelte/store';

export default class WorktimeRepository {
	private readonly worktime_api_url: string =
		'https://pocketbase-work-timetable.site.cyka.info/api/collections/work_time/records';
	private readonly day_service = new DayService();

	public async create(hours: number, day: Day): Promise<WorktimeDTO> {
		if (DayService.is_transient(day)) {
			day = await this.day_service.get_by_date(day.datetime);
		}

		const res = await fetch(this.worktime_api_url, {
			method: 'POST',
			body: JSON.stringify({
				hours,
				day: day.id,
				user: get(user)?.id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return await res.json();
	}

	public async delete(id: string) {
		await fetch(`${this.worktime_api_url}/${id}`, {
			method: 'DELETE'
		});
	}
}