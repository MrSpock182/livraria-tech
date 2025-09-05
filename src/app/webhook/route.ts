import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    const secret = process.env.MP_SIGNATURE_SECRET;

    if (!secret) {
        console.error('Assinatura secreta não configurada');
        return NextResponse.json({ error: 'Configuração ausente' }, { status: 500 });
    }

    const rawBody = await req.text();
    const signatureHeader = req.headers.get('x-signature');

    if (!signatureHeader) {
        console.warn('Assinatura ausente no cabeçalho');
        return NextResponse.json({ error: 'Assinatura ausente' }, { status: 401 });
    }

    const signatureParts = signatureHeader.split(',');
    const signatureMap: Record<string, string> = {};

    for (const part of signatureParts) {
        const [key, value] = part.split('=');
        signatureMap[key.trim()] = value.trim();
    }

    const receivedSignature = signatureMap['v1'];
    const timestamp = signatureMap['ts'];

    if (!receivedSignature || !timestamp) {
        console.warn('Formato da assinatura inválido');
        return NextResponse.json({ error: 'Assinatura malformada' }, { status: 401 });
    }

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
    
    if (expectedSignature !== receivedSignature) {
        console.warn('Assinatura inválida!');
        console.log('Esperada:', expectedSignature);
        console.log('Recebida:', receivedSignature);
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    console.log('Webhook recebido com sucesso!');
    console.log('Tipo:', body.type);
    console.log('Dados:', body.data);

    return NextResponse.json({ status: 'ok' });
}