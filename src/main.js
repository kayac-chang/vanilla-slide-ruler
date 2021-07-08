import { $, throttle, proxy, range, render, translateX } from "./utils";

const Unit = (id) => /*html */ `
  <div class="flex flex-col items-center w-[48px]">
    <span class="after:content-['°'] after:absolute">${id}</span>
  </div>
`;

function Component() {
  queueMicrotask(() => {
    const component = $("#control");
    const display = $("#display");

    let current = 0;
    let anchor = undefined;

    let value = proxy(
      current,
      (value) => (display.textContent = `${Math.round((-value / 48) * 15)}`)
    );

    const onPointerDown = throttle((event) => {
      anchor = Math.round(event.clientX);
    });

    const onPointerMove = throttle((event) => {
      if (!anchor) return;

      const movement = Math.round(current + anchor - event.clientX);
      translateX(component, movement);

      value.set(movement);
    });

    const onPointerUp = throttle((event) => {
      current = Math.round(current + anchor - event.clientX);
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
        ${range(-180, 180, 15).map(Unit).join("")}
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

render(Component(), $("#root"));
