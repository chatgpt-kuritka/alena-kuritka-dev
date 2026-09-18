CREATE POLICY "Server contact handling only"
ON public.contact_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);