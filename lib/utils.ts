import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<F extends (...args: any[]) => void>(
  func: F,
  delay: number
) {
  let timerId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<F>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  } as F;
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
