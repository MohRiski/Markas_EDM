import { PrismaClient } from "@prisma/client";
import { json, type RequestEvent } from "@sveltejs/kit";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export async function POST({request, url}: RequestEvent) {
    try {
        const data = await request.formData();
        const foto = data.get('file');
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

        return json({
            status: true,
            data: {filename: fotoName},
            message: 'Foto berhasil disimpan'
        }, { status: 200 });
    } catch (error) {
        return json({
            status: false,
            message: 'Gagal menyimpan foto',
            error
        }, { status: 500 });
    }
}