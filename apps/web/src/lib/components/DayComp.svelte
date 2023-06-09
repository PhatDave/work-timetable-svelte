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
</script>

<template>
    <div class="dev flex flex-col p-1 w-[7vw]">
        <div class="text-center font-bold text-lg p-0 {day_service.is_current_month(day) ? '': 'opacity-40'}">
            {day.datetime.getDate()}.{day.datetime.getMonth() + 1}.
        </div>
        <div class="text-center font-extrabold text-3xl p-0">
            <span>{work_hours}</span>
            {#if overtime_hours > 0}
                <span class="text-red-500">+ {overtime_hours}</span>
            {/if}
        </div>
    </div>
</template>
