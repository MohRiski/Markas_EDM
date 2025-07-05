import type { Handle } from '@sveltejs/kit';
import { verifyToken } from '$lib/helper/jwt';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const user = token ? verifyToken(token) : null;

	event.locals.user = user;
	
	const isLoggedIn = !!user;
	const path = event.url.pathname;

	const isAuthPage = path === '/' || path === '/register';
	const isRegisPage = path === '/register';
	const isDashboardPage = path.startsWith('/dashboard');
	const isDashboardPageAdmin = path.startsWith('/dashboard/admin');
	const isDashboardPageKepala = path.startsWith('/dashboard/kepala');
	const isDashboardPageKesiswaan = path.startsWith('/dashboard/kesiswaan');
	const isDashboardPageKeuangan = path.startsWith('/dashboard/keuangan');

	if (event.url.pathname.startsWith('/api')) {
		return resolve(event); 
	}

	if (!isLoggedIn && isDashboardPage) {
		throw redirect(302, '/');
	}

	if (isRegisPage) {
		throw redirect(302, '/');
	}

	if (isLoggedIn && isAuthPage) {
		const role = user.hak_akses[0];
		const routeMap: Record<string, string> = {
			'Admin Madrasah': '/dashboard/admin',
			'Kepala Madrasah': '/dashboard/kepala',
			'Operator Kesiswaan': '/dashboard/kesiswaan',
			'Operator Keuangan': '/dashboard/keuangan'
		};

		throw redirect(302, routeMap[role] ?? '/dashboard');
	}

	if (isLoggedIn) {
		const role = user.hak_akses[0];
		if (role === 'Admin Madrasah') {
			if (isDashboardPageKepala || isDashboardPageKesiswaan || isDashboardPageKeuangan) {
				throw redirect(302, '/dashboard/admin');
			}
		} else if (role === 'Kepala Madrasah') {
			if (isDashboardPageAdmin || isDashboardPageKesiswaan || isDashboardPageKeuangan) {
				throw redirect(302, '/dashboard/kepala');
			}
		} else if (role === 'Operator Kesiswaan') {
			if (isDashboardPageKepala || isDashboardPageAdmin || isDashboardPageKeuangan) {
				throw redirect(302, '/dashboard/kesiswaan');
			}
		} else if (role === 'Operator Keuangan') {
			if (isDashboardPageKepala || isDashboardPageKesiswaan || isDashboardPageAdmin) {
				throw redirect(302, '/dashboard/keuangan');
			}
		}
	}

	return resolve(event);
};
