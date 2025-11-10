import { BaseAPIClient } from './base';
import { 
  GetSpaceResponse,
  GetSpaceHistoryRequest,
  GetSpaceHistoryResponse,
} from '../models';

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

  /**
   * Get history for a specific space
   */
  async getSpaceHistory(request: GetSpaceHistoryRequest): Promise<GetSpaceHistoryResponse> {
    const response = await this.makeRequest<GetSpaceHistoryResponse>('getHistory', 'POST', {
      kind: 'Space',
      kindId: request.spaceId,
      limit: request.limit,
      offset: request.offset,
    });
    return response;
  }
}

