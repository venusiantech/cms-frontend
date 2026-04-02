'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { bulkUploadAPI } from '@/lib/api';

export interface SavedDomain {
  id: string;
  domainName: string;
  selectedMeaning: string | null;
  userDescription: string | null;
  sourceType: string;
  status: string;
  website?: { id: string; subdomain: string } | null;
}

export interface UploadResult {
  savedCount: number;
  skippedCount: number;
  total: number;
  saved: SavedDomain[];
  skipped: { domain: string; reason: string }[];
}

interface CsvUploadModalProps {
  onClose: () => void;
  onSuccess: (result: UploadResult) => void;
}

export function CsvUploadModal({ onClose, onSuccess }: CsvUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Only CSV files are accepted');
      return;
    }
    setError('');
    setSelectedFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError('');
    try {
      const res = await bulkUploadAPI.uploadCsv(selectedFile);
      const result: UploadResult = res.data;
      const allSkipped = result.savedCount === 0 && result.skippedCount > 0;
      const allAlreadyExist = allSkipped && result.skipped.every((s) => s.reason === 'Domain already exists');

      if (result.savedCount === 0) {
        if (allAlreadyExist) {
          const n = result.skippedCount;
          toast.error(`${n} domain${n !== 1 ? 's' : ''} already exist`);
          setError(`All ${n} domain${n !== 1 ? 's' : ''} already exist in your account.`);
        } else {
          toast.error(`No domains were saved. ${result.skippedCount} skipped.`);
          setError(`All ${result.skippedCount} rows were skipped. Check the domain formats.`);
        }
        setIsUploading(false);
        return;
      }

      if (result.skippedCount > 0) {
        const savedMsg = `${result.savedCount} domain${result.savedCount !== 1 ? 's' : ''} added`;
        const skippedMsg = `${result.skippedCount} skipped`;
        toast.success(`${savedMsg} and ${skippedMsg}`);
      } else {
        toast.success(`${result.savedCount} domain${result.savedCount !== 1 ? 's' : ''} imported successfully`);
      }
      onSuccess(result);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-light text-neutral-100">Upload CSV</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Bulk import domains from a CSV file</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-[#262626] rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-6 py-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
            CSV Format
          </p>

          {/* Visual table */}
          <div className="rounded-lg border border-neutral-800 overflow-hidden text-xs">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-[#262626]/60">
              <div className="px-3 py-2 font-semibold text-neutral-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                domain
              </div>
              <div className="px-3 py-2 font-semibold text-neutral-300 flex items-center gap-1.5 border-l border-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                keywords
                <span className="text-neutral-600 font-normal">(opt)</span>
              </div>
              <div className="px-3 py-2 font-semibold text-neutral-300 flex items-center gap-1.5 border-l border-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
                description
                <span className="text-neutral-600 font-normal">(opt)</span>
              </div>
            </div>

            {/* Data rows */}
            {[
              { domain: 'example.com', keywords: 'ai technology', description: 'A site about AI', full: true },
              { domain: 'myblog.net',  keywords: 'travel food',   description: '',                full: false },
              { domain: 'shop.io',     keywords: '',              description: '',                full: false },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-t border-neutral-800 bg-[#0a0a0a]/40 hover:bg-[#262626]/30 transition-colors"
              >
                <div className="px-3 py-2 font-mono text-neutral-200">{row.domain}</div>
                <div className="px-3 py-2 font-mono text-emerald-400/80 border-l border-neutral-800">
                  {row.keywords || <span className="text-neutral-700">—</span>}
                </div>
                <div className="px-3 py-2 font-mono text-sky-400/80 border-l border-neutral-800 truncate">
                  {row.description || <span className="text-neutral-700">—</span>}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-neutral-600 mt-2.5">
            Header row is required. Green &amp; blue columns are optional per row.
          </p>
        </div>

        {/* Drop Zone */}
        <div className="px-6 pb-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors
              ${isDragging
                ? 'border-neutral-400 bg-[#262626]/50'
                : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-neutral-700 hover:border-neutral-500 hover:bg-[#0a0a0a]/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileInput}
              className="hidden"
            />
            {selectedFile ? (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FileText size={18} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-200">{selectedFile.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB — click to change
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#262626] border border-neutral-700 flex items-center justify-center">
                  <Upload size={18} className="text-neutral-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-300">
                    Drop your CSV here, or <span className="text-white underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">CSV files only, max 5 MB</p>
                </div>
              </>
            )}
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-400 mt-2">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#262626] hover:bg-[#404040] text-neutral-200 rounded-md text-sm font-light border border-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </>
            ) : (
              'Import Domains'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
