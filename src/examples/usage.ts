/**
 * Примеры использования
 *
 * Этот файл демонстрирует различные паттерны работы с API клиентом.
 * Запуск: npx ts-node src/examples/usage.ts
 */

import { apiClient } from '../api/client';
import { usersApi } from '../api/endpoints/users';
import { ApiError, NetworkError, isApiError } from '../utils/errors';
import type { User } from '../types/user';

// ============================================
// Пример 1: Базовый GET запрос
// ============================================
async function fetchUser(id: number): Promise<User | null> {
  try {
    const user = await apiClient.get<User>(`/users/${id}`);
    console.log('Пользователь получен:', user.name);
    return user;
  } catch (error) {
    console.error('Не удалось получить пользователя:', error);
    return null;
  }
}

// ============================================
// Пример 2: Использование сервиса эндпоинтов
// ============================================
async function getUsersExample(): Promise<void> {
  // Чистые, типобезопасные вызовы API
  const users = await usersApi.getAll({ page: 1, limit: 10 });
  console.log(`Получено ${users.length} пользователей`);

  // Один пользователь
  const user = await usersApi.getById(1);
  console.log(`Пользователь: ${user.name} (${user.email})`);
}

// ============================================
// Пример 3: Создание ресурса
// ============================================
async function createUserExample(): Promise<void> {
  const newUser = await usersApi.create({
    name: 'Иван Петров',
    email: 'ivan@example.com',
  });

  console.log(`Создан пользователь с ID: ${newUser.id}`);
}

// ============================================
// Пример 4: Паттерны обработки ошибок
// ============================================
async function errorHandlingExample(): Promise<void> {
  try {
    await usersApi.getById(99999);
  } catch (error) {
    // Паттерн 1: Использование type guard
    if (isApiError(error)) {
      if (error.status === 404) {
        console.log('Пользователь не найден');
      } else if (error.isClientError()) {
        console.log('Ошибка клиента:', error.message);
      } else if (error.isServerError()) {
        console.log('Ошибка сервера, попробуйте позже');
      }
    }

    // Паттерн 2: Использование instanceof
    if (error instanceof NetworkError) {
      console.log('Нет подключения к интернету');
    }
  }
}

// ============================================
// Пример 5: Запрос с AbortController
// ============================================
async function cancellableRequest(): Promise<void> {
  const controller = new AbortController();

  // Отмена через 5 секунд
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const users = await apiClient.get<User[]>('/users', {
      signal: controller.signal,
    });
    console.log('Пользователи:', users);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Запрос был отменён');
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================
// Пример 6: Параллельные запросы
// ============================================
async function parallelRequests(): Promise<void> {
  const [users, currentUser] = await Promise.all([
    usersApi.getAll(),
    usersApi.getById(1),
  ]);

  console.log(`Всего пользователей: ${users.length}`);
  console.log(`Текущий пользователь: ${currentUser.name}`);
}

// ============================================
// Запуск примеров
// ============================================
async function main(): Promise<void> {
  console.log('=== Примеры TypeScript API Patterns ===\n');

  await fetchUser(1);
  await getUsersExample();
  await createUserExample();
  await errorHandlingExample();
  await cancellableRequest();
  await parallelRequests();
}

main().catch(console.error);
