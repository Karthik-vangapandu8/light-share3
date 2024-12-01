export interface FileData {
  name: string;
  type: string;
  size: number;
  data: Uint8Array;
  createdAt: Date;
  expiresAt: Date;
}
