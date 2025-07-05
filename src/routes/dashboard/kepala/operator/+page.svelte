<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Swal from "sweetalert2";

    let pengguna: any[] = [];
    let penggunaOperator: any[] = [];

    async function dataOperator() {
      const res = await fetch("/api/pengguna", {
        method: "GET"
      });

      if (res.ok) {
        const result = await res.json();
        pengguna = result.data;
        penggunaOperator = pengguna.filter(p =>
          p.hak_akses_pengguna?.some((hp: { hak_akses: { nama: string; }; }) =>
            ["Operator Kesiswaan", "Operator Keuangan"].includes(hp.hak_akses?.nama)
          )
        );
      }
    }

    
    let loading = true;
    onMount(async()=>{
        try {
        await Promise.all([
          dataOperator()
        ]);
        } finally {
            loading = false;
        }  
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Operator</h2> 
</div>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
  {#each penggunaOperator as p}
  <div class="pl-4 md:pl-8 pr-4 md:pr-8 pb-2 pt-2">
      <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
        <!-- foto -->
        <div class="flex items-center justify-center h-[190px] w-full md:w-1/3 bg-gray-100 rounded-lg p-6">
          <div>
            <div class="flex items-center justify-center text-center font-bold text-gray-500">
              <img src={`/images/${p.foto}`} alt="logo" class="h-[120px] w-[100px] rounded-lg">
            </div>
            <p class="text-center mt-2 font-semibold">{p.username}</p>
          </div>
        </div>
        <!-- Form Sekolah -->
        <div class="flex-1 space-y-3 md:pt-4">
          <div class="flex border-b">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {#each p.hak_akses_pengguna as hp}
              {#if hp.hak_akses.nama.includes('Operator')}
                <p class="ml-2 pb-1">{hp.hak_akses.nama}</p>
              {/if}
            {/each}
          </div>
          <div class="flex border-b">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            <p class="ml-2 pb-1">{p.alamat}</p>
          </div>
          <div class="flex border-b">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
            <p class="ml-2 pb-1">{p.email}</p>
          </div>
          <div class="flex border-b">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
            <p class="ml-2 pb-1">{p.no_hp}</p>
          </div>
        </div>
      </div>
  </div>
  {/each}
{/if}