# Railway deployment

This repository is configured for two Railway services:

- `backend`: Express API and Prisma database client
- `front`: Vite-built React application served as a static SPA

## 1. Create the Railway project

1. Create a new Railway project from the GitHub repository.
2. Add a PostgreSQL database service.
3. Add a backend service from the same repository.
4. Add a frontend service from the same repository.

Set each service's **Root Directory**:

- Backend: `/backend`
- Frontend: `/front`

Railway detects the `package.json` scripts automatically.

## 2. Backend variables

In the backend service, add:

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long-random-production-secret>
CLIENT_ORIGIN=https://<your-frontend-domain>
ADMIN_EMAIL=<administrator-email>
```

`JWT_SECRET` must contain at least 32 characters in production. Generate one
with a password manager or a cryptographically secure generator.

The database variable reference may use the exact PostgreSQL service name
Railway displays in your project.

The backend build uses Prisma's `postinstall` script. Set the deploy/start
commands if Railway does not detect them:

```text
Build: npm install
Start: npm start
```

Run the migration once from the backend service shell or as a one-time deploy
command:

```bash
npm run db:deploy
```

## 3. Frontend variables

In the frontend service, add:

```env
VITE_API_URL=https://<your-backend-domain>
```

This variable is baked into the frontend during `npm run build`; changing it
requires a frontend redeploy. Do not leave it as `http://localhost:4000` on
Railway, because a deployed browser cannot reach your local computer.

Use these commands if Railway does not detect them:

```text
Build: npm run build
Start: npm start
```

## 4. Domains and CORS

Generate a Railway domain for each service first. Then:

1. Set `VITE_API_URL` to the backend public HTTPS URL.
2. Set `CLIENT_ORIGIN` to the frontend public HTTPS URL.
3. Redeploy both services.
4. Add custom domains later, then update both variables to the custom HTTPS
   domains and redeploy again.

Never put `DATABASE_URL` or `JWT_SECRET` in the frontend variables.
