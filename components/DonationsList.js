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
    <section className="bg-white rounded-xl shadow p-6 border border-saffron-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          All Entries{" "}
          <span className="text-gray-400 font-normal text-sm">
            ({filtered.length} shown, total ₹{total.toLocaleString("en-IN")})
          </span>
        </h2>
        <input
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!isAdmin && (
        <p className="text-xs text-gray-400 mb-3">
          You have view-only access. Only an admin can edit or delete entries.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-2">Image</th>
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2">Phone</th>
                <th className="py-2 pr-2">Amount</th>
                <th className="py-2 pr-2">Date & Time</th>
                {isAdmin && <th className="py-2 pr-2"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-2">
                    {d.image_url ? (
                      <img
                        src={d.image_url}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>

                  {editingId === d.id ? (
                    <>
                      <td className="py-2 pr-2 space-y-1">
                        <input
                          className="border rounded px-2 py-1 w-28 block"
                          value={editForm.first_name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, first_name: e.target.value })
                          }
                        />
                        <input
                          className="border rounded px-2 py-1 w-28 block"
                          value={editForm.last_name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, last_name: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          className="border rounded px-2 py-1 w-28"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-24"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2 pr-2 text-gray-500">
                        {new Date(d.created_at).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 pr-2 space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => saveEdit(d.id)}
                          disabled={savingEdit}
                          className="text-green-600 text-xs font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 pr-2 font-medium text-gray-800">
                        {d.first_name} {d.last_name}
                      </td>
                      <td className="py-2 pr-2 text-gray-600">{d.phone || "-"}</td>
                      <td className="py-2 pr-2 text-gray-800">
                        ₹{Number(d.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 pr-2 text-gray-500">
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
                            className="text-red-500 text-xs font-medium"
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
