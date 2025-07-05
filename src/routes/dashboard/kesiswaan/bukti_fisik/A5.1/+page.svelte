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
    
    async function simpanSementara() {
        const payload = {
            id_operator,
            id_bukti_fisik,
            id_tahun_akademik,
            status: 'Belum_dikerjakan',
            catatan: '',
            kunci: false,
            jawaban: [
                {
                    atribut: 'Rekapitulasi daftar kunjungan perpustakaan.',
                    nilai: JSON.stringify(JDarray)
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
            goto('/dashboard/kesiswaan/bukti_fisik');
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

    async function simpanPermanent() {
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
                    atribut: 'Rekapitulasi daftar kunjungan perpustakaan.',
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
<div class="flex ml-2 text-[12px]">
    <label for="jumlah data">Jumlah Data</label>
    <input type="number" name="jumlah data" min="0" bind:value={jumlahData} class="border-2 rounded-md h-4 w-14 ml-2 pl-1 pr-1" on:input={() => {
        JDarray = Array.from({ length: jumlahData }, (_, i) => JDarray[i] || {
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
        });
      }}
    >
</div>
<div class={`${catatan.length === 0 ? 'hidden': 'flex'} ml-2 mr-2 mt-1 p-1 rounded-md text-[12px] bg-orange-300`}>
    <p>Catatan revisi: {catatan}</p>
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
                    <select id="bulan" bind:value={j.bulan} class="w-full h-6 border px-1 rounded">
                        <option value="">Pilih Bulan</option>
                        <option value="Januari">Januari</option>
                        <option value="Februari">Februari</option>
                        <option value="Maret">Maret</option>
                        <option value="April">April</option>
                        <option value="Mei">Mei</option>
                        <option value="Juni">Juni</option>
                        <option value="Juli">Juli</option>
                        <option value="Agustus">Agustus</option>
                        <option value="September">September</option>
                        <option value="Oktober">Oktober</option>
                        <option value="November">November</option>
                        <option value="Desember">Desember</option>
                    </select>
                </td>
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="jumlah" bind:value={j.karyaumum} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="jumlah" bind:value={j.agama} class="w-full h-6 border px-1 rounded" />
                </td>
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.ilmusosial} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.bahasa} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.teknologi} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.seni} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.sastra} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.sejarah} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" min="0" id="melanggar" bind:value={j.fiksi} class="w-full h-6 border px-1 rounded" />
                </td>              
                <td class="px-2 py-2 text-[12px]">
                    <input type="number" disabled min="0" id="melanggar" bind:value={j.jumlah} class="w-full h-6 border px-1 rounded" />
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
    <button on:click={()=> goto('/dashboard/kesiswaan/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
    <button on:click={simpanSementara} class="px-2 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
    <button on:click={simpanPermanent} class="px-2 py-1 rounded-md bg-White hover:bg-blue-600 border-2 border-blue-400 hover:text-white">Simpan Permanent</button>
</div>
  