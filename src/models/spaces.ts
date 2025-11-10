import { ColorInfo } from './base';
import { AvatarMode } from './enums';

/**
 * Space
 */
export interface Space {
  id: string;
  name: string;
  color: ColorInfo;
  avatarMode: AvatarMode;
  avatar?: string;
  creator: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
  isForeign: boolean;
}

/**
 * Get space response
 */
export interface GetSpaceResponse {
  space: Space;
}

/**
 * Get space history request
 */
export interface GetSpaceHistoryRequest {
  spaceId: string;
  limit?: number;
  offset?: number;
}

/**
 * Get space history response
 */
export interface GetSpaceHistoryResponse {
  histories: Array<{
    id: string;
    kind: 'Space';
    action: string;
    userId: string;
    createdAt: string;
    changes?: Record<string, any>;
  }>;
  total: number;
}

