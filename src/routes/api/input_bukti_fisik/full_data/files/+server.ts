import { PrismaClient } from "@prisma/client";
import { json, type RequestEvent } from "@sveltejs/kit";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export async function POST({request, url}: RequestEvent) {
    try {
        const data = await request.formData();
        const file = data.get('file');
        if (!file || !(file instanceof File)) {
            return json({
                status: false,
                message: "File foto tidak valid"
            }, {status: 400});
        }

        const fileName = uuidv4() + path.extname(file.name);
        const filePath = path.join('static/files', fileName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const writableStream = fs.createWriteStream(filePath);
        writableStream.write(buffer);
        writableStream.end();

        return json({
            status: true,
            data: {filename: fileName},
            message: 'File berhasil disimpan'
        }, { status: 200 });
    } catch (error) {
        return json({
            status: false,
            message: 'Gagal menyimpan file',
            error
        }, { status: 500 });
    }
}