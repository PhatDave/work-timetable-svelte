<script lang="ts">
    import {days} from "$stores/Days";
    import {now} from "$stores/Now";
    import {is_same_month} from "$lib/utils";
    import {onDestroy} from "svelte";
    import type {Day} from "$lib/Entity/Day";

    let work_hours = 0;
    let overtime_hours = 0;

    let test: {
        set: (this: void, value: Day[]) => void;
        subscribe: (this: void, run: Subscriber<Day[]>, invalidate?: Invalidator<Day[]>) => Unsubscriber;
        update: (this: void, updater: Updater<Day[]>) => void;
        set_day: (day: Day) => void
    } = $days;

    function recalculate() {
        work_hours = 0;
        overtime_hours = 0;

        for (const day of $days) {
            if (is_same_month(day.datetime, $now) === false) {
                continue;
            }

            work_hours += day.work_time.reduce((acc, work_time) => acc + work_time.hours, 0);
            overtime_hours += day.overtime.reduce((acc, overtime) => acc + overtime.hours, 0);
        }
    }

    const unsubscribe = days.subscribe(recalculate);
    onDestroy(unsubscribe);
</script>

<template>
    <div class="select-none py-3 text-5xl font-extrabold shadow-2xl">
        <span class="text-sky-500">{work_hours}</span>
        <span class="text-red-500">+ {overtime_hours}</span>
    </div>
</template>
