<script lang="ts">
    import { onMount } from "svelte";
    import PieChart from '$lib/components/PieChart.svelte';
    import LineChart from "$lib/components/LineChart.svelte";

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

    const allowedKode = ['B3.1', 'E2.1', 'E2.3', 'E3.1'];
    let bukti_fisik: any[] = [];
    async function dataBuktiFisik() {
        const response = await fetch(`/api/bukti_fisik`, {
            method: 'GET'
        });
        const data = await response.json();
        const filter = data.data.filter((item: any) => allowedKode.includes(item.kode));
        bukti_fisik = filter;

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
       
    let loading = true;
    onMount(async()=>{
        try {
        await Promise.all([
            dataBuktiFisik()
        ]);
        } finally {
            loading = false;
        }  
    });
</script>
  
<h2 class="text-lg font-bold ml-4">Dashboard</h2>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="lg:flex justify-between h-[85%] m-4">
        <div class="rounded-lg border shadow-lg h-full lg:w-[40%]">
            {#if chartData.length > 0}
                <p class="text-[14px] font-semibold text-center mt-4">Bukti Fisik Tahun {currentYear}</p>
                <p class="text-[12px] font-medium text-center mt-1 mb-12">Total Bukti Fisik: {bukti_fisik.length}</p>
                <PieChart data={chartData}/>
            {:else}
                <p class="text-center text-gray-500">Sedang memuat data atau tidak ada data untuk tahun ini...</p>
            {/if}
        </div>

        <div class="mt-4 pl-2 pr-2 lg:mt-0 rounded-lg border shadow-lg h-full lg:w-[58%]">
            {#if chartData.length > 0}
                <p class="text-[14px] font-semibold text-center mt-4 mb-14">Perkembangan Input Bukti Fisik Per Bulan</p>
                <LineChart {labels} {datasets} />
            {:else}
                <p class="text-center text-gray-500">Sedang memuat data atau tidak ada data untuk tahun ini...</p>
            {/if}
        </div>
    </div>
{/if}