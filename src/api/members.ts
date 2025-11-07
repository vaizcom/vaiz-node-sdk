import { BaseAPIClient } from './base';
import { GetSpaceMembersResponse } from '../models';

/**
 * Members API Client
 */
export class MembersAPIClient extends BaseAPIClient {
  /**
   * Get all members in the current space
   */
  async getSpaceMembers(): Promise<GetSpaceMembersResponse> {
    const response = await this.makeRequest<GetSpaceMembersResponse>('getSpaceMembers', 'POST', {});
    return response;
  }
}

