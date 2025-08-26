import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {id_indikator, kode, keterangan, required} = await request.json();
    try {
        const exist = await prisma.bukti_fisik.findFirst({
            where: {kode}
        });
        if (exist) {
            return json({
                status: false,
                message: "Bukti fisik sudah ada"
            }, {status: 400});
        }
        
        const response = await prisma.bukti_fisik.create({
            data: {
                id_indikator: parseInt(id_indikator), kode, keterangan, required
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
        const response = await prisma.bukti_fisik.findMany({
            include: {
                indikator: true,
                input_bukti_fisik: true,
                penugasan_operator: true
            }
        });
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
    const {id_indikator, kode, keterangan, required} = await request.json();
    try {
        const exist = await prisma.bukti_fisik.findUnique({
            where: {
                id_bukti_fisik: parseInt(id)
            }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data Tidak Ditemukan",
            }, { status: 400 });
        }

        const exist1 = await prisma.bukti_fisik.findFirst({
            where: {
                AND: [
                {
                    kode: kode
                },
                {
                    NOT: {
                        id_bukti_fisik: parseInt(id)
                    }
                }
            ]
        }
        });
        if (exist1) {
            return json({
                status: false,
                message: "Bukti fisik sudah ada"
            }, {status: 400});
        }

        const response = await prisma.bukti_fisik.update({
            where: {
                id_bukti_fisik: parseInt(id)
            },
            data: {
                id_indikator: parseInt(id_indikator), kode, keterangan, required
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
        const exist = await prisma.bukti_fisik.findUnique({
        where: {
            id_bukti_fisik: parseInt(id)
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const response = await prisma.bukti_fisik.delete({
            where: {
                id_bukti_fisik: parseInt(id)
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