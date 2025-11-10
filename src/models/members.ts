import { ColorInfo } from './base';
import { AvatarMode } from './enums';

/**
 * Member (space member)
 */
export interface Member {
  id: string;
  nickName?: string;
  fullName?: string;
  email: string;
  avatar?: string;
  avatarMode: AvatarMode;
  color: ColorInfo;
  space: string;
  status: string;
  joinedDate: string;
  updatedAt: string;
}

/**
 * Get space members response
 */
export interface GetSpaceMembersResponse {
  members: Member[];
}

