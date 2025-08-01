# Deployment Guide for Abheepay POS Management System

## Vercel Deployment

### Prerequisites
1. Vercel account
2. GitHub repository with the project
3. Environment variables configured

### Environment Variables
Set these environment variables in your Vercel project settings:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
CLIENT_URL=https://your-vercel-domain.vercel.app
```

### Deployment Steps

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the repository

2. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add all required environment variables in the Vercel dashboard
   - Make sure to use production values

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Troubleshooting

#### Build Error 126
If you encounter "Command 'npm run build' exited with 126":
1. Check that all dependencies are properly installed
2. Ensure the build script exists and is executable
3. Verify that the client directory structure is correct

#### API Routes Not Working
1. Ensure all API routes are prefixed with `/api/`
2. Check that the server.js file is properly configured
3. Verify environment variables are set correctly

#### Static Files Not Loading
1. Check that the client build directory exists
2. Ensure the static file serving is configured in server.js
3. Verify the build process completed successfully

### Local Testing

Before deploying, test locally:

```bash
# Install dependencies
npm install
cd client && npm install

# Build the application
npm run build

# Start the server
npm start
```

### Database Setup

1. **Supabase Setup**
   - Create a new Supabase project
   - Run the schema.sql file in the SQL editor
   - Copy the project URL and anon key

2. **Environment Variables**
   - Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel

### Post-Deployment

1. **Test the Application**
   - Verify all pages load correctly
   - Test API endpoints
   - Check authentication flow

2. **Monitor Logs**
   - Use Vercel dashboard to monitor function logs
   - Check for any errors in the console

3. **Performance**
   - Monitor function execution times
   - Optimize if needed

### Support

If you encounter issues:
1. Check the Vercel function logs
2. Verify environment variables
3. Test locally first
4. Check the build logs for specific errors 