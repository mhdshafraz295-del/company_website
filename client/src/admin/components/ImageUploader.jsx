import React, { useState, useRef } from 'react';
import axios from 'axios';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Upload, X, Loader2, Link2, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const fileInputRef = useRef(null);

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

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post(`/media/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      const rawUrl = res.data?.data?.url || res.data?.url;
      const uploadedUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';

      if (res.data?.success && uploadedUrl) {
        onChange(uploadedUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError('Failed to retrieve valid image URL from upload response.');
      }
    } catch (err) {
      console.error('Image upload error diagnostic:', {
        name: err?.name,
        code: err?.code,
        isCancel: axios.isCancel(err),
        message: err?.message,
      });
      setUploadError(err.response?.data?.message || err?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError('');
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentDisplayUrl = value ? getImageUrl(value) : '';

  return (
    <div className="space-y-2 select-none">
      {/* Hidden file input permanently mounted */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

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
          {isUploading ? (
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-500/80 bg-slate-900 rounded-2xl p-4 space-y-2 text-center">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-xs text-cyan-400 font-semibold">Uploading Image to Cloud Storage...</span>
            </div>
          ) : currentDisplayUrl ? (
            <div className="relative group w-full h-40 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                key={currentDisplayUrl}
                src={currentDisplayUrl}
                alt="Image Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-lg"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700/80 hover:border-cyan-500/80 bg-slate-900/60 hover:bg-slate-900 rounded-2xl cursor-pointer transition p-4 group"
            >
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="p-2.5 bg-slate-800 border border-slate-700 group-hover:border-cyan-500/50 rounded-xl text-slate-400 group-hover:text-cyan-400 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Click to upload <span className="text-cyan-400">JPG, PNG, or WebP</span>
                  </p>
                  <p className="text-[10px] text-slate-500">Max size 5 MB</p>
                </div>
              </div>
            </div>
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
