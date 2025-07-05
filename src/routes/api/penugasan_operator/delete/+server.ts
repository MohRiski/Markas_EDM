import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function DELETE({ request }: RequestEvent) {
    const {id_bukti_fisik, id_hak_akses} = await request.json();
    if (!id_bukti_fisik) {
      return json({
        status: false,
        message: 'ID is required'
      }, { status: 400 });
    }
    if (!id_hak_akses) {
      return json({
        status: false,
        message: 'ID is required'
      }, { status: 400 });
    }
    try {
        const exist = await prisma.penugasan_operator.findFirst({
        where: {
            AND: [
                {
                    id_hak_akses: parseInt(id_hak_akses)   
                },
                {
                    id_bukti_fisik: parseInt(id_bukti_fisik)
                }
            ]
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const response = await prisma.penugasan_operator.deleteMany({
            where: {
                AND: [
                    {
                        id_hak_akses: parseInt(id_hak_akses)   
                    },
                    {
                        id_bukti_fisik: parseInt(id_bukti_fisik)
                    }
                ]
            }
        });
        return json({
            status: true,
            message: "Data Berhasil Di Hapus",
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