import { BaseAPIClient } from './base';
import {
  PostCommentRequest,
  PostCommentResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  EditCommentRequest,
  EditCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  AddReactionRequest,
  ReactToCommentRequest,
  ReactToCommentResponse,
} from '../models';

/**
 * Comments API Client
 */
export class CommentsAPIClient extends BaseAPIClient {
  /**
   * Post a new comment to a document
   */
  async postComment(request: PostCommentRequest): Promise<PostCommentResponse> {
    // API requires fileIds to always be present as an array (even if empty)
    const cleanRequest: any = {
      documentId: request.documentId,
      content: request.content,
      fileIds: request.fileIds || [],
    };
    
    if (request.replyTo !== undefined) {
      cleanRequest.replyTo = request.replyTo;
    }
    
    const response = await this.makeRequest<PostCommentResponse>('postComment', 'POST', cleanRequest);
    return response;
  }

  /**
   * Get all comments for a document
   */
  async getComments(request: GetCommentsRequest): Promise<GetCommentsResponse> {
    const response = await this.makeRequest<GetCommentsResponse>('getComments', 'POST', request);
    return response;
  }

  /**
   * Edit a comment
   */
  async editComment(request: EditCommentRequest): Promise<EditCommentResponse> {
    const response = await this.makeRequest<EditCommentResponse>('editComment', 'POST', request);
    return response;
  }

  /**
   * Soft delete a comment
   */
  async deleteComment(request: DeleteCommentRequest): Promise<DeleteCommentResponse> {
    const response = await this.makeRequest<DeleteCommentResponse>('deleteComment', 'POST', request);
    return response;
  }

  /**
   * Add a popular emoji reaction (simplified method)
   */
  async addReaction(request: AddReactionRequest): Promise<ReactToCommentResponse> {
    // Map popular reaction types to emoji data
    const reactionMap: Record<string, any> = {
      'THUMBS_UP': { id: '+1', name: 'Thumbs Up', native: '👍', unified: '1f44d', shortcodes: ':+1:' },
      'HEART': { id: 'heart', name: 'Heart', native: '❤️', unified: '2764-fe0f', shortcodes: ':heart:' },
      'LAUGH': { id: 'laughing', name: 'Laughing', native: '😆', unified: '1f606', shortcodes: ':laughing:' },
      'SAD': { id: 'disappointed', name: 'Disappointed', native: '😞', unified: '1f61e', shortcodes: ':disappointed:' },
      'SURPRISED': { id: 'open_mouth', name: 'Open Mouth', native: '😮', unified: '1f62e', shortcodes: ':open_mouth:' },
      'ANGRY': { id: 'angry', name: 'Angry', native: '😠', unified: '1f620', shortcodes: ':angry:' },
    };
    
    const emojiData = reactionMap[request.reaction];
    if (!emojiData) {
      throw new Error(`Unknown reaction type: ${request.reaction}`);
    }
    
    const reactRequest = {
      commentId: request.commentId,
      id: emojiData.id,
      name: emojiData.name,
      native: emojiData.native,
      unified: emojiData.unified,
      shortcodes: emojiData.shortcodes,
    };
    
    const response = await this.makeRequest<ReactToCommentResponse>('reactToComment', 'POST', reactRequest);
    return response;
  }

  /**
   * React to a comment with custom emoji
   */
  async reactToComment(request: ReactToCommentRequest): Promise<ReactToCommentResponse> {
    const response = await this.makeRequest<ReactToCommentResponse>('reactToComment', 'POST', request);
    return response;
  }
}

