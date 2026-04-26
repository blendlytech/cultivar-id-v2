'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Camera, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
  bucket: 'inventory' | 'vendors';
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string | null;
  label?: string;
}

export default function ImageUpload({ bucket, onUploadComplete, currentImageUrl, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
    } catch (err: any) {
      setError(err.message);
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onUploadComplete('');
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="form-label">{label}</label>}
      
      <div className="relative group">
        {previewUrl ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gold-dim bg-bg-surface">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-gold-dim bg-bg-surface hover:border-gold transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-gold-dim mb-2" />
              )}
              <p className="mb-2 text-sm text-text-secondary">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-text-secondary">PNG, JPG or WEBP (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
