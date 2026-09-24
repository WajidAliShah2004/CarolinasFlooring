// Controllable IntersectionObserver + matchMedia mocks for jsdom.
type Observer = { cb: IntersectionObserverCallback; targets: Set<Element>; instance: IntersectionObserver };
const observers = new Set<Observer>();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  private entry: Observer;
  constructor(cb: IntersectionObserverCallback) {
    this.entry = { cb, targets: new Set(), instance: this };
    observers.add(this.entry);
  }
  observe(t: Element) { this.entry.targets.add(t); }
  unobserve(t: Element) { this.entry.targets.delete(t); }
  disconnect() { observers.delete(this.entry); }
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

export function installIntersectionObserverMock() {
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

/** Fire every live observer with the given intersection state for all its targets. */
export function intersectAll(isIntersecting = true) {
  for (const o of [...observers]) {
    const entries = [...o.targets].map((target) => ({ isIntersecting, target })) as IntersectionObserverEntry[];
    if (entries.length) o.cb(entries, o.instance);
  }
}

let reducedMotion = false;
export function setReducedMotion(value: boolean) { reducedMotion = value; }

export function installMatchMediaMock() {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() { return false; },
    }) as MediaQueryList;
}
