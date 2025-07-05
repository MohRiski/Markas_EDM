<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	Chart.register(...registerables);

	export let data: { label: string; value: number; color: string }[] = [];

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		if (chart) chart.destroy();

		chart = new Chart(canvas, {
			type: 'pie',
			data: {
				labels: data.map(d => d.label),
				datasets: [{
					data: data.map(d => d.value),
					backgroundColor: data.map(d => d.color),
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'bottom' },
					title: { display: false, text: 'Bukti Fisik' }
				}
			}
		});
	});
</script>

<canvas bind:this={canvas} class="max-w-md mx-auto"></canvas>
