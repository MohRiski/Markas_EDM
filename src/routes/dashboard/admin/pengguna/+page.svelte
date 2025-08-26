<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Swal from "sweetalert2";

    let showPassword = false;
    
    let username = '';
    let email = '';
    let password = '';
    let jenis_kelamin = '';
    let tanggal_lahir = '';
    let alamat = '';
    let no_hp = '';
    let foto: File;

    let id = '';

    let usernameEdit = '';
    let emailEdit = '';
    let passwordEdit = '';
    let jenis_kelaminEdit = '';
    let tanggal_lahirEdit = '';
    let alamatEdit = '';
    let no_hpEdit = '';

    let form = "";
    let showForm = false;

    let keyword = '';
    let filterData: any[] = [];
    function cariData() {
        if (keyword.trim() === '') {
            filterData = pengguna;
        } else {
            filterData = pengguna.filter((item) =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(keyword.toLowerCase())
                )
            );
        }
    }

    let pengguna: any[] = [];
    async function dataPengguna() {
    const response = await fetch(`/api/pengguna`, {
        method: 'GET'
    });
    const data = await response.json();
    pengguna = data.data;
    filterData = data.data;
    }

    function dateOnly(datetimeStr: string) {
        const date = new Date(datetimeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    function modalTambah() {
        form = "Tambah"
        showForm = true;
    }

    async function modalEdit(id_pengguna: number) {
        const response = await fetch(`/api/pengguna/id?id=${id_pengguna}`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            id = data.data.id_pengguna;
            usernameEdit = data.data.username;
            emailEdit = data.data.email;
            jenis_kelaminEdit = data.data.jenis_kelamin;
            tanggal_lahirEdit = dateOnly(data.data.tanggal_lahir);
            alamatEdit = data.data.alamat;
            no_hpEdit = data.data.no_hp;
            form = "Edit"
            showForm = true;
        }
    }

    function handleFile(event: any) {
        foto = event.target.files[0];
    }

    async function edit() {
        if (usernameEdit === "" || emailEdit === "" || jenis_kelaminEdit === "" || tanggal_lahirEdit === "" || alamatEdit === "" || no_hpEdit === "") {
			return;
		}
        if (passwordEdit.length < 5 && passwordEdit != "") {
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
            if (!foto) {
                if (passwordEdit === "") {
                    const response = await fetch (`/api/pengguna/nopw?id=${id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            username: usernameEdit, email: emailEdit, jenis_kelamin: jenis_kelaminEdit, tanggal_lahir: tanggal_lahirEdit, alamat: alamatEdit, no_hp: no_hpEdit
                        })
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "Sukses!",
                            text: "Edit data berhasil dilakukan",
                            icon: "success",
                            timer: 3000,
                            background: "#28a745",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        await dataPengguna();
                        showForm = false;
                    } else {
                        Swal.fire({
                            title: "Gagal!",
                            text: "Email sudah digunakan",
                            icon: "error",
                            timer: 3000,
                            background: "#8B0000",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        showForm = false;
                    }
                } else {
                    const response = await fetch (`/api/pengguna?id=${id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            username: usernameEdit, email: emailEdit, password: passwordEdit, jenis_kelamin: jenis_kelaminEdit, tanggal_lahir: tanggal_lahirEdit, alamat: alamatEdit, no_hp: no_hpEdit
                        })
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "Sukses!",
                            text: "Edit data berhasil dilakukan",
                            icon: "success",
                            timer: 3000,
                            background: "#28a745",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        await dataPengguna();
                        showForm = false;
                    } else {
                        Swal.fire({
                            title: "Gagal!",
                            text: "Email sudah digunakan",
                            icon: "error",
                            timer: 3000,
                            background: "#8B0000",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        showForm = false;
                    }
                }
            } else {
                if (passwordEdit === "") {
                    const response = await fetch (`/api/pengguna/nopw?id=${id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            username: usernameEdit, email: emailEdit, jenis_kelamin: jenis_kelaminEdit, tanggal_lahir: tanggal_lahirEdit, alamat: alamatEdit, no_hp: no_hpEdit
                        })
                    });
                    if (response.ok) {
                        const formData = new FormData();
                        formData.append('foto', foto);
                        const respon = await fetch (`/api/pengguna/gambar?id=${id}`,{
                            method: "POST",
                            body: formData
                        });
                        Swal.fire({
                            title: "Sukses!",
                            text: "Edit data berhasil dilakukan",
                            icon: "success",
                            timer: 3000,
                            background: "#28a745",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        await dataPengguna();
                        showForm = false;
                    } else {
                        Swal.fire({
                            title: "Gagal!",
                            text: "Email sudah digunakan",
                            icon: "error",
                            timer: 3000,
                            background: "#8B0000",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        showForm = false;
                    }
                } else {
                    const response = await fetch (`/api/pengguna?id=${id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            username: usernameEdit, email: emailEdit, password: passwordEdit, jenis_kelamin: jenis_kelaminEdit, tanggal_lahir: tanggal_lahirEdit, alamat: alamatEdit, no_hp: no_hpEdit
                        })
                    });
                    if (response.ok) {
                        const formData = new FormData();
                        formData.append('foto', foto);
                        const respon = await fetch (`/api/pengguna/gambar?id=${id}`,{
                            method: "POST",
                            body: formData
                        });
                        Swal.fire({
                            title: "Sukses!",
                            text: "Edit data berhasil dilakukan",
                            icon: "success",
                            timer: 3000,
                            background: "#28a745",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        await dataPengguna();
                        showForm = false;
                    } else {
                        Swal.fire({
                            title: "Gagal!",
                            text: "Email sudah digunakan",
                            icon: "error",
                            timer: 3000,
                            background: "#8B0000",
                            color: "#ffffff",
                            allowOutsideClick: true,
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                        });
                        showForm = false;
                    }
                }
            }
        }
    }

    async function tambah() {
        if (username === "" || email === "" || password === "" || jenis_kelamin === "" || tanggal_lahir === "" || alamat === "" || no_hp === "") {
			return;
		}
        if (password.length < 5) {
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
            const response = await fetch (`/api/pengguna`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                username, email, password, jenis_kelamin, tanggal_lahir, alamat, no_hp
                })
            });
            if (response.ok) {
                if (!foto) {
                    Swal.fire({
                        title: "Sukses!",
                        text: "Data berhasil ditambah",
                        icon: "success",
                        timer: 3000,
                        background: "#28a745",
                        color: "#ffffff",
                        allowOutsideClick: true,
                        showConfirmButton: false,
                        toast: true,
                        position: "top-end",
                    });
                    await dataPengguna();
                    username = '';
                    email = '';
                    password = '';
                    jenis_kelamin = '';
                    tanggal_lahir = '';
                    alamat = '';
                    no_hp = '';
                    showForm = false;
                } else {
                    let data = await response.json();
                    const formData = new FormData();
                    formData.append('foto', foto);
                    const respon = await fetch (`/api/pengguna/gambar?id=${data.data.id_pengguna}`,{
                        method: "POST",
                        body: formData
                    });
                    Swal.fire({
                        title: "Sukses!",
                        text: "Data berhasil ditambah",
                        icon: "success",
                        timer: 3000,
                        background: "#28a745",
                        color: "#ffffff",
                        allowOutsideClick: true,
                        showConfirmButton: false,
                        toast: true,
                        position: "top-end",
                    });
                    await dataPengguna();
                    username = '';
                    email = '';
                    password = '';
                    jenis_kelamin = '';
                    tanggal_lahir = '';
                    alamat = '';
                    no_hp = '';
                    showForm = false;  
                }
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Email sudah digunakan",
                    icon: "error",
                    timer: 3000,
                    background: "#8B0000",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
                showForm = false;
            }
        }
    }

    async function hapus(id_pengguna: string) {
        const result = await Swal.fire({
            title: 'Yakin Di Hapus ?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            width: 300
        });
        if (result.isConfirmed) {
            const response = await fetch(`/api/pengguna?id=${id_pengguna}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await dataPengguna();
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil dihapus",
                    icon: "success",
                    timer: 3000,
                    background: "#28a745",
                    color: "#ffffff",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });           
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: "Data gagal dihapus",
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
            dataPengguna()
        ]);
        } finally {
        loading = false;
        }
    });
</script>

<div class="flex justify-between">
    <h2 class="text-lg font-bold mb-2 ml-4">Pengguna</h2>
    <div class="flex gap-2 items-center mr-4">
        <div class="flex border rounded-md hover:border-2 hover:border-green-400">
            <input type="text" bind:value={keyword} on:input={cariData} placeholder="Cari..." class="rounded h-[18px] w-[120px] md:w-[200px] text-[12px] px-3 py-1 focus:outline-none focus:ring-0 focus:border-transparent" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </div>
        <button on:click={modalTambah} class="text-[12px] h-[20px] bg-white border-2 border-green-400  px-2 font-semibold rounded hover:bg-green-500 flex hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus-icon lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            Tambah
        </button>
    </div> 
</div>

{#if loading}
    <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
{:else}
    <div class="overflow-x-auto overflow-y-auto border rounded-md shadow bg-white ml-4 mr-4 mb-2 mt-2 max-h-[90%] overflow:rounded-r-md">
        <table class="min-w-[1000px]  w-full table-auto">
        <thead class="bg-gray-100 text-left text-sm font-semibold">
            <tr>
            <th class="px-4 py-2">Nama</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Jenis Kelamin</th>
            <th class="px-4 py-2">Tanggal Lahir</th>
            <th class="px-4 py-2">Alamat</th>
            <th class="px-4 py-2">No. Hp</th>
            <th class="px-4 py-2">Foto</th>
            <th class="px-4 py-2">Aksi</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            {#each filterData as p}
            <tr class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{p.username}</td>
                <td class="px-4 py-2">{p.email}</td>
                <td class="px-4 py-2">{p.jenis_kelamin}</td>
                <td class="px-4 py-2">{dateOnly(p.tanggal_lahir)}</td>
                <td class="px-4 py-2">{p.alamat}</td>
                <td class="px-4 py-2">{p.no_hp}</td>
                <td class="px-4 py-2">
                <img src={`/images/${p.foto}`} alt="foto" class="w-8 h-8 rounded-full object-cover" />
                </td>
                <td class="px-4 py-2 flex gap-2">
                <button title="Edit" on:click={() => modalEdit(p.id_pengguna)} class="text-black hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </button>
                <button title="Hapus" on:click={() => hapus(p.id_pengguna)} class="text-black hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
                </td>
            </tr>
            {/each}
        </tbody>
        </table>
    </div>
{/if}
  
<!-- Modal Form -->
{#if showForm}
    {#if form === "Tambah"}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade>
            <div class="bg-white p-4 rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
            <h2 class="text-xl font-bold mb-3">Tambah</h2>
        
            <div class="space-y-2 p-2">
                <div>
                    <label class="block font-semibold text-[14px]">Nama</label>
                    <input type="text" bind:value={username} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Email</label>
                    <input type="text" bind:value={email} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div class="relative">
					<label class="block text-sm font-semibold mb-1" for="password">Password</label>
					<input id="password" type={showPassword ? 'text' : 'password'} bind:value={password} class="w-full h-[34px] px-3 py-2 border text-[12px] border-gray-300 rounded-lg"/>
					<button type="button" class="absolute right-3 top-7 text-gray-600" on:click={() => (showPassword = !showPassword)}>
						{#if showPassword}
							👁️
						{:else}
							👁️‍🗨️
						{/if}
					</button>
				</div>
                <div>
                <label class="block font-semibold text-[14px]">Jenis Kelamin</label>
                <select bind:value={jenis_kelamin} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="Laki_Laki">Laki Laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Tanggal Lahir</label>
                    <input type="date" bind:value={tanggal_lahir} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Alamat</label>
                    <input type="text" bind:value={alamat} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Nomor Hp</label>
                    <input type="text" bind:value={no_hp} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Foto</label>
                    <input type="file" on:change={handleFile} class="w-full h-[34px] border px-3 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" />
                </div>
            </div>
        
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showForm = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Batal</button>
                <button on:click={tambah} class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
            </div>
            </div>
        </div>
    {:else}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade>
            <div class="bg-white p-4 rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
            <h2 class="text-xl font-bold mb-3">Edit</h2>
        
            <div class="space-y-2 p-2">
                <div>
                    <label class="block font-semibold text-[14px]">Nama</label>
                    <input type="text" bind:value={usernameEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Email</label>
                    <input type="text" bind:value={emailEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div class="relative">
					<label class="block text-sm font-semibold mb-1" for="password">Password</label>
					<input id="password" type={showPassword ? 'text' : 'password'} bind:value={passwordEdit} class="w-full h-[34px] px-3 py-2 border text-[12px] border-gray-300 rounded-lg"/>
					<button type="button" class="absolute right-3 top-7 text-gray-600" on:click={() => (showPassword = !showPassword)}>
						{#if showPassword}
							👁️
						{:else}
							👁️‍🗨️
						{/if}
					</button>
                    <p class="text-[10px]">*kosongi password jika tidak ingin di ubah</p>
				</div>
                <div>
                <label class="block font-semibold text-[14px]">Jenis Kelamin</label>
                <select bind:value={jenis_kelaminEdit} class="w-full h-[34px] border px-3 rounded-lg text-[12px]">
                    <option value="">-- Pilih --</option>
                    <option value="Laki_Laki">Laki Laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Tanggal Lahir</label>
                    <input type="date" bind:value={tanggal_lahirEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Alamat</label>
                    <input type="text" bind:value={alamatEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Nomor Hp</label>
                    <input type="text" bind:value={no_hpEdit} class="w-full h-[34px] border px-3 py-2 rounded-lg text-[12px]" required />
                </div>
                <div>
                    <label class="block font-semibold text-[14px]">Foto</label>
                    <input type="file" on:change={handleFile} class="w-full h-[34px] border px-3 py-1 rounded-lg text-[12px] bg-white file:bg-green-600 file:text-white file:rounded-md" />
                    <p class="text-[10px]">*kosongi foto jika tidak ingin di ubah</p>
                </div>
            </div>
        
            <div class="flex justify-end gap-2 mt-4 text-[12px] font-semibold">
                <button on:click={() => showForm = false} class="px-4 py-1 rounded-md bg-white border-2 border-red-400 hover:bg-red-600 hover:text-white">Batal</button>
                <button on:click={edit} class="px-4 py-1 rounded-md bg-White hover:bg-green-600 border-2 border-green-400 hover:text-white">Simpan</button>
            </div>
            </div>
        </div>
    {/if}
{/if}