# Medicine Store Admin

React + Express admin dashboard for an e-pharmacy workflow.

## Run locally

```bash
npm install
npm run dev
```

The Vite client runs on `http://localhost:5173` and the API on `http://localhost:4000`.

Demo account:

- Email: `vendor@gmail.com`
- Password: `12345678`

The API uses seeded in-memory data when `MONGODB_URI` is not configured. For persistent data, copy `.env.example` to `.env`, set `MONGODB_URI`, and restart the server. The API connects once at startup, seeds empty collections, and uses Mongoose validation for products, suppliers, customers, and orders.

Available API features under `/api`:

- `POST /user/login`, `GET /user/user-info`, and `GET /user/logout` with JWT authentication and revoked logout tokens.
- `GET /dashboard` with live collection counts and recent activity.
- `GET /products`, `/orders`, `/customers`, and `/suppliers` with `search`, `page`, `limit`, `sort`, and `order` query parameters.
- Product and supplier create/update/delete endpoints, plus validated customer updates.
- `GET /customers/:customerId` with the customer profile and order history.
- `GET /health` reports whether the server is using `mongodb` or the memory fallback.

The UI includes responsive 320px, 375px, tablet, and desktop layouts, paginated customer data, customer detail pages, sorting controls, working Settings/Activity routes, and persistent favicon/font assets.
