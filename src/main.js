import { $, throttle, proxy, range, render, translateX } from "./utils";

const Unit = (id) => /*html */ `
  <div class="flex flex-col items-center w-[48px]">
    <span class="after:content-['°'] after:absolute">${id}</span>
  </div>
`;

const clamp = (min, max, num) => Math.min(Math.max(num, min), max);

function between(min, max, num) {
  return num >= min && num <= max;
}

function Component({ max, min, step }) {
  queueMicrotask(() => {
    let current = 0;
    let anchor = undefined;

    const mapping = (value) => Math.floor((-value / 48) * step);
    const movement = (value) => {
      const _value = Math.floor(current + anchor - value);

      return (-clamp(min, max, mapping(_value)) / step) * 48;
    };

    const value = proxy(current, (value) => {
      $("#display").textContent = `${mapping(value)}`;

      translateX($("#control"), value);
    });

    const onPointerDown = throttle((event) => {
      anchor = Math.round(event.clientX);
    });

    const onPointerMove = throttle((event) => {
      if (!anchor) return;

      value.set(movement(event.clientX));
    });

    const onPointerUp = throttle((event) => {
      current = movement(event.clientX);
      value.set(current);
      anchor = undefined;
    });

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  });

  return /*html */ `
    <div class="w-full select-none relative flex flex-col justify-center items-center text-white overflow-hidden">
      <div class="absolute -mt-8 pb-2 flex border-b-2 border-dotted" id="control">
        ${range(min, max, step).map(Unit).join("")}
      </div>

      <div class="flex flex-col gap-2 justify-center items-center text-2xl transform text-center">
        <span>&blacktriangledown;</span>
        <span 
        class="after:content-['°'] after:absolute p-2"
        id="display"
        style="background: radial-gradient(black 30%, transparent 80%)">V</span>
        <span class="invisible">-</span>
      </div>
    </div>
  `;
}

render(Component({ max: 180, min: -180, step: 15 }), $("#root"));
