<script lang="ts">
    import { onMount } from "svelte";
    import PieChart from '$lib/components/PieChart.svelte';
    import LineChart from "$lib/components/LineChart.svelte";

    let loading = true;
    
    let pengguna: any[] = [];
    async function dataPengguna() {
    const response = await fetch(`/api/pengguna`, {
        method: 'GET'
    });
    const data = await response.json();
    pengguna = data.data;
    }

    const statusColors: Record<string, string> = {
		Belum_dikerjakan: '#facc15',
		Menunggu_validasi: '#60a5fa',
		Diterima: '#4ade80',
		Ditolak: '#f87171'
	};

    let chartData: { label: string; value: number; color: string }[] = [];
    let currentYear = new Date().getFullYear();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
	let labels = monthNames;
	let datasets: any[] = [];

    let bukti_fisik: any[] = [];
    let all_bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const res = await fetch(`/api/bukti_fisik`);
        const json = await res.json();
        all_bukti_fisik = json.data;
        const filtered = json.data.filter((item: any) =>
            item.input_bukti_fisik.length > 0 &&
            item.input_bukti_fisik.some((ibf: any) => ibf.status !== 'Belum_dikerjakan')
        );
        bukti_fisik = filtered;

		// Hitung jumlah berdasarkan status untuk tahun saat ini
		const statusCounts: Record<string, number> = {};
		for (const item of bukti_fisik) {
			for (const input of item.input_bukti_fisik) {
				const tgl = new Date(input.tanggal_input);
				if (tgl.getFullYear() === currentYear) {
					statusCounts[input.status] = (statusCounts[input.status] || 0) + 1;
				}
			}
		}

        // Buat data Pie chart
		chartData = Object.entries(statusCounts).map(([status, value]) => ({
			label: status,
			value,
			color: statusColors[status] || '#a3a3a3' // default abu-abu
		}));

        // Format: { status: [jumlah per bulan] } Line Chart
		const statusPerBulan: Record<string, number[]> = {};

        for (const item of bukti_fisik) {
            for (const input of item.input_bukti_fisik) {
                const tanggal = new Date(input.tanggal_input);
                const y = tanggal.getFullYear();
                const m = tanggal.getMonth(); // 0 - 11

                if (y === currentYear) {
                    if (!statusPerBulan[input.status]) {
                        statusPerBulan[input.status] = new Array(12).fill(0);
                    }
                    statusPerBulan[input.status][m]++;
                }
            }
        }

        datasets = Object.entries(statusPerBulan).map(([status, data]) => ({
            label: status,
            data,
            borderColor: statusColors[status] || '#a3a3a3',
            backgroundColor: statusColors[status] || '#a3a3a3',
            fill: false,
            tension: 0.3
        }));
    }

    onMount(async()=>{
        try {
        await Promise.all([
            dataPengguna(),
            dataBuktiFisik()
        ]);
        } finally {
        loading = false;
        }  
    });

    $: cards = [
        { title: 'Pengguna', value: pengguna.length, color: 'bg-blue-500', link: '/dashboard/kepala/operator' },
        { title: 'Bukti Fisik Diajukan', value: bukti_fisik.length, color: 'bg-yellow-400', link: '/dashboard/kepala/bukti_fisik' },
        { title: 'Total Bukti Fisik', value: all_bukti_fisik.length, color: 'bg-red-500', link: '/dashboard/kepala/bukti_fisik' }
    ];
</script>
  
<h2 class="text-lg font-bold ml-4">Dashboard</h2>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="m-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {#each cards as card}
        <div class={`p-4 rounded-xl text-white shadow-lg ${card.color}`}>
            <div class="flex justify-between items-center">
            <div>
                <p class="text-2xl font-semibold">{card.value}</p>
                <p class="text-sm opacity-80">{card.title}</p>
            </div>
            <div class="text-4xl">
                <a href={card.link}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/></svg>
                </a>
            </div>
            </div>
        </div>
        {/each}
    </div>

    <div class="lg:flex justify-between h-[70%] m-4">
        <div class="rounded-lg border shadow-lg h-full lg:w-[40%]">
            {#if chartData.length > 0}
                <p class="text-[14px] font-semibold text-center mt-2 mb-2">Validasi Bukti Fisik Tahun {currentYear}</p>
                <PieChart data={chartData}/>
            {:else}
                <p class="text-center text-gray-500">Sedang memuat data atau tidak ada data untuk tahun ini...</p>
            {/if}
        </div>
    
        <div class="mt-4 pl-2 pr-2 lg:mt-0 rounded-lg border shadow-lg h-full lg:w-[58%]">
            {#if chartData.length > 0}
                <p class="text-[14px] font-semibold text-center mt-2 mb-2">Perkembangan Validasi Bukti Fisik Per Bulan</p>
                <LineChart {labels} {datasets} />
            {:else}
                <p class="text-center text-gray-500">Sedang memuat data atau tidak ada data untuk tahun ini...</p>
            {/if}
        </div>
    </div>
{/if}

