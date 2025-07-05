import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {id_operator, id_bukti_fisik, id_tahun_akademik, status, kunci} = await request.json();
    try {
        const response = await prisma.input_bukti_fisik.create({
            data: {
                id_operator: parseInt(id_operator), id_bukti_fisik: parseInt(id_bukti_fisik), id_tahun_akademik: parseInt(id_tahun_akademik), status, kunci
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
        const response = await prisma.input_bukti_fisik.findMany();
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
    const {id_operator, id_bukti_fisik, id_tahun_akademik, status, kunci} = await request.json();
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
                id_operator: parseInt(id_operator), id_bukti_fisik: parseInt(id_bukti_fisik), id_tahun_akademik: parseInt(id_tahun_akademik), status, kunci
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
        const exist = await prisma.input_bukti_fisik.findUnique({
        where: {
            id_input_bukti_fisik: parseInt(id)
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const response = await prisma.input_bukti_fisik.delete({
            where: {
                id_input_bukti_fisik: parseInt(id)
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