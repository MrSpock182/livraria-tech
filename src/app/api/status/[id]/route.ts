import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const accessToken = process.env.MP_AUTH;

  if (!accessToken) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao consultar pagamento' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({ status: data.status });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
