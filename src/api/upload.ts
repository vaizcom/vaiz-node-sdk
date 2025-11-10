import { BaseAPIClient } from './base';
import { UploadFileResponse } from '../models';
import axios from 'axios';
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';

/**
 * Upload API Client
 */
export class UploadAPIClient extends BaseAPIClient {
  /**
   * Upload a file from local filesystem
   */
  async uploadFile(filePath: string, fileType?: string): Promise<UploadFileResponse> {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const response = await this.uploadFileInternal('uploadFile', filePath, fileType);
    return response as UploadFileResponse;
  }

  /**
   * Upload a file from URL
   */
  async uploadFileFromUrl(url: string, fileType?: string): Promise<UploadFileResponse> {
    // Download file first
    const tempPath = `/tmp/vaiz-upload-${Date.now()}`;

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
