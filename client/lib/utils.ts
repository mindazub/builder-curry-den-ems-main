import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TimeFormat } from "@/context/SettingsContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a timestamp with the specified time format and offset
 * @param timestamp - Unix timestamp in seconds
 * @param timeFormat - '12' for 12-hour format, '24' for 24-hour format
 * @param offsetSeconds - Time offset in seconds to add to the timestamp
 * @returns Formatted time string
 */
export function formatTime(timestamp: number, timeFormat: TimeFormat, offsetSeconds: number = 0): string {
  const offsetTimestamp = timestamp + offsetSeconds;
  const date = new Date(offsetTimestamp * 1000);
  
  if (timeFormat === '24') {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } else {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }
}
