'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrCodeBase, setQrCodeBase] = useState('');

  const handleCompra = async () => {
    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setQrCode(data.point_of_interaction.transaction_data.qr_code);
        setQrCodeBase(data.point_of_interaction.transaction_data.qr_code_base64);
      } else {
        console.error('Erro na API:', data);
        alert('Erro ao criar pagamento!');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded w-72 shadow-sm placeholder-gray-400"
        />

        <button
          onClick={handleCompra}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Comprar
        </button>
      </div>

      {qrCodeBase && (
        <div className="mt-10 p-6 bg-gray-900 rounded shadow flex flex-col items-center gap-4 border border-gray-700">
          <h3 className="text-xl font-semibold text-white">QR Code Pix</h3>

          <img
            src={`data:image/png;base64,${qrCodeBase}`}
            alt="QR Code Pix"
            className="w-52 h-52 object-contain border border-gray-700 rounded"
          />

          <div className="w-full">
            <label className="block text-gray-300 mb-1 font-medium">Código Pix:</label>
            <textarea
              readOnly
              className="w-full border border-gray-700 rounded p-2 text-sm font-mono bg-gray-800 text-white resize-none"
              rows={3}
              value={qrCode}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </div>
        </div>
      )}
    </div>
  );
}