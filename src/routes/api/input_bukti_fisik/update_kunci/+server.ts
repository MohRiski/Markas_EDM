import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function PUT({request, url}: RequestEvent) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({
            status: false,
            message: 'ID is required'
        }, { status: 400 });
    }
    const {kunci} = await request.json();
    try {
        const exist = await prisma.input_bukti_fisik.findUnique({
            where: {
                id_input_bukti_fisik: parseInt(id)
            }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data Tidak Ditemukan",
            }, { status: 400 });
        }

        const response = await prisma.input_bukti_fisik.update({
            where: {
                id_input_bukti_fisik: parseInt(id)
            },
            data: {
                kunci
            }
        });
        return json({
            status: true,
            message: "Data Berhasil Di Ubah",
            data: response
          }, { status: 200 });
    } catch (error) {
        return json({
            status: false,
            message: "Terjadi Kesalahan",
            error
        }, { status: 500 });
    }
}