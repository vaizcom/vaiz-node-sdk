import { BaseAPIClient } from './base';
import {
  Document,
  GetDocumentsRequest,
  GetDocumentsResponse,
  CreateDocumentRequest,
  CreateDocumentResponse,
  EditDocumentRequest,
  EditDocumentResponse,
  ReplaceDocumentRequest,
  ReplaceDocumentResponse,
  ReplaceJSONDocumentRequest,
  ReplaceJSONDocumentResponse,
  AppendDocumentRequest,
  AppendDocumentResponse,
  AppendJSONDocumentRequest,
  AppendJSONDocumentResponse,
  GetDocumentHistoryRequest,
  GetDocumentHistoryResponse,
} from '../models';

/**
 * Documents API Client
 */
export class DocumentsAPIClient extends BaseAPIClient {
  /**
   * Get a document by ID
   */
  async getDocument(documentId: string): Promise<{ document: Document }> {
    const response = await this.makeRequest<{ document: Document }>('getDocument', 'POST', {
      documentId,
    });
    return response;
  }

  /**
   * Get documents with optional filtering
   */
  async getDocuments(request?: GetDocumentsRequest): Promise<GetDocumentsResponse> {
    const response = await this.makeRequest<GetDocumentsResponse>(
      'getDocuments',
      'POST',
      request || {}
    );
    return response;
  }

  /**
   * Create a new document
   */
  async createDocument(request: CreateDocumentRequest): Promise<CreateDocumentResponse> {
    const response = await this.makeRequest<CreateDocumentResponse>(
      'createDocument',
      'POST',
      request
    );
    return response;
  }

  /**
   * Edit an existing document
   */
  async editDocument(request: EditDocumentRequest): Promise<EditDocumentResponse> {
    const response = await this.makeRequest<EditDocumentResponse>('editDocument', 'POST', request);
    return response;
  }

  /**
   * Replace document content with HTML
   */
  async replaceDocument(request: ReplaceDocumentRequest): Promise<ReplaceDocumentResponse> {
    const response = await this.makeRequest<ReplaceDocumentResponse>(
      'replaceDocument',
      'POST',
      request
    );
    return response;
  }

  /**
   * Replace document content with JSON structure
   */
  async replaceJsonDocument(
    request: ReplaceJSONDocumentRequest
  ): Promise<ReplaceJSONDocumentResponse> {
    const response = await this.makeRequest<ReplaceJSONDocumentResponse>(
      'replaceJSONDocument',
      'POST',
      request
    );
    return response;
  }

  /**
   * Append content to document (HTML)
   */
  async appendDocument(request: AppendDocumentRequest): Promise<AppendDocumentResponse> {
    const response = await this.makeRequest<AppendDocumentResponse>(
      'appendDocument',
      'POST',
      request
    );
    return response;
  }

  /**
   * Append content to document (JSON structure)
   */
  async appendJsonDocument(
    request: AppendJSONDocumentRequest
  ): Promise<AppendJSONDocumentResponse> {
    const response = await this.makeRequest<AppendJSONDocumentResponse>(
      'appendJSONDocument',
      'POST',
      request
    );
    return response;
  }

  /**
   * Get JSON content of a document
   * Works for task descriptions, standalone documents, and any document by ID
   * @param documentId - The ID of the document to retrieve content from
   * @returns The parsed JSON structure of the document content
   */
  async getJsonDocument(documentId: string): Promise<any[]> {
    const response: any = await this.makeRequest('getJSONDocument', 'POST', {
      documentId,
    });

    // API returns payload.json as a string
    if (response.payload?.json) {
      try {
        const parsed = JSON.parse(response.payload.json);
        // Content is in default.content
        return parsed.default?.content || [];
      } catch (error) {
        console.error('Failed to parse document JSON:', error);
        return [];
      }
    }

    // Fallback for other possible structures
    return response.payload?.content || response.content || [];
  }

  /**
   * Get history for a specific document
   */
  async getDocumentHistory(request: GetDocumentHistoryRequest): Promise<GetDocumentHistoryResponse> {
    const response = await this.makeRequest<GetDocumentHistoryResponse>('getHistory', 'POST', {
      kind: 'Document',
      kindId: request.documentId,
      limit: request.limit,
      offset: request.offset,
    });
    return response;
  }
}
