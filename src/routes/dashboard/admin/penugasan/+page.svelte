<script lang="ts">
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let keyword = '';
    let filterData: any[] = [];
    function cariData() {
        if (keyword.trim() === '') {
            filterData = bukti_fisik;
        } else {
            filterData = bukti_fisik.filter((item) =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
    }

    let bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const res = await response.json();
        bukti_fisik = res.data;
        filterData = res.data;
    }

    let id_kesiswaan = '';
    let id_keuangan = '';
    let hak_akses: any[] = [];
    async function dataHakAkses() {
        const response = await fetch(`/api/hak_akses`, {
            method: 'GET'
        });
        const res = await response.json();
        hak_akses = res.data;
        const filter = hak_akses.filter((item: any) => item.nama === 'Operator Kesiswaan');
        const filter2 = hak_akses.filter((item: any) => item.nama === 'Operator Keuangan');

        id_kesiswaan = filter[0].id_hak_akses;
        id_keuangan = filter2[0].id_hak_akses;
    }

    async function penugasan(id_bukti_fisik: any, operator: string) {
        if (operator === 'kesiswaan') {
            const response = await fetch(`/api/penugasan_operator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_hak_akses: parseInt(id_kesiswaan), id_bukti_fisik: parseInt(id_bukti_fisik)
                })
            });
            if (response.ok) {
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil ubah",
                    icon: "success",
                    timer: 3000,
                    background: "#28a745",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
                await dataBuktiFisik();
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Data gagal diubah",
                    icon: "error",
                    timer: 3000,
                    background: "#8B0000",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
            }
        } else {
            const response = await fetch(`/api/penugasan_operator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_hak_akses: parseInt(id_keuangan), id_bukti_fisik: parseInt(id_bukti_fisik)
                })
            });
            if (response.ok) {
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil diubah",
                    icon: "success",
                    timer: 3000,
                    background: "#28a745",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
                await dataBuktiFisik();
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Data gagal diubah",
                    icon: "error",
                    timer: 3000,
                    background: "#8B0000",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
            }
        }
    }

    async function hapusPenugasan(id_bukti_fisik: any, operator: string) {
        if (operator === 'kesiswaan') {
            const response = await fetch(`/api/penugasan_operator/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_hak_akses: parseInt(id_kesiswaan), id_bukti_fisik: parseInt(id_bukti_fisik)
                })
            });
            if (response.ok) {
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil ubah",
                    icon: "success",
                    timer: 3000,
                    background: "#28a745",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
                await dataBuktiFisik();
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Data gagal diubah",
                    icon: "error",
                    timer: 3000,
                    background: "#8B0000",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
            }
        } else {
            const response = await fetch(`/api/penugasan_operator/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_hak_akses: parseInt(id_keuangan), id_bukti_fisik: parseInt(id_bukti_fisik)
                })
            });
            if (response.ok) {
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil ubah",
                    icon: "success",
                    timer: 3000,
                    background: "#28a745",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
                await dataBuktiFisik();
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Data gagal diubah",
                    icon: "error",
                    timer: 3000,
                    background: "#8B0000",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
            }
        }
    }

    let loading = true;
    
    onMount(async ()=>{
        try {
        await Promise.all([
            dataBuktiFisik(),
            dataHakAkses()
        ]);
        } finally {
            loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Penugasan Operator</h2>
    <div class="flex gap-2 items-center mr-4">
        <div class="flex border rounded-md hover:border-2 hover:border-green-400">
            <input type="text" bind:value={keyword} on:input={cariData} placeholder="Cari..." class="rounded h-[18px] w-[120px] md:w-[200px] text-[12px] px-3 py-1 focus:outline-none focus:ring-0 focus:border-transparent" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </div>
    </div> 
</div>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-4 mr-4 mb-2 mt-2 max-h-[83%] overflow:rounded-r-md">
        <table class="min-w-[1000px]  w-full table-auto">
            <thead class="bg-gray-100 text-left text-sm font-semibold">
                <tr>
                    <th rowspan="2" class="border-r px-4 py-2 w-[12%]">Kode</th>
                    <th rowspan="2" class="border-r px-4 py-2 w-[73%]">Bukti Fisik</th>
                    <th colspan="2" class="border-b px-4 py-2 w-[5%] text-center">Operator</th>
                </tr>
                <tr>
                    <th class="border-r px-4 py-2 text-center">Kesiswaan</th>
                    <th class="border px-4 py-2 text-center">Keuangan</th>
                </tr>
            </thead>
            <tbody class="text-sm">
                {#each filterData as b}
                <tr class="border-t hover:bg-gray-50">
                    <td class="px-4 py-2">{b.kode}</td>
                    <td class="px-4 py-2">{b.keterangan}</td>
                    <td class="px-4 py-2">
                        <div class="flex items-center justify-center">
                            <div on:click={()=> b.penugasan_operator.length === 0 ? penugasan(b.id_bukti_fisik, 'kesiswaan') : hapusPenugasan(b.id_bukti_fisik, 'kesiswaan')} class="flex items-center w-[32px] h-[15px] border-2 rounded-full cursor-pointer transition-colors duration-300 {b.penugasan_operator.length > 0 && b.penugasan_operator[0].id_hak_akses === id_kesiswaan ? 'bg-blue-500 border-blue-500' : 'bg-gray-200'}">
                                <div class="h-[12px] w-[12px] bg-white rounded-full shadow-md transform transition-transform duration-300" class:translate-x-4={b.penugasan_operator.length > 0 && b.penugasan_operator[0].id_hak_akses === id_kesiswaan}></div>
                            </div>
                        </div>                   
                    </td>
                    <td class="px-4 py-2">
                        <div class="flex items-center justify-center">
                            <div on:click={()=> b.penugasan_operator.length === 0 ? penugasan(b.id_bukti_fisik, 'keuangan') : hapusPenugasan(b.id_bukti_fisik, 'keuangan')} class="flex items-center w-[32px] h-[15px] border-2 rounded-full cursor-pointer transition-colors duration-300 {b.penugasan_operator.length > 0 && b.penugasan_operator[0].id_hak_akses === id_keuangan ? 'bg-blue-500 border-blue-500' : 'bg-gray-200'}">
                                <div class="h-[12px] w-[12px] bg-white rounded-full shadow-md transform transition-transform duration-300" class:translate-x-4={b.penugasan_operator.length > 0 && b.penugasan_operator[0].id_hak_akses === id_keuangan}></div>
                            </div>
                        </div>                   
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
  