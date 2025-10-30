# SmartSave - Frontend

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

