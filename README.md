# AGASEKE - Frontend

A digital piggy bank application with user signup functionality.

## Features

- User signup/registration form
- Clean and modern UI
- Ready to connect to backend API

## Signup Page

The signup form is located at `#signup-page` and includes:
- Username input
- Email input
- Password input (min 6 characters)
- Optional phone number

## API Integration

The signup form sends data to `/api/auth/register` endpoint with the following format:

```javascript
{
  fullName: "username",
  email: "user@email.com",
  phoneNumber: "+250788123456",  // optional
  password: "password",
  confirmPassword: "password",
  pin: "0000"
}
```

Expected response:
```javascript
{
  success: true,
  token: "jwt_token_here",
  user: { id, fullName, email, balance, ... }
}
```

## Usage

Just open `Iindex.html` in a browser. The signup functionality will work once the backend API is connected.

To navigate to signup page, add a link or button with:
```javascript
showPage('signup-page')
```

Backend / MTN Integration
------------------------

The backend supports MTN Mobile Money Request-to-Pay integration (sandbox). New endpoints:

- `POST /api/mtn/token` — test endpoint to obtain an access token (requires MTN sandbox credentials).
- `POST /api/mtn/requesttopay` — initiate a Request-to-Pay (internal use).
- `POST /api/mtn/callback` — webhook endpoint MTN will call with payment status updates.

When a client calls `POST /api/saving/add` it now initiates a Request-to-Pay and creates a `Payment` record with `status: pending`.
The saving balance is updated only after a successful payment callback to `/api/mtn/callback`.

Required environment variables (set in `.env` or your environment):

```
MTN_SUBSCRIPTION_KEY=your_subscription_key
MTN_API_USER=your_api_user_id
MTN_API_KEY=your_api_key
MTN_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_TARGET_ENVIRONMENT=sandbox
```

Testing (PowerShell):

Install dependencies and run:
```powershell
cd C:/Users/hp/OneDrive/Desktop/AGASEKE/backend
npm install
npm run dev
```

Initiate a payment (authenticated route):
```powershell
curl -Method POST -Uri 'http://localhost:5000/api/saving/add' -Headers @{ Authorization='Bearer <token>' } -ContentType 'application/json' -Body (@{ amount='10'; payer='25677XXXXXXX' } | ConvertTo-Json)
```

Simulate MTN callback (for local testing):
```powershell
curl -Method POST -Uri 'http://localhost:5000/api/mtn/callback' -ContentType 'application/json' -Body (@{ referenceId='<returned-referenceId>'; status='SUCCESSFUL' } | ConvertTo-Json)
```


