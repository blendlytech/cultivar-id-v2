'use client';
import { useEffect, useRef } from 'react';

export default function ProfileTracker({ vendorId }: { vendorId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per mount to avoid duplicate counts from strict mode or re-renders
    if (tracked.current) return;
    tracked.current = true;

    async function trackView() {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vendor_id: vendorId,
            event_type: 'profile_view',
            metadata: { path: window.location.pathname }
          }),
        });
      } catch (error) {
        // Silently fail, don't interrupt UX
      }
    }

    trackView();
  }, [vendorId]);

  return null; // Invisible tracker component
}
