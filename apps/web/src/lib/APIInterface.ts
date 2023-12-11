import { user } from '$stores/User';
import { get } from 'svelte/store';
import { build_month } from '$lib/utils/DateUtils';
import type { Day } from '$lib/Entity/Day';
import type { APIResponse, APIResponseItem } from '$lib/APIResponse';
import { work_date } from '$stores/WorkDate';
import type { Worktime } from '$lib/Entity/Worktime';
import { days } from '$stores/Days';
import type { Overtime } from '$lib/Entity/Overtime';

const API_URL = 'https://pocketbase-work-timetable.site.quack-lab.dev/api';
const API_COLLECTIONS_URL = `${API_URL}/collections`;

export async function get_or_create_user(username: string) {
	const post_options = {
		method: 'POST',
		body: JSON.stringify({ name: username }),
		headers: {
			'Content-Type': 'application/json'
		}
	};

	let res = await fetch(
		`${API_COLLECTIONS_URL}/user/records?filter=(name='${username}')`
	);
	const json: APIResponse = await res.json();

	if (json?.totalItems > 0) {
		return json.items[0];
	}

	res = await fetch(`${API_COLLECTIONS_URL}/user/records`, post_options);
	return await res.json();
}

export async function get_api_days() {
	const this_month: Day[] = build_month(
		get(work_date).getMonth() + 1,
		get(work_date).getFullYear()
	);

	const user_val = get(user);
	if (!user_val) {
		return this_month;
	}

	const first_day: Date = new Date(this_month[0].datetime);
	const last_day: Date = new Date(this_month[this_month.length - 1].datetime);

	first_day.setHours(0, 0, 0, 0);
	last_day.setHours(23, 59, 59, 999);

	let base_url = `${API_COLLECTIONS_URL}/{0}/records`;
	base_url += '?perPage=100';
	base_url += '&sort=-day';
	// TODO: Fix this abomination as well
	// Though it does work
	base_url += `&filter=(${encodeURIComponent(
		`day>='${first_day.toISOString()}'&&day<='${last_day.toISOString()}'&&user_name='${
			user_val.name
		}'`
	)})`;

	const worktime_url: string = base_url.replace('{0}', 'work_time_user');
	const overtime_url: string = base_url.replace('{0}', 'overtime_user');

	let res = await fetch(worktime_url);
	const worktimes: APIResponse = await res.json();

	res = await fetch(overtime_url);
	const overtimes: APIResponse = await res.json();

	const worktimes_map = worktimes.items.reduce(
		(acc, item: APIResponseItem) => {
			const date = item.day.split(' ')[0];
			if (!acc.has(date)) {
				acc.set(date, []);
			}
			acc.get(date)!.push(item);
			return acc;
		},
		new Map<string, APIResponseItem[]>()
	);
	const overtimes_map = overtimes.items.reduce(
		(acc, item: APIResponseItem) => {
			const date = item.day.split(' ')[0];
			if (!acc.has(date)) {
				acc.set(date, []);
			}
			acc.get(date)!.push(item);
			return acc;
		},
		new Map<string, APIResponseItem[]>()
	);

	for (let i = 0; i < this_month.length; i++) {
		const day: Day = this_month[i];
		const worktimes: APIResponseItem[] | undefined = worktimes_map.get(
			day.date
		);
		const overtimes: APIResponseItem[] | undefined = overtimes_map.get(
			day.date
		);

		if (worktimes) {
			for (let worktime of worktimes) {
				day.work_time.push({
					hours: worktime.hours,
					id: worktime.id
				});
				day.id = worktime.day_id;
			}
		}
		if (overtimes) {
			for (let overtime of overtimes) {
				day.overtime.push({
					hours: overtime.hours,
					id: overtime.id,
					description: overtime.description!
				});
				day.id = overtime.day_id;
			}
		}
	}

	return this_month;
}

export async function persist_day(day: Day) {
	if (day.id) {
		return day;
	}

	let res = await fetch(
		`${API_COLLECTIONS_URL}/day/records?filter=(name~'${day.date}')`
	);
	const json: APIResponse = await res.json();

	if (json.totalItems === 0) {
		const post_options = {
			method: 'POST',
			body: JSON.stringify({
				name: day.datetime
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		};

		res = await fetch(`${API_COLLECTIONS_URL}/day/records`, post_options);

		if (res.status === 400) {
			// Day already exists so get the existing one
			throw new Error('Day does not exist but also does exist');
		}
		return (await res.json()) as Day;
	}

	const item = json.items[0];
	const new_day = {
		...day,
		id: item.id
	};
	days.set_day(new_day);
	return new_day;
}

export async function create_worktime(day: Day, hours: number) {
	const user_val = get(user);
	if (!user_val) {
		return;
	}

	if (!day.id) {
		day = await persist_day(day);
	}

	const post_options = {
		method: 'POST',
		body: JSON.stringify({
			day: day.id,
			hours: hours,
			user: user_val.id
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const res = await fetch(
		`${API_COLLECTIONS_URL}/work_time/records`,
		post_options
	);
	if (res.status === 200) {
		return (await res.json()) as Worktime;
	}
	return undefined;
}

export async function delete_worktime_api(worktime: Worktime) {
	const delete_options = {
		method: 'DELETE'
	};

	return await fetch(
		`${API_COLLECTIONS_URL}/work_time/records/${worktime.id}`,
		delete_options
	);
}

export async function create_overtime(
	day: Day,
	hours: number,
	description: string
) {
	const user_val = get(user);
	if (!user_val) {
		return;
	}

	if (!day.id) {
		day = await persist_day(day);
	}

	const post_options = {
		method: 'POST',
		body: JSON.stringify({
			day: day.id,
			hours: hours,
			user: user_val.id,
			description: description
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const res = await fetch(
		`${API_COLLECTIONS_URL}/overtime/records`,
		post_options
	);
	if (res.status === 200) {
		return (await res.json()) as Overtime;
	}
	return undefined;
}

export async function delete_overtime_api(worktime: Worktime) {
	const delete_options = {
		method: 'DELETE'
	};

	return await fetch(
		`${API_COLLECTIONS_URL}/overtime/records/${worktime.id}`,
		delete_options
	);
}
