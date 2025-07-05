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
    let status = '';
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

    let currentYear = '';
    let filterTahun: any[] = [];
    let tahun_akademik: any[] = [];
    async function dataTahun() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        tahun_akademik = data.data;
        filterTahun = tahun_akademik.filter((item) => item.tahun === parseInt(currentYear));
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
                status = draftData.status;
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

    function getCookie(name: string): string {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : '';
	}

    let tanggalSekarang = new Date();
    function formatTanggal(dateInput: Date | string): string {
        const bulanIndo = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const date = new Date(dateInput);
        const hari = date.getDate();
        const bulan = bulanIndo[date.getMonth()];
        const tahun = date.getFullYear();
        return `Sumenep, ${hari} ${bulan} ${tahun}`;
    }

    let sekolah: any[] = [];
    let namaSekolah = '';
    let logo = '';
    let npsn = '';
    let alamat = '';
    let kepala = '';
    let ttd = '';
    async function dataSekolah() {
        const response = await fetch(`/api/profile_sekolah`, {
            method: 'GET'
        });
        const data = await response.json();
        sekolah = data.data;
        namaSekolah = sekolah[0].nama;
        logo = sekolah[0].logo;
        npsn = sekolah[0].npsn;
        alamat = sekolah[0].alamat;
        kepala = sekolah[0].kepala;
        ttd = sekolah[0].ttd_kepala;
    }

    async function exportToPDF() {
        document.title = 'A5.1';
        window.print();
        setTimeout(() => {
            document.title = "Markas EDM";
        }, 1000);
    }

    onMount(async ()=>{
		const segments = $page.url.pathname.split('/');
		kodeUrl = segments[segments.length - 1];
        currentYear = getCookie('year');
        await dataBuktiFisik();
        await dataOperator();
        await dataTahun();
        await ambilDraftData();
        await dataSekolah();
    });
</script>

<div class="mb-4">
    {#each filterData as b}
        <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan}</h2>
    {/each} 
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={exportToPDF} class="px-2 py-1 rounded-md bg-white border-2 border-orange-400 hover:bg-orange-600 hover:text-white">PDF</button>
</div>
<div class="overflow-x-auto overflow-y-auto h-[75%] mt-4">
    <div class="font-times mx-auto" id="cetak" style="width: 180mm">
        <div class="bg-white ml-2 mr-2 mb-2 mt-2">
            <table class="w-full table-auto" id="tabel-cetak">
                <thead>
                    <tr>
                        <td colspan="12">
                            <div class="flex justify-center items-center text-[12px]">
                                <div class="mr-2">
                                    <img src={`/images/${logo}`} width="90" height="90" alt="logo">
                                </div>
                                <div class="text-center">
                                    <p class="font-semibold text-[14px]">YAYASAN AL-GHAZALI</p>
                                    <p class="font-semibold text-[16px]">MADRASAH ALIYAH AL-GHAZALI</p>
                                    <p class="">NSM : 131 235 290 122  NPSN : {npsn}</p>
                                    <p class="font-semibold text-[14px]">ROMBASAN PRAGAAN SUMENEP</p>
                                    <p class="italic">Sekretariat: {alamat}</p>
                                </div>
                            </div>
                            <hr class="border-t-2 border-black mb-1 mt-1" />
                            <hr class="border-t-4 border-black" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12">
                            <div class="mt-3 mb-3 text-[12px]">
                                <p class="text-center font-semibold text-[14px]">REKAPITULASI DAFTAR KUNJUNGAN PERPUSTAKAAN</p>
                                <p class="text-center font-semibold text-[14px]">MADRASAH ALIYAH AL-GHAZALI</p>
                                <p class="text-center font-semibold text-[14px]">TAHUN {currentYear}</p>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center border border-black text-[13px] font-semibold">
                        <th rowspan="2" class="px-2 py-1 border-r border-black">No</th>
                        <th rowspan="2" class="px-2 py-1 w-[15%] border-r border-black">Bulan</th>
                        <th colspan="9" class="px-2 py-1 border-r border-black">Kategori Buku</th>
                        <th rowspan="2" class="px-2 py-1">jumlah</th>
                    </tr>
                    <tr class="text-center border border-black text-[13px] font-semibold">
                        <th class="px-2 py-1 border-r border-black">Karya Umum</th>
                        <th class="px-2 py-1 border-r border-black">Agama</th>
                        <th class="px-2 py-1 border-r border-black">Ilmu Sosial</th>
                        <th class="px-2 py-1 border-r border-black">Bahasa</th>
                        <th class="px-2 py-1 border-r border-black">Teknologi</th>
                        <th class="px-2 py-1 border-r border-black">Seni & Orkes</th>
                        <th class="px-2 py-1 border-r border-black">Sastra</th>
                        <th class="px-2 py-1 border-r border-black">Sejarah</th>
                        <th class="px-2 py-1 border-r border-black">Fiksi</th>
                    </tr>
                </thead>
                <tbody>
                {#each JDarray as j,i}
                    <tr class="border border-black text-center">
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {i+1}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.bulan}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.karyaumum}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.agama}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.ilmusosial}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.bahasa}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.teknologi}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.seni}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.sastra}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.sejarah}
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.fiksi}
                        </td>              
                        <td class="px-2 py-2 text-[12px] font-semibold">
                           {j.jumlah}
                        </td>              
                    </tr>
                {/each}
                    <tr class="border border-black text-center font-semibold">
                        <td colspan="2" class="px-2 py-2 text-[12px] border-r border-black">
                            Jumlah
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalKaryaUmum}   
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalAgama}    
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalIlmusosial}  
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalBahasa}    
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalTeknologi}   
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalSeni}   
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalSastra}    
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalSejarah}    
                        </td>              
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {totalFiksi}   
                        </td>              
                        <td class="px-2 py-2 text-[12px]">
                            {totalJumlah}   
                        </td>              
                    </tr>
                    <tr>
                        <td colspan="12">
                            <div class="mt-4 mr-2 ml-2 text-[12px] text-right">
                                <p class="pr-6 pb-2">{formatTanggal(tanggalSekarang)}</p>
                                <p class="pl-7 text-left">Mengetahui</p>
                                <div class="flex justify-between">
                                    {#if status === 'Diterima'}
                                    <div class="relative mt-4 mr-2 ml-2 text-[12px] flex flex-col items-start">
                                        <img src={`/images/${ttd}`} alt="ttd" class="w-[280px] -m-6 z-10 relative -translate-y-2">
                                    </div>
                                    {:else}
                                    <div  class="text-center">
                                        <p class="pb-12">Kepala Madrasah</p>
                                        <p class="pb-2 underline font-semibold">{kepala}</p>
                                    </div>
                                    {/if}
                                    <div class="text-center">
                                        <p class="pb-12">Kepala Perpustakaan</p>
                                        <p class="pb-2 ">.............................................</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </div>
    </div>
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kepala/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  