import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
export default function PixQr({ amount }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPayload() {
      setLoading(true);
      try {
        const payload = "...";
        const dataUrl = await QRCode.toDataURL(payload, {
          margin: 1,
          scale: 8,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPayload();
  }, [amount]);

  if (loading) return <div>Gerando QR…</div>;
  if (!qrDataUrl) return <div>Erro ao gerar QR</div>;

  return (
    <div style={{ textAlign: "center" }}>
      <img src={qrDataUrl} alt="QR PIX" style={{ maxWidth: 500 }} />
      <p style={{ marginTop: 10 }}>Escaneie o QR com seu banco para pagar</p>
    </div>
  );
}
