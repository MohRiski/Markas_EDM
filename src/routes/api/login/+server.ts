import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent} from '@sveltejs/kit';
import { generateToken } from "$lib/helper/jwt";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function POST({request, cookies}: RequestEvent) {
    const {email, password} = await request.json();

    const user = await prisma.pengguna.findFirst({
		where: { email },
		include: { 
            hak_akses_pengguna: {
                include: {
                    hak_akses: true
                }
            } 
        }
	});

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return json({
            error: 'Email tidak ditemukan atau password salah'
        }, {status:401});
    }

    const token = generateToken({
        id: user.id_pengguna,
        username: user.username,
        email: user.email,
        foto: user.foto,
        hak_akses: user.hak_akses_pengguna.map((h)=>h.hak_akses?.nama).filter((nama): nama is string => typeof nama === 'string')
    });

    cookies.set('token', token, {
		httpOnly: true,
		sameSite: 'lax',
        secure: false,
		path: '/',
		maxAge: 60 * 60 * 5
	});

	return json({ message: 'Login berhasil'});
}