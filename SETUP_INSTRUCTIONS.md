# Supabase Connection Fix Instructions

## Problems Fixed
1. ✅ Updated .env.local with correct Supabase credentials
2. ✅ Added debugging logs to Supabase client
3. ✅ Added debugging logs to all API routes
4. ✅ Created health check endpoint

## Remaining Issue: Database Schema Not Created

The new Supabase instance (https://hjxlpkgdywlvhrcyquqj.supabase.co) doesn't have the database tables yet. You need to run the setup script.

## Steps to Fix

### Step 1: Run the Database Setup Script

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/hjxlpkgdywlvhrcyquqj
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `database/setup.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

This will create all the required tables:
- studios
- users
- games (with trailer_url column)
- user_library
- comments
- comment_likes
- follows
- lists
- list_games
- list_likes
- reviews
- achievements
- user_achievements
- activities
- game_screenshots

### Step 2: Restart the Development Server

After running the SQL script, you MUST restart your Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it:
npm run dev
```

This is required because:
- Next.js caches environment variables at startup
- The Supabase client is initialized with the old credentials
- Restarting picks up the new .env.local values

### Step 3: Test the Connection

Visit the health check endpoint:
```
http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Supabase connection successful",
  "timestamp": "2026-05-17T..."
}
```

### Step 4: Verify Games are Loading

Visit the homepage:
```
http://localhost:3000
```

The games from the database should now appear.

## What Was Causing the Errors

### Error 1: "Could not find the table 'public.users' in the schema cache"
**Cause:** The new Supabase instance doesn't have the `users` table created yet.
**Fix:** Run the database/setup.sql script in Supabase SQL Editor.

### Error 2: "Could not find the 'trailer_url' column of 'games' in the schema cache"
**Cause:** The new Supabase instance doesn't have the `games` table with the `trailer_url` column.
**Fix:** Run the database/setup.sql script in Supabase SQL Editor.

### Error 3: "ConnectTimeoutError: Connect Timeout Error"
**Cause:** The .env.local file had the old Supabase URL, which was pointing to a different project.
**Fix:** Updated .env.local with the correct credentials and restarted the server.

## How to Avoid This in the Future

1. **Always restart the dev server after changing .env.local**
   - Next.js caches environment variables at startup
   - Changes won't take effect until restart

2. **Keep database schema in sync**
   - When switching Supabase projects, always run the setup script
   - Use migrations for production deployments

3. **Use the health check endpoint**
   - Visit `/api/health` to verify connection
   - Check server logs for detailed error information

## Debugging Tips

If you still have issues after following these steps:

1. Check the server terminal for detailed logs:
   - Look for "Supabase URL:" to verify the correct URL is being used
   - Look for "GET /api/games" to see query execution
   - Look for error details in JSON format

2. Verify the Supabase dashboard:
   - Go to Table Editor
   - Confirm all tables exist
   - Confirm the `games` table has the `trailer_url` column

3. Test the API directly:
   ```bash
   curl http://localhost:3000/api/games
   ```

## Files Modified

1. `.env.local` - Updated with new Supabase credentials
2. `lib/supabase.ts` - Added debugging logs and explicit schema configuration
3. `app/api/games/route.ts` - Added detailed error logging
4. `app/api/games/[id]/route.ts` - Added detailed error logging for PUT/DELETE
5. `app/api/health/route.ts` - Created new health check endpoint
