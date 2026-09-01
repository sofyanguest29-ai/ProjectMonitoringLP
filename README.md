# Project Monitor

Aplikasi internal untuk monitoring project: login, reset password via email, create project (nama, deadline, status), dan calendar view.

Stack: Next.js (App Router) + Supabase (Auth + Database) + deploy ke Vercel.

## 1. Setup Supabase

1. Buat akun & project baru di https://supabase.com (gratis).
2. Buka **SQL Editor** di dashboard Supabase, copy-paste isi file `supabase/schema.sql`, lalu Run. Ini akan membuat tabel `projects` beserta Row Level Security policy-nya.
3. Buka **Authentication -> Providers**, pastikan **Email** provider aktif (default sudah aktif).
4. Buka **Authentication -> URL Configuration**, isi:
   - **Site URL**: `http://localhost:3000` (nanti ganti ke domain production setelah deploy)
   - **Redirect URLs**: tambahkan `http://localhost:3000/update-password` dan (setelah deploy) `https://domain-kamu.com/update-password`
   - Ini penting supaya link reset password dari email mengarah ke halaman yang benar.
5. Buka **Project Settings -> API**, catat:
   - `Project URL` -> ini untuk `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> ini untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Buat User Pertama

Karena ini tool internal, user tidak sign-up sendiri. Buat user manual lewat:
**Authentication -> Users -> Add user** (isi email + password, centang "Auto Confirm User").

Ulangi untuk setiap anggota tim yang butuh akses.

## 3. Jalankan di Lokal

```bash
cp .env.local.example .env.local
# isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local

npm install
npm run dev
```

Buka http://localhost:3000 — akan redirect ke halaman login.

## 4. Deploy ke Vercel

1. Push folder ini ke repo GitHub.
2. Buka https://vercel.com -> New Project -> import repo tadi.
3. Di bagian **Environment Variables**, tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nilai sama seperti di `.env.local`).
4. Deploy.
5. Setelah dapat domain dari Vercel, balik lagi ke Supabase -> Authentication -> URL Configuration, update **Site URL** dan tambahkan **Redirect URL** dengan domain production (`https://domain-kamu.vercel.app/update-password`).

## Struktur Fitur

- `/login` — halaman login
- `/forgot-password` — kirim link reset password ke email
- `/update-password` — halaman set password baru (diakses dari link email)
- `/dashboard` — form create project + daftar project (tabel)
- `/dashboard/calendar` — tampilan kalender bulanan, project muncul di tanggal deadline-nya

## Catatan Keamanan

- Row Level Security sudah aktif di tabel `projects`: semua user yang login bisa **lihat** semua project (karena ini tool internal), tapi hanya bisa **edit/hapus** project yang dia buat sendiri. Kalau mau semua orang bisa edit project siapa saja, ubah policy `update`/`delete` di `supabase/schema.sql`.
- Supabase Auth sudah handle hashing password, session, dan email reset password secara otomatis — tidak perlu implementasi manual.
- Untuk 100 user, cukup pakai Supabase Free Tier (limit 50.000 MAU, jauh dari cukup).
