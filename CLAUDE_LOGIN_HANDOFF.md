# Admin Login: Add Google OAuth Path

## Context

The mphotos backend now supports two admin-login methods, picked by a server-side config setting:

- `password` — the existing username/password form (unchanged)
- `google` — Sign in with Google, gated by an email allowlist on the backend

The UI does **not** know or care which method is configured. It asks the backend, then renders the appropriate widget.

The session cookie that establishes admin status is identical in both cases. So once login completes — by either method — the rest of the app behaves exactly as it does today. Only the login screen needs to change.

## What you need to build

### 1. New endpoint to query: `GET /api/auth/method`

Returns:

```json
{ "data": { "method": "google" } }
```

or

```json
{ "data": { "method": "password" } }
```

(Note: backend wraps responses in `{ "data": ... }` — same envelope as other endpoints.)

Call this on mount of the login page. Cache the result for the session — it doesn't change at runtime.

### 2. Branch the login UI on the result

- `"password"` → render the existing username/password form. **No change** — this is the current flow, which posts to `PUT /api/login` and gets back the session cookie.
- `"google"` → render a "Sign in with Google" button.

### 3. Google button click handler

```js
window.location.href = "/api/login/google"
```

**Critical: this must be a full-page navigation, not a fetch/XHR.** OAuth flows redirect through Google's domain, which can't happen inside an XHR. Use `window.location.href = ...` or a plain `<a href="/api/login/google">` — never `fetch()`.

### 4. After Google redirects back

The flow is:
1. User clicks button → browser navigates to `/api/login/google`
2. Backend redirects to Google → user consents
3. Google redirects to `/api/auth/login/callback` (backend)
4. Backend verifies email allowlist, sets the session cookie, then **302 redirects back to `/`** (configurable via `auth.google.uiRedirectPath` on the backend; currently set to `/account`)

When the user lands back on the UI, the session cookie is already set. Treat it identically to a successful password login — re-fetch logged-in state from `/api/loggedin` (or whatever the existing app does on mount) and route to the admin area.

### 5. Error handling

If the Google flow fails, the backend redirects to `<uiRedirectPath>?error=<reason>` (currently `/account?error=...`). Possible reasons:

| `error` value          | Meaning                                              | Suggested user message                                          |
|------------------------|------------------------------------------------------|-----------------------------------------------------------------|
| `unauthorized_email`   | Email not in the backend's allowlist (or unverified) | "This Google account is not authorized for this site."          |
| `invalid_state`        | CSRF state cookie missing/mismatched/expired         | "Login session expired. Please try again."                      |
| `exchange_failed`      | OAuth code exchange or userinfo fetch failed         | "Could not complete sign-in with Google. Please try again."     |

On the login page, read the `error` URL query parameter on mount and surface a message if present. Clear the param from the URL after reading it (e.g. `history.replaceState`) so a refresh doesn't keep showing the error.

### 6. Already-logged-in case

If the user lands on the login page but is already authenticated (cookie still valid), redirect them to the admin area. The existing UI almost certainly already does this — just make sure it still works for the Google-method case (it should; the cookie is identical).

### 7. Logout — unchanged

`GET /api/logout` clears the session cookie regardless of how the user logged in. No UI change needed.

Note: this does **not** sign the user out of Google globally. Standard and intentional.

## What the UI does NOT need to know

- The email allowlist (lives on the backend).
- OAuth client ID, scopes, redirect URIs (all backend).
- Whether the operator changed `auth.method` (just call `/api/auth/method` again).
- Any token storage. The backend handles everything; the UI only ever sees the session cookie set automatically.

## Backend endpoints reference (read-only summary)

| Method | Path                        | Purpose                                                       |
|--------|-----------------------------|---------------------------------------------------------------|
| GET    | `/api/auth/method`          | Returns `{"method": "password" \| "google"}` (public)         |
| PUT    | `/api/login`                | Existing password login. Returns 405 when method=google.      |
| GET    | `/api/login/google`         | Starts the Google OAuth login flow (full-page redirect target)|
| GET    | `/api/auth/login/callback`  | Google's callback — UI does not call this directly             |
| GET    | `/api/logout`               | Clears session cookie (unchanged)                             |
| GET    | `/api/loggedin`             | Existing endpoint to check auth status (unchanged)            |

## Local dev

- Backend runs on `:8050`, fronted by nginx on `:8060` which routes `/api/*` to the backend and everything else to this UI app.
- All requests are same-origin via nginx, so no CORS / SameSite cookie complications.
- `auth.method` is currently set to `google` in the local config. Flip the backend config and restart to test the password path again.

## Suggested test plan

1. `curl http://localhost:8060/api/auth/method` returns `{"data":{"method":"google"}}` — already verified.
2. With method=google: visit the login page → see Google button → click → Google consent → redirect back → lands logged in.
3. Force the error path: temporarily change the backend's `auth.google.allowedEmails` to a different address, restart, retry the flow → should land on `/?error=unauthorized_email` and show a message.
4. Flip backend to method=password → reload login page → see the old form, which still works.
