# Google OAuth Setup for MedBook

To enable real Google authentication (instead of demo mode), you need to configure Google OAuth credentials in your backend.

## Steps to Set Up Google OAuth

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" then "New Project"
3. Enter a project name (e.g., "MedBook") and click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, with your project selected, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on "Google+ API" and then click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted to configure the OAuth consent screen:
   - Click "Configure Consent Screen"
   - Select "External" (or "Internal" if you're using Google Workspace)
   - Fill in the required fields:
     - App name: MedBook
     - User support email: Your email
     - Developer contact information: Your email
   - Click "Save and Continue"
   - Skip scopes and test users for now
   - Click "Save and Continue" until finished

4. Back on the credentials page:
   - Application type: Web application
   - Name: MedBook
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
   - Click "Create"

5. Copy your Client ID and Client Secret

### 4. Update Environment Variables

In your `backend/.env` file, replace the placeholder values:

```env
GOOGLE_CLIENT_ID=your-real-google-client-id-here
GOOGLE_CLIENT_SECRET=your-real-google-client-secret-here
```

With your actual credentials from Google Cloud Console.

### 5. Restart the Backend Server

After updating the environment variables, restart your backend server:

```bash
cd backend
npm run dev
```

### 6. Test Google Authentication

1. Make sure both frontend and backend servers are running
2. Go to the login page
3. Click "Continue with Google"
4. You should now see the real Google OAuth flow instead of demo mode

## Troubleshooting

- If you still see demo mode, check that your backend server restarted properly
- Ensure there are no typos in your Client ID or Client Secret
- Make sure the redirect URI exactly matches `http://localhost:5000/api/auth/google/callback`
- Check the backend console for any error messages related to Google OAuth

## Security Notes

- Never commit your actual Google OAuth credentials to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- In production, you'll need to update the redirect URIs to your production domain