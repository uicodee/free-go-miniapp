import { hapticFeedback } from "@tma.js/sdk-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "../model/navigation-items";
import { NavigationItem } from "./navigation-item";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentIndex = useMemo(
    () => navigationItems.findIndex((item) => item.href === location.pathname),
    [location.pathname]
  );

  const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, width: 0 });

  const getItemRect = useCallback((index: number) => {
    const item = itemRefs.current[index];
    const container = containerRef.current;
    if (!item || !container) return null;

    const itemRect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: itemRect.left - containerRect.left,
      width: itemRect.width,
    };
  }, []);

  const updateIndicatorPosition = useCallback(() => {
    const rect = getItemRect(currentIndex);
    if (rect) {
      setIndicatorStyle({ x: rect.x, width: rect.width });
    }
  }, [currentIndex, getItemRect]);

  useEffect(() => {
    updateIndicatorPosition();
  }, [currentIndex, updateIndicatorPosition]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
      if (index === currentIndex && el) {
        setTimeout(updateIndicatorPosition, 0);
      }
    },
    [currentIndex, updateIndicatorPosition]
  );

  const findItemAtPosition = useCallback(
    (clientX: number) => {
      for (let i = 0; i < itemRefs.current.length; i++) {
        const item = itemRefs.current[i];
        if (item) {
          const rect = item.getBoundingClientRect();
          if (clientX >= rect.left && clientX <= rect.right) {
            return i;
          }
        }
      }
      return currentIndex;
    },
    [currentIndex]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const targetIndex = findItemAtPosition(e.clientX);
      if (
        targetIndex !== currentIndex &&
        targetIndex >= 0 &&
        targetIndex < navigationItems.length
      ) {
        hapticFeedback.selectionChanged();
        navigate(navigationItems[targetIndex].href);
      }
    },
    [findItemAtPosition, currentIndex, navigate]
  );

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 p-1 z-50 rounded-full w-10/12 touch-none select-none max-w-md"
      style={{
        backgroundColor: "rgba(28, 28, 30, 0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={containerRef}
        className="relative grid w-full"
        style={{
          gridTemplateColumns: `repeat(${navigationItems.length}, 1fr)`,
        }}
      >
        {/* Animated indicator */}
        <div
          className="absolute top-0 bottom-0 rounded-full pointer-events-none"
          style={{
            transform: `translateX(${indicatorStyle.x}px)`,
            width: indicatorStyle.width,
            backgroundColor: "rgba(255,255,255,0.08)",
            transition:
              "transform 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        />

        {navigationItems.map((navigationItem, index) => (
          <NavigationItem
            key={navigationItem.href}
            ref={setItemRef(index)}
            title={navigationItem.title}
            icon={navigationItem.icon}
            activeIcon={navigationItem.activeIcon}
            href={navigationItem.href}
            isActive={location.pathname === navigationItem.href}
          />
        ))}
      </div>
    </div>
  );
};
