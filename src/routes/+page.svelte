<script lang="ts">
	import Swal from "sweetalert2";
	import {goto} from "$app/navigation";
    import { onMount } from "svelte";

	let email = "";
	let password = "";
	let showPassword = false;
	
	$: jumlahPeng = 0;

	async function loadPengguna() {
		const response = await fetch (`/api/pengguna`, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});
		if (response.ok) {
			let pengguna = await response.json();
			jumlahPeng = pengguna.data.length;
		}		
	}

	async function login() {
		if (email === "" || password === "") {
			return;
		}
		const response = await fetch (`/api/login`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				email, password
			}),
			credentials: "include"
		});
		if (response.ok) {
			await new Promise(resolve => setTimeout(resolve, 1000));
			const res = await fetch("/api/me", {
				method: "GET",
				credentials: "include"
			});
			if (res.ok) {
				const result = await res.json();
				const role = result.user.hak_akses[0];
				switch (role) {
					case "Admin Madrasah":
						Swal.fire({
							title: "Login Sukses!",
							text: "Selamat beraktivitas",
							icon: "success",
							timer: 3000,
							background: "#28a745",
							color: "#ffffff",
							allowOutsideClick: true,
							showConfirmButton: false,
							toast: true,
							position: "top-end",
						});
						goto("/dashboard/admin");
						break;
					case "Kepala Madrasah":
						Swal.fire({
							title: "Login Sukses!",
							text: "Selamat beraktivitas",
							icon: "success",
							timer: 3000,
							background: "#28a745",
							color: "#ffffff",
							allowOutsideClick: true,
							showConfirmButton: false,
							toast: true,
							position: "top-end",
						});
						goto("/dashboard/kepala");
						break;
					case "Operator Kesiswaan":
						Swal.fire({
							title: "Login Sukses!",
							text: "Selamat beraktivitas",
							icon: "success",
							timer: 3000,
							background: "#28a745",
							color: "#ffffff",
							allowOutsideClick: true,
							showConfirmButton: false,
							toast: true,
							position: "top-end",
						});
						goto("/dashboard/kesiswaan");
						break;
					case "Operator Keuangan":
						Swal.fire({
							title: "Login Sukses!",
							text: "Selamat beraktivitas",
							icon: "success",
							timer: 3000,
							background: "#28a745",
							color: "#ffffff",
							allowOutsideClick: true,
							showConfirmButton: false,
							toast: true,
							position: "top-end",
						});
						goto("/dashboard/keuangan");
						break;
					default:
						Swal.fire({
							title: "Login Gagal!",
							text: "User belum memiliki hak akses!",
							icon: "error",
							timer: 3000,
							background: "#8B0000",
							color: "#ffffff",
							allowOutsideClick: true,
							showConfirmButton: false,
							toast: true,
							position: "top-end",
						});
						goto("/");
						break;
				}
			} else {
				Swal.fire({
					title: "Gagal Mengambil Data!",
					text: "Silakan login ulang.",
					icon: "error",
					timer: 3000,
					background: "#8B0000",
					color: "#ffffff",
					showConfirmButton: false,
					toast: true,
					position: "top-end",
				});
			}
		} else {
			Swal.fire({
				title: "Login Gagal!",
				text: "Cek kembali email dan password anda!",
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

	onMount(()=>{
		loadPengguna();
	});
</script>

<div class="flex items-center justify-center min-h-screen bg-white">
	<div class="flex flex-col md:flex-row bg-green-50 rounded-2xl shadow-lg w-[90%] max-w-4xl p-8">
		<!-- Gambar -->
		<div class="hidden md:flex items-center justify-center w-full md:w-1/2 bg-green-800 rounded-l-2xl shadow-lg">
            <img src="/icon/login.svg" alt="Logo" class="w-[70%]" />
        </div>

		<!-- Form Login -->
		<div class="w-full md:w-1/2 p-6">
			<h2 class="text-2xl font-semibold">Login to</h2>
			<h1 class="text-3xl font-bold text-green-800 mb-6">MARKAS EDM</h1>

			<form>
				<div class="mb-4">
					<label class="block text-sm font-semibold mb-1" for="email">Email</label>
					<input
						id="email"
						type="email"
						required
						bind:value={email}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
				</div>

				<div class="mb-4 relative">
					<label class="block text-sm font-semibold mb-1" for="password">Password</label>
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						required
						bind:value={password}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<!-- Toggle Password -->
					<button
						type="button"
						class="absolute right-3 top-9 text-gray-600"
						on:click={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							👁️
						{:else}
							👁️‍🗨️
						{/if}
					</button>
				</div>

				<button
					type="submit"
					on:click={login}
					class="w-full bg-green-800 hover:bg-green-600 text-white font-bold py-2 rounded-md transition"
				>
					MASUK
				</button>
			</form>

			{#if jumlahPeng === 0}
			<p class="mt-4 text-center text-sm">
				Belum punya akun?
				<a href="/register" class="text-green-600 font-semibold hover:underline">Daftar</a>
			</p>
			{:else}
			<p class=" hidden mt-4 text-center text-sm">
				Belum punya akun?
				<a href="/register" class="text-green-600 font-semibold hover:underline">Daftar</a>
			</p>
			{/if}
		</div>
	</div>
</div>
