'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import CustomLoader from '@/components/CustomLoader';
import { CsvPreviewEditor } from '@/components/dashboard';
import type { UploadResult } from '@/components/dashboard';

const CSV_RESULT_STORAGE_KEY = 'csvUploadResult';

export default function CsvPreviewEditorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CSV_RESULT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UploadResult;
        setResult(parsed);
      }
    } catch {
      // invalid or missing
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!result) {
      router.replace('/dashboard/domains');
    }
  }, [isHydrated, result, router]);

  const handleClose = () => {
    try {
      sessionStorage.removeItem(CSV_RESULT_STORAGE_KEY);
    } catch {
      // ignore
    }
    queryClient.invalidateQueries({ queryKey: ['domains'] });
    router.push('/dashboard/domains');
  };

  const handleUpdateResult = (next: UploadResult) => {
    setResult(next);
    try {
      sessionStorage.setItem(CSV_RESULT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  if (!isHydrated || !result) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <CsvPreviewEditor
        result={result}
        onClose={handleClose}
        onUpdateResult={handleUpdateResult}
      />
    </div>
  );
}
