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

    async function uploadFileIfNeeded(file: any) {
        if (file instanceof File) {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/input_bukti_fisik/full_data/files', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                return data.data.filename;
            } else {
                throw new Error("Upload gagal");
            }
        }
        return file;
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
                    (d: { atribut: string; }) => d.atribut === 'C5.1 Daftar nilai PH, PTS dan PAS.'
                );
                if (draft) {
                    nilaiSebelumnya = draft.nilai;
                    JDarray = JSON.parse(draft.nilai);
                    jumlahData = JDarray.length;
                }
            }
        }
    }

    async function simpanPermanent() {
        for (let i = 0; i < JDarray.length; i++) {
            JDarray[i].file = await uploadFileIfNeeded(JDarray[i].file);
        }

        const nilaiBaru = JSON.stringify(JDarray);
        const payload = {
            id_operator,
            id_bukti_fisik,
            id_tahun_akademik,
            status: 'Menunggu_validasi',
            catatan: '',
            kunci: false,
            jawaban: [
                {
                    atribut: 'C5.1 Daftar nilai PH, PTS dan PAS.',
                    nilai: nilaiBaru
                }
            ]
        };

        if (id_input_bukti_fisik) {
            const hanyaUpdateStatus = nilaiBaru === nilaiSebelumnya;

            const res = await fetch(`/api/input_bukti_fisik/full_data/${id_input_bukti_fisik}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    hanyaUpdateStatus ? { status: 'Menunggu_validasi', catatan: ''} : payload
                )
            });

            if (res.ok) {
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Data berhasil dikirim',
                    icon: 'success',
                    timer: 3000,
                    background: '#28a745',
                    color: '#ffffff',
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
                goto('/dashboard/kesiswaan/bukti_fisik');
            } else {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Data gagal dikirim',
                    icon: 'error',
                    timer: 3000,
                    background: '#8B0000',
                    color: '#ffffff',
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        } else {
            const res = await fetch('/api/input_bukti_fisik/full_data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Data berhasil dikirim',
                    icon: 'success',
                    timer: 3000,
                    background: '#28a745',
                    color: '#ffffff',
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
                goto('/dashboard/kesiswaan/bukti_fisik');
            } else {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Data gagal dikirim',
                    icon: 'error',
                    timer: 3000,
                    background: '#8B0000',
                    color: '#ffffff',
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        }
    }

    async function simpanSementara(file: string | File | null, keterangan: string) {
        if (!file) return false;

        const uploadedFilename = await uploadFileIfNeeded(file);
        const dataBaru = { file: uploadedFilename, keterangan };

        const nilaiBaru = JSON.stringify([...(JDarray ?? []), dataBaru]);

        const payload = {
            id_operator,
            id_bukti_fisik,
            id_tahun_akademik,
            status: 'Belum_dikerjakan',
            catatan: '',
            kunci: false,
            jawaban: [
                {
                    atribut: 'C5.1 Daftar nilai PH, PTS dan PAS.',
                    nilai: nilaiBaru
                }
            ]
        };

        const url = id_input_bukti_fisik ? `/api/input_bukti_fisik/full_data/${id_input_bukti_fisik}` : '/api/input_bukti_fisik/full_data';

        const method = id_input_bukti_fisik ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            Swal.fire({
            title: 'Sukses!',
            text: 'Data berhasil disimpan',
            icon: 'success',
            timer: 3000,
            background: '#28a745',
            color: '#ffffff',
            allowOutsideClick: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
            });
            JDarray = JSON.parse(nilaiBaru);
            showModal = false;
            fileBaru = null;
            keteranganBaru = '';
        } else {
            Swal.fire({
            title: 'Gagal!',
            text: 'Data gagal disimpan',
            icon: 'error',
            timer: 3000,
            background: '#8B0000',
            color: '#ffffff',
            allowOutsideClick: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
            });
        }
    }

    async function updateData() {
        if (indexEdit === null || !JDarray[indexEdit]) return;

        let updatedFile = fileBaru;
        if (fileBaru instanceof File) {
            updatedFile = await uploadFileIfNeeded(fileBaru);
        }

        const dataBaru = { file: updatedFile, keterangan: keteranganBaru };
        const dataCopy = [...JDarray];
        dataCopy[indexEdit] = dataBaru;

        const nilaiBaru = JSON.stringify(dataCopy);

        const payload = {
            id_operator,
            id_bukti_fisik,
            id_tahun_akademik,
            status: 'Belum_dikerjakan',
            catatan: '',
            kunci: false,
            jawaban: [
                {
                    atribut: 'C5.1 Daftar nilai PH, PTS dan PAS.',
                    nilai: nilaiBaru
                }
            ]
        };

        const url = id_input_bukti_fisik
            ? `/api/input_bukti_fisik/full_data/${id_input_bukti_fisik}`
            : '/api/input_bukti_fisik/full_data';

        const method = id_input_bukti_fisik ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            Swal.fire({
                title: 'Sukses!',
                text: 'Data berhasil diperbarui',
                icon: 'success',
                timer: 3000,
                background: '#28a745',
                color: '#ffffff',
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
            JDarray = dataCopy;
            showModal = false;
            indexEdit = null;
        } else {
            Swal.fire({
                title: 'Gagal!',
                text: 'Gagal memperbarui data',
                icon: 'error',
                timer: 3000,
                background: '#8B0000',
                color: '#ffffff',
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
        }
    }

    async function hapusData(index: number) {
        const result = await Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            width: '350px',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            JDarray.splice(index, 1);
            const nilaiBaru = JSON.stringify(JDarray);

            const payload = {
                id_operator,
                id_bukti_fisik,
                id_tahun_akademik,
                status: 'Belum_dikerjakan',
                catatan: '',
                kunci: false,
                jawaban: [
                    {
                        atribut: 'C5.1 Daftar nilai PH, PTS dan PAS.',
                        nilai: nilaiBaru
                    }
                ]
            };

            const res = await fetch(`/api/input_bukti_fisik/full_data/${id_input_bukti_fisik}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
            Swal.fire({
                title: 'Sukses!',
                text: 'Data berhasil dihapus',
                icon: 'success',
                timer: 3000,
                background: '#28a745',
                color: '#ffffff',
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
            JDarray = JSON.parse(nilaiBaru);
            } else {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Gagal meghapus data',
                    icon: 'error',
                    timer: 3000,
                    background: '#8B0000',
                    color: '#ffffff',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
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

    let indexEdit: number | null = null;
    function editData(item: JDItem, index: number) {
        fileBaru = item.file;
        keteranganBaru = item.keterangan;
        indexEdit = index;
        modal = 'edit';
        showModal = true;
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
<div class={`${catatan.length === 0 ? 'hidden': 'flex'} ml-2 mr-2 mt-1 p-1 rounded-md text-[12px] bg-orange-300`}>
    <p>Catatan revisi: {catatan}</p>
</div>
<div class="flex justify-end mr-2 mt-2">
    <button on:click={() => { showModal = true; modal = 'tambah'; fileBaru = null; keteranganBaru = ''; }} class="text-[12px] h-[20px] bg-white border-2 border-green-400  px-2 font-semibold rounded hover:bg-green-500 flex hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus-icon lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        Tambah File
    </button>
</div>
<div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-2 mr-2 mb-2 mt-2 max-h-[80%] overflow:rounded-r-md">
    <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-[13px] font-semibold">
          <tr>
            <th class="px-4 py-2">Daftar Nilai PH, PTS, dan PAS</th>
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
                    <button title="Edit" on:click={() => editData(j,i)} class="text-black hover:text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                    </button>
                    <button title="Hapus" on:click={() => hapusData(i)} class="text-black hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </td>
            </tr>
          {/each}
        </tbody>
    </table> 
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kesiswaan/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
    <button on:click={simpanPermanent} class="px-2 py-1 rounded-md bg-White hover:bg-blue-600 border-2 border-blue-400 hover:text-white">Simpan Permanent</button>
</div>
  


{#if showModal}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    {#if modal === 'tambah'}
        <div class="bg-white p-4 rounded-lg shadow-md w-80">
            <h3 class="font-bold text-md mb-2">Tambah File</h3>
            <input type="file" class="w-full h-[34px] border px-2 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" on:change={(e) => fileBaru = (e.target as HTMLInputElement).files?.[0] ?? null}>
            <textarea class="w-full border px-2 py-1 text-sm rounded-lg resize-none mt-2" rows="2" placeholder="Masukkan keterangan" bind:value={keteranganBaru}></textarea>
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showModal = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">
                    Batal
                </button>
                <button
                    on:click={() => {
                        if (fileBaru) {
                        simpanSementara(fileBaru, keteranganBaru);
                        }
                    }}
                    class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">
                    Tambahkan
                </button>
            </div>
        </div>
    {:else if modal === 'view'}
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
    {:else}
        <div class="bg-white p-4 rounded-lg shadow-md w-80">
            <h3 class="font-bold text-md mb-2">Edit File</h3>
            <input type="file" class="w-full h-[34px] border px-2 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" on:change={(e) => fileBaru = (e.target as HTMLInputElement).files?.[0] ?? null}>
            <p class="text-[10px] pl-2">*kosongi input file jika tidak ingin di ubah</p>
            <textarea class="w-full border px-2 py-1 text-sm rounded-lg resize-none mt-2" rows="2" placeholder="Masukkan keterangan" bind:value={keteranganBaru}></textarea>
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showModal = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">
                    Batal
                </button>
                <button
                    on:click={updateData}
                    class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">
                    Update
                </button>
            </div>
        </div>
    {/if}
</div>
{/if}