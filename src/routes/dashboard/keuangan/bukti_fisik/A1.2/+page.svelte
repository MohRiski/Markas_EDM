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
    
    let id_tahun_akademik: number;
    let id_operator: number;
    let id = '';
    let id_in = '';
    let kodeUrl = '';
    let filterData: any[] = [];
    let bukti_fisik: any[] = [];
    let input: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const data = await response.json();
        bukti_fisik = data.data;
        filterData = bukti_fisik.filter((item) => item.kode === kodeUrl);
        input = filterData[0].input_bukti_fisik;
        id = filterData[0].id_bukti_fisik;
        id_in = filterData[0].input_bukti_fisik[0].id_input_bukti_fisik;
    }

    let currentYear = '';
    let ftahun: any[] = [];
    let ta: any[] = [];
    async function dataThn() {
        const response = await fetch(`/api/tahun_akademik`, {
            method: 'GET'
        });
        const data = await response.json();
        ta = data.data;
        ftahun = ta.filter((item) => item.tahun === parseInt(currentYear));
        id_tahun_akademik = ftahun[0].id_tahun_akademik;
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

    let draftData = null;
    let catatan = '';
    async function ambilDraftData() {
        const res = await fetch(
            `/api/input_bukti_fisik/draft?id_bukti_fisik=${id}&id_tahun_akademik=${id_tahun_akademik}`
        );

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                draftData = result.data;
                catatan = draftData.catatan;
            }
        }
    }

    let nilaiSebelumnya = '';
    async function ambilDraftDataX() {
        const res = await fetch(
            `/api/input_bukti_fisik/draft?id_bukti_fisik=${id}&id_tahun_akademik=${id_tahun_akademik}`
        );

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                draftData = result.data;
                catatan = draftData.catatan;
                id_in = draftData.id_input_bukti_fisik;
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
    async function ambilDraftDataXI() {
        const res = await fetch(
            `/api/input_bukti_fisik/draft?id_bukti_fisik=${id}&id_tahun_akademik=${id_tahun_akademik}`
        );

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                draftData = result.data;
                catatan = draftData.catatan;
                id_in = draftData.id_input_bukti_fisik;
                const draft = draftData.jawaban_bukti_fisik[0]?.detail_jawaban.find(
                    (d: { atribut: string; }) => d.atribut === 'Jurnal guru pendidikan agama/PPkn/BK (Kelas XI)'
                );
                if (draft) {
                    nilaiSebelumnya = draft.nilai;
                    JDarray = JSON.parse(draft.nilai);
                    jumlahData = JDarray.length;
                }
            }
        }
    }
    async function ambilDraftDataXII() {
        const res = await fetch(
            `/api/input_bukti_fisik/draft?id_bukti_fisik=${id}&id_tahun_akademik=${id_tahun_akademik}`
        );

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                draftData = result.data;
                catatan = draftData.catatan;
                id_in = draftData.id_input_bukti_fisik;
                const draft = draftData.jawaban_bukti_fisik[0]?.detail_jawaban.find(
                    (d: { atribut: string; }) => d.atribut === 'Jurnal guru pendidikan agama/PPkn/BK (Kelas XII)'
                );
                if (draft) {
                    nilaiSebelumnya = draft.nilai;
                    JDarray = JSON.parse(draft.nilai);
                    jumlahData = JDarray.length;
                }
            }
        }
    }

    async function konfirmasi() {
        const response = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: "Menunggu_validasi"
            })
        });
        if (response.ok) {
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
                goto('/dashboard/keuangan/bukti_fisik');
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

    async function simpanX() {
        const newJawaban = {
            atribut: 'Jurnal guru pendidikan agama/PPkn/BK (Kelas X)',
            nilai: JSON.stringify(JDarray)
        };

        if (!id_in) {
            const payloadBaru = {
                id_operator,
                id_bukti_fisik: id,
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
                showForm = false;
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

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
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
                        showForm = false;
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
                const ress = await fetch(`/api/input_bukti_fisik/id?id=${id_in}`, {
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

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
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
                        showForm = false;
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

    async function simpanXI() {
        const newJawaban = {
            atribut: 'Jurnal guru pendidikan agama/PPkn/BK (Kelas XI)',
            nilai: JSON.stringify(JDarray)
        };

        if (!id_in) {
            const payloadBaru = {
                id_operator,
                id_bukti_fisik: id,
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
                showForm = false;
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

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
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
                        showForm = false;
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
                const ress = await fetch(`/api/input_bukti_fisik/id?id=${id_in}`, {
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

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
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
                        showForm = false;
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

    async function simpanXII() {
        const newJawaban = {
            atribut: 'Jurnal guru pendidikan agama/PPkn/BK (Kelas XII)',
            nilai: JSON.stringify(JDarray)
        };

        if (!id_in) {
            const payloadBaru = {
                id_operator,
                id_bukti_fisik: id,
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
                showForm = false;
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

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
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
                        showForm = false;
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
                const ress = await fetch(`/api/input_bukti_fisik/id?id=${id_in}`, {
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

                    const update = await fetch(`/api/input_bukti_fisik/update_status?id=${id_in}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: "Belum_dikerjakan"
                        })
                    })

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
                        showForm = false;
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

    let showForm = false;
    let showX = false;
    let showXI = false;
    let showXII = false;
    async function kerjakan(kode: string) {
        showForm = true;
        if (kode === 'X') {
            await ambilDraftDataX();
            showX = true;
            showXI = false;
            showXII = false;
        } else if (kode === 'XI') {
            await ambilDraftDataXI();
            showXI = true;
            showX = false;
            showXII = false;
        } else {
            await ambilDraftDataXII();
            showXII = true;
            showX = false;
            showXI = false;
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
        await dataThn();
        await dataOperator();
        await ambilDraftData();
    });
</script>

<div class="mb-4">
    {#each filterData as b}
        <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan}</h2>
    {/each}
</div>
<div class={`${catatan.length === 0 ? 'hidden' : 'flex'} ml-2 mr-2 mt-1 p-1 rounded-md text-[12px] bg-orange-300`}>
    <p>Catatan revisi: {catatan}</p>
</div>
<div class="overflow-x-auto overflow-y-auto py-2 px-2 font-semibold flex justify-between border rounded-md shadow bg-white ml-2 mr-2 mb-2 mt-2 max-h-[90%] overflow:rounded-r-md">
    <button on:click={()=> kerjakan('X')} class="px-2 py-1 rounded-md bg-white border-2 border-blue-400 hover:bg-blue-600 hover:text-white w-[30%]">Kelas X</button>
    <button on:click={()=> kerjakan('XI')} class="px-2 py-1 rounded-md bg-white border-2 border-green-400 hover:bg-green-600 hover:text-white w-[30%]">Kelas XI</button>
    <button on:click={()=> kerjakan('XII')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white w-[30%]">Kelas XII</button>
</div>
{#if showForm}
<div class="border rounded-md shadow ml-2 mr-2 mb-2 mt-2 py-4 px-4">
    {#if showX}
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
        <button on:click={simpanX} class="px-2 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
    </div>
    {:else if showXI}
    <div class="mb-4">
        {#each filterData as b}
            <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan} (Kelas XI)</h2>
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
        <button on:click={simpanXI} class="px-2 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
    </div>
    {:else if showXII} 
    <div class="mb-4">
        {#each filterData as b}
            <h2 class="text-md font-bold ml-2">{b.kode} {b.keterangan} (Kelas XII)</h2>
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
        <button on:click={simpanXII} class="px-2 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
    </div>
    {/if}
</div>
{/if}
<div class="flex justify-end gap-2 mt-2 mr-2 text-[12px] font-semibold">
    <button on:click={()=> goto('/dashboard/keuangan/bukti_fisik')} class="px-2 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Kembali</button>
    {#if input.length === 0}
        <button disabled class="px-2 py-1 rounded-md bg-white border-2 border-gray-400 cursor-not-allowed">Simpan Permanent</button>
    {:else}
        <button on:click={konfirmasi} class="px-2 py-1 rounded-md bg-white border-2 border-blue-400 hover:bg-blue-600 hover:text-white">Simpan Permanent</button>
    {/if}
</div>
  