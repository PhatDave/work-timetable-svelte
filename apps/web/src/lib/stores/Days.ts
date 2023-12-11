import { writable } from 'svelte/store';
import type { Day } from '$lib/Entity/Day';

const create_store = () => {
	const { subscribe, set, update } = writable<Day[]>([]);
	return {
		subscribe,
		set,
		update,
		set_day: (day: Day) => {
			update((days: Day[]) => {
				for (let i = 0; i < days.length; i++) {
					const val: Day = days[i];
					if (val.date === day.date) {
						val.id = day.id;
						val.datetime = day.datetime;
						val.date = day.date;
						val.work_time = day.work_time;
						val.overtime = day.overtime;
						break;
					}
				}
				return days;
			});
		}
	};
};

export const days = create_store();
