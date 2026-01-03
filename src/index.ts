/**
 * TypeScript API Patterns
 *
 * Чистые, типобезопасные паттерны для работы с REST API
 */

// API клиент
export { apiClient, ApiClient } from './api/client';
export { usersApi } from './api/endpoints/users';

// Типы
export type {
  ApiResponse,
  RequestOptions,
  HttpMethod,
  ApiClientConfig,
} from './types/api';

export type { User, CreateUserDto, UpdateUserDto } from './types/user';

// Ошибки
export {
  ApiError,
  NetworkError,
  TimeoutError,
  isApiError,
  isNetworkError,
} from './utils/errors';
