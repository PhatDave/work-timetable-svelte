<script lang="ts">
	import { work_date } from '$stores/WorkDate';
	import { is_current_month } from '$lib/utils';
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';

	let display_string;
	let is_current_month_val;
	let unsubscribe = work_date.subscribe(value => {
		display_string = value.toISOString().split('T')[0];
		display_string =
			display_string.split('-')[0] + '-' + display_string.split('-')[1];
		is_current_month_val = is_current_month(get(work_date));
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<template>
	<div class="flex select-none justify-between py-4">
		<button
			class="btn btn-outline w-[20vw] text-lg"
			on:click={work_date.backward}
			>&lt&lt&lt
		</button>
		<h1
			class="content-center px-8 text-center text-4xl font-bold"
			class:text-emerald-500={is_current_month_val}>
			{display_string}
		</h1>
		<button
			class="btn btn-outline w-[20vw] text-lg"
			on:click={work_date.forward}
			>&gt&gt&gt
		</button>
	</div>
</template>
