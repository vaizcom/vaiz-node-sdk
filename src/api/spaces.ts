import { BaseAPIClient } from './base';
import { GetSpaceResponse } from '../models';

/**
 * Spaces API Client
 */
export class SpacesAPIClient extends BaseAPIClient {
  /**
   * Get space information
   */
  async getSpace(spaceId: string): Promise<GetSpaceResponse> {
    const response = await this.makeRequest<GetSpaceResponse>('getSpace', 'POST', { spaceId });
    return response;
  }
}

