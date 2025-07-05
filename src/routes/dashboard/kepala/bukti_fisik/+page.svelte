<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";
    
    let showModal = false;
    let catatanPenolakan = '';
    let idInputBuktiFisikDitolak: number | null = null;


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

    let bukti_fisik: any[] = [];
    let bukti_fisik_filter: any[] = [];
    let all_bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const res = await response.json();
        const filtered = res.data.filter((item: any) =>
            item.input_bukti_fisik.length > 0 &&
            item.input_bukti_fisik.some((ibf: any) => ibf.status !== 'Belum_dikerjakan')
        );

        all_bukti_fisik = filtered;
        bukti_fisik = filtered;
        filterData = filtered;
        bukti_fisik_filter = filtered;
    }

    async function filterDataTahun() {
        const filtered = all_bukti_fisik.filter((item: any) =>
            item.input_bukti_fisik.some((ibf: any) => {
                const tanggal = new Date(ibf.tanggal_input);
                return tanggal.getFullYear() === year;
            })
        );

        bukti_fisik = filtered;
        bukti_fisik_filter = filtered;
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

    let year: number;
    async function yearOnly() {
        const date = new Date();
        year = date.getFullYear();
    }

    async function konfirmasi(id_input_bukti_fisik: any) {
        const response = await fetch(`/api/input_bukti_fisik/update_status?id=${id_input_bukti_fisik}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: "Diterima"
            })
        });
        if (response.ok) {
            Swal.fire({
                title: "Sukses!",
                text: "Konfirmasi berhasil",
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
            await progres();
        } else {
            Swal.fire({
                title: "Gagal!",
                text: "Konfirmasi Gagal",
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

    function bukaModalPenolakan(id_input: number) {
        idInputBuktiFisikDitolak = id_input;
        catatanPenolakan = '';
        showModal = true;
    }

    async function konfirmasiPenolakan() {
        if (!catatanPenolakan.trim()) {
            Swal.fire({
                title: "Perhatian!",
                text: "Catatan tidak boleh kosong",
                icon: "error",
                timer: 3000,
                background: "#8B0000",
                color: "#ffffff",
                allowOutsideClick: true,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
            return;
        }

        const response = await fetch(`/api/input_bukti_fisik/update_status?id=${idInputBuktiFisikDitolak}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: "Ditolak",
                catatan: catatanPenolakan
            })
        });

        showModal = false;
        idInputBuktiFisikDitolak = null;

        if (response.ok) {
            Swal.fire({
                title: "Sukses!",
                text: "Konfirmasi berhasil",
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
                text: "Konfirmasi Gagal",
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

    function view(kode: string) {
        goto(`/dashboard/kepala/bukti_fisik/${kode}`)
    }

    function cetak(kode: string) {
        goto(`/dashboard/kepala/bukti_fisik/_cetak/${kode}`)
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
            } else {
                return item.input_bukti_fisik.some((ibf: any) => ibf.status === stts);
            }
        });

        bukti_fisik_filter = result;
        filterData = result;
    }

    let sta= 'Diterima';
    type KelompokIndikator = {
        kode: string;
        total: number;
        diterima: number;
        persen: number;
        items: any[];
    };
    let dataKelompok: KelompokIndikator[] = [];
    async function progres() {
        const kelompokMap: Record<string, KelompokIndikator> = {};

	    for (const item of filterData) {
		    if (!item.kode) continue;
            const prefix = item.kode.split('.')[0];
            if (!kelompokMap[prefix]) {
                kelompokMap[prefix] = {
                    kode: prefix,
                    total: 0,
                    diterima: 0,
                    persen: 0,
                    items: []
                };
            }
            kelompokMap[prefix].total++;
            kelompokMap[prefix].items.push(item);
            let isDiterima;
            if (sta === '') {
                isDiterima = item.input_bukti_fisik.some((ibf: any) => ibf.status === 'Diterima' );
            } else if (sta === 'Belum_dikerjakan') {
                isDiterima = item.input_bukti_fisik.length === 0 || item.input_bukti_fisik.some((ibf: any) => ibf.status === 'Belum_dikerjakan');
            } else {
                isDiterima = item.input_bukti_fisik.some((ibf: any) => ibf.status === sta );
            }
            
            if (isDiterima) {
                kelompokMap[prefix].diterima++;
            }
        }
        dataKelompok = Object.values(kelompokMap).map(k => ({
            ...k,
            persen: Math.round((k.diterima / k.total) * 100)
        }));
    }

    let showProgres = false;
    function toggleProgres() {
        showProgres = !showProgres;
    }

    let loading = true;
    onMount(async()=>{
        try {
            await yearOnly();
            await dataBuktiFisik();
            await dataTahunAkademik();
            await filterDataTahun();
            await dataIndikator();
            await progres();
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
        <div class="md:flex">
            <div class="md: mr-2">
                <button on:click={toggleProgres} class="text-[11px] text-white font-semibold px-2 rounded-md border-2 border-gray-200 bg-green-800 hover:bg-green-600">Progres</button>
            </div>
            <div class="flex items-center">
                <label class="block font-semibold text-[14px] mr-2">Tahun Akademik</label>
                <select bind:value={year} on:change={filterDataTahun} class="w-[80px] h-[20px] border px-3 rounded-md text-[12px]">
                    <option value="">Pilih</option>
                    {#each tahun_akademik as ta}
                        <option value={ta.tahun}>{ta.tahun}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="md:flex md:items-center">
            <div class="md:mr-2 md:block hidden">
                <select bind:value={stts} on:change={filterStatus} class="w-[150px] h-[20px] border px-1 rounded-md text-[12px]">
                    <option value="">Status</option>
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
                    <option value='Menunggu_validasi'>Menunggu Validasi</option>
                    <option value='Diterima'>Diterima</option>
                    <option value='Ditolak'>Ditolak</option>
                </select>
            </div>
        </div>
    </div>
    {#if showProgres}
    <div class="ml-4 mr-4 mt-4 mb-6 border rounded-md shadow-lg px-2 py-2">
        <div class="flex  justify-between">
            <h1 class="font-bold text-[14px]">Progres Input Bukti Fisik</h1>
            <select bind:value={sta} on:change={progres} class="w-[150px] h-[20px] border px-1 rounded-md text-[12px]">
                <option value="">Filter Status</option>
                <option value='Belum_dikerjakan'>Belum Dikerjakan</option>
                <option value='Menunggu_validasi'>Menunggu Validasi</option>
                <option value='Diterima'>Diterima</option>
                <option value='Ditolak'>Ditolak</option>
            </select>
        </div>
        <div class="mt-4 flex flex-wrap justify-between items-center gap-1 w-full">
            {#each dataKelompok as i}
                <div class={`flex justify-between items-center rounded-md shadow-md w-[175px] md:w-[200px] text-center text-[16px] border-2 px-1 py-1 `}>
                    <div class="w-[100px]">
                        <h1 class="font-bold">{i.kode}</h1>
                        <p class="text-[12px] font-semibold">Total: {i.total}</p>
                        <p class="text-[12px] font-semibold">Jumlah: {i.diterima}</p>
                    </div>
                    <div class={`w-[90px] border-2 py-4 rounded-r-sm ${i.persen === 100 ? 'bg-green-500': i.persen < 100 && i.persen > 50 ? 'bg-blue-500' : i.persen === 50 ? 'bg-yellow-400' : 'bg-red-500'}`}>
                        <p class="text-[20px] text-white font-semibold">{i.persen}%</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    {/if}
    <div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-4 mr-4 mb-2 mt-2 max-h-[83%] overflow:rounded-r-md">
        <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-sm font-semibold">
            <tr>
            <th class="px-4 py-2 w-[12%]">Kode</th>
            <th class="px-4 py-2 w-[42%]">Bukti Fisik</th>
            <th class="px-4 py-2 w-[10%]">Required</th>
            <th class="px-4 py-2 w-[15%]">Validasi</th>
            <th class="px-4 py-2 w-[8%]">View</th>
            <th class="px-4 py-2 w-[8%]">Cetak</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            {#each filterData as b}
            <tr class={`border-t hover:bg-gray-50 ${b.required === true ? 'bg-white':'bg-blue-50'}`}>
                <td class="px-4 py-2">{b.kode}</td>
                <td class="px-4 py-2">{b.keterangan}</td>              
                <td class="px-4 py-2">{b.required === true ? 'Ya' : 'Tidak'}</td>              
                <td class="px-4 py-2 text-[11px] font-semibold">
                    {#if b.input_bukti_fisik[0].status !== "Belum_dikerjakan" && b.input_bukti_fisik[0].status !== "Menunggu_validasi"}
                        {b.input_bukti_fisik[0].status}
                    {:else}
                        <button on:click={()=> konfirmasi(b.input_bukti_fisik[0].id_input_bukti_fisik)} type="button" title="Terima" class="mr-2 w-[55px] border-2 pl-1 pr-1 rounded-md shadow-md border-green-500 hover:bg-green-500 hover:text-white">
                            Terima
                        </button>
                        <button on:click={() => bukaModalPenolakan(b.input_bukti_fisik[0].id_input_bukti_fisik)} type="button" title="Tolak" class="w-[55px] border-2 pl-1 pr-1 rounded-md shadow-md border-red-500 hover:bg-red-500 hover:text-white">
                            Tolak
                        </button>
                    {/if}
                </td>
                <td class="px-4 py-2 text-[11px] font-semibold">
                    <button on:click={()=> view(b.kode)} type="button" title="View" class="mr-2 w-[45px] border-2 pl-1 pr-1 rounded-md shadow-md border-blue-500 hover:bg-blue-500 hover:text-white">
                        View
                    </button>
                </td>
                <td class="px-4 py-2 text-[11px] font-semibold">
                    <button on:click={()=> cetak(b.kode)} type="button" title="Cetak" class="mr-2 w-[50px] border-2 pl-1 pr-1 rounded-md shadow-md border-yellow-500 hover:bg-yellow-500 hover:text-white">
                        Cetak
                    </button>
                </td>
            </tr>
            {/each}
        </tbody>
        </table>
    </div>
{/if}
  

{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[90%] md:w-[400px] shadow-lg">
      <h3 class="text-lg font-semibold mb-2">Catatan Revisi</h3>
      <textarea bind:value={catatanPenolakan} rows="4" placeholder="Tulis alasan penolakan..." class="w-full border rounded-md p-2 text-sm"></textarea>
      <div class="flex justify-end mt-4 gap-2">
        <button on:click={() => { showModal = false; }} class="px-2 py-1 text-[12px] font-semibold border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-md">
          Batal
        </button>
        <button on:click={konfirmasiPenolakan} class="px-2 py-1 text-[12px] font-semibold border-2 border-red-500 hover:bg-red-500 hover:text-white rounded-md">
          Tolak
        </button>
      </div>
    </div>
  </div>
{/if}
