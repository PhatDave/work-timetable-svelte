import type { Day } from '$lib/mvc/Entity/Day';

const MONTH_COLUMNS = 7;
const MONTH_ROWS = 6;
const MONTH_DAYS = MONTH_COLUMNS * MONTH_ROWS;

export class DayEnumItem {
	ordinal: number;
	value: string;
	short: string;

	constructor(ordinal: number, value: string) {
		this.ordinal = ordinal;
		this.value = value;
		this.short = value.substring(0, 3);
	}
}

export const DayEnum: { [key: number]: DayEnumItem } = {
	0: new DayEnumItem(0, 'Sunday'),
	1: new DayEnumItem(1, 'Monday'),
	2: new DayEnumItem(2, 'Tuesday'),
	3: new DayEnumItem(3, 'Wednesday'),
	4: new DayEnumItem(4, 'Thursday'),
	5: new DayEnumItem(5, 'Friday'),
	6: new DayEnumItem(6, 'Saturday')
};

export function get_days_in_month(month: number, year: number): number {
	// Although months are 0 indexed we are not doing -1 here because we're interested in the next month's 0th day
	// Which is effectively the current month's last day which is effectively the count of days of the current month
	return new Date(year, month, 0).getDate();
}

export function get_day_at(date: Date): DayEnumItem {
	const day: number = date.getUTCDay();
	return DayEnum[day];
}

export function get_first_day_in_month(
	month: number,
	year: number
): DayEnumItem {
	month -= 1;
	// Because this damned time is in whatever the fuck that isn't UTC
	// It displays time in current time I guess??? But it's actually UTC???
	// So the displayed date is actually offset by +1 hours
	// So 00:00 on Feb 02 is actually 23:00 on Feb 01
	// So we have to get the 2nd day (which is actually 23:00 on the 1st) to get the first day
	// Likewise when getting the last day we have to get the 1st day on the next month
	// Which is actually the last day of the current month......................
	// OR we could get the 1st day at 01:00 (which in turn would be 00:00 on the 1st)
	return get_day_at(new Date(year, month, 1, 14));
}

export function getLastDayInMonth(month: number, year: number): DayEnumItem {
	month -= 1;
	// 0th day of the next month is effectively the last day of the current month
	return get_day_at(new Date(year, month + 1, 0, 14));
}

export function get_last_n_days(
	month: number,
	year: number,
	n: number
): Date[] {
	const days: Date[] = [];
	const daysInMonth = get_days_in_month(month, year);
	for (let i = daysInMonth; i > daysInMonth - n; i--) {
		days.push(new Date(year, month - 1, i, 14));
	}
	return days.reverse();
}

export function get_first_n_days(
	month: number,
	year: number,
	n: number
): Date[] {
	const days: Date[] = [];
	// 1 because days are 1 indexed (while months are 0 indexed)
	for (let i = 1; i < n + 1; i++) {
		days.push(new Date(year, month - 1, i, 14));
	}
	return days;
}

export function build_month(month: number, year: number): Day[] {
	const firstDay: DayEnumItem = get_first_day_in_month(month, year);

	const num_previous_month_days: number = firstDay.ordinal;
	// There is NO -1 here because we want the next month's day count (which is effectively month without the -1)
	const num_next_month_days: number =
		MONTH_DAYS - num_previous_month_days - get_days_in_month(month, year);

	const previous_month_days: Date[] = get_last_n_days(
		month - 1,
		year,
		num_previous_month_days
	);
	const next_month_days: Date[] = get_first_n_days(
		month + 1,
		year,
		num_next_month_days
	);

	const days: Date[] = [];
	days.push(...previous_month_days);
	days.push(...get_first_n_days(month, year, get_days_in_month(month, year)));
	days.push(...next_month_days);

	return days.map((date: Date) => {
		return {
			id: '',
			datetime: date,
			date: datetime_to_date(date),
			work_time: [],
			overtime: []
		};
	});
}

export function datetime_to_date(datetime: Date): string {
	return datetime.toISOString().split('T')[0];
}
