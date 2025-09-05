import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const secret = process.env.MP_SIGNATURE_SECRET!;
  const rawBody = await req.text();

  const headers = req.headers;
  const signatureHeader = headers.get('x-signature') || '';
  const requestId = headers.get('x-request-id') || '';

  const sigMap: Record<string, string> = {};
  signatureHeader.split(',').forEach(part => {
    const [k, v] = part.split('=');
    if (k && v) sigMap[k.trim()] = v.trim();
  });

  const ts = sigMap.ts;
  const receivedSignature = sigMap.v1;

  if (!ts || !receivedSignature) {
    console.warn('Assinatura malformada:', signatureHeader);
    return NextResponse.json({ error: 'Assinatura malformada' }, { status: 401 });
  }

  const jsonBody = JSON.parse(rawBody);
  const id = (jsonBody.data?.id || '').toString().toLowerCase();

  const manifest = `id:${id};request-id:${requestId};ts:${ts};`;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  console.log('Raw body:', rawBody);
  console.log('Manifest:', manifest);
  console.log('Esperada:', expectedSignature);
  console.log('Recebida:', receivedSignature);

  if (expectedSignature !== receivedSignature) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  console.log('Webhook válido!', jsonBody);
  return NextResponse.json({ status: 'ok' });
}
