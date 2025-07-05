<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    
    let id_kesiswaan = '';
    let hak_akses: any[] = [];
    async function dataHakAkses() {
        const response = await fetch(`/api/hak_akses`, {
            method: 'GET'
        });
        const res = await response.json();
        hak_akses = res.data;
        const filter = hak_akses.filter((item: any) => item.nama === 'Operator Kesiswaan');

        id_kesiswaan = filter[0].id_hak_akses;
    }

    let keyword = '';
    let filterData: any[] = [];
    function cariData() {
        if (keyword.trim() === '') {
            filterData = bukti_fisik_filter;
        } else {
            filterData = bukti_fisik_filter.filter((item) =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
    }

    let all_bukti_fisik: any[] = [];
    let bukti_fisik_filter: any[] = [];
    let bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const data = await response.json();
        const filter = data.data.filter((item: any) => item.penugasan_operator.some((ibf: any) => ibf.id_hak_akses === id_kesiswaan));
        all_bukti_fisik = filter;
        filterByTahun(year);
    }

    function filterByTahun(tahun: number) {
        bukti_fisik = all_bukti_fisik.map((item: any) => {
            const filteredInputs = item.input_bukti_fisik.filter((input: any) => {
                const tgl = new Date(input.tanggal_input);
                return tgl.getFullYear() === tahun;
            });

            return {
                ...item,
                input_bukti_fisik: filteredInputs // hanya input tahun tersebut
            };
        });

        bukti_fisik_filter = bukti_fisik;
        filterData = bukti_fisik_filter;
    }

    let tahun_akademik: any[] = [];
    async function dataTahunAkademik() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        tahun_akademik = data.data;
    }

    function kerjakan(kode: string) {
        goto(`/dashboard/kesiswaan/bukti_fisik/${kode}`)
    }

    function cetak(kode: string) {
        goto(`/dashboard/kesiswaan/bukti_fisik/_cetak/${kode}`)
    }

    let year: number;
    let status: string;
    async function yearOnly() {
        const date = new Date();
        year = date.getFullYear();
    }
    async function filterDataTahun() {
        const filtered = tahun_akademik.filter((item: any) =>
            item.tahun === year
        );
        status = filtered[0].status;
        document.cookie = `year = ${year}`;
        filterByTahun(year);
    }

    let indi= '';
    let indikator: any[] = [];
    async function dataIndikator() {
        const response = await fetch(`/api/indikator`, {
            method: 'GET'
        });
        const data = await response.json();
        indikator = data.data;
    }
    async function filterIndikator() {
        let result = bukti_fisik.filter((item) => {
            const cocokIndi = indi.trim() === '' || item.kode?.toLowerCase().startsWith(indi.toLowerCase());

            if (!cocokIndi) return false;

            if (stts.trim() === '') {
                return true;
            } else if (stts === 'Tidak_ada_input') {
                return item.input_bukti_fisik.length === 0;
            } else {
                return item.input_bukti_fisik.some((ibf: any) => ibf.status === stts);
            }
        });

        bukti_fisik_filter = result;
        filterData = result;
    }

    let stts= '';
    async function filterStatus() {
        let result = bukti_fisik.filter((item) => {
            const cocokIndi = indi.trim() === '' || item.kode?.toLowerCase().startsWith(indi.toLowerCase());

            if (!cocokIndi) return false;

            if (stts.trim() === '') {
                return true;
            } else if (stts === 'Tidak_ada_input') {
                return item.input_bukti_fisik.length === 0;
            } else {
                return item.input_bukti_fisik.some((ibf: any) => ibf.status === stts);
            }
        });

        bukti_fisik_filter = result;
        filterData = result;
    }
    
    let loading = true;
    onMount(async()=>{
        try {
            await dataHakAkses();
            await dataBuktiFisik();
            await dataTahunAkademik();
            await yearOnly();
            await filterDataTahun();
            await dataIndikator();
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
    </div> 
</div>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="flex justify-between ml-4 mt-4 mr-4">
        <div class="flex items-end">
            <label class="block font-semibold text-[14px] mr-2">Tahun Akademik</label>
            <select bind:value={year} on:change={filterDataTahun} class="w-[80px] h-[20px] border px-3 rounded-md text-[12px]">
                <option value="">Pilih</option>
                {#each tahun_akademik as ta}
                    <option value={ta.tahun}>{ta.tahun}</option>
                {/each}
            </select>
        </div>
        <div class="md:flex">
            <div class="md:mr-2 md:block hidden">
                <select bind:value={stts} on:change={filterStatus} class="w-[150px] h-[20px] border px-1 rounded-md text-[12px]">
                    <option value="">Status</option>
                    <option value='Tidak_ada_input'>Tidak Ada Input</option>
                    <option value='Belum_dikerjakan'>Belum Diselesaikan</option>
                    <option value='Menunggu_validasi'>Menunggu Validasi</option>
                    <option value='Diterima'>Diterima</option>
                    <option value='Ditolak'>Ditolak</option>
                </select>
            </div>
            <div class="flex justify-end items-center">
                <select bind:value={indi} on:change={filterIndikator} class="w-[90px] h-[20px] border px-1 rounded-md text-[12px]">
                    <option value="">Indikator</option>
                    {#each indikator as i}
                        <option value={i.kode}>{i.kode}</option>
                    {/each}
                </select>
            </div>
            <div class="md:hidden">
                <select bind:value={stts} on:change={filterStatus} class="w-[150px] h-[20px] border px-1 rounded-md text-[12px]">
                    <option value="">Status</option>
                    <option value='Tidak_ada_input'>Tidak Ada Input</option>
                    <option value='Belum_dikerjakan'>Belum Diselesaikan</option>
                    <option value='Menunggu_validasi'>Menunggu Validasi</option>
                    <option value='Diterima'>Diterima</option>
                    <option value='Ditolak'>Ditolak</option>
                </select>
            </div>
        </div>
    </div>
    <div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-4 mr-4 mb-2 mt-2 max-h-[83%] overflow:rounded-r-md">
        <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-sm font-semibold">
            <tr>
            <th class="px-4 py-2 w-[8%]">Kode</th>
            <th class="px-4 py-2 w-[42%]">Bukti Fisik</th>
            <th class="px-4 py-2 w-[10%]">Required</th>
            <th class="px-4 py-2 w-[19%]">Status</th>
            <th class="px-4 py-2 w-[8%]">Kerjakan</th>
            <th class="px-4 py-2 w-[8%]">Cetak</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            {#if status === 'Aktif'}
            {#each filterData as b}
                <tr class={`border-t hover:bg-gray-50 ${b.required === true ? 'bg-white':'bg-blue-50'}`}>
                <td class="px-4 py-2">{b.kode}</td>
                <td class="px-4 py-2">{b.keterangan}</td>              
                <td class="px-4 py-2">{b.required === true ? 'Ya' : 'Tidak'}</td>              
                <td class="px-4 py-2">{b.input_bukti_fisik.length === 0 ? "Tidak Ada Input" : (b.input_bukti_fisik[0].status === "Belum_dikerjakan" ? "Belum Diselesaikan" : (b.input_bukti_fisik[0].status === "Menunggu_validasi" ? "Menunggu Validasi" : b.input_bukti_fisik[0].status))}</td>
                <td class="px-4 py-2 text-[11px] font-semibold">
                    {#if b.input_bukti_fisik.length !== 0 && b.input_bukti_fisik[0].kunci === true}
                        <button
                            type="button"
                            class="mr-2 w-[65px] border-2 pl-1 pr-1 rounded-md shadow-md border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
                            disabled
                            title="Menunggu validasi"
                        >
                            kerjakan
                        </button>
                    {:else if b.input_bukti_fisik.length !== 0 && b.input_bukti_fisik[0].status === 'Ditolak'}
                        <button
                            type="button"
                            title="Kerjakan"
                            on:click={() => kerjakan(b.kode)}
                            class="mr-2 w-[65px] border-2 pl-1 pr-1 rounded-md shadow-md border-red-500 hover:bg-red-500 hover:text-white"
                        >
                            Revisi
                        </button>
                    {:else if b.input_bukti_fisik.length !== 0 && b.input_bukti_fisik[0].status === 'Belum_dikerjakan'}
                        <button
                            type="button"
                            on:click={() => kerjakan(b.kode)}
                            class="mr-2 w-[65px] text-[10px] border-2 pl-1 pr-1 rounded-md shadow-md border-green-500 hover:bg-green-500 hover:text-white"
                            title="Lanjutkan"
                        >
                            Lanjutkan
                        </button>
                    {:else if b.input_bukti_fisik.length !== 0 && b.input_bukti_fisik[0].status === 'Menunggu_validasi'}
                        <button
                            type="button"
                            title="Kerjakan"
                            on:click={() => kerjakan(b.kode)}
                            class="mr-2 w-[65px] border-2 pl-1 pr-1 rounded-md shadow-md border-orange-500 hover:bg-orange-500 hover:text-white"
                        >
                            Tambah
                        </button>
                    {:else}
                        <button
                            type="button"
                            title="Kerjakan"
                            on:click={() => kerjakan(b.kode)}
                            class="mr-2 w-[65px] border-2 pl-1 pr-1 rounded-md shadow-md border-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                            Kerjakan
                        </button>
                    {/if}
                </td>
                <td class="px-4 py-2 text-[11px] font-semibold">
                    <button type="button" on:click={() => cetak(b.kode)} title="Cetak" class="mr-2 w-[50px] border-2 pl-1 pr-1 rounded-md shadow-md border-yellow-500 hover:bg-yellow-500 hover:text-white">
                        Cetak
                    </button>
                </td>
                </tr>
            {/each}
            {:else}
            <tr class="border-t hover:bg-gray-50">
                <td colspan="5" class="px-4 py-2 text-center">Tahun Akademik Tidak Aktif</td>
            </tr>
            {/if}
        </tbody>
        </table>
    </div>
{/if}