# Примеры контента для документов в Vaiz MCP

## Два способа замены контента документа

### 1. `vaiz_replace_document` - Простой текст/Markdown/HTML

Используется для простого текстового контента. API автоматически преобразует в базовые параграфы.

**Пример использования:**
```json
{
  "documentId": "690e08410cba5f5549219e1d",
  "content": "## Заголовок\n\nПростой текст параграфа\n\n- Пункт 1\n- Пункт 2"
}
```

**Ограничение:** Markdown НЕ преобразуется в интерактивные элементы (чеклисты останутся простым текстом).

---

### 2. `vaiz_replace_json_document` - Структурированный контент

Используется для создания интерактивных чеклистов, таблиц и других богатых элементов.

## Структура документа

Документ - это массив нод. Каждая нода имеет тип и может содержать дочерние ноды.

## Основные типы нод

### Заголовок (Heading)

```json
{
  "type": "heading",
  "attrs": {
    "level": 2,
    "uid": "abc12345defg"
  },
  "content": [
    {
      "type": "text",
      "text": "Заголовок второго уровня"
    }
  ]
}
```

**Параметры:**
- `level`: 1-6 (уровень заголовка)
- `uid`: уникальный 12-символьный идентификатор
- `content`: массив текстовых нод

---

### Параграф (Paragraph)

```json
{
  "type": "paragraph",
  "content": [
    {
      "type": "text",
      "text": "Обычный текст параграфа"
    }
  ]
}
```

---

### Чеклист (Task List) ⭐

Интерактивный чеклист с чекбоксами:

```json
{
  "type": "taskList",
  "attrs": {
    "uid": "xyz98765abcd"
  },
  "content": [
    {
      "type": "taskItem",
      "attrs": {
        "checked": false
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Первая задача"
            }
          ]
        }
      ]
    },
    {
      "type": "taskItem",
      "attrs": {
        "checked": true
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Выполненная задача"
            }
          ]
        }
      ]
    }
  ]
}
```

**Структура:**
- `taskList` - контейнер чеклиста (нужен `uid`)
- `taskItem` - элемент чеклиста
  - `checked`: true/false - состояние чекбокса
  - `content`: массив параграфов с текстом

---

### Маркированный список (Bullet List)

```json
{
  "type": "bulletList",
  "content": [
    {
      "type": "listItem",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Первый пункт"
            }
          ]
        }
      ]
    },
    {
      "type": "listItem",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Второй пункт"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Нумерованный список (Ordered List)

```json
{
  "type": "orderedList",
  "attrs": {
    "start": 1
  },
  "content": [
    {
      "type": "listItem",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Первый шаг"
            }
          ]
        }
      ]
    },
    {
      "type": "listItem",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Второй шаг"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Текст с форматированием

```json
{
  "type": "text",
  "text": "Жирный текст",
  "marks": [
    {
      "type": "bold"
    }
  ]
}
```

**Доступные marks:**
- `"bold"` - жирный
- `"italic"` - курсив
- `"code"` - код
- `{"type": "link", "attrs": {"href": "https://example.com", "target": "_blank"}}` - ссылка

**Пример комбинации:**
```json
{
  "type": "text",
  "text": "Жирный курсивный текст",
  "marks": [
    {"type": "bold"},
    {"type": "italic"}
  ]
}
```

---

### Цитата (Blockquote)

```json
{
  "type": "blockquote",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Текст цитаты"
        }
      ]
    }
  ]
}
```

---

### Блок кода (Code Block)

```json
{
  "type": "codeBlock",
  "attrs": {
    "uid": "code123abc",
    "language": "javascript"
  },
  "content": [
    {
      "type": "text",
      "text": "const x = 10;\nconsole.log(x);"
    }
  ]
}
```

**Языки:** javascript, python, typescript, html, css, json, markdown и т.д.

---

### Горизонтальная линия

```json
{
  "type": "horizontalRule"
}
```

---

## Полный пример документа с чеклистом

```json
[
  {
    "type": "heading",
    "attrs": {
      "level": 1,
      "uid": "h1unique123"
    },
    "content": [
      {
        "type": "text",
        "text": "Мой документ"
      }
    ]
  },
  {
    "type": "paragraph",
    "content": [
      {
        "type": "text",
        "text": "Описание документа"
      }
    ]
  },
  {
    "type": "heading",
    "attrs": {
      "level": 2,
      "uid": "h2tasks567"
    },
    "content": [
      {
        "type": "text",
        "text": "Задачи"
      }
    ]
  },
  {
    "type": "taskList",
    "attrs": {
      "uid": "tasklist890"
    },
    "content": [
      {
        "type": "taskItem",
        "attrs": {
          "checked": false
        },
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Задача 1"
              }
            ]
          }
        ]
      },
      {
        "type": "taskItem",
        "attrs": {
          "checked": false
        },
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Задача 2"
              }
            ]
          }
        ]
      }
    ]
  }
]
```

---

## Генерация UID

UID должен быть уникальным 12-символьным идентификатором из букв и цифр:
- Можно использовать: `A-Z`, `a-z`, `0-9`
- Длина: 12 символов
- Пример: `abc123XYZ789`

---

## Использование в MCP

### Через vaiz_replace_json_document:

```javascript
// Пример вызова через MCP
{
  "documentId": "690e08410cba5f5549219e1d",
  "content": [
    {
      "type": "heading",
      "attrs": {"level": 2, "uid": "abc123def456"},
      "content": [{"type": "text", "text": "Заголовок"}]
    },
    {
      "type": "taskList",
      "attrs": {"uid": "xyz789uvw012"},
      "content": [
        {
          "type": "taskItem",
          "attrs": {"checked": false},
          "content": [
            {
              "type": "paragraph",
              "content": [{"type": "text", "text": "Задача"}]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Важные замечания

1. ⚠️ Для интерактивных чеклистов используйте `vaiz_replace_json_document`, а не `vaiz_replace_document`
2. ⚠️ Каждый `taskList`, `heading`, `codeBlock` и т.д. требует уникальный `uid`
3. ⚠️ Текст всегда должен быть обернут в `{"type": "text", "text": "..."}`
4. ⚠️ Параграфы всегда содержат массив `content` с текстовыми нодами
5. ✅ Для простого текста можно использовать `vaiz_replace_document` с markdown/HTML

---

## Дополнительные ресурсы

Смотрите также:
- Node SDK документацию: `/src/helpers/documentStructure.ts`
- Примеры использования хелперов: `heading()`, `taskList()`, `taskItem()`, `paragraph()`

