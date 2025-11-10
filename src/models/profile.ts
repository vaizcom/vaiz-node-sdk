import { ColorInfo } from './base';
import { AvatarMode } from './enums';

/**
 * User profile
 */
export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarMode: AvatarMode;
  color: ColorInfo;
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile response
 */
export interface ProfileResponse {
  profile: Profile;
}

