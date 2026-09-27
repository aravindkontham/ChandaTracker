"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildUpiLink } from "../lib/upi";

export default function UpiPayment({ amount, donorName }) {
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");

  const vpa = process.env.NEXT_PUBLIC_UPI_ID;
  const payeeName =
    process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Sri Ramanavami Committee";

  const numericAmount = Number(amount);
  const link =
    vpa && numericAmount > 0
      ? buildUpiLink({
          vpa,
          payeeName,
          amount: numericAmount,
          note: `Chanda from ${donorName || "Donor"}`,
        })
      : null;

  useEffect(() => {
    if (!link) {
      setQrUrl("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(link, {
      width: 200,
      margin: 1,
      color: { dark: "#5C1620", light: "#FFF8ED" },
    })
      .then((url) => {
        if (!cancelled) setQrUrl(url);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [link]);

  if (!vpa) {
    return (
      <p className="text-sm text-maroon-600 mt-2">
        UPI ID not configured. Add NEXT_PUBLIC_UPI_ID to your environment
        variables.
      </p>
    );
  }

  if (!(numericAmount > 0)) {
    return (
      <p className="text-sm text-maroon-400 mt-2">
        Enter an amount above to generate a UPI QR code.
      </p>
    );
  }

  return (
    <div className="border border-gold/40 rounded-xl p-4 bg-marigold-50 text-center mt-2">
      {qrUrl && (
        <img
          src={qrUrl}
          alt="UPI QR Code"
          className="mx-auto mb-3 rounded-lg bg-white p-2 shadow-temple-sm"
          width={180}
          height={180}
        />
      )}
      <p className="text-sm text-maroon-600 mb-2">
        Ask the donor to scan this with any UPI app, or tap below on a phone:
      </p>
      <a
        href={link}
        className="inline-block bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-maroon-800 text-sm font-semibold rounded-lg px-4 py-2 mb-2"
      >
        Open in UPI app
      </a>
      <p className="text-xs text-maroon-500">
        Paying to: {payeeName} ({vpa}) &middot; ₹
        {numericAmount.toLocaleString("en-IN")}
      </p>
      {error && <p className="text-xs text-maroon-600 mt-1">{error}</p>}
    </div>
  );
}