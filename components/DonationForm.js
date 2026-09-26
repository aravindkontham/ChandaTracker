"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DonationForm({ userId, onAdded }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !amount) {
      setError("First name, last name and amount are required.");
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
          submitted_by: userId,
        },
      ]);
      if (insertError) throw insertError;

      setFirstName("");
      setLastName("");
      setPhone("");
      setAmount("");
      setImageFile(null);
      e.target.reset();
      onAdded();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-6 border border-saffron-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Add New Chanda Entry
      </h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
          placeholder="First Name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
          placeholder="Last Name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          min="0"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
          placeholder="Amount (₹) *"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="sm:col-span-2 bg-saffron-600 hover:bg-saffron-700 text-white font-medium rounded-lg px-4 py-2 transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Donation"}
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-2">
        Date & time are recorded automatically.
      </p>
    </section>
  );
}
