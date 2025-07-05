<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Swal from "sweetalert2";
    
    let id_profile_sekolah = '';
    let tahun = '';
    let status = '';

    let id = '';

    let id_profile_sekolahEdit = '';
    let tahunEdit = '';
    let statusEdit = '';

    let form = "";
    let showForm = false;

    let keyword = '';
    let filterData: any[] = [];
    function cariData() {
        if (keyword.trim() === '') {
            filterData = tahun_akademik;
        } else {
            filterData = tahun_akademik.filter((item) =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
    }

    let tahun_akademik: any[] = [];
    async function dataTahunAkademik() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        tahun_akademik = data.data;
        filterData = data.data;
    }

    let sekolah: any[] = [];
    async function dataSekolah() {
        const response = await fetch(`/api/profile_sekolah`, {
            method: 'GET'
        });
        const data = await response.json();
        sekolah = data.data;
    }

    function modalTambah() {
        form = "Tambah"
        showForm = true;
    }

    async function modalEdit(id_tahun_akademik: number) {
        const response = await fetch(`/api/tahun_akademik/id?id=${id_tahun_akademik}`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            id = data.data.id_tahun_akademik;
            id_profile_sekolahEdit = String(data.data.id_profile_sekolah);
            tahunEdit = data.data.tahun;
            statusEdit = data.data.status;
            form = "Edit"
            showForm = true;
        }
    }


    async function edit() {
        if (id_profile_sekolahEdit === "" || statusEdit === "" || tahunEdit === "") {
			return;
		}
        const response = await fetch (`/api/tahun_akademik?id=${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id_profile_sekolah: id_profile_sekolahEdit, tahun: tahunEdit, status: statusEdit
            })
        });
        if (response.ok) {
            Swal.fire({
                title: "Sukses!",
                text: "Edit data berhasil dilakukan",
                icon: "success",
                timer: 3000,
                background: "#28a745",
                color: "#ffffff",
                allowOutsideClick: true,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
            await dataTahunAkademik();
            showForm = false;
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Edit data gagal dilakukan",
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

    async function tambah() {
        if (id_profile_sekolah === "" || tahun === "" || status === "") {
			return;
		}
        const response = await fetch (`/api/tahun_akademik`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id_profile_sekolah, tahun, status
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
            await dataTahunAkademik();
            id_profile_sekolah = '';
            tahun = '';
            status = '';
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

    async function hapus(id_tahun_akademik: string) {
        const result = await Swal.fire({
            title: 'Yakin Di Hapus ?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            width: 300
        });
        if (result.isConfirmed) {
            const response = await fetch(`/api/tahun_akademik?id=${id_tahun_akademik}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await dataTahunAkademik();
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil dihapus",
                    icon: "success",
                    timer: 3000,
                    background: "#28a745",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });           
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Data gagal dihapus",
                    icon: "error",
                    timer: 3000,
                    background: "#8B0000",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
            } 
        }
    }
    
    let loading = true;
    
    onMount(async ()=>{
        try {
        await Promise.all([
            dataTahunAkademik(),
            dataSekolah()
        ]);
        } finally {
            loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Tahun Akademik</h2>
    <div class="flex gap-2 items-center mr-4">
        <div class="flex border rounded-md hover:border-2 hover:border-green-400">
            <input type="text" bind:value={keyword} on:input={cariData} placeholder="Cari..." class="rounded h-[18px] w-[120px] md:w-[200px] text-[12px] px-3 py-1 focus:outline-none focus:ring-0 focus:border-transparent" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </div>
        <button on:click={modalTambah} class="text-[12px] h-[20px] bg-white border-2 border-green-400  px-2 font-semibold rounded hover:bg-green-500 flex hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus-icon lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            Tambah
        </button>
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
            <th class="px-4 py-2">Tahun</th>
            <th class="px-4 py-2 w-[20%]">Status</th>
            <th class="px-4 py-2 w-[5%]">Aksi</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            {#each filterData as t}
            <tr class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{t.tahun}</td>
                <td class="px-4 py-2">{t.status === "Aktif" ? "Aktif": "Tidak Aktif"}</td>
                <td class="px-4 py-2 flex gap-2">
                <button title="Edit" on:click={() => modalEdit(t.id_tahun_akademik)} class="text-black hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </button>
                <button title="Hapus" on:click={() => hapus(t.id_tahun_akademik)} class="text-black hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
    {#if form === "Tambah"}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade>
            <div class="bg-white p-4 rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
            <h2 class="text-xl font-bold mb-3">Tambah</h2>
        
            <div class="space-y-2 p-2">
                <div>
                    <label class="block font-semibold text-[14px]">Sekolah</label>
                    <select bind:value={id_profile_sekolah} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        {#each sekolah as s}
                            <option value={`${s.id_profile_sekolah}`}>{s.nama}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Tahun</label>
                    <input type="number" bind:value={tahun} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Status</label>
                    <select bind:value={status} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak_Aktif">Tidak Aktif</option>
                    </select>
                </div>
            </div>
        
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showForm = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Batal</button>
                <button on:click={tambah} class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
            </div>
            </div>
        </div>
    {:else}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade>
            <div class="bg-white p-4 rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
            <h2 class="text-xl font-bold mb-3">Edit</h2>
        
            <div class="space-y-2 p-2">
                <div>
                    <label class="block font-semibold text-[14px]">Sekolah</label>
                    <select bind:value={id_profile_sekolahEdit} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        {#each sekolah as s}
                            <option value={`${s.id_profile_sekolah}`}>{s.nama}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Tahun</label>
                    <input type="number" bind:value={tahunEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Status</label>
                    <select bind:value={statusEdit} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak_Aktif">Tidak Aktif</option>
                    </select>
                </div>
            </div>
        
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showForm = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Batal</button>
                <button on:click={edit} class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
            </div>
            </div>
        </div>
    {/if}
{/if}