import type { APIResponseDTO } from '$lib/mvc/DTO/APIResponseDTO';
import type { DayDTO, RequestDayDTO } from '$lib/mvc/DTO/DayDTO';
import type { Day } from '$lib/mvc/Entity/Day';

export default class DayRepository {
	private readonly day_api_url: string =
		'https://pocketbase-work-timetable.site.quack-lab.dev/api/collections/day/records';
	private readonly default_page_size: string = '?perPage=100';
	private readonly default_expand: string =
		'&expand=work_time(day),overtime(day)';
	private readonly default_fields: string = '&fields=id,name,expand';
	private readonly default_sort: string = '&sort=-name';
	private readonly default_filter: string =
		"&filter=(name >= '{1}')&&(name <= '{2}')";

	public async get_all_days(start: Date, end: Date): Promise<APIResponseDTO> {
		const url = this.construct_default_url(start, end);
		const res = await fetch(url);
		return await res.json();
	}

	public async get_all_days_full(
		start: Date,
		end: Date
	): Promise<APIResponseDTO> {
		let url = this.construct_default_url(start, end);
		url += this.default_expand;
		const res = await fetch(url);
		return await res.json();
	}

	public async get_by_date(date: Date): Promise<APIResponseDTO> {
		const url = `${this.day_api_url}?filter=(name ~ '${
			date.toISOString().split('T')[0]
		}')`;
		const res = await fetch(url);
		return await res.json();
	}

	public async create(dto: RequestDayDTO): Promise<DayDTO> {
		const res = await fetch(this.day_api_url, {
			method: 'POST',
			body: JSON.stringify(dto),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return await res.json();
	}

	public async create_1(day: Day): Promise<DayDTO> {
		const res = await fetch(this.day_api_url, {
			method: 'POST',
			body: JSON.stringify({ name: day.datetime }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return await res.json();
	}

	private construct_default_url(start: Date, end: Date): string {
		start = new Date(start);
		end = new Date(end);

		let url = this.day_api_url;
		url += this.default_page_size;
		url += this.default_fields;
		url += this.default_sort;
		url += this.default_filter
			.replace('{1}', start.toISOString())
			.replace('{2}', end.toISOString());
		url += this.default_expand;

		return url;
	}
}
