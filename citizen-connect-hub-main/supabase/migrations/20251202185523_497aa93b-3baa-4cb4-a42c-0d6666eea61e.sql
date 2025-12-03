-- Allow anyone to create complaints (no authentication required)
CREATE POLICY "Anyone can create complaints" 
ON public.complaints 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to add status updates for anonymous complaints
CREATE POLICY "Anyone can add status updates" 
ON public.status_updates 
FOR INSERT 
WITH CHECK (true);

-- Drop the restrictive authenticated-only policies
DROP POLICY IF EXISTS "Authenticated users can create complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authenticated users can add status updates" ON public.status_updates;