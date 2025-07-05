<script lang="ts">
	import Swal from "sweetalert2";
	import {goto} from "$app/navigation";

	let username = "";
	let email = "";
	let password = "";
	let konPassword = "";
	let jenis_kelamin = "";
	let tanggal_lahir = "";
	let alamat = "";
	let no_hp = "";
	let foto: File;

	$: panjangPass = password.length;

	function handleInputNoHp(event: Event) {
		const target = event.target as HTMLInputElement;
		no_hp = target.value.replace(/[^0-9]/g, '');
	}

	function handleFile(event: any) {
        foto = event.target.files[0];
    }

	let showPassword = false;
	let showConfirmPassword = false;

	async function register() {
		if (username === "" || email === "" || password === "" || jenis_kelamin === "" || tanggal_lahir === "" || alamat === "" || no_hp === "") {
			return;
		}
		if (panjangPass<5) {
			Swal.fire({
				title: "Perhatian!",
				text: "Password terlalu pendek minimal 5 karakter",
				icon: "warning",
				timer: 5000,
				background: "#FF8C00",
				color: "#ffffff",
				allowOutsideClick: true,
				showConfirmButton: false,
				toast: true,
				position: "top-end",
			});
		} else {
			if (konPassword != password) {
				Swal.fire({
					title: "Perhatian!",
					text: "Konfirmasi password tidak sama",
					icon: "warning",
					timer: 5000,
					background: "#FF8C00",
					color: "#ffffff",
					allowOutsideClick: true,
					showConfirmButton: false,
					toast: true,
					position: "top-end",
				});
			} else {
				const response = await fetch (`/api/register`, {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						username, email, password, jenis_kelamin, tanggal_lahir, alamat, no_hp
					})
				});
				
				if (response.ok) {
					let data = await response.json();
					const formData = new FormData();
					formData.append("foto", foto);
					const respon = await fetch (`/api/pengguna/gambar?id=${data.data.id_pengguna}`,{
						method: "POST",
						body: formData
					});
					Swal.fire({
						title: "Registrasi Sukses!",
						text: "Selamat Registrasi Berhasil Di Lakukan!. Silahkan login",
						icon: "success",
						timer: 3000,
						background: "#28a745",
						color: "#ffffff",
						allowOutsideClick: true,
						showConfirmButton: false,
						toast: true,
						position: "top-end",
					});
					goto("/");
				} else {
					Swal.fire({
						title: "Registrasi Gagal!",
						text: "Email Sudah Ada. Coba Registrasi Ulang Dengan Email Lain!",
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
	}

</script>

<div class="flex items-center justify-center min-h-screen bg-white">
	<div class="flex flex-col md:flex-row bg-green-50 rounded-md shadow-lg w-[90%] max-w-5xl p-8 mt-4 mb-4">
		
		<!-- Gambar -->
		<div class="hidden md:flex items-center justify-center w-full md:w-1/2 bg-green-800 rounded-l-xl shadow-lg">
            <div class="w-[90%] m-8">
                <h2 class="text-2xl font-semibold text-white">Register to</h2>
			    <h1 class="text-3xl font-bold text-green-400 mb-6">MARKAS EDM</h1>
                <img src="/icon/register.svg" alt="Logo" class="w-[100%]" />
            </div>
		</div>

		<!-- Form Registrasi -->
		<div class="w-full md:w-1/2 pl-6">
			<form>
				<!-- Nama -->
				<div class="mb-1">
					<label class="block text-sm font-semibold" for="nama">Nama</label>
					<input id="nama" type="text" bind:value={username} class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
				</div>

				<!-- Email -->
				<div class="mb-1">
					<label class="block text-sm font-semibold" for="email">Email</label>
					<input id="email" type="email" bind:value={email} class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
				</div>

				<!-- Password -->
				<div class="mb-1 relative">
					<label class="block text-sm font-semibold" for="password">Password</label>
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<button
						type="button"
						class="absolute right-3 top-6 text-gray-600"
						on:click={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							👁️
						{:else}
							👁️‍🗨️
						{/if}
					</button>
				</div>

				<!-- Ulangi Password -->
				<div class="mb-1 relative">
					<label class="block text-sm font-semibold" for="confirm">Ulangi Password</label>
					<input
						id="confirm"
						type={showConfirmPassword ? 'text' : 'password'}
						bind:value={konPassword}
						class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<button
						type="button"
						class="absolute right-3 top-6 text-gray-600"
						on:click={() => (showConfirmPassword = !showConfirmPassword)}
					>
						{#if showConfirmPassword}
							👁️
						{:else}
							👁️‍🗨️
						{/if}
					</button>
				</div>

				<!-- Jenis Kelamin -->
				<div class="mb-1">
					<label class="block text-sm font-semibold" for="jk">Jenis Kelamin</label>
					<select id="jk" bind:value={jenis_kelamin} class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
						<option value="">Pilih</option>
						<option value="Laki_Laki">Laki-laki</option>
						<option value="Perempuan">Perempuan</option>
					</select>
				</div>

				<!-- Tanggal Lahir -->
				<div class="mb-1">
					<label class="block text-sm font-semibold" for="tgl">Tanggal Lahir</label>
					<input id="tgl" type="date" bind:value={tanggal_lahir} class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
				</div>

				<!-- Alamat -->
				<div class="mb-1">
					<label class="block text-sm font-semibold" for="alamat">Alamat</label>
					<textarea id="alamat" bind:value={alamat} rows="2" class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
				</div>

				<!-- Nomor HP -->
				<div class="mb-1">
					<label class="block text-sm font-semibold" for="nohp">Nomor Hp</label>
					<input id="nohp" type="text" bind:value={no_hp} on:input={handleInputNoHp} class="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
				</div>

				<!-- Foto -->
				<div class="mb-4">
					<label class="block text-sm font-semibold" for="foto">Foto</label>
					<input id="foto" type="file" on:change={handleFile} class="w-full border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-800 file:text-white hover:file:bg-green-600" />
				</div>

				<!-- Tombol -->
				<button type="submit" on:click={register} class="w-full bg-green-800 hover:bg-green-600 text-white font-bold py-2 rounded-md transition">
					Daftar
				</button>
			</form>
		</div>
	</div>
</div>
