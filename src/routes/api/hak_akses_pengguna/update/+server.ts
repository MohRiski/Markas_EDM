import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
    try {
        const { id_pengguna, selectedHakAkses } = await request.json();

        //Ambil hak akses sebelumnya
        const existing = await prisma.hak_akses_pengguna.findMany({
            where: { id_pengguna },
            select: { id_hak_akses: true }
        });

        const existingIds = existing.map((e) => e.id_hak_akses);

        //Hak akses baru yang perlu ditambahkan
        const toAdd = selectedHakAkses.filter((id: number) => !existingIds.includes(id));

        //Hak akses lama yang perlu dihapus
        const toDelete = existingIds.filter((id) => !selectedHakAkses.includes(id));

        //Insert hak akses baru
        await prisma.hak_akses_pengguna.createMany({
            data: toAdd.map((id_hak_akses: any) => ({
                id_pengguna,
                id_hak_akses
            })),
            skipDuplicates: true
        });

        //Delete hak akses yang tidak lagi dipilih
        await prisma.hak_akses_pengguna.deleteMany({
            where: {
                id_pengguna,
                id_hak_akses: { in: toDelete }
            }
        });

        return json({ status: true, message: "Hak akses pengguna diperbarui." });
    } catch (error) {
        return json({
            status: false,
            message: "Terjadi Kesalahan",
            error
        }, { status: 500 });
    }
}