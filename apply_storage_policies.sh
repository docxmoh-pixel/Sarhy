#!/bin/bash

# Script to apply storage policies to Supabase
# This script assumes you have the Supabase CLI installed and configured

echo "Applying storage policies to Supabase..."

# Run the migration
supabase db push

echo "Storage policies applied successfully!"
