/**
 * Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  General = 1,
  Medium = 2,
  High = 3,
}

/**
 * Avatar mode
 */
export enum AvatarMode {
  Initials = 0,
  Upload = 1,
  Avatar = 2,
}

/**
 * Entity kind/type
 */
export enum Kind {
  Task = 'Task',
  Document = 'Document',
  Milestone = 'Milestone',
  User = 'User',
  Project = 'Project',
  Space = 'Space',
  Member = 'Member',
}

/**
 * Custom field types
 */
export enum CustomFieldType {
  TEXT = 'Text',
  NUMBER = 'Number',
  CHECKBOX = 'Checkbox',
  DATE = 'Date',
  MEMBER = 'Member',
  TASK_RELATIONS = 'TaskRelations',
  SELECT = 'Select',
  URL = 'Url',
}

/**
 * Color options for select fields
 */
export enum Color {
  Red = 'Red',
  Orange = 'Orange',
  Yellow = 'Yellow',
  Green = 'Green',
  Teal = 'Teal',
  Blue = 'Blue',
  Purple = 'Purple',
  Magenta = 'Magenta',
  Gray = 'Gray',
}

/**
 * Icon options for select fields
 */
export enum Icon {
  Flag = 'Flag',
  Circle = 'Circle',
  Target = 'Target',
  Crown = 'Crown',
  Fire = 'Fire',
  Star = 'Star',
  Check = 'Check',
  Alert = 'Alert',
}

/**
 * Comment reaction types
 */
export enum CommentReactionType {
  Like = 'like',
  Love = 'love',
  Laugh = 'laugh',
  Surprised = 'surprised',
  Sad = 'sad',
  Angry = 'angry',
}

/**
 * Embed types for embed blocks
 */
export enum EmbedType {
  YouTube = 'YouTube',
  Figma = 'Figma',
  Vimeo = 'Vimeo',
  CodeSandbox = 'CodeSandbox',
  GitHubGist = 'GitHub Gist',
  Miro = 'Miro',
  Iframe = 'Iframe',
}

/**
 * Comment reaction metadata
 */
export const COMMENT_REACTION_METADATA = {
  [CommentReactionType.Like]: { emoji: '👍', label: 'Like' },
  [CommentReactionType.Love]: { emoji: '❤️', label: 'Love' },
  [CommentReactionType.Laugh]: { emoji: '😄', label: 'Laugh' },
  [CommentReactionType.Surprised]: { emoji: '😮', label: 'Surprised' },
  [CommentReactionType.Sad]: { emoji: '😢', label: 'Sad' },
  [CommentReactionType.Angry]: { emoji: '😠', label: 'Angry' },
};
