import { ColorInfo, AvatarMode } from './base';

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

