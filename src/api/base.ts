import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { readFileSync } from 'fs';
import { createReadStream } from 'fs';
import FormData from 'form-data';

/**
 * Error metadata from API
 */
export interface ErrorMeta {
  description?: string;
  token?: string;
}

/**
 * API error structure
 */
export interface APIError {
  code: string;
  fields: string[];
  originalType: string;
  meta?: ErrorMeta;
}

/**
 * Base SDK error class
 */
export class VaizSDKError extends Error {
  apiError?: APIError;

  constructor(message: string, apiError?: APIError) {
    const errorDetails: string[] = [];

    if (apiError) {
      errorDetails.push(`Error code: ${apiError.code}`);
      errorDetails.push(`Original type: ${apiError.originalType}`);
      if (apiError.fields && apiError.fields.length > 0) {
        const fieldStrs = apiError.fields.map((f) =>
          typeof f === 'object' && f !== null && 'name' in f ? (f as any).name : String(f)
        );
        errorDetails.push(`Affected fields: ${fieldStrs.join(', ')}`);
      }
      if (apiError.meta?.description) {
        errorDetails.push(`Details: ${apiError.meta.description}`);
      }
    }

    const formattedMessage =
      errorDetails.length > 0 ? `${message}\n\n${errorDetails.join('\n')}` : message;

    super(formattedMessage);
    this.name = 'VaizSDKError';
    this.apiError = apiError;
  }
}

/**
 * Authentication error
 */
export class VaizAuthError extends VaizSDKError {
  constructor(message: string, apiError?: APIError) {
    super(`Authentication error: ${message}`, apiError);
    this.name = 'VaizAuthError';
  }
}

/**
 * Validation error
 */
export class VaizValidationError extends VaizSDKError {
  constructor(message: string, apiError?: APIError) {
    super(`Validation error: ${message}`, apiError);
    this.name = 'VaizValidationError';
  }
}

/**
 * Resource not found error
 */
export class VaizNotFoundError extends VaizSDKError {
  constructor(message: string, apiError?: APIError) {
    super(`Resource not found: ${message}`, apiError);
    this.name = 'VaizNotFoundError';
  }
}

/**
 * Permission error
 */
export class VaizPermissionError extends VaizSDKError {
  constructor(message: string, apiError?: APIError) {
    super(`Permission denied: ${message}`, apiError);
    this.name = 'VaizPermissionError';
  }
}

/**
 * Rate limit error
 */
export class VaizRateLimitError extends VaizSDKError {
  constructor(message: string, apiError?: APIError) {
    super(`Rate limit exceeded: ${message}`, apiError);
    this.name = 'VaizRateLimitError';
  }
}

/**
 * HTTP error
 */
export class VaizHTTPError extends VaizSDKError {
  statusCode?: number;
  url?: string;
  responseText?: string;

  constructor(message: string, statusCode?: number, url?: string, responseText?: string) {
    super(message);
    this.name = 'VaizHTTPError';
    this.statusCode = statusCode;
    this.url = url;
    this.responseText = responseText;
  }
}

/**
 * Base configuration for API client
 */
export interface BaseAPIClientConfig {
  apiKey: string;
  spaceId: string;
  baseUrl?: string;
  verifySsl?: boolean;
  verbose?: boolean;
}

/**
 * Base API client with common functionality
 */
export class BaseAPIClient {
  protected apiKey: string;
  protected spaceId: string;
  protected baseUrl: string;
  protected verifySsl: boolean;
  protected verbose: boolean;
  protected appVersion: string;
  protected session: AxiosInstance;

  constructor(config: BaseAPIClientConfig) {
    this.apiKey = config.apiKey;
    this.spaceId = config.spaceId;
    this.baseUrl = config.baseUrl || 'https://api.vaiz.com/v4';
    this.verifySsl = config.verifySsl !== undefined ? config.verifySsl : true;
    this.verbose = config.verbose || false;

    // Get version from package.json
    try {
      const packageJson = JSON.parse(readFileSync(__dirname + '/../../package.json', 'utf-8'));
      this.appVersion = `node-sdk-${packageJson.version}`;
    } catch {
      this.appVersion = 'node-sdk-0.18.0';
    }

    // Create axios instance with default headers
    this.session = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'current-space-id': this.spaceId,
        'app-version': this.appVersion,
      },
      // SSL verification
      ...(this.verifySsl === false && { httpsAgent: { rejectUnauthorized: false } }),
    });
  }

  /**
   * Parse error from API response
   */
  protected parseError(responseData: any): APIError {
    const error = responseData.error || {};
    const meta = error.meta || {};

    return {
      code: error.code || 'UnknownError',
      fields: error.fields || [],
      originalType: error.originalType || '',
      meta: {
        description: meta.description,
        token: meta.token,
      },
    };
  }

  /**
   * Handle API error and throw appropriate exception
   */
  protected handleApiError(apiError: APIError): never {
    const errorMap: Record<string, typeof VaizSDKError> = {
      JwtIncorrect: VaizAuthError,
      JwtExpired: VaizAuthError,
      ValidationError: VaizValidationError,
      NotFound: VaizNotFoundError,
      PermissionDenied: VaizPermissionError,
      RateLimitExceeded: VaizRateLimitError,
    };

    const ErrorClass = errorMap[apiError.code] || VaizSDKError;
    const message = apiError.meta?.description || apiError.code;
    throw new ErrorClass(message, apiError);
  }

  /**
   * Make HTTP request to API
   */
  protected async makeRequest<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;

    if (this.verbose) {
      console.log('Request payload:', data);
    }

    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        ...(data && { data }),
      };

      const response = await this.session.request(config);
      const responseData = response.data;

      if (this.verbose) {
        console.log('Response data:', responseData);
      }

      // Check for error in response
      if (responseData.error) {
        const apiError = this.parseError(responseData);
        this.handleApiError(apiError);
      }

      return responseData as T;
    } catch (error: any) {
      if (error instanceof VaizSDKError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        // Include response data for debugging
        const errorDetails = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        throw new VaizSDKError(`Network error for ${url}: ${errorDetails}`);
      }

      throw new VaizSDKError(`Unexpected error: ${error.message}`);
    }
  }

  /**
   * Upload file to API (internal method)
   */
  protected async uploadFileInternal(
    endpoint: string,
    filePath: string,
    fileType?: string
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', createReadStream(filePath));

      if (fileType) {
        formData.append('type', fileType);
      }

      const response = await this.session.post(endpoint, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.data.error) {
        const apiError = this.parseError(response.data);
        this.handleApiError(apiError);
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof VaizSDKError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new VaizSDKError(`File upload error: ${error.message}`);
      }

      throw new VaizSDKError(`Unexpected error during file upload: ${error.message}`);
    }
  }
}
