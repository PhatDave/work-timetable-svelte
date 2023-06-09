<script lang="ts">
    import {api_day, api_overtime, api_work_time} from "$types";

    export let day: api_day;

    let work_hours = day.work_time.reduce((acc: number, work_time: api_work_time) => {
        return acc + work_time.hours;
    }, 0);
    let overtime_hours = day.overtime.reduce((acc: number, overtime: api_overtime) => {
        return acc + overtime.hours;
    }, 0);
</script>

<template>
    <div class="dev flex flex-col p-1 w-[7vw]">
        <div class="text-center font-bold opacity-40 text-lg p-0">
            {day.name.getDate()}.{day.name.getMonth() + 1}.
        </div>
        <div class="text-center font-extrabold text-3xl p-0">
            <span>{work_hours}</span>
            {#if overtime_hours > 0}
                <span class="text-red-500">+ {overtime_hours}</span>
            {/if}
        </div>
    </div>
</template>
