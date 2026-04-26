-- Enable public access to inventory and vendors buckets

-- 1. Create policies for 'inventory' bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'inventory');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- 2. Create policies for 'vendors' bucket
CREATE POLICY "Public Access Vendors" ON storage.objects FOR SELECT USING (bucket_id = 'vendors');
CREATE POLICY "Authenticated Upload Vendors" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vendors' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update Vendors" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'vendors' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete Vendors" ON storage.objects FOR DELETE USING (bucket_id = 'vendors' AND auth.role() = 'authenticated');
