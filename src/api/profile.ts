import { BaseAPIClient } from './base';
import { ProfileResponse } from '../models';

/**
 * Profile API Client
 */
export class ProfileAPIClient extends BaseAPIClient {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await this.makeRequest<ProfileResponse>('getProfile', 'POST');
    return response;
  }
}

