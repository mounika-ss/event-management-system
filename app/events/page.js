"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function fetchEvents() {
    let { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) console.error(error);
    else setEvents(data);
    setLoading(false);
  }

  async function fetchUsers() {
    let { data, error } = await supabase
      .from("users")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) console.error(error);
    else setUsers(data);
  }

  async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) alert("❌ Error deleting: " + error.message);
    else {
      alert("✅ Event deleted!");
      fetchEvents();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !date || !city || !createdBy) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    if (editingId) {
      // update
      const { error } = await supabase
        .from("events")
        .update({ title, description, date, city, created_by: createdBy })
        .eq("id", editingId);

      if (error) alert("❌ Error updating: " + error.message);
      else alert("✅ Event updated!");
    } else {
      // insert
      const { error } = await supabase
        .from("events")
        .insert([{ title, description, date, city, created_by: createdBy }]);

      if (error) alert("❌ Error adding: " + error.message);
      else alert("✅ Event added!");
    }

    // reset
    setTitle("");
    setDescription("");
    setDate("");
    setCity("");
    setCreatedBy("");
    setEditingId(null);
    fetchEvents();
  }

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      {/* Highlighted Header */}
      <h1 className="sticky top-0 z-10 text-3xl font-extrabold mb-6 text-white bg-gray-800 p-3 rounded-lg shadow">
        Events
      </h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 bg-gray-100 rounded-lg shadow"
      >
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          {editingId ? "Edit Event" : "Add Event"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded text-gray-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded text-gray-900 md:col-span-2"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded text-gray-900"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            className="border p-2 rounded text-gray-900"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <select
            className="border p-2 rounded text-gray-900 md:col-span-2"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} - {u.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </form>

      {/* Events Table */}
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : (
        <table className="w-full border border-gray-300 bg-white rounded-lg shadow text-gray-900">
          <thead className="bg-gray-700 text-white sticky top-[70px] z-5">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{ev.id}</td>
                <td className="p-2 border">{ev.title}</td>
                <td className="p-2 border text-left">{ev.description}</td>
                <td className="p-2 border">
                  {new Date(ev.date).toLocaleDateString()}
                </td>
                <td className="p-2 border">{ev.city}</td>
                <td className="p-2 border">{ev.created_by}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(ev.id);
                      setTitle(ev.title);
                      setDescription(ev.description || "");
                      setDate(ev.date.split("T")[0]);
                      setCity(ev.city || "");
                      setCreatedBy(ev.created_by || "");
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
