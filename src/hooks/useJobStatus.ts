import { useState, useEffect, useCallback } from 'react';
import { websitesAPI } from '@/lib/api';

interface JobStatus {
  id: string | number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'not_found';
  progress: number;
  data?: any;
  result?: any;
  failedReason?: string;
}

export function useJobStatus(
  jobId: string | null,
  onComplete?: (result: any) => void,
  onError?: (error: string) => void
) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await websitesAPI.checkJobStatus(jobId);
      const jobStatus = response.data;
      
      setStatus(jobStatus);

      if (jobStatus.status === 'completed') {
        setIsPolling(false);
        if (onComplete) {
          onComplete(jobStatus.result);
        }
      } else if (jobStatus.status === 'failed') {
        setIsPolling(false);
        if (onError) {
          onError(jobStatus.failedReason || 'Job failed');
        }
      }
    } catch (err: any) {
      console.error('Error checking job status:', err);
      setIsPolling(false);
      if (onError) {
        onError(err.response?.data?.message || 'Failed to check status');
      }
    }
  }, [jobId, onComplete, onError]);

  useEffect(() => {
    if (!jobId) {
      setStatus(null);
      setIsPolling(false);
      return;
    }

    // Don't poll if already completed or failed
    if (status?.status === 'completed' || status?.status === 'failed') {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    
    // Initial check
    checkStatus();

    // Poll every 3 seconds
    const pollInterval = setInterval(checkStatus, 3000);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [jobId, checkStatus, status?.status]);

  return {
    status,
    isPolling,
    progress: status?.progress || 0,
    isCompleted: status?.status === 'completed',
    isFailed: status?.status === 'failed',
    isActive: status?.status === 'active' || status?.status === 'waiting',
  };
}


