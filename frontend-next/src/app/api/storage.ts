// In-memory storage for files
export const fileStorage = new Map<string, {
  name: string;
  type: string;
  size: number;
  data: Uint8Array;
  createdAt: Date;
}>();

// Clean up files older than 24 hours
setInterval(() => {
  const now = Date.now();
  Array.from(fileStorage.entries()).forEach(([id, file]) => {
    if (now - file.createdAt.getTime() > 24 * 60 * 60 * 1000) {
      fileStorage.delete(id);
    }
  });
}, 60 * 60 * 1000); // Run every hour
