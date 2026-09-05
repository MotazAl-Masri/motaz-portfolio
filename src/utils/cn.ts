/**
 * Minimal class-name joiner. Kept dependency-free on purpose — the stack in
 * CLAUDE.md does not include clsx/tailwind-merge.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
