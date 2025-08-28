"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    // <div className="sticky top-0 z-50 bg-gray-800 text-white shadow-md">
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">📅 Event Manager</h1>
      <div className="flex gap-6">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <Link href="/users" className="hover:text-blue-400">Users</Link>
        <Link href="/events" className="hover:text-blue-400">Events</Link>
        <Link href="/rsvps" className="hover:text-blue-400">RSVPs</Link>
      </div>
    </nav>
    // </div>
  );
}
