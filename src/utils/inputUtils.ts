import { KeyboardEventHandler } from "react";

export const onlyNumbersKeyDownEvent: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if(e.code == undefined) return;
    if (
      !e.code.includes("Digit") &&
      e.code !== "Backspace" &&
      !e.code.includes("Numpad0") &&
      !e.code.includes("Numpad1") &&
      !e.code.includes("Numpad2") &&
      !e.code.includes("Numpad3") &&
      !e.code.includes("Numpad4") &&
      !e.code.includes("Numpad5") &&
      !e.code.includes("Numpad6") &&
      !e.code.includes("Numpad7") &&
      !e.code.includes("Numpad8") &&
      !e.code.includes("Numpad9") &&
      isNaN((e.target as any).value)
    ) {
      e.preventDefault();
    }
  };