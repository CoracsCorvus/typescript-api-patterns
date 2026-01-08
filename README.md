# TypeScript API Patterns

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Чистые и типобезопасные паттерны для работы с REST API на TypeScript**

[Возможности](#возможности) • [Установка](#установка) • [Использование](#использование) • [API Reference](#api-reference)

</div>

---

## Возможности

- **Типобезопасные запросы** — Полная поддержка TypeScript с дженериками
- **Обработка ошибок** — Централизованная обработка с кастомными типами ошибок
- **Чистая архитектура** — Разделение API-слоя и бизнес-логики
- **Без зависимостей** — Построено на нативном `fetch` API

## Структура проекта

```
src/
├── api/
│   ├── client.ts          # Базовый HTTP клиент
│   └── endpoints/
│       └── users.ts       # Эндпоинты для работы с пользователями
├── types/
│   ├── api.ts             # Типы для API ответов
│   └── user.ts            # Доменные типы
├── utils/
│   └── errors.ts          # Кастомные классы ошибок
└── examples/
    └── usage.ts           # Примеры использования
```

## Установка

```bash
git clone https://github.com/YOUR_USERNAME/typescript-api-patterns.git
cd typescript-api-patterns
npm install
```

## Использование

### Базовый запрос

```typescript
import { apiClient } from './api/client';
import type { User } from './types/user';

// GET запрос с выводом типов
const user = await apiClient.get<User>('/users/1');
console.log(user.name);

// POST запрос с типизированным телом
const newUser = await apiClient.post<User>('/users', {
  body: { name: 'Иван', email: 'ivan@example.com' }
});
```

### Использование сервисов эндпоинтов

```typescript
import { usersApi } from './api/endpoints/users';

// Чистые, типобезопасные вызовы API
const users = await usersApi.getAll();
const user = await usersApi.getById(1);
const created = await usersApi.create({ name: 'Иван', email: 'ivan@example.com' });
```

### Обработка ошибок

```typescript
import { apiClient } from './api/client';
import { ApiError, NetworkError } from './utils/errors';

try {
  const data = await apiClient.get('/users/1');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Ошибка API: ${error.status} - ${error.message}`);
  } else if (error instanceof NetworkError) {
    console.error('Сеть недоступна');
  }
}
```

## API Reference

### `ApiClient`

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `get` | `get<T>(url, options?)` | GET запрос |
| `post` | `post<T>(url, options?)` | POST запрос |
| `put` | `put<T>(url, options?)` | PUT запрос |
| `patch` | `patch<T>(url, options?)` | PATCH запрос |
| `delete` | `delete<T>(url, options?)` | DELETE запрос |

### Опции запроса

```typescript
interface RequestOptions<TBody = unknown> {
  body?: TBody;                              // Тело запроса
  headers?: Record<string, string>;          // Дополнительные заголовки
  params?: Record<string, string | number>;  // Query параметры
}
```

## Ключевые концепции

### 1. Универсальный HTTP клиент

Базовый клиент обрабатывает всю HTTP-коммуникацию с полной типобезопасностью:

```typescript
class ApiClient {
  async get<TResponse>(url: string): Promise<TResponse> {
    return this.request<TResponse>('GET', url);
  }
}
```

### 2. Типизированная обработка ошибок

Кастомные классы ошибок для разных сценариев:

```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`${status}: ${statusText}`);
  }
}
```

### 3. Абстракция эндпоинтов

Доменные модули API для чистой организации кода:

```typescript
export const usersApi = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: number) => apiClient.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => apiClient.post<User>('/users', { body: data }),
};
```

## Скрипты

```bash
npm run build      # Компиляция TypeScript
npm run dev        # Запуск в режиме разработки
npm run typecheck  # Проверка типов без компиляции
```

## Лицензия

MIT

---

<div align="center">

**[Наверх](#typescript-api-patterns)**

</div>
