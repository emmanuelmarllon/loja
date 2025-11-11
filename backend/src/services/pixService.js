// services/pixService.js
import QRCode from "qrcode";

const PIX_KEY = process.env.PIX_KEY;
const MERCHANT_NAME = process.env.MERCHANT_NAME;
const MERCHANT_CITY = process.env.MERCHANT_CITY;

// Gera CRC16
function crc16ccitt(str) {
  const polynomial = 0x1021;
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc =
        crc & 0x8000 ? ((crc << 1) ^ polynomial) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tag(id, value) {
  const s = String(value ?? "");
  const len = String(s.length).padStart(2, "0");
  return `${id}${len}${s}`;
}

// Cria payload Pix
export function createPixPayload({ amount, txid, description }) {
  const gui = tag("00", "br.gov.bcb.pix");
  const keyTag = tag("01", PIX_KEY);
  const merchantAccountInfo = tag("26", gui + keyTag);

  const payloadFormat = tag("00", "01");
  const pointOfInitiation = tag("01", "11");
  const mcc = tag("52", "0000");
  const currency = tag("53", "986");
  const amountTag = tag("54", Number(amount).toFixed(2));
  const country = tag("58", "BR");
  const name = tag("59", MERCHANT_NAME);
  const city = tag("60", MERCHANT_CITY);
  const addData = tag("05", txid);
  const descTag = description ? tag("50", description.slice(0, 25)) : ""; // máx 25 chars
  const addDataTemplate = tag("62", addData + descTag);

  const partial =
    payloadFormat +
    pointOfInitiation +
    merchantAccountInfo +
    mcc +
    currency +
    amountTag +
    country +
    name +
    city +
    addDataTemplate +
    "63" +
    "04";

  const crc = crc16ccitt(partial);
  return partial + crc;
}

// Gera QR Code Pix
export async function generatePix({ amount, description, txid }) {
  if (!amount || amount <= 0) throw new Error("Valor inválido");

  const payload = createPixPayload({ amount, txid, description });
  const qrDataUrl = await QRCode.toDataURL(payload);

  return { txid, amount, payload, qrDataUrl };
}
