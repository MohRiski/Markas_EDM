<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let jumlahData = 0;
    let JDarray = Array.from({ length: jumlahData }, (_, i) => ({
        tanggal: '',
        nama: '',
        kejadian: '',
        sikap: '',
        nilai: '',
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
                    (d: { atribut: string; }) => d.atribut === 'Jurnal guru pendidikan agama/PPkn/BK (Kelas X)'
                );
                if (draft) {
                    nilaiSebelumnya = draft.nilai;
                    JDarray = JSON.parse(draft.nilai);
                    jumlahData = JDarray.length;
                }
            }
        }
    }

    async function simpan() {
        const newJawaban = {
            atribut: 'Jurnal guru pendidikan agama/PPkn/BK (Kelas X)',
            nilai: JSON.stringify(JDarray)
        };

        if (!id_input_bukti_fisik) {
            const payloadBaru = {
                id_operator,
                id_bukti_fisik,
                id_tahun_akademik,
                status: 'Belum_dikerjakan',
                kunci: false,
                jawaban: [newJawaban]
            };

            const res = await fetch('/api/input_bukti_fisik/full_data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadBaru)
            });

            if (res.ok) {
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Data berhasil disimpan',
                    icon: 'success',
                    timer: 3000,
                    background: '#28a745',
                    color: '#ffffff',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
                goto('/dashboard/kesiswaan/bukti_fisik/A1.2');
            } else {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Data gagal disimpan',
                    icon: 'error',
                    timer: 3000,
                    background: '#8B0000',
                    color: '#ffffff',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
            }
        } else {
            // Sudah ada, cek atribut detail
            const resCheck = await fetch(`/api/detail_jawaban/atribut?atb=${newJawaban.atribut}`);

            if (resCheck.ok) {
                const checkData = await resCheck.json();
                const id_detail = checkData.data.id_detail_jawaban;
                const id_jwb = checkData.data.id_jawaban;
                const res = await fetch(`/api/detail_jawaban?id=${id_detail}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.ok) {
                    const res = await fetch(`/api/detail_jawaban`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            id_jawaban: id_jwb, atribut: newJawaban.atribut, nilai: newJawaban.nilai 
                        })
                    });

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_input_bukti_fisik}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: "Belum_dikerjakan"
                        })
                    });

                    if (res.ok) {
                        Swal.fire({
                            title: 'Sukses!',
                            text: 'Data berhasil disimpan',
                            icon: 'success',
                            timer: 3000,
                            background: '#28a745',
                            color: '#ffffff',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false
                        });
                        goto('/dashboard/kesiswaan/bukti_fisik/A1.2');
                    } else {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Data gagal disimpan',
                            icon: 'error',
                            timer: 3000,
                            background: '#8B0000',
                            color: '#ffffff',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Data gagal disimpan',
                        icon: 'error',
                        timer: 3000,
                        background: '#8B0000',
                        color: '#ffffff',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false
                    });
                }
            } else {
                const ress = await fetch(`/api/input_bukti_fisik/id?id=${id_input_bukti_fisik}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (ress.ok) {
                    const data = await ress.json();
                    const id_jw = data.data.jawaban_bukti_fisik[0].id_jawaban;
                    const res = await fetch(`/api/detail_jawaban`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            id_jawaban: id_jw, atribut: newJawaban.atribut, nilai: newJawaban.nilai 
                        })
                    });

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_input_bukti_fisik}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: "Belum_dikerjakan"
                        })
                    });

                    if (res.ok) {
                        Swal.fire({
                            title: 'Sukses!',
                            text: 'Data berhasil disimpan',
                            icon: 'success',
                            timer: 3000,
                            background: '#28a745',
                            color: '#ffffff',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false
                        });
                        goto('/dashboard/kesiswaan/bukti_fisik/A1.2');
                    } else {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Data gagal disimpan',
                            icon: 'error',
                            timer: 3000,
                            background: '#8B0000',
                            color: '#ffffff',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Data gagal disimpan',
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
    }

    function getCookie(name: string): string {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : '';
	}

    onMount(async ()=>{
		const segments = $page.url.pathname.split('/');
		kodeUrl = segments[segments.length - 2];
        currentYear = getCookie('year');
        await dataBuktiFisik();
        await dataOperator();
        await dataTahun();
        await ambilDraftData();
    });
</script>

<div class="mb-4">
    {#each filterData as b}
        <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan} (Kelas X)</h2>
    {/each} 
</div>
<div class="flex ml-2 text-[12px]">
    <label for="jumlah data">Jumlah Data</label>
    <input type="number" name="jumlah data" min="0" bind:value={jumlahData} class="border-2 rounded-md h-4 w-14 ml-2 pl-1 pr-1" on:input={() => {
        JDarray = Array.from({ length: jumlahData }, (_, i) => JDarray[i] || {
            tanggal: '',
            nama: '',
            kejadian: '',
            sikap: '',
            nilai: '',
        });
      }}
    >
</div>
<div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-2 mr-2 mb-2 mt-2 max-h-[80%] overflow:rounded-r-md">
    <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-[13px] font-semibold">
          <tr>
            <th class="px-4 py-2 w-[12%]">Tanggal</th>
            <th class="px-4 py-2 w-[30%]">Nama</th>
            <th class="px-4 py-2 w-[30%]">Kejadian/Prilaku</th>
            <th class="px-4 py-2 w-[20%]">Butir Sikap</th>
            <th class="px-4 py-2 w-[8%]">Nilai</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          {#each JDarray as j}
            <tr class="border-t hover:bg-gray-50">             
                <td class="px-2 py-2 text-[12px]">
                    <input type="date" id="tanggal" bind:value={j.tanggal} class="w-full h-6 border px-1 rounded" />
                </td>
                <td class="px-2 py-2 text-[12px]">
                    <input type="text" id="nama" bind:value={j.nama} class="w-full h-6 border px-1 rounded" />
                </td>
                <td class="px-2 py-2 text-[12px]">
                    <textarea id="kejadian" bind:value={j.kejadian} class="w-full h-8 border px-1 rounded"></textarea>
                </td>
                <td class="px-2 py-2 text-[12px]">
                    <input type="text" id="sikap" bind:value={j.sikap} class="w-full h-6 border px-1 rounded" />
                </td>      
                <td class="px-2 py-2 text-[12px]">
                    <select id="niai" bind:value={j.nilai} class="w-full h-6 border px-1 rounded">
                    <option value="">Nilai</option>
                    <option value="+">+</option>
                    <option value="-">-</option>
                    </select>
                </td>
            </tr>
          {/each}
        </tbody>
    </table> 
</div>
<div class="flex justify-end gap-2 mt-2 mr-2 text-[10px] font-semibold">
    <button on:click={()=> goto('/dashboard/kesiswaan/bukti_fisik/A1.2')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
    <button on:click={simpan} class="px-2 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
</div>
  