import React, { useEffect, useState } from "react";

/**
 * Componente de QR Code PIX
 * @param {number} amount - Valor a ser pago
 * @param {string} description - Descrição opcional
 */
export default function PixQr({ amount, description = "Pagamento PIX" }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txid, setTxid] = useState(null);

  useEffect(() => {
    const valorNumber = Number(amount);

    if (!valorNumber || valorNumber <= 0) return; // Não tenta gerar QR se valor inválido

    async function fetchPixQr() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: valorNumber, description }),
        });

        const data = await res.json();

        if (!data.qrDataUrl) throw new Error("QR não retornado pelo backend");

        setQrDataUrl(data.qrDataUrl);
        setTxid(data.txid);
      } catch (err) {
        console.error("Erro ao gerar QR:", err);
        setQrDataUrl(null);
        setTxid(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPixQr();
  }, [amount, description]);

  if (loading) return <div>Gerando QR…</div>;
  if (!qrDataUrl) return <div>Aguardando valor...</div>;

  return (
    <div className="pix-qr-container" style={{ textAlign: "center" }}>
      <img src={qrDataUrl} alt="QR PIX" style={{ maxWidth: 500 }} />
      <p style={{ marginTop: 10 }}>
        Escaneie o QR Code com seu banco para pagar
      </p>
      <p>
        <strong>TXID:</strong> {txid}
      </p>
      <p>
        <strong>Valor:</strong> R$ {Number(amount).toFixed(2)}
      </p>
    </div>
  );
}
