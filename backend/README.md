# CV Maker API

This service provides the REST boundary used by the React client. It is intentionally
framework-light so it can later be replaced by a Python FastAPI/Flask service without
changing the frontend.

## Run with PostgreSQL

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

Start the local PostgreSQL instance before migrating:

```bash
docker compose up -d postgres
```

The application and production deployments use PostgreSQL through Prisma. Set
`DATABASE_URL` to your managed PostgreSQL connection string in production and run
`npm run db:deploy` during deployment.

Set `ADMIN_EMAIL` to the normalized email address that should receive admin
access. The account must still be registered normally; admin access is checked
server-side for the configured email or a user with the `ADMIN` role.

Optional AI summary generation uses an OpenAI-compatible chat completions
endpoint. Keep `AI_API_KEY` server-side and configure `AI_API_URL` and
`AI_MODEL` as needed. The frontend never receives the key. A 502 response
means the provider rejected the request; verify the key has access to the
configured model and that the endpoint matches the provider.

## API contract

All JSON responses use these shapes:

- `POST /api/auth/register` and `POST /api/auth/login`: `{ token, user }`
- `GET /api/auth/me`: `{ user }`
- `GET /api/admin/users`: `{ users }` for administrators; each user is identified
  by its unique normalized email address.
- `POST /api/ai/professional-summary`: `{ summary }` for authenticated users.
- `GET /api/cvs`: `{ cvs }`
- `POST /api/cvs` and `PUT /api/cvs/:id`: `{ cv }`
- Errors: `{ message }`

CV endpoints require `Authorization: Bearer <token>`. A Python service only needs to
preserve these paths, status codes, and response shapes to remain compatible.

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
```
