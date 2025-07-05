import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export async function PUT({request, url}: RequestEvent) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({
            status: false,
            message: 'ID is required'
        }, { status: 400 });
    }
    const {username, email, jenis_kelamin, tanggal_lahir, alamat, no_hp} = await request.json();
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
        
        const newDate = new Date(tanggal_lahir);
        const response = await prisma.pengguna.update({
            where: {
                id_pengguna: parseInt(id)
            },
            data: {
                username, email, jenis_kelamin, tanggal_lahir: newDate, alamat, no_hp
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
