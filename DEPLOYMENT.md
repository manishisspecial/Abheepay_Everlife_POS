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
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add all the environment variables listed above
   - Make sure to set `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Troubleshooting

#### Build Error 126
If you get "Command 'npm run build' exited with 126":
- Make sure the build command is: `npm run build`
- Check that all dependencies are in package.json
- Verify the client folder structure

#### API Routes Not Working
If API routes return 404:
- Check that the `vercel.json` file is in the root directory
- Verify the routes configuration in `vercel.json`
- Make sure the server.js file is in the root directory

#### Static Files Not Loading
If the React app doesn't load:
- Check that the build output is in `client/build`
- Verify the static file serving in `server.js`
- Make sure the 404 handler serves `index.html`

### File Structure for Vercel
```
/
├── server.js              # Main server file
├── package.json           # Root package.json
├── vercel.json           # Vercel configuration
├── client/
│   ├── package.json      # React package.json
│   ├── src/              # React source code
│   └── build/            # React build output (after build)
└── routes/               # API routes
```

### Vercel Configuration (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Build Process
1. Vercel installs dependencies from root `package.json`
2. Runs `npm run build` which:
   - Installs client dependencies
   - Builds React app to `client/build`
3. Deploys the server.js as a serverless function
4. Serves static files from `client/build`

### Post-Deployment
1. **Test the application**
   - Visit your Vercel URL
   - Test all major features
   - Verify API endpoints work

2. **Monitor logs**
   - Check Vercel function logs
   - Monitor for any errors

3. **Set up custom domain** (optional)
   - Configure custom domain in Vercel
   - Update environment variables

### Common Issues and Solutions

#### Issue: "functions and builds cannot be used together"
**Solution**: Remove the `functions` property from `vercel.json` and use only `builds`.

#### Issue: React app not loading
**Solution**: 
- Check that `client/build/index.html` exists
- Verify the static file serving in `server.js`
- Make sure the 404 handler is working

#### Issue: API routes returning 404
**Solution**:
- Verify the routes in `vercel.json`
- Check that server.js is properly configured
- Ensure all route files exist

#### Issue: Environment variables not working
**Solution**:
- Add all environment variables in Vercel dashboard
- Make sure variable names match exactly
- Redeploy after adding variables

### Local Testing
Before deploying, test locally:
```bash
# Install dependencies
npm install
cd client && npm install

# Build the client
npm run build

# Start the server
npm start
```

### Performance Optimization
1. **Enable caching** for static assets
2. **Use CDN** for better global performance
3. **Monitor function execution time**
4. **Optimize bundle size** if needed

### Security Considerations
1. **Environment variables** are encrypted in Vercel
2. **HTTPS** is enabled by default
3. **CORS** is configured for production
4. **Rate limiting** is enabled
5. **Helmet** provides security headers

### Support
If you encounter issues:
1. Check Vercel deployment logs
2. Verify all configuration files
3. Test locally first
4. Check environment variables
5. Review the troubleshooting section above 