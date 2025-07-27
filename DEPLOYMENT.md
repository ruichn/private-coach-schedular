# 🚀 Deployment Guide: Vercel + Supabase (FREE)

## Step 1: Create Supabase Account & Database

1. **Sign up**: Go to [supabase.com](https://supabase.com) and create account
2. **Create project**: 
   - Project name: `volleyball-scheduler`
   - Database password: Choose a strong password
   - Region: Choose closest to your users
3. **Get database URLs**:
   - Go to `Settings > Database`
   - Copy both `Connection string` and `Direct connection`
   - Replace `[YOUR-PASSWORD]` with your database password

## Step 2: Prepare Code for Deployment

```bash
# Install dependencies
npm install

# Generate Prisma client for PostgreSQL
npx prisma generate

# Test build locally
npm run build
```

## Step 3: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - volleyball scheduler"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/volleyball-scheduler.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Import project**:
   - Click "New Project"
   - Import your `volleyball-scheduler` repository
   - Framework preset: Next.js (auto-detected)
3. **Set environment variables** in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://postgres.xxx:[password]@...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   DIRECT_URL=postgresql://postgres.xxx:[password]@...pooler.supabase.com:5432/postgres
   EMAIL_USER=robe@podiosports.org
   EMAIL_PASS=your-gmail-app-password
   ADMIN_PASSWORD=your-secure-password-2024
   NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
   ```
4. **Deploy**: Click "Deploy"

## Step 5: Setup Database Schema

After deployment, run these commands to setup your production database:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Push database schema to Supabase
vercel env pull .env.production
npx prisma db push --accept-data-loss

# Seed with initial data
npx prisma db seed
```

## Step 6: Update Production URL

1. **Get your Vercel URL** from deployment (e.g., `volleyball-scheduler.vercel.app`)
2. **Update environment variable**:
   - Go to Vercel dashboard > Project > Settings > Environment Variables
   - Update `NEXT_PUBLIC_BASE_URL` to your actual URL

## Step 7: Test Your Live Site

Visit your deployed URL and test:
- ✅ View sessions
- ✅ Register for session (use real email)
- ✅ Check email confirmation
- ✅ Test cancellation
- ✅ Admin access with password

## 🆓 Free Tier Limits

**Supabase Free:**
- 2 projects
- 500MB database
- 2GB bandwidth/month
- 50MB file uploads

**Vercel Free:**
- 100GB bandwidth/month
- 100 deployments/day
- Serverless functions

## 🎯 Custom Domain (Optional)

1. **Buy domain** (e.g., `volleyballtraining.com`)
2. **Add to Vercel**:
   - Go to Project > Settings > Domains
   - Add your domain
   - Update DNS records as shown

## 🔧 Troubleshooting

**Database connection issues:**
- Verify connection strings have correct password
- Check Supabase project is active

**Build errors:**
- Run `npm run build` locally first
- Check all environment variables are set

**Email not working:**
- Verify Gmail app password is correct
- Check Gmail 2FA is enabled

## 📱 Going Live Checklist

- [ ] Database schema deployed
- [ ] Test data seeded
- [ ] Email confirmation working
- [ ] Admin access working
- [ ] Cancel functionality working
- [ ] Mobile responsive
- [ ] All environment variables set
- [ ] Custom domain (optional)

## 💡 Next Steps

- Add real training sessions via admin panel
- Configure Coach Robe's real Gmail
- Share URL with parents/players
- Monitor usage in Vercel analytics