<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import DayService from '$lib/mvc/Service/DayService';

    export let work_date: Date;

    let display_string = work_date.toISOString().split('T')[0];
    display_string =
        display_string.split('-')[0] + '-' + display_string.split('-')[1];

    const dispatcher = createEventDispatcher();

    function month_forward() {
        work_date.setMonth(work_date.getMonth() + 1);
        do_update();
    }

    function month_backward() {
        work_date.setMonth(work_date.getMonth() - 1);
        do_update();
    }

    function do_update() {
        dispatcher('update', work_date);
    }

    let is_current_month = DayService.is_same_month(
        work_date,
        DayService.cached_now
    );
</script>

<template>
    <div class="flex select-none justify-between py-4">
        <button
                class="btn btn-outline w-[20vw] text-lg"
                on:click={month_backward}>&lt&lt&lt
        </button>
        <h1
                class="content-center px-8 text-center text-4xl font-bold"
                class:text-emerald-500={is_current_month}>
            {display_string}
        </h1>
        <button
                class="btn btn-outline w-[20vw] text-lg"
                on:click={month_forward}>&gt&gt&gt
        </button>
    </div>
</template>
