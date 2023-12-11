<script lang="ts">
	import type { Day } from '$lib/Entity/Day';
	import { is_same_day, is_same_month } from '$lib/utils';
	import { get } from 'svelte/store';
	import { work_date } from '$stores/WorkDate';
	import type { Worktime } from '$lib/Entity/Worktime';
	import type { Overtime } from '$lib/Entity/Overtime';
	import {
		create_overtime,
		create_worktime,
		delete_overtime_api,
		delete_worktime_api
	} from '$lib/APIInterface';
	import { days } from '$stores/Days';

	export let day: Day;

	let work_hours = 0;
	let overtime_hours = 0;

	$: {
		work_hours = 0;
		overtime_hours = 0;

		for (let i = 0; i < day.overtime.length; i++) {
			overtime_hours += day.overtime[i].hours;
		}
		for (let i = 0; i < day.work_time.length; i++) {
			work_hours += day.work_time[i].hours;
		}
	}

	const is_current_month = is_same_month(get(work_date), day.datetime);
	const is_current_day = is_same_day(get(work_date), day.datetime);

	const date = String(day.datetime.getDate());
	const month = String(day.datetime.getMonth() + 1);

	async function complete_workday() {
		const worktime = await create_worktime(day, 8);
		if (worktime) {
			day.work_time.push(worktime);
			days.set_day(day);
			day = day;
		}
	}

	let work_time_input = NaN;
	let overtime_input = NaN;
	let overtime_desc_input = '';

	async function add_worktime() {
		if (work_time_input) {
			const worktime = await create_worktime(day, work_time_input);
			if (worktime) {
				day.work_time.push(worktime);
				days.set_day(day);
				day = day;
			}
			work_time_input = NaN;
		}
	}

	async function delete_worktime(worktime: Worktime) {
		const res = await delete_worktime_api(worktime);
		if (res.status === 204) {
			day.work_time = day.work_time.filter(wt => wt.id !== worktime.id);
			days.set_day(day);
			day = day;
		}
	}

	async function add_overtime() {
		if (overtime_input && overtime_desc_input) {
			const overtime = await create_overtime(
				day,
				overtime_input,
				overtime_desc_input
			);
			if (overtime) {
				day.overtime.push(overtime);
				days.set_day(day);
				day = day;
			}
			overtime_input = NaN;
			overtime_desc_input = '';
		}
	}

	async function delete_overtime(overtime: Overtime) {
		const res = await delete_overtime_api(overtime);
		if (res.status === 204) {
			day.overtime = day.overtime.filter(wt => wt.id !== overtime.id);
			days.set_day(day);
			day = day;
		}
	}

	let modal: HTMLDialogElement;
</script>

<template>
	<div
		class="flex h-[11vh] w-[8vw] cursor-pointer select-none flex-col p-1
         {is_current_month
			? 'border-[1px] border-sky-300'
			: 'border-[1px] border-gray-500 opacity-40'}
         {is_current_day ? '!border-2 !border-dashed !border-fuchsia-500' : ''}"
		on:auxclick={complete_workday}
		on:click={() => modal.showModal()}>
		<div
			class="p-0 text-center text-lg font-bold"
			class:text-fuchsia-500={is_current_day}>
			{#if date.length === 1}0{/if}{date}.
			{#if month.length === 1}0{/if}{month}.
		</div>
		<div class="p-0 py-2 text-center text-2xl font-extrabold shadow-2xl">
			<span class:text-sky-500={work_hours >= 8}>{work_hours}</span>
			{#if overtime_hours > 0}
				<span class="text-red-500">+ {overtime_hours}</span>
			{/if}
		</div>
	</div>

	<dialog bind:this={modal} class="modal border-cyan-500">
		<form class="modal-box select-none" method="dialog">
			<div class="form-control gap-y-5">
				<table
					class="dev table-zebra rounded-box mb-4 mt-2 table w-full">
					<thead>
						<tr>
							<th>id</th>
							<th>hours</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						{#each day.work_time as time}
							<tr
								on:click={delete_worktime(time)}
								class="cursor-pointer hover:!bg-pink-500/30">
								<td class="border-fuchsia-500 p-1 font-mono"
									>{time.id}</td>
								<td>{time.hours}h</td>
								<td>
									{#if time.description}
										{@html time.description}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<form on:submit|preventDefault={add_worktime}>
				<input
					autofocus
					bind:value={work_time_input}
					class="input input-sm w-full"
					type="number" />
				<button class="hidden" type="submit" />
			</form>
			<div class="divider" />
			<div class="form-control gap-y-5">
				<table
					class="dev table-zebra rounded-box mb-4 mt-2 table w-full">
					<thead>
						<tr>
							<th>id</th>
							<th>hours</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						{#each day.overtime as time}
							<tr
								on:click={delete_overtime(time)}
								class="cursor-pointer hover:!bg-pink-500/30">
								<td class="border-fuchsia-500 p-1 font-mono"
									>{time.id}</td>
								<td>{time.hours}h</td>
								<td class="flex items-center">
									{#if time.description}
										{@html time.description}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<form on:submit|preventDefault={add_overtime}>
				<input
					autofocus
					bind:value={overtime_input}
					class="input input-sm w-full"
					type="number" />
				<input
					bind:value={overtime_desc_input}
					class="input input-sm w-full"
					type="text" />
				<button class="hidden" type="submit" />
			</form>
		</form>
		<form class="modal-backdrop" method="dialog">
			<button>close</button>
		</form>
	</dialog>
</template>
