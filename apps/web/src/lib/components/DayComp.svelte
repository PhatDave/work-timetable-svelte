<script lang="ts">
	import type {Day} from "$lib/mvc/Entity/Day";
	import DayService from "$lib/mvc/Service/DayService";
	import WorktimeService from "$lib/mvc/Service/WorktimeService";
	import type {Worktime} from "$lib/mvc/Entity/Worktime";

	export let day: Day;
	export let work_date: Date = DayService.cached_now;

	const worktime_service = new WorktimeService();

	let work_hours = 0;
	let overtime_hours = 0;

	$: {
		for (let i = 0; i < day.overtime.length; i++) {
			overtime_hours += day.overtime[i].hours;
		}
		for (let i = 0; i < day.work_time.length; i++) {
			work_hours += day.work_time[i].hours;
		}
	}

	// const is_current_month = day_service.is_current_month(day);
	// const is_current_day = day_service.is_current_day(day);

	const is_current_month = DayService.is_same_month(work_date, day.datetime);
	const is_current_day = DayService.is_same_day(work_date, day.datetime);

	const date = String(day.datetime.getDate());
	const month = String(day.datetime.getMonth() + 1);

	function complete_workday() {
		worktime_service.create(8, day).then((worktime: Worktime) => {
			day.work_time.push(worktime);
			day = day;
		});
	}
</script>

<template>
    <div class="flex flex-col p-1 w-[8vw] h-[11vh] select-none
         {is_current_month ? 'border-[1px] border-sky-300' : 'border-[1px] border-gray-500 opacity-40'}
         {is_current_day ? '!border-2 !border-dashed !border-fuchsia-500' : ''}"
         on:dblclick={complete_workday}>
        <div class="text-center font-bold text-lg p-0"
             class:text-fuchsia-500={is_current_day}>
            {#if date.length === 1}0{/if}{date}.
            {#if month.length === 1}0{/if}{month}.
        </div>
        <div class="text-center font-extrabold shadow-2xl text-4xl p-0 py-2">
            <span class:text-sky-500={work_hours >= 8}>{work_hours}</span>
            {#if overtime_hours > 0}
                <span class="text-red-500">+ {overtime_hours}</span>
            {/if}
        </div>
    </div>
</template>
