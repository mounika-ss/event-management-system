// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function RSVPsPage() {
//   const [rsvps, setRsvps] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [events, setEvents] = useState([]);

//   const [form, setForm] = useState({
//     user_id: "",
//     event_id: "",
//     status: "Yes",
//   });

//   function onChange(e) {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   }

//   async function loadData() {
//     // join via foreign tables (works when FKs are set)
//     const { data: r, error: er } = await supabase
//       .from("rsvps")
//       .select("id, status, user_id, event_id, users (name), events (title)")
//       .order("id", { ascending: true });
//     if (!er) setRsvps(r || []);

//     const { data: us } = await supabase.from("users").select("id, name").order("id");
//     setUsers(us || []);
//     const { data: ev } = await supabase.from("events").select("id, title").order("id");
//     setEvents(ev || []);
//   }

//   useEffect(() => { loadData(); }, []);

//   async function onSubmit(e) {
//     e.preventDefault();
//     if (!form.user_id || !form.event_id || !form.status) {
//       alert("Please fill user, event, and status");
//       return;
//     }
//     const { error } = await supabase.from("rsvps").insert([{
//       user_id: Number(form.user_id),
//       event_id: Number(form.event_id),
//       status: form.status,
//     }]);
//     if (error) return alert("Insert failed: " + error.message);
//     alert("RSVP added!");
//     setForm({ user_id: "", event_id: "", status: "Yes" });
//     loadData();
//   }

//   async function deleteRSVP(id) {
//     if (!confirm("Delete this RSVP?")) return;
//     const { error } = await supabase.from("rsvps").delete().eq("id", id);
//     if (error) return alert("Delete failed: " + error.message);
//     alert("RSVP deleted.");
//     loadData();
//   }

//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       {/* Create form */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Create RSVP</h2>
//         <form onSubmit={onSubmit} className="space-y-3">
//           <div>
//             <label className="block text-sm mb-1">User</label>
//             <select name="user_id" value={form.user_id} onChange={onChange} className="w-full border rounded px-3 py-2">
//               <option value="">Select user...</option>
//               {users.map(u => <option key={u.id} value={u.id}>{u.id} — {u.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Event</label>
//             <select name="event_id" value={form.event_id} onChange={onChange} className="w-full border rounded px-3 py-2">
//               <option value="">Select event...</option>
//               {events.map(ev => <option key={ev.id} value={ev.id}>{ev.id} — {ev.title}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Status</label>
//             <select name="status" value={form.status} onChange={onChange} className="w-full border rounded px-3 py-2">
//               <option>Yes</option>
//               <option>No</option>
//               <option>Maybe</option>
//             </select>
//           </div>
//           <button className="px-4 py-2 rounded bg-black text-white">Add RSVP</button>
//         </form>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
//         <h2 className="text-xl font-semibold mb-4">RSVPs</h2>
//         <table className="w-full text-left border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">ID</th>
//               <th className="p-2 border">User</th>
//               <th className="p-2 border">Event</th>
//               <th className="p-2 border">Status</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rsvps.map(r => (
//               <tr key={r.id} className="odd:bg-white even:bg-gray-50">
//                 <td className="p-2 border">{r.id}</td>
//                 <td className="p-2 border">{r.users?.name} <span className="text-xs text-gray-500">({r.user_id})</span></td>
//                 <td className="p-2 border">{r.events?.title} <span className="text-xs text-gray-500">({r.event_id})</span></td>
//                 <td className="p-2 border">{r.status}</td>
//                 <td className="p-2 border">
//                   <button onClick={() => deleteRSVP(r.id)} className="px-3 py-1 rounded bg-red-600 text-white">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {rsvps.length === 0 && (
//               <tr><td className="p-3 text-center text-gray-500" colSpan={5}>No RSVPs</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }





"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RSVPsPage() {
  const [rsvps, setRsvps] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ user_id: "", event_id: "", status: "Yes" });
  const [editingId, setEditingId] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function fetchData() {
    const { data: r, error: er } = await supabase
      .from("rsvps")
      .select("id, status, users(name), events(title), user_id, event_id")
      .order("id");
    if (!er) setRsvps(r || []);

    const { data: us } = await supabase.from("users").select("id, name").order("id");
    setUsers(us || []);

    const { data: ev } = await supabase.from("events").select("id, title").order("id");
    setEvents(ev || []);

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.user_id || !form.event_id) {
      alert("⚠️ Please select user and event");
      return;
    }

    if (editingId) {
      // update
      const { error } = await supabase
        .from("rsvps")
        .update({
          user_id: form.user_id,
          event_id: form.event_id,
          status: form.status,
        })
        .eq("id", editingId);
      if (error) alert("❌ Update failed: " + error.message);
      else alert("✅ RSVP updated!");
    } else {
      // insert
      const { error } = await supabase.from("rsvps").insert([form]);
      if (error) alert("❌ Insert failed: " + error.message);
      else alert("✅ RSVP added!");
    }

    setForm({ user_id: "", event_id: "", status: "Yes" });
    setEditingId(null);
    fetchData();
  }

  async function deleteRSVP(id) {
    if (!confirm("Delete this RSVP?")) return;
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (error) alert("❌ Delete failed: " + error.message);
    else {
      alert("✅ RSVP deleted.");
      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="sticky top-0 z-10 text-3xl font-extrabold mb-6 text-white bg-gray-800 p-3 rounded-lg shadow">
        RSVPs
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          {editingId ? "Edit RSVP" : "Add RSVP"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <select
            name="user_id"
            value={form.user_id}
            onChange={onChange}
            className="border p-2 rounded text-gray-900"
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} - {u.name}
              </option>
            ))}
          </select>

          <select
            name="event_id"
            value={form.event_id}
            onChange={onChange}
            className="border p-2 rounded text-gray-900"
          >
            <option value="">-- Select Event --</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} - {ev.title}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="border p-2 rounded text-gray-900"
          >
            <option>Yes</option>
            <option>No</option>
            <option>Maybe</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update RSVP" : "Add RSVP"}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : (
        <table className="w-full border border-gray-300 bg-white rounded-lg shadow text-gray-900">
          <thead className="bg-gray-700 text-white sticky top-[70px]">
            <tr>
              <th className="p-2 border">RSVP_ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Event</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{r.id}</td>
                <td className="p-2 border">{r.users?.name}</td>
                <td className="p-2 border">{r.events?.title}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(r.id);
                      setForm({
                        user_id: r.user_id,
                        event_id: r.event_id,
                        status: r.status,
                      });
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRSVP(r.id)}
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
