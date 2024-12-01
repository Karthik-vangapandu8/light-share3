import { FileData } from './types';

class FileStorage {
  private storage: Map<string, FileData>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.storage = new Map();
    // Run cleanup every hour
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  set(id: string, data: FileData): void {
    console.log(`Storing file with ID: ${id}`);
    this.storage.set(id, data);
  }

  get(id: string): FileData | undefined {
    console.log(`Retrieving file with ID: ${id}`);
    const data = this.storage.get(id);
    if (!data) {
      console.log(`File with ID ${id} not found`);
    }
    return data;
  }

  delete(id: string): boolean {
    console.log(`Deleting file with ID: ${id}`);
    return this.storage.delete(id);
  }

  private cleanup(): void {
    console.log('Running storage cleanup...');
    const now = new Date();
    for (const [id, data] of this.storage.entries()) {
      if (data.expiresAt && now > new Date(data.expiresAt)) {
        console.log(`Cleaning up expired file: ${id}`);
        this.storage.delete(id);
      }
    }
  }

  // For debugging
  debug(): void {
    console.log('Current storage state:');
    for (const [id, data] of this.storage.entries()) {
      console.log(`- File ID: ${id}`);
      console.log(`  Name: ${data.name}`);
      console.log(`  Type: ${data.type}`);
      console.log(`  Size: ${data.size}`);
      console.log(`  Created: ${data.createdAt}`);
      console.log(`  Expires: ${data.expiresAt}`);
    }
  }
}

// Create singleton instance
export const fileStorage = new FileStorage();
