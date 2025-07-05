<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let jumlahData = 0;
    let JDarray = Array.from({ length: jumlahData }, (_, i) => ({
        bulan: '',
        karyaumum: 0,
        agama: 0,
        ilmusosial: 0,
        bahasa: 0,
        teknologi: 0,
        seni: 0,
        sastra: 0,
        sejarah: 0,
        fiksi: 0,
        jumlah: 0
    }));

    $: JDarray = JDarray.map(item => ({
        ...item,
        jumlah: (item.karyaumum + item.agama + item.ilmusosial + item.bahasa + item.teknologi + item.seni + item.sastra + item.sejarah + item.fiksi)
    }));
    $: totalAgama = JDarray.reduce((sum, row) => sum + (+row.agama || 0), 0);
    $: totalIlmusosial = JDarray.reduce((sum, row) => sum + (+row.ilmusosial || 0), 0);
    $: totalBahasa = JDarray.reduce((sum, row) => sum + (+row.bahasa || 0), 0);
    $: totalTeknologi = JDarray.reduce((sum, row) => sum + (+row.teknologi || 0), 0);
    $: totalSeni = JDarray.reduce((sum, row) => sum + (+row.seni || 0), 0);
    $: totalSastra = JDarray.reduce((sum, row) => sum + (+row.sastra || 0), 0);
    $: totalSejarah = JDarray.reduce((sum, row) => sum + (+row.sejarah || 0), 0);
    $: totalFiksi = JDarray.reduce((sum, row) => sum + (+row.fiksi || 0), 0);
    $: totalKaryaUmum = JDarray.reduce((sum, row) => sum + (+row.karyaumum || 0), 0);
    $: totalJumlah = JDarray.reduce((sum, row) => sum + (+row.jumlah || 0), 0);

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
                    (d: { atribut: string; }) => d.atribut === 'Rekapitulasi daftar kunjungan perpustakaan.'
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
                <th colspan="9" class="border px-2 py-1">Kategori Buku</th>
                <th rowspan="2" class="border px-2 py-1">jumlah</th>
            </tr>
            <tr>
                <th class="border px-2 py-1">Karya Umum</th>
                <th class="border px-2 py-1">Agama</th>
                <th class="border px-2 py-1">Ilmu Sosial</th>
                <th class="border px-2 py-1">Bahasa</th>
                <th class="border px-2 py-1">Teknologi</th>
                <th class="border px-2 py-1">Seni & Orkes</th>
                <th class="border px-2 py-1">Sastra</th>
                <th class="border px-2 py-1">Sejarah</th>
                <th class="border px-2 py-1">Fiksi</th>
            </tr>
        </thead>
        <tbody class="text-sm">
          {#each JDarray as j}
            <tr class="border-t hover:bg-gray-50">
                <td class="px-2 py-2 text-[12px]">
                    {j.bulan}
                </td>
                <td class="px-2 py-2 text-[12px]">
                    {j.karyaumum}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.agama}
                </td>
                <td class="px-2 py-2 text-[12px]">
                   {j.ilmusosial} 
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.bahasa}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.teknologi}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.seni}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.sastra}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.sejarah}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.fiksi}
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {j.jumlah}
                </td>              
            </tr>
          {/each}
            <tr class="bg-gray-100 font-semibold">
                <td class="px-2 py-2 text-[12px]">
                    Jumlah
                </td>
                <td class="px-2 py-2 text-[12px]">
                    {totalKaryaUmum}   
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalAgama}    
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalIlmusosial}  
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalBahasa}    
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalTeknologi}   
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalSeni}   
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalSastra}    
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalSejarah}    
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalFiksi}   
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    {totalJumlah}   
                </td>              
            </tr>
        </tbody>
    </table> 
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kepala/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  