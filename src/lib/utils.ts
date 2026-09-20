export { cn } from "cn";

export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<noise>.*?<\/noise>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
