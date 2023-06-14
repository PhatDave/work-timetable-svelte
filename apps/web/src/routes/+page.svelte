<script lang="ts">
    import BackdropContainer from '$lib/components/containers/BackdropContainer.svelte';
    import DayService from '$lib/mvc/Service/DayService';
    import type {Day} from '$lib/mvc/Entity/Day';
    import DayComp from '$components/DayComp.svelte';
    import NavigationComp from '$components/NavigationComp.svelte';
    import TotalsComp from '$components/TotalsComp.svelte';
    import {fade} from 'svelte/transition';
    import {user} from '$stores/User';

    const day_service = new DayService();

    let work_date: Date = new Date();
    let promise: Promise<Day[]>;
    $: {
        promise = day_service.get_days_of_month_full(work_date);
    }

    function work_date_update(event: CustomEvent<Date>) {
        work_date = event.detail;
    }

    // ---------------------------------------------------------------------------------
    let username = '';
</script>

<template>
    <div class="form-control flex content-center items-center justify-center">
        <BackdropContainer>
            {#await user.initialize() then _}
                {#if !$user}
                    <form
                            class="flex flex-col content-center bg-transparent text-center"
                            action="#"
                            on:submit|preventDefault>
                        <p class="p-10 text-4xl shadow">Username</p>
                        <input
                                class="input input-bordered h-auto border-2 border-cyan-500 text-5xl"
                                bind:value={username}
                                on:focusout={() => user.login(username)}/>
                        <button
                                class="btn btn-lg btn-primary capitalize"
                                type="submit"
                                on:click={() => user.login(username)}>
                            Login
                        </button>
                    </form>
                {:else}
                    <div class="grid [grid-template-areas:'stack']">
                        {#await promise then days}
                            <div
                                    class="flex-start flex flex-col items-center [grid-area:stack]"
                                    transition:fade={{ duration: 100 }}>
                                <div class="w-100">
                                    <NavigationComp
                                            {work_date}
                                            on:update={work_date_update}/>
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
                    </div>
                {/if}
            {/await}
        </BackdropContainer>
    </div>
</template>
