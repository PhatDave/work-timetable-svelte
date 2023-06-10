<script lang="ts">
	import ThemeToggle from '$components/theme/ThemeToggle.svelte';
	import {user} from "$stores/User";
	import {faXmark} from "@fortawesome/free-solid-svg-icons";
	import {exit} from "@tauri-apps/api/process";
	import Fa from "svelte-fa";

	Fa;
</script>

<div class="flex h-22 justify-between px-4">
    <div class="flex-1" data-tauri-drag-region>
        {#if $user}
            <button class="btn btn-outline btn-lg m-5 text-4xl items-center content-center normal-case"
                    on:click={user.logout}>
                {$user.name}
            </button>
        {/if}
    </div>

    <div class="flex items-center space-x-4 [&>*:hover]:text-primary [&>*]:transition-all [&>*]:duration-300">
        <ThemeToggle/>
        <button class="p-4" on:click={() => exit(0)}>
            <Fa icon={faXmark} size="1.5x"/>
        </button>
    </div>
</div>
