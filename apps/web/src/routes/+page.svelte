<script lang="ts">
    import BackdropContainer from '$lib/components/containers/BackdropContainer.svelte';
    import NavigationComp from '$components/NavigationComp.svelte';
    import TotalsComp from '$components/TotalsComp.svelte';
    import {fade} from 'svelte/transition';
    import {user} from '$stores/User';
    import {days} from "$stores/Days";
    import {get_api_days} from "$lib/APIInterface";
    import {work_date} from "$stores/WorkDate";
    import {onDestroy} from "svelte";
    import DayComp from "$components/DayComp.svelte";

    let user_init_promise = user.initialize();

    async function do_update() {
        const data = await get_api_days();
        days.set(data);
    }

    const work_date_unsubscribe = work_date.subscribe(do_update);
    const user_unsubscribe = user.subscribe(do_update);

    onDestroy(() => {
        work_date_unsubscribe();
        user_unsubscribe();
    });

    // ---------------------------------------------------------------------------------
    let username = '';
</script>

<template>
    <div class="form-control flex content-center items-center justify-center">
        <BackdropContainer>
            {#await user_init_promise then _}
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
                        <div
                                class="flex-start flex flex-col items-center [grid-area:stack]"
                                transition:fade={{ duration: 100 }}>
                            <div class="w-100">
                                <NavigationComp/>
                            </div>
                            <div class="grid grid-cols-7 gap-1">
                                {#each $days as day}
                                    <DayComp {day}/>
                                {/each}
                            </div>
                            <div class="w-100">
                                <TotalsComp/>
                            </div>
                        </div>
                    </div>
                {/if}
            {/await}
        </BackdropContainer>
    </div>
</template>
