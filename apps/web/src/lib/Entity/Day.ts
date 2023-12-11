import type { Worktime } from '$lib/Entity/Worktime';
import type { Overtime } from '$lib/Entity/Overtime';

export type Day = {
	id: string;
	datetime: Date;
	date: string;
	work_time: Worktime[];
	overtime: Overtime[];
};
