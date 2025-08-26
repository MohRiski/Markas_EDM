<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Swal from "sweetalert2";
    
    let id_indikator = '';
    let kode = '';
    let keterangan = '';
    let required: Boolean;

    let id = '';

    let id_indikatorEdit = '';
    let kodeEdit = '';
    let keteranganEdit = '';
    let requiredEdit: Boolean;

    let form = "";
    let showForm = false;

    let keyword = '';
    let filterData: any[] = [];
    function cariData() {
        if (keyword.trim() === '') {
            filterData = bukti_fisik;
        } else {
            filterData = bukti_fisik.filter((item) =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
    }

    let bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const data = await response.json();
        bukti_fisik = data.data;
        filterData = data.data;
    }

    let indikator: any[] = [];
    async function dataIndikator() {
        const response = await fetch(`/api/indikator`, {
            method: 'GET'
        });
        const data = await response.json();
        indikator = data.data;
    }

    let cekIndikator: any[] = [];
    async function indikatorCek(id_indikator: number) {
        const response = await fetch(`/api/bukti_fisik/id_indikator?id=${id_indikator}`, {
            method: 'GET'
        });
        const data = await response.json();
        cekIndikator = data.data;
        const respon = await fetch(`/api/indikator/id?id=${id_indikator}`, {
            method: 'GET'
        });
        const hasil = await respon.json();
        kode = `${hasil.data.kode}.${cekIndikator.length + 1}`;
    }

    async function handleIndikatorChange(event: Event) {
		const selectedValue = Number((event.target as HTMLSelectElement).value);
		await indikatorCek(selectedValue);
	}

    function handleRequiredChange(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		if (value === '1' || value === '') {
            required = true;
        } else {
            required = false;
        }
	}

    function handleRequiredChange2(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		if (value === '1' || value === '') {
            requiredEdit = true;
        } else {
            requiredEdit = false;
        }
	}

    function modalTambah() {
        form = "Tambah"
        showForm = true;
    }

    async function modalEdit(id_bukti_fisik: number) {
        const response = await fetch(`/api/bukti_fisik/id?id=${id_bukti_fisik}`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            id = data.data.id_bukti_fisik;
            id_indikatorEdit = String(data.data.id_indikator);
            kodeEdit = data.data.kode;
            keteranganEdit = data.data.keterangan;
            requiredEdit = data.data.required;
            form = "Edit"
            showForm = true;
        }
    }


    async function edit() {
        if (id_indikatorEdit === "" || kodeEdit === "" || keteranganEdit === "") {
			return;
		}
        const response = await fetch (`/api/bukti_fisik?id=${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id_indikator: id_indikatorEdit, kode: kodeEdit, keterangan: keteranganEdit, required: requiredEdit
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
            await dataBuktiFisik();
            showForm = false;
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Duplikasi Kode data gagal diedit",
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
        if (id_indikator === "" || kode === "" || keterangan === "") {
			return;
		}
        const response = await fetch (`/api/bukti_fisik`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id_indikator, kode, keterangan, required
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
            await dataBuktiFisik();
            id_indikator = '';
            kode = '';
            keterangan = '';
            showForm = false;
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Kode sudah digunakan data gagal di tambahkan" ,
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

    async function hapus(id_bukti_fisik: string) {
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
            const response = await fetch(`/api/bukti_fisik?id=${id_bukti_fisik}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await dataBuktiFisik();
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
            dataBuktiFisik(),
            dataIndikator()
        ]);
        } finally {
            loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Bukti Fisik</h2>
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
            <th class="px-4 py-2 w-[15%]">Indikator</th>
            <th class="px-4 py-2 w-[15%]">Kode</th>
            <th class="px-4 py-2">Keterangan</th>
            <th class="px-4 py-2 w-[5%]">Required</th>
            <th class="px-4 py-2 w-[5%]">Aksi</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            {#each filterData as b}
            <tr class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{b.indikator.kode}</td>
                <td class="px-4 py-2">{b.kode}</td>
                <td class="px-4 py-2 text-wrap">{b.keterangan}</td>
                <td class="px-4 py-2">{b.required ? 'Ya' : 'Tidak'}</td>
                <td class="px-4 py-2 flex gap-2">
                <button title="Edit" on:click={() => modalEdit(b.id_bukti_fisik)} class="text-black hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </button>
                <button title="Hapus" on:click={() => hapus(b.id_bukti_fisik)} class="text-black hover:text-red-600">
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
                    <label class="block font-semibold text-[14px]">Indikator</label>
                    <select bind:value={id_indikator} on:change={handleIndikatorChange} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        {#each indikator as i}
                            <option value={`${i.id_indikator}`}>{i.kode}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Kode</label>
                    <input type="text" bind:value={kode} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Keterangan</label>
                    <input type="text" bind:value={keterangan} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Required</label>
                    <select on:change={handleRequiredChange} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        <option value="1">Ya</option>
                        <option value="0">Tidak</option>
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
                    <label class="block font-semibold text-[14px]">Indikator</label>
                    <select bind:value={id_indikatorEdit} on:change={handleIndikatorChange} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        {#each indikator as i}
                            <option value={`${i.id_indikator}`}>{i.kode}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Kode</label>
                    <input type="text" bind:value={kodeEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Keterangan</label>
                    <input type="text" bind:value={keteranganEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Required</label>
                    <select on:change={handleRequiredChange2} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                        <option value="">-- Pilih --</option>
                        <option value="1" selected={requiredEdit === true}>Ya</option>
                        <option value="0" selected={requiredEdit === false}>Tidak</option>
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