import { CommentReactionType } from './enums';
import { UploadedFile } from './upload';

/**
 * Comment reaction
 */
export interface CommentReaction {
  reactionDbId: string;
  emojiId: string;
  native?: string;
  memberIds: string[];
}

/**
 * Comment
 */
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  deletedAt?: string;
  replyTo?: string;
  files: UploadedFile[];
  reactions: CommentReaction[];
  hasRemovedFiles: boolean;
}

/**
 * Post comment request
 */
export interface PostCommentRequest {
  documentId: string;
  content: string;
  fileIds?: string[];
  replyTo?: string;
}

/**
 * Post comment response
 */
export interface PostCommentResponse {
  comment: Comment;
}

/**
 * Get comments request
 */
export interface GetCommentsRequest {
  documentId: string;
}

/**
 * Get comments response
 */
export interface GetCommentsResponse {
  comments: Comment[];
}

/**
 * Edit comment request
 */
export interface EditCommentRequest {
  commentId: string;
  content: string;
  addFileIds?: string[];
  orderFileIds?: string[];
  removeFileIds?: string[];
}

/**
 * Edit comment response
 */
export interface EditCommentResponse {
  comment: Comment;
}

/**
 * Delete comment request
 */
export interface DeleteCommentRequest {
  commentId: string;
}

/**
 * Delete comment response
 */
export interface DeleteCommentResponse {
  comment: Comment;
}

/**
 * Add reaction request (simplified for popular emojis)
 */
export interface AddReactionRequest {
  commentId: string;
  reaction: CommentReactionType;
}

/**
 * React to comment request (custom emoji)
 */
export interface ReactToCommentRequest {
  commentId: string;
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords?: string[];
  shortcodes?: string;
}

/**
 * React to comment response
 */
export interface ReactToCommentResponse {
  reactions: CommentReaction[];
}

