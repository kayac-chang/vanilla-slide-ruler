export function render(component, el) {
  el.innerHTML = component;
}

export function range(start, end, step = 1) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(
    (i) => i === 0 || Math.floor(i % step) === 0
  );
}

export function throttle(func) {
  let skip = false;

  return (...args) => {
    if (skip) return;

    skip = true;

    requestAnimationFrame(() => {
      func(...args);

      skip = false;
    });
  };
}

export function proxy(value, onChange) {
  onChange?.(value);

  return {
    set(newVal) {
      value = newVal;

      onChange?.(value);
    },
    value: () => value,
  };
}

export const translateX = (el, num = 0) =>
  (el.style.transform = `translateX(${num}px)`);

export const $ = document.querySelector.bind(document);

export const clamp = (min, max, num) => Math.min(Math.max(num, min), max);
