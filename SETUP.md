# Local Admin Setup

To set up hardcoded local admin credentials, add the following environment variables to your `.env.local` file:

```env
# Local Admin Credentials (for development/testing)
LOCAL_ADMIN_USERNAME=your_admin_username
LOCAL_ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_LOCAL_ADMIN_NAME=Your Display Name
```

## How it works:

1. **Priority**: Local admin credentials are checked FIRST before database authentication
2. **Authentication**: If credentials match, user gets admin access immediately
3. **Token**: Creates a special token prefixed with "local-admin"
4. **Fallback**: If no local admin is configured, falls back to Supabase database

## Usage:

1. Create or update your `.env.local` file
2. Add the two environment variables above
3. Restart your development server
4. Login with the hardcoded credentials

## Security Notes:

- **Development Only**: This is intended for development/testing
- **Environment Variables**: Credentials are stored in environment variables, not in code
- **Git Safe**: `.env.local` is in `.gitignore` so credentials won't be committed
- **Production**: Consider using proper authentication in production

## Example:

```env
LOCAL_ADMIN_USERNAME=admin
LOCAL_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_LOCAL_ADMIN_NAME=John Doe
```

This would allow you to:
- **Login** with: `admin` / `admin123`
- **Display**: Shows "John Doe" in the profile dropdown
- **Avatar**: Shows "J" (first letter of display name)
