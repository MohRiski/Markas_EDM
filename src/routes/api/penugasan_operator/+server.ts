import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {id_hak_akses, id_bukti_fisik} = await request.json();
    try {
        const response = await prisma.penugasan_operator.create({
            data: {
                id_hak_akses: parseInt(id_hak_akses), id_bukti_fisik: parseInt(id_bukti_fisik)
            }
        });
        return json({
            status: true,
            message: "Data berhasil di tambah",
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

export async function GET() {
    try {
        const response = await prisma.penugasan_operator.findMany();
        if (response.length === 0) {
            return json({
                status: false,
                message: "Data kosong",
            }, {status: 400})
        }
        return json({
            status: true,
            message: "Data Berhasil Di Ambil",
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

export async function PUT({request, url}: RequestEvent) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({
            status: false,
            message: 'ID is required'
        }, { status: 400 });
    }
    const {id_hak_akses, id_bukti_fisik} = await request.json();
    try {
        const exist = await prisma.penugasan_operator.findUnique({
            where: {
                id_penugasan_operator: parseInt(id)
            }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data Tidak Ditemukan",
            }, { status: 400 });
        }

        const response = await prisma.penugasan_operator.update({
            where: {
                id_penugasan_operator: parseInt(id)
            },
            data: {
                id_hak_akses: parseInt(id_hak_akses), id_bukti_fisik: parseInt(id_bukti_fisik)
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

export async function DELETE({ url }: RequestEvent) {
    const id = url.searchParams.get('id');
    if (!id) {
      return json({
        status: false,
        message: 'ID is required'
      }, { status: 400 });
    }
    try {
        const exist = await prisma.penugasan_operator.findUnique({
        where: {
            id_penugasan_operator: parseInt(id)
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const response = await prisma.penugasan_operator.delete({
            where: {
                id_penugasan_operator: parseInt(id)
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