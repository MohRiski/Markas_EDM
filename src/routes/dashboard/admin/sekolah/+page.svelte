<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Swal from "sweetalert2";

    let id = '';
    let npsn = '';
    let nama = '';
    let alamat = '';
    let akreditasi = '';
    let jenjang_pendidikan = '';
    let status_pendidikan = '';
    let kepala = '';
    let ttd_kepala = '';
    let logoo = '';

    let logo: File;
    let ttd: File;
    let showForm = false;

    function handleFile(event: any) {
        logo = event.target.files[0];
    }

    function handleFile2(event: any) {
        ttd = event.target.files[0];
    }

    async function edit() {
        if (!logo && !ttd) {
            const response = await fetch (`/api/profile_sekolah?id=${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    npsn, nama, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala
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
                await dataSekolah();
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
        } else {
            const response = await fetch (`/api/profile_sekolah?id=${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    npsn, nama, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala
                })
            });
            if (response.ok) {
                if (!ttd) {
                    const formData = new FormData();
                    formData.append('logo', logo);
                    const respon = await fetch (`/api/profile_sekolah/gambar?id=${id}`,{
                        method: "POST",
                        body: formData
                    });
                } else {
                    const formDataa = new FormData();
                    formDataa.append('ttd', ttd);
                    const res = await fetch (`/api/profile_sekolah/ttd?id=${id}`,{
                        method: "POST",
                        body: formDataa
                    });
                }
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
                await dataSekolah();
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
    }

    async function tambah() {
        const response = await fetch (`/api/profile_sekolah`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
               npsn, nama, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala
            })
        });
        if (response.ok) {
            if (!logo && !ttd) {
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
                await dataSekolah();
                showForm = false;
            } else {
                let data = await response.json();
                if (!ttd) {
                    const formData = new FormData();
                    formData.append('logo', logo);
                    const respon = await fetch (`/api/profile_sekolah/gambar?id=${data.data.id_profile_sekolah}`,{
                        method: "POST",
                        body: formData
                    });
                } else {
                    const formDataa = new FormData();
                    formDataa.append('ttd', ttd);
                    const res = await fetch (`/api/profile_sekolah/ttd?id=${data.data.id_profile_sekolah}`,{
                        method: "POST",
                        body: formDataa
                    });
                }
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
                await dataSekolah();
                showForm = false;  
            }
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

    async function dataSekolah() {
		const res = await fetch("/api/profile_sekolah", {
			method: "GET"
		});
		if (res.ok) {
			const result = await res.json();
            const dase = result.data[0];
            id = dase.id_profile_sekolah
            npsn = dase.npsn;
            nama = dase.nama;
			alamat = dase.alamat;
            akreditasi = dase.akreditasi;
            jenjang_pendidikan = dase.jenjang_pendidikan;
            status_pendidikan = dase.status_pendidikan;
            kepala = dase.kepala;
            ttd_kepala = dase.ttd_kepala;
            logoo = dase.logo;
        }
	}

    let loading = true;
    
    onMount(async ()=>{
        try {
        await Promise.all([
            dataSekolah()
        ]);
        } finally {
        loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Sekolah</h2> 
    <button on:click={() => showForm = true} class="text-[12px] h-[20px] bg-white border-2 border-green-400  px-4 mt-1 mr-4 font-semibold rounded hover:bg-green-500 flex hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
        Edit
    </button>
</div>
{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="pl-4 pr-4 pb-2 pt-2">
        <div class="bg-white border border-gray-200 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
        <!-- Form Sekolah -->
        <div class="flex-1 space-y-3">
            <div>
            <label class="block font-semibold">NPSN</label>
            <input type="text" bind:value={npsn} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div>
            <label class="block font-semibold">Nama</label>
            <input type="text" bind:value={nama} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div>
            <label class="block font-semibold">Kepala</label>
            <input type="text" bind:value={kepala} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div>
            <label class="block font-semibold">Alamat</label>
            <input type="text" bind:value={alamat} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div>
            <label class="block font-semibold">Akreditasi</label>
            <input type="text" bind:value={akreditasi} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div>
            <label class="block font-semibold">Jenjang Pendidikan</label>
            <input type="text" bind:value={jenjang_pendidikan} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div>
            <label class="block font-semibold">Status Pendidikan</label>
            <input type="text" bind:value={status_pendidikan} disabled class="w-full h-[36px] border rounded-lg px-3 py-2 bg-white" />
            </div>
        </div>
    
        <!-- Logo -->
        <div class="flex items-center justify-center w-full md:w-1/3 bg-gray-100 rounded-lg p-6">
            <div class="w-40 h-40 rounded-xl bg-white flex items-center justify-center text-center font-bold text-gray-500">
            <img src={`/images/${logoo}`} alt="logo">
            </div>
        </div>
        </div>
    </div>
{/if}
  
<!-- Modal Form -->
{#if showForm}
    {#if id === ""}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade>
            <div class="bg-white p-4 rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
            <h2 class="text-xl font-bold mb-3">Tambah</h2>
        
            <div class="space-y-2 p-2">
                <div>
                    <label class="block font-semibold text-[14px]">NPSN</label>
                    <input type="text" bind:value={npsn} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Nama Madrasah</label>
                    <input type="text" bind:value={nama} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Kepala Madrasah</label>
                    <input type="text" bind:value={kepala} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Alamat</label>
                    <input type="text" bind:value={alamat} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                <label class="block font-semibold text-[14px]">Akreditasi</label>
                <select bind:value={akreditasi} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
                </div>
                <div>
                <label class="block font-semibold text-[14px]">Jenjang</label>
                <select bind:value={jenjang_pendidikan} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="MI">MI</option>
                    <option value="MTS">MTS</option>
                    <option value="MA">MA</option>
                </select>
                </div>
                <div>
                <label class="block font-semibold text-[14px]">Status Pendidikan</label>
                <select bind:value={status_pendidikan} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="Negeri">Negeri</option>
                    <option value="Swasta">Swasta</option>
                </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">TTD Kepala</label>
                    <input type="file" on:change={handleFile2} class="w-full h-[34px] border px-3 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Logo</label>
                    <input type="file" on:change={handleFile} class="w-full h-[34px] border px-3 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" />
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
                    <label class="block font-semibold text-[14px]">NPSN</label>
                    <input type="text" bind:value={npsn} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Nama Madrasah</label>
                    <input type="text" bind:value={nama} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Kepala Madrasah</label>
                    <input type="text" bind:value={kepala} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Alamat</label>
                    <input type="text" bind:value={alamat} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                <label class="block font-semibold text-[14px]">Akreditasi</label>
                <select bind:value={akreditasi} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
                </div>
                <div>
                <label class="block font-semibold text-[14px]">Jenjang</label>
                <select bind:value={jenjang_pendidikan} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="MI">MI</option>
                    <option value="MTS">MTS</option>
                    <option value="MA">MA</option>
                </select>
                </div>
                <div>
                <label class="block font-semibold text-[14px]">Status Pendidikan</label>
                <select bind:value={status_pendidikan} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="Negeri">Negeri</option>
                    <option value="Swasta">Swasta</option>
                </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">TTD Kepala</label>
                    <input type="file" on:change={handleFile2} class="w-full h-[34px] border px-3 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" />
                    <p class="text-[10px]">*kosongi gambar ttd kepala jika tidak ingin di ubah</p>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Logo</label>
                    <input type="file" on:change={handleFile} class="w-full h-[34px] border px-3 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" />
                    <p class="text-[10px]">*kosongi logo jika tidak ingin di ubah</p>
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