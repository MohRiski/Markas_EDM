import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {username, email, password, jenis_kelamin, tanggal_lahir, alamat, no_hp} = await request.json();
    try {
        const exist = await prisma.pengguna.findFirst({
            where: {email}
        });
        if (exist) {
            return json({
                status: false,
                message: "Email sudah di gunakan"
            }, {status: 400});
        }

        const cekHakAkses = await prisma.hak_akses.count();
        if (cekHakAkses === 0) {
            await prisma.hak_akses.createMany({
                data: [
                    {nama: 'Admin Madrasah'},
                    {nama: 'Kepala Madrasah'},
                    {nama: 'Operator Kesiswaan'},
                    {nama: 'Operator Keuangan'}
                ]
            })
        }
        
        const hashPass = bcrypt.hashSync(password, 10);
        const newDate = new Date(tanggal_lahir);
        const response = await prisma.pengguna.create({
            data: {
                username, email, password: hashPass, jenis_kelamin, tanggal_lahir: newDate, alamat, no_hp
            }
        });
        
        const cekUser = await prisma.pengguna.count();
        const adminRole = await prisma.hak_akses.findFirst({
            where: {
                nama: 'Admin Madrasah'
            }
        });
        if (!adminRole) {
            return json({
                status: false,
                message: "Hak akses masih kosong"
            }, {status: 400});
        }
        if (cekUser === 1) {
            await prisma.hak_akses_pengguna.create({
                data: {
                    id_pengguna: response.id_pengguna,
                    id_hak_akses: adminRole.id_hak_akses
                }
            });
        }

        return json({
            status: true,
            message: "Registrasi berhasil. Silahkan login",
            data: response
        }, {status: 200});
    } catch (error) {
        return json({
            status: false,
            message: "Terjadi Kesalahan",
            error
        }, { status: 500 });
    }
}
