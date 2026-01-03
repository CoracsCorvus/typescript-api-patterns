import { apiClient } from '../client';
import type { User, CreateUserDto, UpdateUserDto } from '../../types/user';

/**
 * API эндпоинты для работы с пользователями
 *
 * Этот паттерн инкапсулирует все операции с пользователями в одном модуле,
 * предоставляя чистый интерфейс для остальной части приложения.
 */
export const usersApi = {
  /**
   * Получить всех пользователей
   */
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get<User[]>('/users', { params });
  },

  /**
   * Получить пользователя по ID
   */
  getById: (id: number) => {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Создать нового пользователя
   */
  create: (data: CreateUserDto) => {
    return apiClient.post<User, CreateUserDto>('/users', { body: data });
  },

  /**
   * Обновить существующего пользователя
   */
  update: (id: number, data: UpdateUserDto) => {
    return apiClient.patch<User, UpdateUserDto>(`/users/${id}`, { body: data });
  },

  /**
   * Удалить пользователя
   */
  delete: (id: number) => {
    return apiClient.delete<void>(`/users/${id}`);
  },

  /**
   * Поиск пользователей по запросу
   */
  search: (query: string) => {
    return apiClient.get<User[]>('/users/search', { params: { q: query } });
  },
};
