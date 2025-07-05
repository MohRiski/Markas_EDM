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
    const logo = data.get('logo');
    if (!logo || !(logo instanceof File)) {
        return json({
            status: false,
            message: "File logo tidak valid"
        }, {status: 400});
    }

    const logoName = uuidv4() + path.extname(logo.name);
    const logoPath = path.join('static/images', logoName);

    const arrayBuffer = await logo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const writableStream = fs.createWriteStream(logoPath);
    writableStream.write(buffer);
    writableStream.end();

    try {
        const response = await prisma.profile_sekolah.update({
            where: {
              id_profile_sekolah: parseInt(id)
            },
            data: {
              logo: logoName,
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