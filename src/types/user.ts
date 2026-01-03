/**
 * Сущность пользователя
 */
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

/**
 * DTO для создания нового пользователя
 */
export interface CreateUserDto {
  name: string;
  email: string;
}

/**
 * DTO для обновления существующего пользователя
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
}
