import { useState, useEffect, useRef, useCallback } from 'react';
import { websitesAPI } from '@/lib/api';

interface JobStatus {
  id: string | number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'not_found';
  progress: number;
  data?: any;
  result?: any;
  failedReason?: string;
}

const POLL_INTERVAL = 5000; // 5 seconds (increased from 3)
const MAX_POLL_ATTEMPTS = 120; // 10 minutes max (120 * 5s)

export function useJobStatus(
  jobId: string | null,
  onComplete?: (result: any) => void,
  onError?: (error: string) => void
) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const checkStatus = useCallback(async () => {
    if (!jobId || hasCompletedRef.current) return;

    // Check max attempts
    if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
      console.error('⏱️ Job polling timeout - max attempts reached');
      stopPolling();
      hasCompletedRef.current = true;
      if (onError) {
        onError('Job timeout - Please refresh the page to check status');
      }
      return;
    }

    pollCountRef.current += 1;
    console.log(`📊 Polling job ${jobId} (attempt ${pollCountRef.current}/${MAX_POLL_ATTEMPTS})`);

    try {
      const response = await websitesAPI.checkJobStatus(jobId);
      const jobStatus = response.data;
      
      setStatus(jobStatus);

      // Terminal states - stop polling
      if (jobStatus.status === 'completed') {
        console.log('✅ Job completed successfully');
        stopPolling();
        hasCompletedRef.current = true;
        if (onComplete) {
          onComplete(jobStatus.result);
        }
      } else if (jobStatus.status === 'failed') {
        console.log('❌ Job failed');
        stopPolling();
        hasCompletedRef.current = true;
        if (onError) {
          onError(jobStatus.failedReason || 'Job failed');
        }
      } else if (jobStatus.status === 'not_found') {
        console.log('⚠️ Job not found');
        stopPolling();
        hasCompletedRef.current = true;
        if (onError) {
          onError('Job not found');
        }
      } else {
        console.log(`⏳ Job ${jobStatus.status} - ${jobStatus.progress}%`);
      }
    } catch (err: any) {
      console.error('❌ Error checking job status:', err);
      
      // Don't stop polling on network errors (might be temporary)
      // But count towards max attempts
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        stopPolling();
        hasCompletedRef.current = true;
        if (onError) {
          onError(err.response?.data?.message || 'Failed to check status');
        }
      }
    }
  }, [jobId, onComplete, onError, stopPolling]);

  useEffect(() => {
    // Reset state when jobId changes
    if (!jobId) {
      stopPolling();
      setStatus(null);
      pollCountRef.current = 0;
      hasCompletedRef.current = false;
      return;
    }

    // Don't start polling if already completed
    if (hasCompletedRef.current) {
      return;
    }

    console.log(`🚀 Starting polling for job ${jobId}`);
    setIsPolling(true);
    pollCountRef.current = 0;
    
    // Initial check immediately
    checkStatus();

    // Then poll at intervals
    intervalRef.current = setInterval(checkStatus, POLL_INTERVAL);

    // Cleanup on unmount or jobId change
    return () => {
      console.log(`🛑 Stopping polling for job ${jobId}`);
      stopPolling();
    };
  }, [jobId]); // Only depend on jobId, not checkStatus or status

  return {
    status,
    isPolling,
    progress: status?.progress || 0,
    isCompleted: status?.status === 'completed',
    isFailed: status?.status === 'failed',
    isActive: status?.status === 'active' || status?.status === 'waiting',
  };
}


