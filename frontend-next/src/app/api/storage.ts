// Shared storage for files across API routes
export const FILES = new Map<string, {
  name: string;
  type: string;
  size: number;
  data: Uint8Array;
  createdAt: number;
}>();
