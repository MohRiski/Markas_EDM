<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	Chart.register(...registerables);

	export let labels: string[] = [];
	export let datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string }[] = [];

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		if (chart) chart.destroy();

		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					title: { display: false, text: 'Perkembangan Bukti Fisik per Bulan' }
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});
	});
</script>

<canvas bind:this={canvas} class="w-full max-w-4xl mx-auto"></canvas>
