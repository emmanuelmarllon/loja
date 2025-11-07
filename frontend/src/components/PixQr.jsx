import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Componente de QR Code para pagamento via PIX
 * @param {number} amount - Valor a ser pago
 */
export default function PixQr({ amount }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function generateQr() {
      setLoading(true);
      try {
        // Payload PIX temporário (substituir pela API de geração real)
        const payload = `PIX_PAYMENT_PAYLOAD_FOR_${amount}`;

        // Gera o QR Code
        const dataUrl = await QRCode.toDataURL(payload, {
          margin: 1,
          scale: 8,
          color: {
            dark: "#000000", // cor dos pixels do QR
            light: "#ffffff", // fundo do QR
          },
        });

        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("Erro ao gerar QR:", err);
      } finally {
        setLoading(false);
      }
    }

    generateQr();
  }, [amount]);

  if (loading) return <div>Gerando QR…</div>;
  if (!qrDataUrl) return <div>Erro ao gerar QR</div>;

  return (
    <div className="pix-qr-container" style={{ textAlign: "center" }}>
      <img src={qrDataUrl} alt="QR PIX" style={{ maxWidth: 500 }} />
      <p style={{ marginTop: 10 }}>Escaneie o QR com seu banco para pagar</p>
    </div>
  );
}
