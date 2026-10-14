# IT Helpdesk (Laravel API + React/Vite SPA)

Login: `itadmin` / `helpdesk123` (client-side, hardcoded per the exam).

## 1. Backend (`backend/` holds only the files you add to a fresh Laravel app)
```bash
composer create-project laravel/laravel helpdesk-api
cd helpdesk-api
php artisan install:api            # creates routes/api.php and enables the /api prefix
```
Copy these from `backend/` into the Laravel project (overwrite where they exist):
- `app/Models/Ticket.php`
- `app/Http/Controllers/TicketController.php`
- `database/migrations/2026_10_14_000000_create_tickets_table.php`
- `routes/api.php`
- `config/cors.php`
- `Dockerfile` (for Render/Fly)

Local run (SQLite or MySQL in `.env`):
```bash
php artisan migrate
php artisan serve                  # http://localhost:8000/api/tickets
```
Behind an HTTPS proxy (Render): in `bootstrap/app.php`, inside `->withMiddleware(...)`, add
`$middleware->trustProxies(at: '*');`

## 2. Deploy the API (Render, Docker web service)
1. Create a Postgres database on Render/Neon/Supabase and copy its credentials.
2. Push `helpdesk-api` to GitHub, create a Render Web Service (Environment: Docker).
3. Set env vars from `.env.production.example`. `FRONTEND_URL` must be your exact frontend origin (no trailing slash).
4. The Dockerfile runs `php artisan migrate --force` on each start.
API base URL = `https://YOUR-API.onrender.com/api`.

## 3. Frontend (`frontend/`)
```bash
cd frontend
cp .env.example .env               # set VITE_API_URL
npm install
npm run dev
```
Deploy to Vercel/Netlify with `VITE_API_URL=https://YOUR-API.onrender.com/api`, build `npm run build`, output `dist`.
`vercel.json` and `public/_redirects` keep client-side routes working on refresh.

## 4. Proof for submission
Screenshots: Ticket List, Add Ticket, Ticket Details, the list after restarting both servers, and the cloud DB table showing the rows.
