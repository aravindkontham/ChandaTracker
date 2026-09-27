"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import UpiPayment from "./UpiPayment";

const inputClass =
  "border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 focus:border-marigold-400 bg-white";

export default function DonationForm({ userId, onAdded }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !amount) {
      setError("First name, last name and amount are required.");
      return;
    }
    if (paymentMethod === "upi" && !paymentConfirmed) {
      setError(
        "Please confirm the UPI payment was actually received before saving."
      );
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      let imageUrl = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("chanda-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("chanda-images")
          .getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("donations").insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || null,
          amount: parseFloat(amount),
          image_url: imageUrl,
          payment_method: paymentMethod,
          submitted_by: userId,
        },
      ]);
      if (insertError) throw insertError;

      setFirstName("");
      setLastName("");
      setPhone("");
      setAmount("");
      setImageFile(null);
      setPaymentMethod("cash");
      setPaymentConfirmed(false);
      e.target.reset();
      onAdded();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-cream-50 rounded-2xl shadow-temple p-6 mb-6 border border-gold/30">
      <h2 className="font-display text-xl font-semibold mb-4 text-maroon-700">
        Add a chanda entry
      </h2>
      {error && (
        <p className="bg-maroon-50 text-maroon-700 text-sm rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          className={inputClass}
          placeholder="First name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Last name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          min="0"
          className={inputClass}
          placeholder="Amount (₹) *"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div className="sm:col-span-2">
          <label className="block text-sm text-maroon-500 mb-1">
            Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-maroon-600"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-maroon-500 mb-2">
            Payment method
          </label>
          <div className="flex gap-4 text-sm mb-2 text-maroon-700">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => {
                  setPaymentMethod("cash");
                  setPaymentConfirmed(false);
                }}
              />
              Cash
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI (QR / link)
            </label>
          </div>

          {paymentMethod === "upi" && (
            <>
              <UpiPayment
                amount={amount}
                donorName={`${firstName} ${lastName}`.trim()}
              />
              <label className="flex items-start gap-2 text-sm text-maroon-700 mt-3">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                />
                <span>
                  I've confirmed the UPI payment was actually received (this
                  app can't verify UPI payments automatically).
                </span>
              </label>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={
            submitting || (paymentMethod === "upi" && !paymentConfirmed)
          }
          className="sm:col-span-2 bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-maroon-800 font-semibold rounded-lg px-4 py-2.5 transition disabled:opacity-50 shadow-temple-sm"
        >
          {submitting ? "Saving..." : "Add donation"}
        </button>
      </form>
      <p className="text-xs text-maroon-400 mt-2">
        Date & time are recorded automatically.
      </p>
    </section>
  );
}