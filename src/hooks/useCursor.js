'use client';

// === IMPORTS ===

import { useState, useCallback } from 'react';

// === HOOK ===

export default function useCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const handleHoverChange = useCallback((hovering) => {
    setIsHovering(hovering);
  }, []);

  return {
    isHovering,
    handleHoverChange,
  };
}
