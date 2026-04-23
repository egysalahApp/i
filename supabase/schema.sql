-- Create lessons table
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    pageTitle TEXT NOT NULL,
    headerTitle TEXT NOT NULL,
    headerSubtitle TEXT,
    youtubeLink TEXT,
    copyright TEXT,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Note: Since we are using the anon key for the migration script just for convenience,
-- we should temporarily disable RLS, or create an RLS policy that allows inserts.
-- By default, new tables don't have RLS enabled, so anyone with the anon key can insert/select.
-- For production, we should enable RLS and only allow SELECT for the anon key.

-- Enable Row Level Security (RLS)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON lessons FOR SELECT USING (true);

-- Create policy to allow public insert (ONLY TEMPORARY FOR MIGRATION)
-- We will delete this policy after migration.
CREATE POLICY "Allow public insert" ON lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON lessons FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON lessons FOR DELETE USING (true);
