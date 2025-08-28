# 📌 Event Management System – Supabase + Next.js

## 🚀 Overview
This project is part of the **Database Building/Management Internship Assessment** for PixaBeam Digital Services.  
It demonstrates a **database schema in Supabase** for managing **Users, Events, and RSVPs**, along with a minimal **Next.js app** connected to Supabase.

---

## 🗄️ Part 1 – Database Design

### 📑 Schema
The database contains three main tables:

**Users**
- `id` (Primary Key)
- `name`
- `email` (unique)
- `created_at` (default: now)

**Events**
- `id` (Primary Key)
- `title`
- `description`
- `date`
- `city`
- `created_by` (Foreign Key → Users.id, ON DELETE CASCADE)

**RSVPs**
- `id` (Primary Key)
- `user_id` (Foreign Key → Users.id, ON DELETE CASCADE)
- `event_id` (Foreign Key → Events.id, ON DELETE CASCADE)
- `status` (ENUM: Yes / No / Maybe)

### ✅ Design Choices
- **Primary Keys:** Each table has a unique primary key (`id`) for identification.
- **Foreign Keys & Constraints:**
  - `Events.created_by` references `Users.id`.
  - `RSVPs.user_id` references `Users.id`.
  - `RSVPs.event_id` references `Events.id`.
  - All foreign keys use `ON DELETE CASCADE` to ensure referential integrity.
- **Data Integrity:**
  - Emails are unique in the `Users` table.
  - RSVP status is limited to `Yes / No / Maybe`.

### 📷 Deliverables
- **SQL Dump:** `schema.sql`
- **Database Screenshots:** see `/screenshots/` folder
- **ER Diagram:** see `/screenshots/ERD.png`

---

## 🌐 Part 2 – Bonus (Next.js + Supabase App)

### Features
- **Event Listing Page:** Displays all upcoming events from the `Events` table.
- **RSVP Page:** Allows users to RSVP to an event with options: Yes, No, Maybe.

### Tech Stack
- **Frontend:** Next.js (React + TailwindCSS)
- **Backend:** Supabase (Postgres + Auth + API)
- **Deployment:** Vercel

### 🔧 Setup Instructions
1. **Clone the repo:**
   ```bash
   git clone https://github.com/<your-username>/event-management-system.git
   cd event-management-system

2. **Install dependencies:**
   ```bash
   npm install

3. **Configure environment variables:**
   Create a .env.local file in the root folder with:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

4. **Run locally:**
   ```bash
   npm run dev

5. **Open in browser:**
   ```
   http://localhost:3000

### 🚀 Deployment

- The app is deployed on Vercel: [Live Demo](https://event-management-system-mu-ten.vercel.app/)
- Backend powered by Supabase.

### 📎 Deliverables Summary

- SQL Dump: schema.sql
- ER Diagram & Screenshots: /screenshots/ folder
- GitHub Repo: [link here]
- Live Vercel Deployment: [link here]

### 👩‍💻 Author

**Mounika Seelam**

Database Management & Frontend Development Enthusiast

---
-----

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---


## Here my project links
- Github - https://github.com/mounika-ss/event-management-system
- Vercel - https://event-management-system-mu-ten.vercel.app/

- 
