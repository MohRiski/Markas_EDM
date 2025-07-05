<script lang="ts">
    import { onMount } from "svelte";
    import Swal from "sweetalert2";
    
    let id = '';
    let nama = '';
    let selectedHakAkses: number[] = [];

    let form = "";
    let showForm = false;

    function toggleHakAkses(id: number) {
        if (selectedHakAkses.includes(id)) {
            selectedHakAkses = selectedHakAkses.filter(i => i !== id);
        } else {
            selectedHakAkses = [...selectedHakAkses, id];
        }
    }


    let keyword = '';
    let filterData: any[] = [];
    function cariData() {
        if (keyword.trim() === '') {
            filterData = pengguna;
        } else {
            filterData = pengguna.filter((item) =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
    }

    let pengguna: any[] = [];
    async function dataPengguna() {
        const response = await fetch(`/api/pengguna`, {
            method: 'GET'
        });
        const data = await response.json();
        pengguna = data.data;
        filterData = data.data;
    }

    let hak_akses: any[] = [];
    async function dataHakAkses() {
        const response = await fetch(`/api/hak_akses`, {
            method: 'GET'
        });
        const data = await response.json();
        hak_akses = data.data;
    }

    async function modalEdit(id_pengguna: number) {
        const response = await fetch(`/api/pengguna/id?id=${id_pengguna}`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            id = data.data.id_pengguna;
            nama = data.data.username; 
            selectedHakAkses = data.data.hak_akses_pengguna.map((item: any) => item.hak_akses.id_hak_akses);
            form = "Edit"
            showForm = true;
        }
    }

    async function simpan() {
        const response = await fetch('/api/hak_akses_pengguna/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_pengguna: parseInt(id), selectedHakAkses
            })
        });
        if (response.ok) {
            Swal.fire({
                title: "Sukses!",
                text: "Data berhasil ditambah",
                icon: "success",
                timer: 3000,
                background: "#28a745",
                color: "#ffffff",
                allowOutsideClick: true,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
            await dataPengguna();
            showForm = false;
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Data gagal ditambah",
                icon: "error",
                timer: 3000,
                background: "#8B0000",
                color: "#ffffff",
                allowOutsideClick: true,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
            showForm = false;
        }
    }
    
    let loading = true;
    
    onMount(async ()=>{
        try {
        await Promise.all([
            dataPengguna(),
            dataHakAkses()
        ]);
        } finally {
            loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Hak Akses Pengguna</h2>
    <div class="flex gap-2 items-center mr-4">
        <div class="flex border rounded-md hover:border-2 hover:border-green-400">
            <input type="text" bind:value={keyword} on:input={cariData} placeholder="Cari Nama..." class="rounded h-[18px] w-[120px] md:w-[200px] text-[12px] px-3 py-1 focus:outline-none focus:ring-0 focus:border-transparent" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </div>
    </div> 
</div>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-4 mr-4 mb-2 mt-2 max-h-[90%] overflow:rounded-r-md">
        <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-sm font-semibold">
            <tr>
            <th class="px-4 py-2 w-[45%]">Nama</th>
            <th class="px-4 py-2 w-[50%]">Hak Akses</th>
            <th class="px-4 py-2 w-[5%]">Aksi</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            {#each filterData as p}
            <tr class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{p.username}</td>
                <td class="px-4 py-2">
                    {#if p.hak_akses_pengguna.length === 0}
                        Belum Memiliki Hak Akses
                    {:else}
                        {p.hak_akses_pengguna.map((hp: { hak_akses: { nama: any; }; }) => hp.hak_akses.nama).join(', ')}
                    {/if}
                </td>              
                <td class="px-4 py-2 flex gap-2">
                <button title="Edit" on:click={() => modalEdit(p.id_pengguna)} class="text-black hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </button>
                </td>
            </tr>
            {/each}
        </tbody>
        </table>
    </div>
{/if}
  
<!-- Modal Form -->
{#if showForm}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-4 rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
            <h2 class="text-xl font-bold mb-3">Edit</h2>
        
            <div class="space-y-2 p-2">
                <div>
                    <label class="block font-semibold text-[14px]">Nama</label>
                    <input type="text" disabled bind:value={nama} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-sm mb-2">Hak Akses:</label>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        {#each hak_akses as akses}
                            <label class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                value={akses.id_hak_akses}
                                checked={selectedHakAkses.includes(akses.id_hak_akses)}
                                on:change={() => toggleHakAkses(akses.id_hak_akses)}
                            />
                            <span>{akses.nama}</span>
                            </label>
                        {/each}
                    </div>
                </div>
            </div>
        
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showForm = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Batal</button>
                <button on:click={simpan} class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
            </div>
            </div>
        </div>
{/if}