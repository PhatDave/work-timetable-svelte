import type { Worktime } from '$lib/mvc/Entity/Worktime';
import type { Overtime } from '$lib/mvc/Entity/Overtime';

export type Day = {
	id: string;
	datetime: Date;
	date: string;
	work_time: Worktime[];
	overtime: Overtime[];
};
