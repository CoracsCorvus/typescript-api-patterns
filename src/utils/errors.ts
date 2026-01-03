/**
 * Базовая ошибка для всех API-ошибок
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly data?: unknown
  ) {
    super(`Ошибка API: ${status} ${statusText}`);
    this.name = 'ApiError';
  }

  /**
   * Проверка на клиентскую ошибку (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Проверка на серверную ошибку (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Сетевая ошибка (ответ не получен)
 */
export class NetworkError extends Error {
  constructor(message: string = 'Сетевой запрос не выполнен') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Ошибка таймаута запроса
 */
export class TimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`Превышено время ожидания: ${timeoutMs}мс`);
    this.name = 'TimeoutError';
  }
}

/**
 * Type guard для проверки на ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard для проверки на NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}
