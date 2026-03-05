'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Loader2, Sparkles, Pencil, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { bulkUploadAPI } from '@/lib/api';
import type { UploadResult, SavedDomain } from './CsvUploadModal';

interface CsvPreviewEditorProps {
  result: UploadResult;
  onClose: () => void;
  onUpdateResult?: (next: UploadResult) => void;
}

export function CsvPreviewEditor({ result, onClose, onUpdateResult }: CsvPreviewEditorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSkipped, setShowSkipped] = useState(false);
  const [generatedIds, setGeneratedIds] = useState<Set<string>>(new Set());
  const [editingDomain, setEditingDomain] = useState<SavedDomain | null>(null);
  const [editKeywords, setEditKeywords] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const allIds = useMemo(() => result.saved.map((d) => d.id), [result.saved]);
  const allSelected = selected.size === allIds.length && allIds.length > 0;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openEdit = (domain: SavedDomain) => {
    setEditingDomain(domain);
    setEditKeywords(domain.selectedMeaning ?? '');
    setEditDescription(domain.userDescription ?? '');
  };

  const closeEdit = () => {
    setEditingDomain(null);
    setIsSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingDomain) return;
    const trimmedKeywords = editKeywords.trim();
    const trimmedDesc = editDescription.trim();
    if (!trimmedKeywords && !trimmedDesc) {
      toast.error('Provide at least keywords or description');
      return;
    }
    setIsSavingEdit(true);
    try {
      await bulkUploadAPI.updateDomain(editingDomain.id, {
        ...(trimmedKeywords ? { selectedMeaning: trimmedKeywords } : {}),
        ...(trimmedDesc ? { userDescription: trimmedDesc } : {}),
      });
      const nextSaved = result.saved.map((d) =>
        d.id === editingDomain.id
          ? {
              ...d,
              selectedMeaning: trimmedKeywords || d.selectedMeaning,
              userDescription: trimmedDesc || d.userDescription,
            }
          : d
      );
      onUpdateResult?.({ ...result, saved: nextSaved });
      toast.success('Domain updated');
      closeEdit();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update domain';
      toast.error(msg);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleGenerate = async () => {
    if (selected.size === 0) return;
    setIsGenerating(true);
    try {
      const res = await bulkUploadAPI.generateWebsites([...selected]);
      const { queued, pending, skipped } = res.data as {
        queued: { domainId: string; jobId: string }[];
        pending: string[];
        skipped: { domainId: string; reason: string }[];
      };

      if (queued.length > 0) {
        toast.success(`${queued.length} website${queued.length !== 1 ? 's' : ''} queued for generation`);
        setGeneratedIds((prev) => {
          const next = new Set(prev);
          queued.forEach(({ domainId }) => next.add(domainId));
          return next;
        });
      }

      if (pending.length > 0) {
        toast(`${pending.length} domain${pending.length !== 1 ? 's' : ''} not queued — queue is full. Try again shortly.`, {
          icon: '⏳',
          duration: 5000,
          style: { background: '#262626', color: '#fafafa' },
        });
      }

      if (skipped.length > 0 && queued.length === 0 && pending.length === 0) {
        toast.error(`Could not queue any domains. Check ownership or domain status.`);
      }

      // Deselect successfully queued items
      if (queued.length > 0) {
        const queuedIds = new Set(queued.map(({ domainId }) => domainId));
        setSelected((prev) => {
          const next = new Set(prev);
          queuedIds.forEach((id) => next.delete(id));
          return next;
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to queue generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden rounded-lg border border-neutral-800 bg-black">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center gap-4 px-4 lg:px-8 h-14 border-b border-neutral-800 bg-black">
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 rounded-md transition-colors flex-shrink-0"
          title="Back to dashboard"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <h1 className="text-base font-medium text-neutral-100 truncate">CSV Import Preview</h1>
          <span className="flex-shrink-0 px-2 py-0.5 bg-neutral-900 text-neutral-400 text-xs rounded-full border border-neutral-700">
            {result.savedCount} imported
          </span>
          {result.skippedCount > 0 && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20">
              {result.skippedCount} skipped
            </span>
          )}
        </div>

        {selected.size > 0 && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-md text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Generate Websites ({selected.size})
          </button>
        )}
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto">
        {result.saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-neutral-500 text-sm">No domains were imported.</p>
            <button onClick={onClose} className="mt-4 text-xs text-neutral-400 underline underline-offset-2">
              Go back
            </button>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-[#0a0a0a] z-10">
              <tr className="border-b border-neutral-800">
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-white cursor-pointer"
                    title="Select all"
                  />
                </th>
                <th className="w-12 px-2 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wide">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wide">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wide">Keywords</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wide">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wide">Status</th>
                <th className="w-12 px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {result.saved.map((domain: SavedDomain, idx: number) => {
                const isSelected = selected.has(domain.id);
                const isQueued = generatedIds.has(domain.id);
                return (
                  <tr
                    key={domain.id}
                    onClick={() => toggleRow(domain.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#0a0a0a]' : 'hover:bg-[#0a0a0a]/50'
                    }`}
                  >
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(domain.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 accent-white cursor-pointer"
                      />
                    </td>
                    <td className="w-12 px-2 py-3 text-xs text-neutral-600 font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-neutral-100 font-medium">{domain.domainName}</span>
                      {domain.website?.subdomain && (
                        <span className="block text-xs text-neutral-600 font-mono mt-0.5">{domain.website.subdomain}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-xs max-w-[200px] truncate">
                      {domain.selectedMeaning || <span className="text-neutral-700">—</span>}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-xs max-w-[280px]">
                      {domain.userDescription ? (
                        <span className="line-clamp-2">{domain.userDescription}</span>
                      ) : (
                        <span className="text-neutral-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isQueued ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                          Queued
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-neutral-500 text-xs rounded-full border border-neutral-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {domain.status !== 'ACTIVE' && (
                        <button
                          type="button"
                          onClick={() => openEdit(domain)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
                          title="Edit keywords and description"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Skipped section */}
      {result.skipped.length > 0 && (
        <div className="flex-shrink-0 border-t border-neutral-800 bg-[#0a0a0a]">
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className="w-full flex items-center gap-2 px-4 lg:px-8 py-3 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            {showSkipped ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <span className="font-medium">{result.skipped.length} skipped row{result.skipped.length !== 1 ? 's' : ''}</span>
            <span className="text-neutral-600">— click to {showSkipped ? 'hide' : 'view'}</span>
          </button>
          {showSkipped && (
            <div className="px-4 lg:px-8 pb-4 max-h-40 overflow-y-auto space-y-1">
              {result.skipped.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs py-1">
                  <span className="text-neutral-400 font-mono w-40 truncate">{item.domain}</span>
                  <span className="text-amber-500/70">{item.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom hint */}
      <div className="flex-shrink-0 px-4 lg:px-8 py-2.5 border-t border-neutral-900 bg-black flex items-center justify-between text-xs text-neutral-600">
        <span>
          {selected.size > 0
            ? `${selected.size} of ${result.saved.length} selected`
            : 'Click rows to select domains for website generation'}
        </span>
        <span>Max 3 concurrent generation jobs per account</span>
      </div>

      {/* Edit domain modal */}
      {editingDomain && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeEdit}
        >
          <div
            className="w-full max-w-md rounded-lg border border-neutral-700 bg-[#0a0a0a] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <h3 className="text-sm font-medium text-neutral-100">Edit domain</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-4 py-3 space-y-3">
              <p className="text-xs text-neutral-500 font-mono">{editingDomain.domainName}</p>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Keywords</label>
                <input
                  type="text"
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  placeholder="Keywords (selected meaning)"
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-md text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-md text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={closeEdit}
                className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit || (!editKeywords.trim() && !editDescription.trim())}
                className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-md text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSavingEdit ? <Loader2 size={14} className="animate-spin" /> : null}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
