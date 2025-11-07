/**
 * Uploaded file information
 */
export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  ext: string;
  type: string;
  size: number;
  dimension?: number[];
  mime?: string;
  dominantColor?: any;
}

/**
 * Upload file response
 */
export interface UploadFileResponse {
  file: UploadedFile;
}

