// utils/lenis.ts
import Lenis from '@studio-freight/lenis'

let lenisInstance: Lenis | null = null

export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return null // SSR-safe

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1 ,
      smoothWheel: true,
   easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })

    const raf = (time: number) => {
      lenisInstance?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }

  return lenisInstance
}

export const getLenisInstance = () => lenisInstance


// utils/scroll-lock.ts
export function lockScrollWithLenis() {
  const lenisContainer = document.querySelector('[data-lenis-scroll]') as HTMLElement;

  if (!lenisContainer) return;

  // Disable Lenis scroll engine
  (window as any).lenis?.stop?.();

  // Prevent wheel and touchmove from scrolling the body
  lenisContainer.style.overflow = 'hidden';
  lenisContainer.addEventListener('wheel', preventDefault, { passive: false });
  lenisContainer.addEventListener('touchmove', preventDefault, { passive: false });
}

export function unlockScrollWithLenis() {
  const lenisContainer = document.querySelector('[data-lenis-scroll]') as HTMLElement;

  if (!lenisContainer) return;

  // Re-enable Lenis scroll engine
  (window as any).lenis?.start?.();

  lenisContainer.style.overflow = '';
  lenisContainer.removeEventListener('wheel', preventDefault);
  lenisContainer.removeEventListener('touchmove', preventDefault);
}

function preventDefault(e: Event) {
  e.preventDefault();
}




