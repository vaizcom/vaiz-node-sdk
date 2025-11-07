# Быстрая справка по контенту документов в MCP

## Два метода для работы с документами

### 1️⃣ `vaiz_replace_document` - Простой текст

**Когда использовать:** Для обычного текста, простых списков

**Пример:**
```json
{
  "documentId": "doc_id_here",
  "content": "## Заголовок\n\nТекст параграфа\n\n- Пункт 1\n- Пункт 2"
}
```

⚠️ **Ограничение:** Чеклисты НЕ станут интерактивными

---

### 2️⃣ `vaiz_replace_json_document` - Структурированный контент ⭐

**Когда использовать:** Для интерактивных чеклистов, таблиц, богатого форматирования

## Быстрый старт: Чеклист

```json
{
  "documentId": "doc_id_here",
  "content": [
    {
      "type": "heading",
      "attrs": {"level": 2, "uid": "abc123def456"},
      "content": [{"type": "text", "text": "Мои задачи"}]
    },
    {
      "type": "taskList",
      "attrs": {"uid": "xyz789uvw012"},
      "content": [
        {
          "type": "taskItem",
          "attrs": {"checked": false},
          "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": "Задача 1"}]}
          ]
        },
        {
          "type": "taskItem",
          "attrs": {"checked": true},
          "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": "Выполнено"}]}
          ]
        }
      ]
    }
  ]
}
```

---

## Основные элементы

### Заголовок
```json
{
  "type": "heading",
  "attrs": {"level": 2, "uid": "unique12char"},
  "content": [{"type": "text", "text": "Текст заголовка"}]
}
```

### Параграф
```json
{
  "type": "paragraph",
  "content": [{"type": "text", "text": "Текст параграфа"}]
}
```

### Чеклист (интерактивный!)
```json
{
  "type": "taskList",
  "attrs": {"uid": "unique12char"},
  "content": [
    {
      "type": "taskItem",
      "attrs": {"checked": false},
      "content": [
        {"type": "paragraph", "content": [{"type": "text", "text": "Текст"}]}
      ]
    }
  ]
}
```

### Текст с форматированием
```json
{
  "type": "text",
  "text": "Жирный текст",
  "marks": [{"type": "bold"}]
}
```

Доступные marks: `"bold"`, `"italic"`, `"code"`, `{"type": "link", "attrs": {...}}`

---

## Генерация UID

UID = 12 символов из `A-Z`, `a-z`, `0-9`

Примеры:
- `abc123XYZ789`
- `h2unique567`
- `YRGsWbFdtUwP`

---

## Шаблон для копирования

```json
{
  "documentId": "YOUR_DOC_ID",
  "content": [
    {
      "type": "heading",
      "attrs": {"level": 2, "uid": "GENERATE_UID"},
      "content": [{"type": "text", "text": "ЗАГОЛОВОК"}]
    },
    {
      "type": "taskList",
      "attrs": {"uid": "GENERATE_UID"},
      "content": [
        {
          "type": "taskItem",
          "attrs": {"checked": false},
          "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": "ТЕКСТ ЗАДАЧИ"}]}
          ]
        }
      ]
    }
  ]
}
```

---

## Полная документация

Смотрите [MCP_DOCUMENT_EXAMPLES.md](../MCP_DOCUMENT_EXAMPLES.md) для:
- Всех типов нод (blockquote, codeBlock, table, и т.д.)
- Подробных примеров
- Сложных структур
- Форматирования текста

---

## Важно! ⚠️

1. Для интерактивных чеклистов используйте `vaiz_replace_json_document`
2. Каждый элемент с `attrs` требует уникальный `uid`
3. Текст всегда в формате `{"type": "text", "text": "..."}`
4. Параграфы всегда содержат массив `content`

