# Storage Policy Fix for Products Bucket

## Root Cause Analysis

The error `StorageApiError: new row violates row-level security policy` when uploading files to the `products` bucket is caused by:

1. **Missing Storage INSERT Policy**: There was no proper INSERT policy for the `storage.objects` table that allows authenticated users to upload files.

2. **Current Upload Path Structure**: The code uploads files to paths like:
   - Images: `user_id/timestamp-random.ext`
   - Files: `user_id/files/timestamp.ext`

3. **Missing Policy for Authenticated Users**: Without a proper INSERT policy, even authenticated users cannot upload files to the storage bucket.

## Storage Bucket
- **Bucket Name**: `products`
- **Current Status**: RLS enabled but missing proper INSERT policies

## Policies that were blocking uploads

Before the fix, there were likely either:
- No INSERT policies at all for the storage.objects table
- Existing policies that were too restrictive (e.g., only allowing admins)

## The Fix

The fix creates proper RLS policies for the `storage.objects` table:

### INSERT Policy
```sql
CREATE POLICY "Authenticated users can upload to their own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'products' AND
    split_part(name, '/', 1) = auth.uid()::text
  );
```

This policy:
- Allows only authenticated users to upload
- Restricts uploads to the `products` bucket
- Ensures users can only upload to their own folder (first part of path must match their user ID)
- Uses `split_part(name, '/', 1)` to extract the user ID from the path

### Security Assurance
- **No public write access**: Only authenticated users can upload
- **User isolation**: Users can only upload to their own folder
- **Bucket restriction**: Uploads are restricted to the `products` bucket only
- **RLS remains enabled**: Security is maintained, not bypassed
- **No service role keys in client**: Client-side code uses proper authentication

## How to Apply the Fix

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the content of `supabase/migrations/20240904_fix_storage_policies.sql`
4. Paste and run the SQL script

### Option 2: Via Supabase CLI
```bash
supabase db push
```

### Option 3: Via API
Use the Supabase REST API to execute the SQL commands.

## Expected Results After Fix

Once the policies are applied:

1. **Authenticated Seller User** can:
   - Upload product images to `user_id/` folder
   - Upload product files to `user_id/files/` folder
   - View their own uploaded files
   - Update and delete their own files

2. **Public Users** can:
   - View all product files (for product display)

3. **Security Maintained**:
   - Users cannot upload to other users' folders
   - Users cannot upload to other buckets
   - Unauthenticated users cannot upload
   - RLS remains fully enabled

## Testing Instructions

After applying the fix, test the following:

### A. Authenticated Seller User Uploads Image
1. Login as a seller user
2. Navigate to product creation page
3. Upload a product image
4. Expected: Upload succeeds without RLS error

### B. Authenticated Seller User Uploads File
1. Login as a seller user  
2. Navigate to product creation page
3. Upload a product file
4. Expected: Upload succeeds without RLS error

### C. Complete Digital Product Creation
1. Login as a seller user
2. Create a complete digital product with images and files
3. Expected: Product creation succeeds, files are properly saved

### D. File URL Validation
1. After product creation, check the product details
2. Expected: File URLs are correctly saved and accessible

### E. Unauthenticated User Security
1. Logout from the application
2. Try to upload a file via API
3. Expected: Upload fails with authentication error

## Verification Commands

After applying the fix, you can verify the policies are working:

```sql
-- Check that policies exist
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Test INSERT as authenticated user (in your app code)
-- The upload should succeed for paths like: user_id/filename.ext
