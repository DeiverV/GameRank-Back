import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://lsvnkghztdjfxsxmuvjo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzdm5rZ2h6dGRqZnhzeG11dmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MzU3MDMsImV4cCI6MjA0NjUxMTcwM30.2ahfp3HmsNsWQCnaImQ_MJS6OrRcaawc77FphgiHhF0',
);
