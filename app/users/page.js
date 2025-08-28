// "use client";
// import { useState, useEffect } from "react";

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   // fetch all users
//   useEffect(() => {
//     fetch("/api/users")
//       .then((res) => res.json())
//       .then((data) => setUsers(data));
//   }, []);

//   // add user
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     await fetch("/api/users", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email }),
//     });
//     setName("");
//     setEmail("");
//     const updated = await fetch("/api/users").then((r) => r.json());
//     setUsers(updated);
//   };

//   // delete user
//   const handleDelete = async (id) => {
//     await fetch(`/api/users/${id}`, { method: "DELETE" });
//     setUsers(users.filter((u) => u.id !== id));
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>

//       {/* Add User Form */}
//       <form onSubmit={handleAdd} className="mb-6 flex gap-3 flex-wrap">
//         <input
//           type="text"
//           placeholder="Name"
//           className="p-2 rounded text-black"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="p-2 rounded text-black"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
//           Add User
//         </button>
//       </form>

//       {/* Users Table */}
//       <table className="w-full border border-gray-600">
//         <thead>
//           <tr className="bg-gray-700">
//             <th className="p-2 border">ID</th>
//             <th className="p-2 border">Name</th>
//             <th className="p-2 border">Email</th>
//             <th className="p-2 border">Created At</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr key={u.id} className="text-center">
//               <td className="p-2 border">{u.id}</td>
//               <td className="p-2 border">{u.name}</td>
//               <td className="p-2 border">{u.email}</td>
//               <td className="p-2 border">{new Date(u.created_at).toLocaleString()}</td>
//               <td className="p-2 border">
//                 <button
//                   onClick={() => handleDelete(u.id)}
//                   className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function fetchUsers() {
    let { data, error } = await supabase.from("users").select("*").order("id");
    if (error) console.error(error);
    else setUsers(data);
    setLoading(false);
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) alert("❌ Error deleting: " + error.message);
    else {
      alert("✅ User deleted!");
      fetchUsers();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("users")
        .update({ name, email })
        .eq("id", editingId);
      if (error) alert("❌ Error updating: " + error.message);
      else alert("✅ User updated!");
    } else {
      const { error } = await supabase
        .from("users")
        .insert([{ name, email }]);
      if (error) alert("❌ Error adding: " + error.message);
      else alert("✅ User added!");
    }

    setName("");
    setEmail("");
    setEditingId(null);
    fetchUsers();
  }

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="p-6">
      <h1 className="sticky top-0 z-10 text-3xl font-extrabold mb-6 text-white bg-gray-800 p-3 rounded-lg shadow">
        Users
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          {editingId ? "Edit User" : "Add User"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input type="text" placeholder="Name" className="border p-2 rounded text-gray-900"
            value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" className="border p-2 rounded text-gray-900"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Table */}
      {loading ? <p className="text-gray-700">Loading...</p> : (
        <table className="w-full border border-gray-300 bg-white rounded-lg shadow text-gray-900">
          <thead className="bg-gray-700 text-white sticky top-[70px]">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{new Date(u.created_at).toLocaleString()}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => { setEditingId(u.id); setName(u.name); setEmail(u.email); }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => deleteUser(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
