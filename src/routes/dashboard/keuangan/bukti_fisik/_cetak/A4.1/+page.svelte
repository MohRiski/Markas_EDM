<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2"; 
    
    
    let id_tahun_akademik: number;
    let id = '';
    let id_in = '';
    let kodeUrl = '';
    let filterData: any[] = [];
    let bukti_fisik: any[] = [];
    let input: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const data = await response.json();
        bukti_fisik = data.data;
        filterData = bukti_fisik.filter((item) => item.kode === kodeUrl);
        input = filterData[0].input_bukti_fisik;
        id = filterData[0].id_bukti_fisik;
        id_in = filterData[0].input_bukti_fisik[0].id_input_bukti_fisik;
    }

    let currentYear = '';
    let ftahun: any[] = [];
    let ta: any[] = [];
    async function dataThn() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        ta = data.data;
        ftahun = ta.filter((item) => item.tahun === parseInt(currentYear));
        id_tahun_akademik = ftahun[0].id_tahun_akademik;
    }

    let draftData = null;
    let catatan = '';
    async function ambilDraftData() {
        const res = await fetch(
            `/api/input_bukti_fisik/draft?id_bukti_fisik=${id}&id_tahun_akademik=${id_tahun_akademik}`
        );

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                draftData = result.data;
                catatan = draftData.catatan;
            }
        }
    }

    function kerjakan(kode: string) {
        goto(`/dashboard/keuangan/bukti_fisik/_cetak/A4.1/${kode}`)
    }

    function getCookie(name: string): string {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : '';
	}
    
    onMount(async ()=>{
        const segments = $page.url.pathname.split('/');
		kodeUrl = segments[segments.length - 1];
        currentYear = getCookie('year');
        await dataBuktiFisik();
        await dataThn();
        await ambilDraftData();
    });
</script>

<div class="mb-4">
    {#each filterData as b}
        <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan}</h2>
    {/each}
</div>
<div class="overflow-x-auto overflow-y-auto py-4 px-4 font-semibold flex justify-between border rounded-md shadow bg-white ml-2 mr-2 mb-2 mt-2 max-h-[90%] overflow:rounded-r-md">
    <button on:click={()=> kerjakan('X')} class="px-2 py-1 rounded-md bg-white border-2 border-blue-400 hover:bg-blue-600 hover:text-white w-[30%]">Kelas X</button>
    <button on:click={()=> kerjakan('XI')} class="px-2 py-1 rounded-md bg-white border-2 border-green-400 hover:bg-green-600 hover:text-white w-[30%]">Kelas XI</button>
    <button on:click={()=> kerjakan('XII')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white w-[30%]">Kelas XII</button>
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[12px] font-semibold">
    <button on:click={()=> goto('/dashboard/keuangan/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  