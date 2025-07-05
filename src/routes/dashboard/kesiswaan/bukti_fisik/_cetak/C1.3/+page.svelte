<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let jumlahData = 0;
    let JDarray = Array.from({ length: jumlahData }, (_, i) => ({
        nama: '',
        mapel: '',
        satu: '',
        dua: '',
        kelas: '',
        rpp: '',
        metode: '',
        media: '',
        penilaian: ''
    }));

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
                    (d: { atribut: string; }) => d.atribut === 'Daftar guru yang menyusun Perangkat Pembelajaran'
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
        document.title = 'C1.3';
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
                        <td colspan="10">
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
                        <td colspan="10">
                            <div class="mt-3 mb-2 text-[12px]">
                                <p class="text-center font-semibold text-[14px] mb-3">DAFTAR GURU YANG MENYUSUN RPP</p>
                                <div class="flex">
                                    <p class="">Nama Madrasah</p>
                                    <p class="pl-3">: {namaSekolah}</p>
                                </div>
                                <div class="flex">
                                    <p class="pr-2.5">NSM/NPSN</p>
                                    <p class="pl-5">: 131 235 290 122/{npsn}</p>
                                </div>
                                <div class="flex">
                                    <p class="">Alamat Madrasah</p>
                                    <p class="pl-1">: {alamat}</p>
                                </div>
                                <div class="flex">
                                    <p class="">Semester/Tahun</p>
                                    <p class="pl-3">: 1-2/{currentYear}</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center border border-black text-[13px] font-semibold">
                        <th rowspan="2" class="border-r border-black px-2 py-1">No</th>
                        <th rowspan="2" class="border-r border-black px-2 py-1">Nama Guru</th>
                        <th rowspan="2" class="border-r border-black px-2 py-1">Pengampu Mapel/Kelas</th>
                        <th colspan="2" class="border-r border-black px-2 py-1">Semester</th>
                        <th rowspan="2" class="border-r border-black px-2 py-1">Kelas</th>
                        <th rowspan="2" class="border-r border-black px-2 py-1">RPP</th>
                        <th colspan="3" class="border-r border-black px-2 py-1">Hasil Temuan Telah RPP</th>
                    </tr>
                    <tr class="text-center border border-black text-[13px] font-semibold">
                        <th class="border-r border-black px-2 py-2">1</th>
                        <th class="border-r border-black px-2 py-2">2</th>
                        <th class="border-r border-black px-2 py-2">Metode</th>
                        <th class="border-r border-black px-2 py-2">Media</th>
                        <th class="border-r border-black px-2 py-2">Penilaian</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                {#each JDarray as j, i}
                    <tr class="border border-black text-center">
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {i+1}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.nama}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.mapel}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.satu}
                        </td>  
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.dua}
                        </td>  
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.kelas}
                        </td>  
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.rpp}
                        </td>  
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.metode}
                        </td>
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.media}
                        </td>                                                               
                        <td class="px-2 py-2 text-[12px] border-r border-black">
                            {j.penilaian}
                        </td>                                                               
                    </tr>
                {/each}
                    <tr>
                        <td colspan="10">
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
                                        <p class="pb-12">Pengawas Madrasah</p>
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
    <button on:click={()=> goto('/dashboard/kesiswaan/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  