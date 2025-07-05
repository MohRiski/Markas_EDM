import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {nama, npsn, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala} = await request.json();
    try {
        const exist = await prisma.profile_sekolah.findFirst({
            where: {npsn}
        });
        if (exist) {
            return json({
                status: false,
                message: "Sekolah sudah di ada"
            }, {status: 400});
        }
        
        const response = await prisma.profile_sekolah.create({
            data: {
                nama, npsn, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala
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
        const response = await prisma.profile_sekolah.findMany();
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
    const {nama, npsn, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala} = await request.json();
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

        const response = await prisma.profile_sekolah.update({
            where: {
                id_profile_sekolah: parseInt(id)
            },
            data: {
                nama, npsn, alamat, akreditasi, jenjang_pendidikan, status_pendidikan, kepala
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
        const exist = await prisma.profile_sekolah.findUnique({
        where: {
            id_profile_sekolah: parseInt(id)
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const logo = exist.logo;
        if (logo) {
            const imagePath = path.join('static/images', logo);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        const response = await prisma.profile_sekolah.delete({
            where: {
                id_profile_sekolah: parseInt(id)
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