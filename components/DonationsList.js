"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DonationsList({ donations, loading, isAdmin, onChange }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const filtered = donations.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
      (d.phone || "").toLowerCase().includes(q)
    );
  });

  const total = donations.reduce((s, d) => s + Number(d.amount), 0);

  function startEdit(d) {
    setEditingId(d.id);
    setEditForm({
      first_name: d.first_name,
      last_name: d.last_name,
      phone: d.phone || "",
      amount: d.amount,
    });
  }

  async function saveEdit(id) {
    setSavingEdit(true);
    const { error } = await supabase
      .from("donations")
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        phone: editForm.phone || null,
        amount: parseFloat(editForm.amount),
      })
      .eq("id", id);
    setSavingEdit(false);
    if (!error) {
      setEditingId(null);
      onChange();
    } else {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    const { error } = await supabase.from("donations").delete().eq("id", id);
    if (!error) onChange();
    else alert(error.message);
  }

  return (
    <section className="bg-cream-50 rounded-2xl shadow-temple p-6 border border-gold/30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-display text-xl font-semibold text-maroon-700">
          All entries{" "}
          <span className="text-maroon-400 font-normal text-sm font-sans">
            ({filtered.length} shown, total ₹{total.toLocaleString("en-IN")})
          </span>
        </h2>
        <input
          className="border border-maroon-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!isAdmin && (
        <p className="text-xs text-maroon-400 mb-3">
          You have view-only access. Only an admin can edit or delete entries.
        </p>
      )}

      {loading ? (
        <p className="text-maroon-400 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-maroon-400 text-sm">No entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-maroon-400 border-b border-gold/30">
                <th className="py-2 pr-2">Image</th>
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2">Phone</th>
                <th className="py-2 pr-2">Amount</th>
                <th className="py-2 pr-2">Method</th>
                <th className="py-2 pr-2">Date & time</th>
                {isAdmin && <th className="py-2 pr-2"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-gold/15 last:border-0 align-top"
                >
                  <td className="py-2 pr-2">
                    {d.image_url ? (
                      <img
                        src={d.image_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-gold/30"
                      />
                    ) : (
                      <span className="text-maroon-200">-</span>
                    )}
                  </td>

                  {editingId === d.id ? (
                    <>
                      <td className="py-2 pr-2 space-y-1">
                        <input
                          className="border border-maroon-100 rounded px-2 py-1 w-28 block"
                          value={editForm.first_name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, first_name: e.target.value })
                          }
                        />
                        <input
                          className="border border-maroon-100 rounded px-2 py-1 w-28 block"
                          value={editForm.last_name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, last_name: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          className="border border-maroon-100 rounded px-2 py-1 w-28"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          className="border border-maroon-100 rounded px-2 py-1 w-24"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2 text-maroon-400 capitalize">
                        {d.payment_method || "cash"}
                      </td>
                      <td className="py-2 pr-2 text-maroon-400">
                        {new Date(d.created_at).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 pr-2 space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => saveEdit(d.id)}
                          disabled={savingEdit}
                          className="text-green-700 text-xs font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-maroon-400 text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 pr-2 font-medium text-maroon-800">
                        {d.first_name} {d.last_name}
                      </td>
                      <td className="py-2 pr-2 text-maroon-500">
                        {d.phone || "-"}
                      </td>
                      <td className="py-2 pr-2 text-maroon-800 font-medium">
                        ₹{Number(d.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 pr-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            d.payment_method === "upi"
                              ? "bg-marigold-100 text-marigold-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {d.payment_method === "upi" ? "UPI" : "Cash"}
                        </span>
                      </td>
                      <td className="py-2 pr-2 text-maroon-400">
                        {new Date(d.created_at).toLocaleString("en-IN")}
                      </td>
                      {isAdmin && (
                        <td className="py-2 pr-2 space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => startEdit(d)}
                            className="text-blue-600 text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="text-maroon-500 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}