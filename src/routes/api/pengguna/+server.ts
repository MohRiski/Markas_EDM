import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    const {username, email, password, jenis_kelamin, tanggal_lahir, alamat, no_hp} = await request.json();
    try {
        const exist = await prisma.pengguna.findFirst({
            where: {email}
        });
        if (exist) {
            return json({
                status: false,
                message: "Email sudah di gunakan"
            }, {status: 400});
        }
        
        const hashPass = bcrypt.hashSync(password, 10);
        const newDate = new Date(tanggal_lahir);
        const response = await prisma.pengguna.create({
            data: {
                username, email, password: hashPass, jenis_kelamin, tanggal_lahir: newDate, alamat, no_hp
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
        const response = await prisma.pengguna.findMany({
            include: {
                hak_akses_pengguna: {
                    include: {
                        hak_akses: true
                    }
                }
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
    const {username, email, password, jenis_kelamin, tanggal_lahir, alamat, no_hp} = await request.json();
    try {
        const exist = await prisma.pengguna.findUnique({
            where: {
                id_pengguna: parseInt(id)
            }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data Tidak Ditemukan",
            }, { status: 400 });
        }

        const exist1 = await prisma.pengguna.findFirst({
            where: {AND: [
                {
                    email: email
                },
                {
                    NOT: {
                        id_pengguna: parseInt(id)
                    }
                }
            ]}
        });
        if (exist1) {
            return json({
                status: false,
                message: "Email sudah di gunakan"
            }, {status: 400});
        }
        
        const hashPass = bcrypt.hashSync(password, 10);
        const newDate = new Date(tanggal_lahir);
        const response = await prisma.pengguna.update({
            where: {
                id_pengguna: parseInt(id)
            },
            data: {
                username, email, password: hashPass, jenis_kelamin, tanggal_lahir: newDate, alamat, no_hp
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
        const exist = await prisma.pengguna.findUnique({
        where: {
            id_pengguna: parseInt(id)
        }
        });
        if (!exist) {
            return json({
                status: false,
                message: "Data tidak ditemukan",
            }, { status: 400 });
        }
        const foto = exist.foto;
        if (foto) {
            const imagePath = path.join('static/images', foto);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        const response = await prisma.pengguna.delete({
            where: {
                id_pengguna: parseInt(id)
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