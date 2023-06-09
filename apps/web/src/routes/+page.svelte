<script lang="ts">
    import BackdropContainer from '$lib/components/containers/BackdropContainer.svelte';
    import DayService from "$lib/mvc/Service/DayService";

    let user = localStorage.getItem("user");
    let logged_in = user !== null;

    function apply_user() {
        console.log(user);
        // Handle this in DB later
    }

    const day_service = new DayService();
    let promise = day_service.get_this_month_days_full();
    promise.then(days => console.log(days));
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
                    <!--            <NavigationTrayComponent :current-time="currentTime"/>-->
                    <div>
                        <!--                <HeaderComponent :title="header" v-for="header in headers"/>-->
                        <div class="grid grid-cols-7 gap-1">
                            <!--{#each api_days as day}-->
                            <!--    <slot class="grid">-->
                            <!--        <Day {day} class="day"/>-->
                            <!--    </slot>-->
                            <!--{/each}-->
                        </div>
                    </div>
                {/await}
            {/if}
        </BackdropContainer>
    </div>
</template>
