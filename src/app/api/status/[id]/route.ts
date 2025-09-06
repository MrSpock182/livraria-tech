import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const paymentId = params.id
  const accessToken = process.env.MP_AUTH

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('Erro ao consultar pagamento:', error)
      return NextResponse.json({ status: 'erro', error }, { status: res.status })
    }

    const data = await res.json()
    const status = data.status

    return NextResponse.json({ status })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ status: 'erro', error: 'Falha interna' }, { status: 500 })
  }
}