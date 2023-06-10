<script lang="ts">
	import ThemeToggle from '$components/theme/ThemeToggle.svelte';
	import {user} from "$stores/User";
</script>

<div class="flex h-20 items-center justify-between px-4" data-tauri-drag-region>
    <nav>
        <ul class="flex gap-x-8 text-3xl font-bold [&_a:hover]:text-primary [&_a]:transition-colors">
            <li>
                <a href="/route1"> Route1 </a>
            </li>
            <li>
                <a href="/route2"> Route2 </a>
            </li>
        </ul>
    </nav>

    {#if $user}
        <button class="btn btn-outline" on:click={user.logout}>
            {$user.name}
        </button>
    {/if}
    <div class="flex items-center space-x-4 [&>*:hover]:text-primary [&>*]:transition-all [&>*]:duration-300">
        <ThemeToggle/>
    </div>
</div>
