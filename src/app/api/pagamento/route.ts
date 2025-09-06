import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  const idempotencyKey = Math.random().toString();
  const token = process.env.MP_AUTH;

  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      transaction_amount: 1,
      description: 'Acesso ao serviço Micro SaaS',
      payment_method_id: 'pix',
      payer: {
        email,
        first_name: '',
        last_name: '',
      },
    }),
  });

  const resultado = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: resultado }, { status: response.status });
  }

  return NextResponse.json(resultado);
}