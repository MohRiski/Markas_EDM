import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function GET({request, url}: RequestEvent) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({
            status: false,
            message: 'ID is required'
        }, { status: 400 });
    }
    try {
        const exist = await prisma.profile_sekolah.findUnique({
            where: {
                id_profile_sekolah: parseInt(id)
            }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data Tidak Ditemukan",
            }, { status: 400 });
        }
        return json({
            status: true,
            message: "Data Berhasil Di Ambil",
            data: exist
          }, { status: 200 });
    } catch (error) {
        return json({
            status: false,
            message: "Terjadi Kesalahan",
            error
        }, { status: 500 });
    }
}