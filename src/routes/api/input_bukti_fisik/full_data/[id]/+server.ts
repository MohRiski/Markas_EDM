import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function PUT({ request, params }) {
    const id_input_bukti_fisik = parseInt(params.id);

    if (isNaN(id_input_bukti_fisik)) {
        return json({ success: false, message: 'ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();
    const {
        status,
        kunci,
        catatan,
        jawaban
    } = body;

    try {
        // Cari data yang ada
        const existing = await prisma.input_bukti_fisik.findUnique({
            where: { id_input_bukti_fisik },
            include: {
                jawaban_bukti_fisik: {
                    include: { detail_jawaban: true }
                }
            }
        });

        if (!existing) {
            return json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
        }

        if (jawaban) {
            // 1. Hapus semua detail_jawaban terkait
            await prisma.detail_jawaban.deleteMany({
                where: {
                    jawaban_bukti_fisik: {
                        id_input_bukti_fisik
                    }
                }
            });
        
            // 2. Hapus semua jawaban_bukti_fisik
            await prisma.jawaban_bukti_fisik.deleteMany({
                where: {
                    id_input_bukti_fisik
                }
            });
        }

        // 3. Update input_bukti_fisik dan tambahkan jawaban baru jika ada
        const updated = await prisma.input_bukti_fisik.update({
            where: { id_input_bukti_fisik },
            data: {
                status: status ?? existing.status,
                kunci: kunci ?? existing.kunci,
                catatan: catatan ?? null,
                tanggal_input: new Date(),

                ...(jawaban && {
                    jawaban_bukti_fisik: {
                        create: {
                            detail_jawaban: {
                                create: jawaban.map((j: any) => ({
                                    atribut: j.atribut,
                                    nilai: j.nilai
                                }))
                            }
                        }
                    }
                })
            }
        });

        return json({ success: true, message: 'Berhasil update', data: updated });
    } catch (error) {
        console.error('Gagal update:', error);
        return json({ success: false, message: 'Terjadi kesalahan saat update data' }, { status: 500 });
    }
}
