import { error } from '@sveltejs/kit';

/**
 * Mengecek apakah user login dan punya salah satu hak akses yang dibutuhkan.
 * @param event - dari route/server
 * @param allowedRoles - daftar hak akses yang diperbolehkan
 */
export function requireAuth(event: { locals: App.Locals }, allowedRoles: string[] = []) {
	const user = event.locals.user;

	if (!user) {
		throw error(401, 'Unauthorized: Anda belum login');
	}

	if (allowedRoles.length > 0 && !allowedRoles.some((role) => user.hak_akses.includes(role))) {
		throw error(403, 'Forbidden: Anda tidak punya hak akses');
	}

	return user; // Kembalikan user jika lolos semua validasi
}
