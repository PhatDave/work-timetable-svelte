<script lang="ts">
	import BackdropContainer from '$lib/components/containers/BackdropContainer.svelte';
	import DayService from "$lib/mvc/Service/DayService";
	import type {Day} from "$lib/mvc/Entity/Day";
	import DayComp from "$components/DayComp.svelte";
	import NavigationComp from "$components/NavigationComp.svelte";
	import TotalsComp from "$components/TotalsComp.svelte";
	import UserService from "$lib/mvc/Service/UserService";

	const day_service = new DayService();
	const user_service = new UserService();

	localStorage.clear();

	let username = "";
	const stored_user: string | null = localStorage.getItem('user');
	if (stored_user) {
		user_service.update_logged_user(username);
		username = stored_user;
	}

	// TODO: Ask for help tomorrow
	// UserService.is_logged_in() is not triggering update
	// When UserService.logged_user changes

	function apply_user() {
		user_service.update_logged_user(username);
	}

	let days: Day[] = [];
	let work_date: Date = new Date();
	let promise: Promise<Day[]>;
	$: {
		promise = day_service.get_days_of_month_full(work_date);
		promise.then((data: Day[]) => days = data);
	}

	function work_date_update(event: CustomEvent<Date>) {
		work_date = event.detail;
	}

	console.log(UserService.is_logged_in());
</script>

<template>
    <div class="form-control flex content-center items-center justify-center">
        <BackdropContainer>
            {#if !UserService.is_logged_in()}
                <div class="content-center text-center flex flex-col bg-transparent">
                    <p class="text-4xl shadow p-10">Username</p>
                    <div class="text-5xl h-auto border-cyan-500 border-2" contenteditable="true"
                         bind:innerHTML={username}
                         on:focusout={apply_user}></div>
                </div>
            {:else}
                {#await promise}
                    <p class="text-4xl font-extrabold text-red-600 text-center">
                        Loading...
                    </p>
                {:then _}
                    <div class="flex flex-col items-center flex-start">
                        <div class="w-100">
                            <NavigationComp {work_date} on:update={work_date_update}/>
                        </div>
                        <div class="grid grid-cols-7 gap-1">
                            {#each days as day}
                                <DayComp {day} {work_date}/>
                            {/each}
                        </div>
                        <div class="w-100">
                            <TotalsComp {days} {work_date}/>
                        </div>
                    </div>
                    <!--                    <NavigationTrayComponent :current-time="currentTime"/>-->
                    <!--                    <HeaderComponent :title="header" v-for="header in headers"/>-->
                {/await}
            {/if}
        </BackdropContainer>
    </div>
</template>
