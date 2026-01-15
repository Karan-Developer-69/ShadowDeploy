# Environment Variables Setup

## Server (.env)

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URL=mongodb://localhost:27017/shadowdeploy

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Server Port
PORT=6900

# Environment
NODE_ENV=development
```

### Getting Clerk Secret Key:
1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to "API Keys" in the sidebar
4. Copy your "Secret Key" (starts with `sk_`)
5. Paste it as the value for `CLERK_SECRET_KEY`

---

## Client (.env.local)

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Clerk Public Key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# API URL
NEXT_PUBLIC_API_URL=http://localhost:6900
```

### Getting Clerk Publishable Key:
1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to "API Keys" in the sidebar
4. Copy your "Publishable Key" (starts with `pk_`)
5. Paste it as the value for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

---

## Important Notes

- **Never commit `.env` files to Git** - they contain sensitive keys
- Both keys must be from the same Clerk application
- The `CLERK_SECRET_KEY` must never be exposed to the client
- Make sure MongoDB is running before starting the server
- Restart both client and server after adding environment variables
