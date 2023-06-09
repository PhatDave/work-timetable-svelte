<script lang="ts">
	import {createEventDispatcher} from "svelte";

	export let work_date: Date;

	let display_string = work_date.toISOString().split("T")[0];
	display_string = display_string.split("-")[0] + "-" + display_string.split("-")[1];

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
</script>

<template>
    <div class="flex justify-between py-4">
        <button class="btn text-lg btn-outline w-[20vw]" on:click={month_backward}>&lt&lt&lt</button>
        <h1 class="text-4xl content-center text-center font-bold px-8">{display_string}</h1>
        <button class="btn text-lg btn-outline w-[20vw]" on:click={month_forward}>&gt&gt&gt</button>
    </div>
</template>
