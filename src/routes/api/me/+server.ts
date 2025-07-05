import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	}

	return new Response(JSON.stringify({ user: locals.user }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
