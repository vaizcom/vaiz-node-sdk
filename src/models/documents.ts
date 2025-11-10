import { Kind } from './enums';

/**
 * Document
 */
export interface Document {
  id: string;
  name: string;
  description?: string;
  content?: string;
  projectId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get documents request
 */
export interface GetDocumentsRequest {
  kind: Kind;
  kindId: string;
}

/**
 * Get documents response
 */
export interface GetDocumentsResponse {
  documents: Document[];
  total: number;
}

/**
 * Create document request
 */
export interface CreateDocumentRequest {
  kind: Kind;
  kindId: string;
  title: string;
  index: number;
  parentDocumentId?: string;
}

/**
 * Create document response
 */
export interface CreateDocumentResponse {
  document: Document;
}

/**
 * Edit document request
 */
export interface EditDocumentRequest {
  documentId: string;
  name?: string;
  description?: string;
  projectId?: string;
  parentId?: string;
}

/**
 * Edit document response
 */
export interface EditDocumentResponse {
  document: Document;
}

/**
 * Replace document request
 */
export interface ReplaceDocumentRequest {
  documentId: string;
  description: string;
}

/**
 * Replace document response
 */
export interface ReplaceDocumentResponse {
  document: Document;
}

/**
 * Replace JSON document request
 */
export interface ReplaceJSONDocumentRequest {
  documentId: string;
  content: any[];
}

/**
 * Replace JSON document response
 */
export interface ReplaceJSONDocumentResponse {
  document: Document;
}

/**
 * Append document request
 */
export interface AppendDocumentRequest {
  documentId: string;
  content: string;
}

/**
 * Append document response
 */
export interface AppendDocumentResponse {
  document: Document;
}

/**
 * Append JSON document request
 */
export interface AppendJSONDocumentRequest {
  documentId: string;
  content: any[];
}

/**
 * Append JSON document response
 */
export interface AppendJSONDocumentResponse {
  document: Document;
}

/**
 * Get JSON document request
 */
export interface GetJSONDocumentRequest {
  documentId: string;
}

/**
 * Get JSON document response
 */
export interface GetJSONDocumentResponse {
  content: any[];
}

/**
 * Get document history request
 */
export interface GetDocumentHistoryRequest {
  documentId: string;
  limit?: number;
  offset?: number;
}

/**
 * Get document history response
 */
export interface GetDocumentHistoryResponse {
  histories: Array<{
    id: string;
    kind: Kind;
    action: string;
    userId: string;
    createdAt: string;
    changes?: Record<string, any>;
  }>;
  total: number;
}
