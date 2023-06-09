<script lang="ts">
	import type {Day} from "$lib/mvc/Entity/Day";
	import DayService from "$lib/mvc/Service/DayService";

	export let day: Day;

	const day_service = new DayService();

	let work_hours = 0;
	let overtime_hours = 0;

	for (let i = 0; i < day.overtime.length; i++) {
		overtime_hours += day.overtime[i].hours;
	}
	for (let i = 0; i < day.work_time.length; i++) {
		work_hours += day.work_time[i].hours;
	}

	const is_current_month = day_service.is_current_month(day);
	const is_current_day = day_service.is_current_day(day);

	const date = String(day.datetime.getDate());
	const month = String(day.datetime.getMonth() + 1);
</script>

<template>
    <div class="flex flex-col p-1 w-[8vw] h-[12vh]
         {is_current_month ? 'border-[1px] border-sky-300' : 'border-[1px] border-gray-500'}
         {is_current_day ? '!border-2 !border-dashed !border-fuchsia-500' : ''}"
         class:opacity-40={!is_current_month}>
        <div class="text-center font-bold text-lg p-0"
             class:text-fuchsia-500={is_current_day}>
            {#if date.length === 1}0{/if}{date}.
            {#if month.length === 1}0{/if}{month}.
        </div>
        <div class="text-center font-extrabold text-4xl p-0 py-2">
            <span class:text-sky-500={work_hours >= 8}>{work_hours}</span>
            {#if overtime_hours > 0}
                <span class="text-red-500">+ {overtime_hours}</span>
            {/if}
        </div>
    </div>
</template>
