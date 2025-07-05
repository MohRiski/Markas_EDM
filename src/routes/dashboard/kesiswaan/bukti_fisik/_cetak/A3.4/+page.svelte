<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let jumlahData = 0;
    let JDarray = Array.from({ length: jumlahData }, (_, i) => ({
        narasumber: '',
        pertanyaan: '',
        jawaban: ''
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
                id_input_bukti_fisik = draftData.id_input_bukti_fisik;
                const draft = draftData.jawaban_bukti_fisik[0]?.detail_jawaban.find(
                    (d: { atribut: string; }) => d.atribut === 'Laporan hasil wawancara TPM dengan para guru.'
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

    let sekolah: any[] = [];
    let namaSekolah = '';
    let logo = '';
    let npsn = '';
    let alamat = '';
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
    }

    async function exportToPDF() {
        document.title = 'A3.4';
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
            <hr class="border-t-4 border-black mb-4"/>
            <p class="font-bold text-center pb-4">Hasil Wawancara TPM Dengan Para Guru</p>
            {#each JDarray as j, i}
                <p>{i+1}. {j.narasumber}</p>
                <p class="pl-4">Pertanyaan: {j.pertanyaan}</p>
                <p class="pl-4">Jawaban: {j.jawaban}</p>
                <hr>
            {/each}
        </div>
    </div>
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kesiswaan/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  