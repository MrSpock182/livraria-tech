import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    console.log('🔍 Headers recebidos:', headers);
    console.log('📦 Body recebido (raw):', rawBody);

    const body = JSON.parse(rawBody);
    console.log('🧾 JSON:', body);

    return NextResponse.json({ status: 'ok' });

    // const secret = process.env.MP_SIGNATURE_SECRET;

    // if (!secret) {
    //     console.error('Assinatura secreta não configurada em MP_SIGNATURE_SECRET');
    //     return NextResponse.json({ error: 'Configuração ausente' }, { status: 500 });
    // }

    // const rawBody = await req.text();
    // const signatureHeader = req.headers.get('x-signature');

    // if (!signatureHeader) {
    //     console.warn('Assinatura ausente no cabeçalho');
    //     return NextResponse.json({ error: 'Assinatura ausente' }, { status: 401 });
    // }

    // const expectedSignature = 'sha256=' + crypto
    //     .createHmac('sha256', secret)
    //     .update(rawBody)
    //     .digest('hex');

    // if (signatureHeader !== expectedSignature) {
    //     console.warn('Assinatura inválida!');
    //     return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    // }

    // const body = JSON.parse(rawBody);
    // const { type, data } = body;

    // console.log('Webhook recebido!');
    // console.log('Tipo:', type);
    // console.log('Data:', data);

    // if (type === 'payment' && data?.id) {
    //     console.log(`Simulando busca por pagamento ID ${data.id}`);

    //     const pagamento = {
    //     status: 'approved',
    //     transaction_amount: 1,
    //     id: data.id,
    //     };

    //     if (pagamento.status === 'approved') {
    //     console.log(`PIX aprovado de R$${pagamento.transaction_amount}`);
    //     } else {
    //     console.log('Pagamento ainda não aprovado:', pagamento.status);
    //     }
    // }

    // return NextResponse.json({ status: 'ok' });
}