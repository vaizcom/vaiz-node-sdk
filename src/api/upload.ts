import { BaseAPIClient } from './base';
import { UploadFileResponse, UploadFileType } from '../models';
import axios from 'axios';
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import { extname } from 'path';

/**
 * Upload API Client
 */
export class UploadAPIClient extends BaseAPIClient {
  /**
   * Detect file type from file path or MIME type
   */
  private detectFileType(filePath: string, mimeType?: string): UploadFileType {
    const ext = extname(filePath).toLowerCase();

    // Image extensions
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].includes(ext)) {
      return UploadFileType.Image;
    }

    // Video extensions
    if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'].includes(ext)) {
      return UploadFileType.Video;
    }

    // PDF extension
    if (ext === '.pdf') {
      return UploadFileType.Pdf;
    }

    // Try to detect from MIME type
    if (mimeType) {
      if (mimeType.startsWith('image/')) {
        return UploadFileType.Image;
      }
      if (mimeType.startsWith('video/')) {
        return UploadFileType.Video;
      }
      if (mimeType === 'application/pdf') {
        return UploadFileType.Pdf;
      }
    }

    // Default to File
    return UploadFileType.File;
  }

  /**
   * Upload a file from local filesystem
   * @param filePath - Path to the file to upload
   * @param fileType - Optional file type (UploadFileType enum or MIME type string). If not provided, will be auto-detected.
   */
  async uploadFile(
    filePath: string,
    fileType?: UploadFileType | string
  ): Promise<UploadFileResponse> {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Convert MIME type string to UploadFileType enum if needed
    let uploadFileType: UploadFileType;
    if (!fileType) {
      uploadFileType = this.detectFileType(filePath);
    } else if (typeof fileType === 'string') {
      // If it's already an UploadFileType value, use it directly
      if (Object.values(UploadFileType).includes(fileType as UploadFileType)) {
        uploadFileType = fileType as UploadFileType;
      } else {
        // Otherwise, treat it as MIME type and detect
        uploadFileType = this.detectFileType(filePath, fileType);
      }
    } else {
      uploadFileType = fileType;
    }

    const response = await this.uploadFileInternal('UploadFile', filePath, uploadFileType);
    return response as UploadFileResponse;
  }

  /**
   * Upload a file from URL
   * @param url - URL of the file to download and upload
   * @param fileType - Optional file type (UploadFileType enum or MIME type string). If not provided, will be auto-detected.
   * @param filename - Optional custom filename for the uploaded file (reserved for future use)
   */
  async uploadFileFromUrl(
    url: string,
    fileType?: UploadFileType | string,
    filename?: string
  ): Promise<UploadFileResponse> {
    // Download file first
    // Note: filename parameter is reserved for future use
    const _filename = filename; // Suppress unused parameter warning
    const tempPath = `/tmp/vaiz-upload-${Date.now()}${_filename ? `-${_filename}` : ''}`;

    try {
      const response = await axios.get(url, { responseType: 'stream' });
      const writer = createWriteStream(tempPath);

      await pipeline(response.data, writer);

      // Upload the downloaded file
      const uploadResponse = await this.uploadFile(tempPath, fileType);

      // Clean up temp file
      const fs = await import('fs/promises');
      await fs.unlink(tempPath);

      return uploadResponse;
    } catch (error: any) {
      // Try to clean up temp file if it exists
      try {
        const fs = await import('fs/promises');
        await fs.unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw new Error(`Failed to upload file from URL: ${error.message}`);
    }
  }

  /**
   * Download an image from URL to local path for analysis
   * @param imageUrl - URL of the image to download
   * @param localPath - Local path where to save the image
   * @returns Path to the downloaded image
   */
  async downloadImage(imageUrl: string, localPath: string): Promise<string> {
    try {
      // Check if URL is from Vaiz (needs authentication)
      const isVaizUrl = imageUrl.includes('vaiz.com');

      const response = await axios.get(imageUrl, {
        responseType: 'stream',
        headers: {
          Accept: 'image/*',
          // Add authentication headers if it's a Vaiz URL
          ...(isVaizUrl && {
            Authorization: `Bearer ${this.apiKey}`,
            'current-space-id': this.spaceId,
          }),
        },
      });

      const writer = createWriteStream(localPath);
      await pipeline(response.data, writer);

      return localPath;
    } catch (error: any) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }
}
