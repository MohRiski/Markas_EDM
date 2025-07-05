<script lang="ts">
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

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
    let cek_bukti_fisik: any[] = [];
    let semua_bukti: any[] = [];
    let all_bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const res = await response.json();
        const filtered = res.data.filter((item: any) =>
            item.input_bukti_fisik.length > 0 &&
            item.input_bukti_fisik.some((ibf: any) => ibf.status === 'Diterima')
        );

        const filtered2 = res.data.filter((item: any) =>
            item.input_bukti_fisik.some((ibf: any) => {
                const tanggal = new Date(ibf.tanggal_input);
                return tanggal.getFullYear() === year;
            })
        );

        cek_bukti_fisik = res.data.filter((item: any) =>item.input_bukti_fisik.length > 0);

        all_bukti_fisik = filtered;
        bukti_fisik = filtered;
        filterData = filtered;
        semua_bukti = filtered2;
        await filterIndikatorDiterima();
    }

    async function filterDataTahun() {
        const filtered = all_bukti_fisik.filter((item: any) =>
            item.input_bukti_fisik.some((ibf: any) => {
                const tanggal = new Date(ibf.tanggal_input);
                return tanggal.getFullYear() === year;
            })
        );

        bukti_fisik = filtered;
        filterData = filtered;
        await filterIndikatorDiterima();
    }

    let tahun_akademik: any[] = [];
    async function dataTahunAkademik() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        tahun_akademik = data.data;
    }

    let year: number;
    async function yearOnly() {
        const date = new Date();
        year = date.getFullYear();
    }

    async function kunci(id_input_bukti_fisik: any, kunci: boolean) {
        const response = await fetch(`/api/input_bukti_fisik/update_kunci?id=${id_input_bukti_fisik}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                kunci: kunci
            })
        });
        if (response.ok) {
            Swal.fire({
                title: "Sukses!",
                text: "Data berhasil dikunci",
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
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Data gagal dikunci",
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

    let filter = 'bukti';
    let indikatorDiterima: string[] = [];
    async function filterIndikatorDiterima() {
        const mapIndikator: Record<string, any[]> = {};

        for (const item of semua_bukti) {
            const kodeIndikator = item.kode?.split('.')[0];
            if (!kodeIndikator) continue;

            if (!mapIndikator[kodeIndikator]) {
                mapIndikator[kodeIndikator] = [];
            }
            mapIndikator[kodeIndikator].push(item);
        }

        indikatorDiterima = [];

        for (const [kode, items] of Object.entries(mapIndikator)) {
            const semuaDiterima = items.every((item: any) => {
                return item.input_bukti_fisik.some((ibf: any) => {
                    const tahun = new Date(ibf.tanggal_input).getFullYear();
                    return tahun === year && ibf.status === 'Diterima';
                });
            });

            if (semuaDiterima) {
                indikatorDiterima.push(kode);
            }
        }
    }

    function semuaSudahTerkunci(indikator: string): boolean {
        const buktiIndikator = semua_bukti.filter((item: any) =>
            item.kode?.startsWith(indikator)
        );
        if (buktiIndikator.length === 0) return false;
        return buktiIndikator.every((item: any) =>
            item.input_bukti_fisik.every((ibf: any) => ibf.kunci === true)
        );
    }

    async function kunciIndikator(indikator: string, status: boolean) {
        const response = await fetch('/api/input_bukti_fisik/kunci_indikator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                indikator,
                kunci: status,
                tahun: year
            })
        });
        if (response.ok) {
            Swal.fire({
                title: "Sukses!",
                text: `Semua data dengan indikator ${indikator} berhasil dikunci`,
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
            filter = '';
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Data gagal dikunci",
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

    let loading = true;
    
    onMount(async ()=>{
        try {
        await Promise.all([
            yearOnly(),
            dataBuktiFisik(),
            dataTahunAkademik(),
            filterDataTahun(),
        ]);
        } finally {
            loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Kunci Inputan Bukti Fisik</h2>
    <div class="flex gap-2 items-center mr-4">
        <div class="flex border rounded-md hover:border-2 hover:border-green-400">
            <input type="text" bind:value={keyword} on:input={cariData} placeholder="Cari..." class="rounded h-[18px] w-[120px] md:w-[200px] text-[12px] px-3 py-1 focus:outline-none focus:ring-0 focus:border-transparent" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </div>
    </div> 
</div>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="flex justify-between ml-4 mt-4 mr-4">
        <div class="flex">
            <label class="block font-semibold text-[14px] mr-2">Tahun Akademik</label>
            <select bind:value={year} on:change={filterDataTahun} class="w-[100px] border px-3 rounded-md text-[12px]">
                <option value="">-- Pilih --</option>
                {#each tahun_akademik as ta}
                    <option value={ta.tahun}>{ta.tahun}</option>
                {/each}
            </select>
        </div>
        <div class="">
            <select bind:value={filter} class="w-[120px] border px-3 rounded-md text-[12px]" disabled={cek_bukti_fisik.length !== 70}>
                <option value="">-- Filter --</option>
                <option value="bukti">Bukti Fisik</option>
                <option value="indikator">Indikator</option>
            </select>
        </div>
    </div>
    <div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-4 mr-4 mb-2 mt-2 max-h-[83%] overflow:rounded-r-md">
        {#if filter === 'bukti' || filter === ''}
        <table class="min-w-[1000px]  w-full table-auto">
            <thead class="bg-gray-100 text-left text-sm font-semibold">
                <tr>
                <th class="px-4 py-2 w-[12%]">Kode</th>
                <th class="px-4 py-2 w-[73%]">Bukti Fisik</th>
                <th class="px-4 py-2 w-[10%]">Status</th>
                <th class="px-4 py-2 w-[5%]">Kunci</th>
                </tr>
            </thead>
            <tbody class="text-sm">
                {#each filterData as b}
                <tr class="border-t hover:bg-gray-50">
                    <td class="px-4 py-2">{b.kode}</td>
                    <td class="px-4 py-2">{b.keterangan}</td>              
                    <td class="px-4 py-2">Selesai</td>
                    <td class="px-4 py-2">
                        {#if b.input_bukti_fisik[0].kunci === false}
                            <button type="button" on:click={()=> kunci(b.input_bukti_fisik[0].id_input_bukti_fisik, true)} title="Kunci" class="hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-open-icon lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                            </button>
                        {:else}
                            <button type="button" on:click={()=> kunci(b.input_bukti_fisik[0].id_input_bukti_fisik, false)} title="Buka Kunci" class="hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </button>
                        {/if}
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
        {:else}
        <table class="min-w-[1000px]  w-full table-auto">
            <thead class="bg-gray-100 text-left text-sm font-semibold">
                <tr>
                <th class="px-4 py-2">Indikator</th>
                <th class="px-4 py-2 w-[10%]">Status</th>
                <th class="px-4 py-2 w-[5%]">Kunci</th>
                </tr>
            </thead>
            <tbody class="text-sm">
                {#each indikatorDiterima as i}
                <tr class="border-t hover:bg-gray-50">
                    <td class="px-4 py-2">{i}</td>            
                    <td class="px-4 py-2">Selesai</td>
                    <td class="px-4 py-2">
                        {#if !semuaSudahTerkunci(i)}
                            <button on:click={()=> kunciIndikator(i, true)} type="button" title="Kunci" class="hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-open-icon lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                            </button>
                        {:else}
                            <button on:click={()=> kunciIndikator(i, false)} type="button" title="Buka Kunci" class="hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </button>
                        {/if}
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
        {/if}
    </div>
{/if}
  