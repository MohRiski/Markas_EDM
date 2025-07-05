import { PrismaClient } from "@prisma/client";
import { json, type RequestEvent } from "@sveltejs/kit";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export async function POST({request, url}: RequestEvent) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({
            message: "ID is required"
        }, {status: 400});
    }

    const data = await request.formData();
    const ttd = data.get('ttd');
    if (!ttd || !(ttd instanceof File)) {
        return json({
            status: false,
            message: "File ttd tidak valid"
        }, {status: 400});
    }

    const ttdName = uuidv4() + path.extname(ttd.name);
    const ttdPath = path.join('static/images', ttdName);

    const arrayBuffer = await ttd.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const writableStream = fs.createWriteStream(ttdPath);
    writableStream.write(buffer);
    writableStream.end();

    try {
        const response = await prisma.profile_sekolah.update({
            where: {
              id_profile_sekolah: parseInt(id)
            },
            data: {
              ttd_kepala: ttdName,
            },
        });
      
        return json({
            status: true,
            message: 'berhasil diperbarui',
            data: response
        }, { status: 200 });
    } catch (error) {
        return json({
            status: false,
            message: 'Gagal memperbarui foto pengguna',
            error
        }, { status: 500 });
    }
}