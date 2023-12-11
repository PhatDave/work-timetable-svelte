import { now } from '$stores/Now';
import { get } from 'svelte/store';

export function is_current_month(datetime: Date) {
	return (
		datetime.getMonth() === get(now).getMonth() &&
		datetime.getFullYear() === get(now).getFullYear()
	);
}

export function is_current_day(datetime: Date) {
	return (
		datetime.getDate() === get(now).getDate() &&
		datetime.getMonth() === get(now).getMonth() &&
		datetime.getFullYear() === get(now).getFullYear()
	);
}

export function is_same_month(datetime1: Date, datetime2: Date) {
	return (
		datetime1.getMonth() === datetime2.getMonth() &&
		datetime1.getFullYear() === datetime2.getFullYear()
	);
}

export function is_same_day(datetime1: Date, datetime2: Date) {
	return (
		datetime1.getDate() === datetime2.getDate() &&
		datetime1.getMonth() === datetime2.getMonth() &&
		datetime1.getFullYear() === datetime2.getFullYear()
	);
}
