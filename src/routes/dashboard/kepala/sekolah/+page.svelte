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
    let logoo = '';

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
            logoo = dase.logo;
        }
	}
    
  let loading = true;
    onMount(async()=>{
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