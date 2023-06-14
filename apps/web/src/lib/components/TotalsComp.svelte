<script lang="ts">
	import type { Day } from '$lib/mvc/Entity/Day';
	import DayService from '$lib/mvc/Service/DayService';

	export let days: Day[];
	export let work_date: Date = DayService.cached_now;

	let work_hours = 0;
	let overtime_hours = 0;

	for (let i = 0; i < days.length; i++) {
		const day = days[i];
		if (DayService.is_same_month(day.datetime, work_date) === false) {
			continue;
		}
		for (let i = 0; i < day.overtime.length; i++) {
			overtime_hours += day.overtime[i].hours;
		}
		for (let i = 0; i < day.work_time.length; i++) {
			work_hours += day.work_time[i].hours;
		}
	}
</script>

<template>
	<div class="select-none py-3 text-5xl font-extrabold shadow-2xl">
		<span class="text-sky-500">{work_hours}</span>
		<span class="text-red-500">+ {overtime_hours}</span>
	</div>
</template>
