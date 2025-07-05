import { PrismaClient } from '@prisma/client';
import { json, type RequestEvent } from '@sveltejs/kit';
const prisma = new PrismaClient();

export async function GET({url}: RequestEvent) {
  const id_bukti_fisik = Number(url.searchParams.get('id_bukti_fisik'));
  const id_tahun_akademik = Number(url.searchParams.get('id_tahun_akademik'));

  const data = await prisma.input_bukti_fisik.findFirst({
    where: {
      id_bukti_fisik,
      id_tahun_akademik
    },
    include: {
      jawaban_bukti_fisik: {
        include: {
          detail_jawaban: true
        }
      }
    }
  });

  if (!data) {
    return new Response(JSON.stringify({ success: false, data: null }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
};
