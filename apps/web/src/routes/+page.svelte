<script lang="ts">
	import BackdropContainer from '$lib/components/containers/BackdropContainer.svelte';
	import DayService from "$lib/mvc/Service/DayService";
	import type {Day} from "$lib/mvc/Entity/Day";
	import DayComp from "$components/DayComp.svelte";

	const day_service = new DayService();

	let user = localStorage.getItem("user");
	let logged_in = user !== null;

	function apply_user() {
		console.log(user);
		// Handle this in DB later
	}

	let days: Day[] = [];
	let promise = day_service.get_this_month_days_full();
	promise.then((data: Day[]) => days = data);
</script>

<template>
    <div class="form-control flex-1 items-center justify-center">
        <BackdropContainer>
            {#if !logged_in}
                <div class="content-center text-center flex flex-col bg-transparent">
                    <p class="text-4xl shadow p-10">Username</p>
                    <div class="text-5xl h-auto" contenteditable="true" bind:innerHTML={user}
                         on:focusout={apply_user}></div>
                </div>
            {:else}
                {#await promise}
                    <p>
                        Loading...
                    </p>
                {:then _}
                    <!--                    <NavigationTrayComponent :current-time="currentTime"/>-->
                    <!--                    <HeaderComponent :title="header" v-for="header in headers"/>-->
                    <div class="grid grid-cols-7 gap-1">
                        {#each days as day}
                            <DayComp {day}/>
                        {/each}
                    </div>
                {/await}
            {/if}
        </BackdropContainer>
    </div>
</template>
