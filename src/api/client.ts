import type { ApiClientConfig, HttpMethod, RequestOptions } from '../types/api';
import { ApiError, NetworkError } from '../utils/errors';

/**
 * Типобезопасный HTTP клиент для работы с REST API
 */
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  /**
   * Формирование URL с query параметрами
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Основной метод запроса с полной типобезопасностью
   */
  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions<TBody>
  ): Promise<TResponse> {
    const url = this.buildUrl(endpoint, options?.params);

    const requestInit: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      signal: options?.signal,
    };

    if (options?.body && method !== 'GET') {
      requestInit.body = JSON.stringify(options.body);
    }

    let response: Response;

    try {
      response = await fetch(url, requestInit);
    } catch (error) {
      throw new NetworkError(
        error instanceof Error ? error.message : 'Сетевой запрос не выполнен'
      );
    }

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }
      throw new ApiError(response.status, response.statusText, errorData);
    }

    // Обработка пустых ответов (204 No Content)
    if (response.status === 204) {
      return undefined as TResponse;
    }

    return response.json() as Promise<TResponse>;
  }

  /**
   * GET запрос
   */
  async get<TResponse>(
    endpoint: string,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<TResponse> {
    return this.request<TResponse>('GET', endpoint, options);
  }

  /**
   * POST запрос
   */
  async post<TResponse, TBody = unknown>(
    endpoint: string,
    options?: RequestOptions<TBody>
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>('POST', endpoint, options);
  }

  /**
   * PUT запрос
   */
  async put<TResponse, TBody = unknown>(
    endpoint: string,
    options?: RequestOptions<TBody>
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>('PUT', endpoint, options);
  }

  /**
   * PATCH запрос
   */
  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    options?: RequestOptions<TBody>
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>('PATCH', endpoint, options);
  }

  /**
   * DELETE запрос
   */
  async delete<TResponse>(
    endpoint: string,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<TResponse> {
    return this.request<TResponse>('DELETE', endpoint, options);
  }
}

/**
 * Преднастроенный экземпляр API клиента
 * Замените BASE_URL на ваш реальный API endpoint
 */
export const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
});

export { ApiClient };
