import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {id_profile_sekolah, tahun, status} = await request.json();
    try {
        const exist = await prisma.tahun_akademik.findFirst({
            where: {tahun}
        });
        if (exist) {
            return json({
                status: false,
                message: "Tahun akademik sudah ada"
            }, {status: 400});
        }
        
        const response = await prisma.tahun_akademik.create({
            data: {
                id_profile_sekolah: parseInt(id_profile_sekolah), tahun: parseInt(tahun), status
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
        const response = await prisma.tahun_akademik.findMany();
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
    const {id_profile_sekolah, tahun, status} = await request.json();
    try {
        const exist = await prisma.tahun_akademik.findUnique({
            where: {
                id_tahun_akademik: parseInt(id)
            }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data Tidak Ditemukan",
            }, { status: 400 });
        }

        const response = await prisma.tahun_akademik.update({
            where: {
                id_tahun_akademik: parseInt(id)
            },
            data: {
                id_profile_sekolah: parseInt(id_profile_sekolah), tahun: parseInt(tahun), status
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
        const exist = await prisma.tahun_akademik.findUnique({
        where: {
            id_tahun_akademik: parseInt(id)
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const response = await prisma.tahun_akademik.delete({
            where: {
                id_tahun_akademik: parseInt(id)
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