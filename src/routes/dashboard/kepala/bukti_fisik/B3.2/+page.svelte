<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let jumlahData = 0;
    let JDarray = Array.from({ length: jumlahData }, (_, i) => ({
        bulan: '',
        jumlahGuru: 0,
        wajibHadir: 0,
        S: 0,
        A: 0,
        I: 0,
        jumlah: 0,
        prosentase: 0,
        keterangan: ''
    }));

    $: JDarray = JDarray.map(item => ({
        ...item,
        jumlah: item.S > 0 || item.A > 0 || item.I > 0 ? (item.S + item.I + item.A) : 0
    }));

    $: JDarray = JDarray.map(item => ({
        ...item,
        prosentase: item.jumlah > 0 ? (item.wajibHadir - item.jumlah) / item.wajibHadir * 100 : 100
    }));

    let id_bukti_fisik: number;
    let id_operator: number;
    let id_tahun_akademik: number;

    let draftData = null;
    let id_input_bukti_fisik: null = null;
    let nilaiSebelumnya = '';

    let catatan = '';

    let kodeUrl = '';
    let filterData: any[] = [];
    let bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const data = await response.json();
        bukti_fisik = data.data;
        filterData = bukti_fisik.filter((item) => item.kode === kodeUrl);
        id_bukti_fisik = filterData[0].id_bukti_fisik;
    }

    let filterTahun: any[] = [];
    let tahun_akademik: any[] = [];
    async function dataTahun() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        tahun_akademik = data.data;
        const currentYear = new Date().getFullYear();
        filterTahun = tahun_akademik.filter((item) => item.tahun === currentYear);
        id_tahun_akademik = filterTahun[0].id_tahun_akademik;
    }

    async function dataOperator() {
		const res = await fetch("/api/me", {
			method: "GET",
			credentials: "include"
		});
		if (res.ok) {
			const result = await res.json();
            id_operator = result.user.id;
        }
    }

    async function ambilDraftData() {
        const res = await fetch(
            `/api/input_bukti_fisik/draft?id_bukti_fisik=${id_bukti_fisik}&id_tahun_akademik=${id_tahun_akademik}`
        );

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                draftData = result.data;
                catatan = draftData.catatan;
                id_input_bukti_fisik = draftData.id_input_bukti_fisik;
                const draft = draftData.jawaban_bukti_fisik[0]?.detail_jawaban.find(
                    (d: { atribut: string; }) => d.atribut === 'Daftar guru yang akan mengikuti program peningkatan mutu pembelajaran.'
                );
                if (draft) {
                    nilaiSebelumnya = draft.nilai;
                    JDarray = JSON.parse(draft.nilai);
                    jumlahData = JDarray.length;
                }
            }
        }
    }

    onMount(async ()=>{
		const segments = $page.url.pathname.split('/');
		kodeUrl = segments[segments.length - 1];
        await dataBuktiFisik();
        await dataOperator();
        await dataTahun();
        await ambilDraftData();
    });
</script>

<div class="mb-4">
    {#each filterData as b}
        <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan}</h2>
    {/each} 
</div>
<div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-2 mr-2 mb-2 mt-2 max-h-[80%] overflow:rounded-r-md">
    <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-[13px] font-semibold">
            <tr>
                <th rowspan="2" class="border px-2 py-1 w-[15%]">Bulan</th>
                <th rowspan="2" class="border px-2 py-1">Jumlah Guru</th>
                <th rowspan="2" class="border px-2 py-1">Wajib Hadir</th>
                <th colspan="4" class="border px-2 py-1 w-[30%]">Jumlah Absen</th>
                <th rowspan="2" class="border px-2 py-1">Prosentase (%)</th>
                <th rowspan="2" class="border px-2 py-1 w-[20%]">Keterangan</th>
            </tr>
            <tr>
                <th class="border px-2 py-1">S</th>
                <th class="border px-2 py-1">I</th>
                <th class="border px-2 py-1">A</th>
                <th class="border px-2 py-1">Jumlah</th>
            </tr>
        </thead>
        <tbody class="text-sm">
          {#each JDarray as j}
            <tr class="border-t hover:bg-gray-50">
                <td class="px-2 py-2 text-[12px]">
                    {j.bulan}
                </td>
                <td class="px-2 py-2 text-[12px]">
                    {j.jumlahGuru}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.wajibHadir}
                </td>
                <td class="px-2 py-2 text-[12px]">
                    {j.S}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.I}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.A}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.jumlah}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.prosentase}%
                </td>
                <td class="px-2 py-2 text-[12px]">
                    {j.keterangan}
                </td>
            </tr>
          {/each}
        </tbody>
    </table> 
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kepala/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  