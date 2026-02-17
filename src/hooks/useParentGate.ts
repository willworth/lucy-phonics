import { type TouchEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ParentGateResult {
  gateHandlers: {
    onTouchStart: (event: TouchEvent) => void;
    onTouchEnd: (event: TouchEvent) => void;
    onTouchCancel: () => void;
  };
  showOverlay: boolean;
}

export const useParentGate = (onActivate: () => void): ParentGateResult => {
  const timerRef = useRef<number | null>(null);
  const activatedRef = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const clearHold = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    activatedRef.current = false;
    setShowOverlay(false);
  }, []);

  useEffect(() => () => clearHold(), [clearHold]);

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length < 3 || timerRef.current) {
        return;
      }

      activatedRef.current = false;
      setShowOverlay(true);

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        activatedRef.current = true;
        setShowOverlay(false);
        onActivate();
      }, 3000);
    },
    [onActivate]
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length < 3 && !activatedRef.current) {
        clearHold();
      }

      if (activatedRef.current) {
        activatedRef.current = false;
      }
    },
    [clearHold]
  );

  const gateHandlers = useMemo(
    () => ({
      onTouchStart,
      onTouchEnd,
      onTouchCancel: clearHold
    }),
    [clearHold, onTouchEnd, onTouchStart]
  );

  return { gateHandlers, showOverlay };
};
