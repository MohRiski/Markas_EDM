import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function GET({request, url}: RequestEvent) {
    const atb = url.searchParams.get('atb');
    if (!atb) {
        return json({
            status: false,
            message: 'Atribut is required'
        }, { status: 400 });
    }
    try {
        const exist = await prisma.detail_jawaban.findFirst({
            where: {
                atribut: atb
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