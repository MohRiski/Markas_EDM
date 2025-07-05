import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function POST({request}: RequestEvent) {
  try {
    const body = await request.json();
    
    const input = await prisma.input_bukti_fisik.create({
      data: {
        id_operator: body.id_operator,
        id_bukti_fisik: body.id_bukti_fisik,
        id_tahun_akademik: body.id_tahun_akademik,
        status: body.status,
        kunci: body.kunci,
        jawaban_bukti_fisik: {
          create: {
            detail_jawaban: {
              create: body.jawaban.map((j: { atribut: any; nilai: any; }) => ({
                atribut: j.atribut,
                nilai: j.nilai
              }))
            }
          }
        }
      }
    });

    return new Response(JSON.stringify({ success: true, data: input }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: 'Terjadi kesalahan saat menyimpan.' }), {
      status: 500
    });
  }
};
