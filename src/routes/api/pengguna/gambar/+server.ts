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
    const foto = data.get('foto');
    if (!foto || !(foto instanceof File)) {
        return json({
            status: false,
            message: "File foto tidak valid"
        }, {status: 400});
    }

    const fotoName = uuidv4() + path.extname(foto.name);
    const fotoPath = path.join('static/images', fotoName);

    const arrayBuffer = await foto.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const writableStream = fs.createWriteStream(fotoPath);
    writableStream.write(buffer);
    writableStream.end();

    try {
        const response = await prisma.pengguna.update({
            where: {
              id_pengguna: parseInt(id)
            },
            data: {
              foto: fotoName,
            },
        });
      
        return json({
            status: true,
            message: 'Menu berhasil diperbarui',
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