# 🔗 HSIBS URL Shortener

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%2B%20Auth-3ECF8E?logo=supabase)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

A fully-featured, secure, and modern **URL Shortener** built using **Next.js App Router**, **Supabase**, and **TypeScript**.
Designed for organizations, schools, and personal use requiring fast short links, custom codes, and link management.

---

## ✨ Features

### 🔓 Public Features

* Shorten any URL without logging in
* Auto-generate short codes
* Custom short code support
* Public redirect `/<short_code>`
* Responsive UI

### 🔐 Authenticated Features

* Manage all URLs created by the user
* Click analytics
* Enable/Disable short links
* Edit target URL
* Delete links
* Secure dashboard via Supabase Auth

### 🛡️ Security (RLS)

* Row-Level Security enabled
* Users can only manage their own rows
* Anonymous users can create links but cannot edit/delete

---

## 📸 Screenshots (Placeholder)

> Tambahkan screenshot setelah deploy.

```
/public/screenshots
  dashboard.png
  create-link.png
  analytics.png
```

---

## 🗂️ Project Structure

```
├── app
│   ├── api
│   │   ├── shorten/route.ts
│   │   └── redirect/[code]/route.ts
│   ├── dashboard/page.tsx
│   └── page.tsx
├── lib
│   ├── supabase.ts
│   ├── db.ts
│   ├── constants.ts
│   └── utils.ts
├── types
│   └── database.ts
├── public
│   └── screenshots
├── .env.local
└── README.md
```

---

## ⚙️ Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🧪 Database Schema (Supabase)

### Table: `urls_linkq`

```sql
CREATE TABLE urls_linkq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

## 🔧 RLS Policies

### Public insert allowed (anonymous users)

```sql
create policy "Public can insert" 
on urls_linkq for insert
to public
with check (true);
```

### Users read only their own entries

```sql
create policy "Users can read own rows"
on urls_linkq for select
to authenticated
using (auth.uid() = created_by);
```

### Users update only their own entries

```sql
create policy "Users can update own rows"
on urls_linkq for update
to authenticated
using (auth.uid() = created_by);
```

### Users delete only their own entries

```sql
create policy "Users can delete own rows"
on urls_linkq for delete
to authenticated
using (auth.uid() = created_by);
```

---

## 📈 RPC: Increment Click Counts

```sql
CREATE OR REPLACE FUNCTION increment_click(url_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE urls_linkq
  SET clicks = clicks + 1
  WHERE id = url_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📡 API Documentation

### **POST** `/api/shorten`

Create a short URL.

#### Request body:

```json
{
  "original_url": "https://example.com",
  "short_code": "custom123"
}
```

#### Response:

```json
{
  "short_url": "https://yourdomain.com/custom123",
  "id": "uuid"
}
```

---

### **GET** `/:short_code`

Redirect to original URL.

* 302 redirect when found
* 404 page if not found

---

### **GET** `/api/urls` (Authenticated)

Returns all URLs created by the user.

---

## 🖥️ Local Development

### Clone repository

```bash
git clone https://github.com/yourname/hsibs-url-shortener.git
cd hsibs-url-shortener
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Tambahkan environment variables
4. Deploy

### Supabase Setup

* Buat project baru
* Apply table schema
* Enable RLS
* Tambahkan policies
* Tambahkan RPC

---

## 🧑‍🤝‍🧑 Contributing

Contributions are welcome!

1. Fork repository
2. Create feature branch
3. Commit & push
4. Open pull request

---

## 🪪 License

Released under the **MIT License**.

---

## ❤️ Acknowledgements

Built with:

* Next.js
* Supabase
* PostgreSQL
* Tailwind CSS
* Vercel
