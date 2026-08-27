import React, { useState } from 'react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Upload, X, Image as ImageIcon, Loader2, Link2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImageUploader({
  value = '',
  onChange,
  folder = 'general',
  label = 'Image',
  placeholder = 'Select or upload an image...',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess(false);

    // Client-side MIME check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, and WebP images are allowed.');
      return;
    }

    // Client-side 5MB size check
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Maximum image size limit is 5 MB.');
      return;
    }

    // Local instant preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post(`/media/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data.data?.url) {
        onChange(res.data.data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Please try again.');
      setLocalPreview(null);
    }
    setIsUploading(false);
  };

  const handleClear = () => {
    onChange('');
    setLocalPreview(null);
    setUploadError('');
    setUploadSuccess(false);
  };

  const currentDisplayUrl = localPreview || getImageUrl(value);

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{showManualUrl ? 'Use File Upload' : 'Advanced: Paste URL'}</span>
        </button>
      </div>

      {showManualUrl ? (
        <div className="space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      ) : (
        <div className="space-y-2">
          {currentDisplayUrl ? (
            <div className="relative group w-full h-40 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={currentDisplayUrl}
                alt="Image Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/placeholder.png';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          ) : (
            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700/80 hover:border-cyan-500/80 bg-slate-900/60 hover:bg-slate-900 rounded-2xl cursor-pointer transition p-4 group">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                {isUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    <span className="text-xs text-cyan-400 font-semibold">Uploading Image...</span>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 bg-slate-800 border border-slate-700 group-hover:border-cyan-500/50 rounded-xl text-slate-400 group-hover:text-cyan-400 transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Click to upload <span className="text-cyan-400">JPG, PNG, or WebP</span>
                      </p>
                      <p className="text-[10px] text-slate-500">Max size 5 MB</p>
                    </div>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploading}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {uploadSuccess && (
        <div className="p-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] rounded-lg flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Image uploaded successfully!</span>
        </div>
      )}

      {uploadError && (
        <div className="p-2 bg-red-950/60 border border-red-800 text-red-300 text-[11px] rounded-lg flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
