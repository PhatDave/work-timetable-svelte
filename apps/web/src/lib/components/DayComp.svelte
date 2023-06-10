<script lang="ts">
	import type {Day} from "$lib/mvc/Entity/Day";
	import DayService from "$lib/mvc/Service/DayService";
	import WorktimeService from "$lib/mvc/Service/WorktimeService";
	import type {Worktime} from "$lib/mvc/Entity/Worktime";
	import OvertimeService from "$lib/mvc/Service/OvertimeService";
	import type {Overtime} from "$lib/mvc/Entity/Overtime";

	export let day: Day;
	export let work_date: Date = DayService.cached_now;

	const worktime_service = new WorktimeService();
	const overtime_service = new OvertimeService();

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

	// const is_current_month = day_service.is_current_month(day);
	// const is_current_day = day_service.is_current_day(day);

	const is_current_month = DayService.is_same_month(work_date, day.datetime);
	const is_current_day = DayService.is_same_day(work_date, day.datetime);

	const date = String(day.datetime.getDate());
	const month = String(day.datetime.getMonth() + 1);

	async function complete_workday() {
		const worktime: Worktime = await worktime_service.create(8, day);
		day.work_time.push(worktime);
		day = day;
	}

	let work_time_input = NaN;
	let overtime_input = NaN;
	let overtime_desc_input = "";

	async function add_worktime() {
		const worktime: Worktime = await worktime_service.create(work_time_input, day)
		day.work_time.push(worktime);
		day = day;
		work_time_input = NaN;
	}

	async function delete_worktime(worktime: Worktime) {
		await worktime_service.delete(worktime.id);
		day.work_time = day.work_time.filter(wt => wt.id !== worktime.id);
		day = day;
		work_time_input = NaN;
	}

	async function add_overtime() {
		const overtime: Overtime = await overtime_service.create(overtime_input, overtime_desc_input, day)
		day.overtime.push(overtime);
		day = day;
		overtime_input = NaN;
		overtime_desc_input = "";
	}

	async function delete_overtime(worktime: Overtime) {
		await overtime_service.delete(worktime.id);
		day.overtime = day.overtime.filter(wt => wt.id !== worktime.id);
		day = day;
		overtime_input = NaN;
		overtime_desc_input = "";
	}

	let modal: HTMLDialogElement;
</script>

<template>
    <div class="flex flex-col p-1 w-[8vw] h-[11vh] select-none cursor-pointer
         {is_current_month ? 'border-[1px] border-sky-300' : 'border-[1px] border-gray-500 opacity-40'}
         {is_current_day ? '!border-2 !border-dashed !border-fuchsia-500' : ''}"
         on:auxclick={complete_workday}
         on:click={() => modal.showModal()}>
        <div class="text-center font-bold text-lg p-0"
             class:text-fuchsia-500={is_current_day}>
            {#if date.length === 1}0{/if}{date}.
            {#if month.length === 1}0{/if}{month}.
        </div>
        <div class="text-center font-extrabold shadow-2xl text-2xl p-0 py-2">
            <span class:text-sky-500={work_hours >= 8}>{work_hours}</span>
            {#if overtime_hours > 0}
                <span class="text-red-500">+ {overtime_hours}</span>
            {/if}
        </div>
    </div>

    <dialog bind:this={modal} class="modal border-cyan-500">
        <form class="modal-box select-none" method="dialog">
            <div class="form-control gap-y-5">
                <table class="dev w-full table table-zebra rounded-box mt-2 mb-4">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>hours</th>
                        <th>description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each day.work_time as time}
                        <tr on:click={delete_worktime(time)} class="hover:!bg-pink-500/30 cursor-pointer">
                            <td class="p-1 border-fuchsia-500 font-mono">{time.id}</td>
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
                <input autofocus bind:value={work_time_input}
                       class="input input-sm w-full"
                       type="number">
                <button class="hidden" type="submit"></button>
            </form>
            <div class="divider"></div>
            <div class="form-control gap-y-5">
                <table class="dev w-full table table-zebra rounded-box mt-2 mb-4">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>hours</th>
                        <th>description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each day.overtime as time}
                        <tr on:click={delete_overtime(time)} class="hover:!bg-pink-500/30 cursor-pointer">
                            <td class="p-1 border-fuchsia-500 font-mono">{time.id}</td>
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
                <input autofocus bind:value={overtime_input}
                       class="input input-sm w-full"
                       type="number">
                <input bind:value={overtime_desc_input}
                       class="input input-sm w-full"
                       type="text">
                <button class="hidden" type="submit"></button>
            </form>
        </form>
        <form class="modal-backdrop" method="dialog">
            <button>close</button>
        </form>
    </dialog>
</template>
