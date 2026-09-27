// Builds a standard UPI deep link that any UPI app (GPay, PhonePe, Paytm, BHIM...)
// can open to pre-fill a payment. This is a plain peer-to-peer UPI request link —
// it does NOT verify or confirm payment automatically. Whoever is entering the
// donation should confirm the money actually arrived before saving the record.
export function buildUpiLink({ vpa, payeeName, amount, note }) {
  const parts = [
    `pa=${encodeURIComponent(vpa)}`,
    `pn=${encodeURIComponent(payeeName)}`,
    `am=${encodeURIComponent(Number(amount).toFixed(2))}`,
    `cu=INR`,
  ];
  if (note) {
    parts.push(`tn=${encodeURIComponent(note)}`);
  }
  return `upi://pay?${parts.join("&")}`;
}