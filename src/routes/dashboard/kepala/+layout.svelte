<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let isSidebarOpen = true;
    let isHakOpen = false;
    let hakAksesMap = {
        "Admin Madrasah": "admin",
        "Kepala Madrasah": "kepala",
        "Operator Kesiswaan": "kesiswaan",
        "Operator Keuangan": "keuangan",
    } as const;
    type HakAksesKey = keyof typeof hakAksesMap;

    let username = "";
    let foto = "";
    let hakses: string[];

    async function logout() {
		const response = await fetch (`/api/logout`, {
			method: "POST",
			headers: {"Content-Type": "application/json"}
		});
        if (response.ok) {
            goto('/');
        }
	}

    async function data() {
		await new Promise(resolve => setTimeout(resolve, 1000));
		const res = await fetch("/api/me", {
			method: "GET",
			credentials: "include"
		});
		if (res.ok) {
			const result = await res.json();
            username = result.user.username;
            foto = result.user.foto;
            hakses = result.user.hak_akses;
        }
	}

    onMount(async ()=>{
        await data();
    });
</script>

    <div class="flex flex-col h-screen bg-white font-poppins">
        <!-- Header -->
        <header class="flex items-center justify-between bg-green-800 text-white px-6 py-4 shadow-md border-b border-gray-600 z-10">
            <div class="flex items-center space-x-4">
                <h1 class="text-2xl font-bold">MARKAS EDM</h1>
                <button class="md:hidden" on:click={() => (isSidebarOpen = !isSidebarOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div class="flex items-center space-x-3">
                <button title="user" on:click={() => (isHakOpen = !isHakOpen)} class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-green-100 mr-2">
                        <img src={`/images/${foto}`} alt="foto" class="w-8 h-8 rounded-full">
                    </div>
                    <span class="font-semibold">{username}</span>
                </button>
                <button title="Logout" on:click={logout} class="pl-2 md:pl-6 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-power-icon lucide-power"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
                </button>
            </div>
        </header>

        <!-- Hak Akses -->
        <div class={`bg-green-800 text-white absolute rounded-b-sm shadow-md right-0 mr-16 md:mr-20 p-1 top-14 z-10 ${isHakOpen ? 'block' : 'hidden'}`}>
            <nav class="text-[11px]">
                {#each hakses as ha}
                    <a href={`/dashboard/${hakAksesMap[ha as HakAksesKey]}`} class="flex items-center space-x-2 hover:text-green-200 border-b border-gray-400">
                        {ha}
                    </a>
                {/each}
            </nav>
        </div>
    
        <!-- Konten di bawah header -->
        <div class="flex flex-1 min-h-0 overflow-hidden">
        <!-- Sidebar -->
            <aside class={`bg-green-600 text-gray-800 border-r border-gray-600 w-64 p-4 space-y-6 overflow-auto ${isSidebarOpen ? 'block' : 'hidden md:block'} `}>
                <div class="flex flex-col items-center space-y-2 border-b border-gray-400 pb-4">
                    <div class="w-24 h-24 rounded-full bg-white">
                        <img src={`/images/${foto}`} alt="foto" class="rounded-full w-24 h-24">
                    </div>
                    <p class="font-bold text-center">{username}</p>
                    <p class="text-sm text-gray-600">Kepala Madrasah</p>
                </div>
                <nav class="space-y-3 text-[13px] font-semibold">
                    <a href="/dashboard/kepala" class="flex items-center space-x-2 hover:text-green-600 hover:rounded-md hover:px-2 hover:bg-white hover:shadow-md hover:shadow-white hover:border-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        <p class="mt-1 ">Dashboard</p>
                    </a>
                    <a href="/dashboard/kepala/sekolah" class="flex items-center space-x-2 hover:text-green-600 hover:rounded-md hover:px-2 hover:bg-white hover:shadow-md hover:shadow-white hover:border-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 lucide lucide-layout-grid-icon lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                        <p class="mt-1">Sekolah</p>
                    </a>
                    <a href="/dashboard/kepala/operator" class="flex items-center space-x-2 hover:text-green-600 hover:rounded-md hover:px-2 hover:bg-white hover:shadow-md hover:shadow-white hover:border-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-user-icon lucide-square-user"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                        <p class="mt-1">Operator</p>
                    </a>
                    <a href="/dashboard/kepala/bukti_fisik" class="flex items-center space-x-2 hover:text-green-600 hover:rounded-md hover:px-2 hover:bg-white hover:shadow-md hover:shadow-white hover:border-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-icon lucide-book"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                        <p class="mt-1">Bukti Fisik</p>
                    </a>
                </nav>
            </aside>
    
        <!-- Konten Utama -->
            <main class="flex-1 overflow-auto p-2">
                <slot/>
            </main>
        </div>
    
    </div>