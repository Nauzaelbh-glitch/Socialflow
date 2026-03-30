# SocialFlow Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. Vercel CLI installed (`npm i -g vercel`)
3. A Vercel account
4. A Supabase project

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URL (Session Pooler for IPv4 compatibility)
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres

# Upstash Redis (Optional - for job scheduling)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## Deployment Steps

### Option 1: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy

## Required Environment Variables in Vercel

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side only) |
| `DATABASE_URL` | PostgreSQL connection string with Session Pooler |

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Settings > API
3. Use the Session Pooler connection string for better IPv4 compatibility
4. Run database migrations:

```bash
npx prisma db push
```

5. Seed the database (optional):

```bash
npx tsx scripts/seed.ts
```

## Database

The schema is already configured in `prisma/schema.prisma` with the following tables:

- `companies` - Multi-tenant companies
- `users` - User accounts with roles
- `social_accounts` - Connected social media accounts
- `templates` - Content templates
- `posts` - Scheduled/published posts
- `post_platforms` - Post-platform relationships
- `analytics` - Performance metrics

## After Deployment

1. Register a new account at `/register`
2. Connect your social media accounts at `/dashboard/accounts`
3. Create content templates at `/dashboard/templates`
4. Schedule posts at `/dashboard/calendar`
5. View analytics at `/dashboard/analytics`

## Troubleshooting

### Authentication Issues

If you experience authentication issues:
1. Verify all Supabase environment variables are set
2. Check Supabase project's authentication settings
3. Ensure email confirmation is disabled for easier testing

### Database Connection Issues

If the database connection fails:
1. Verify DATABASE_URL is using Session Pooler format
2. Check that your Supabase project is not paused
3. Ensure IP whitelist includes Vercel's IPs (usually not needed with Session Pooler)

### Build Errors

If you encounter build errors:
1. Ensure Node.js version is 18+
2. Run `npm install` locally first
3. Check all environment variables are set

## Support

For issues or questions, please check the project documentation or contact support.
