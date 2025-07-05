import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const { indikator, kunci, tahun } = await request.json();

    try {
        const response = await prisma.input_bukti_fisik.updateMany({
            where: {
                bukti_fisik: {
                    kode: {
                        startsWith: indikator
                    }
                },
                tanggal_input: {
                    gte: new Date(`${tahun}-01-01`),
                    lte: new Date(`${tahun}-12-31`)
                }
            },
            data: {
                kunci: kunci
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