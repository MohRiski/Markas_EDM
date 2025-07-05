<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let jumlahData = 1;
    type JDItem = {
        file: string | File | null;
        keterangan : string;
    };

    let JDarray: JDItem[] = Array.from({ length: jumlahData }, () => ({
        file: '',
        keterangan: ''
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
                    (d: { atribut: string; }) => d.atribut === 'Rekapitulasi daftar hadir rapat guru, tenaga kependidikan, dan komite madrasah.'
                );
                if (draft) {
                    nilaiSebelumnya = draft.nilai;
                    JDarray = JSON.parse(draft.nilai);
                    jumlahData = JDarray.length;
                }
            }
        }
    }

    let showModal = false;
    let modal = '';
    let fileBaru: string | File | null = null;
    let keteranganBaru = '';

    let filePreview: string = '';
    let keteranganPreview: string = '';

    function lihatData(item: JDItem) {
        if (typeof item.file === 'string') {
            filePreview = item.file;
        } else if (item.file instanceof File) {
            filePreview = URL.createObjectURL(item.file);
        } else {
            filePreview = '';
        }

        keteranganPreview = item.keterangan;
        modal = 'view';
        showModal = true;
    }

    function isImage(fileName: string) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
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
            <th class="px-4 py-2">File Resum Hasil Rapat</th>
            <th class="px-4 py-2 w-[10px] text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          {#each JDarray as j, i}
            <tr class="border-t hover:bg-gray-50">              
                <td class="px-2 py-2">
                    <p class="text-[12px] mt-1">File: {j.keterangan}</p>
                </td>
                <td class="px-2 py-2 text-right whitespace-nowrap space-x-1">
                    <button title="Lihat" on:click={() => lihatData(j)} class="text-black hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-view-icon lucide-view"><path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/></svg>
                    </button>
                </td>
            </tr>
          {/each}
        </tbody>
    </table> 
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kepala/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
</div>
  

{#if showModal}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    {#if modal === 'view'}
        <div class="bg-white p-4 rounded-lg shadow-md w-80">
            <h3 class="font-bold text-md mb-2">Preview File</h3>
            {#if isImage(filePreview)}
                <img src={`/files/${filePreview}`} alt="preview" class="max-w-full max-h-[300px] rounded border" />
            {:else}
                <a href={`/files/${filePreview}`} target="_blank" class="text-blue-600 underline text-[14px]">
                    Download File
                </a>
            {/if}
            <p class="mt-2 text-sm text-gray-700"><strong>Keterangan:</strong> {keteranganPreview}</p>
            <div class="flex justify-end mt-4 text-[12px] font-semibold">
                <button on:click={() => showModal = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">
                    Tutup
                </button>
            </div>
        </div>
    {/if}
</div>
{/if}