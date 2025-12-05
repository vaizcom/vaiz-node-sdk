# Vaiz Node.js SDK

> Node.js/TypeScript SDK for the [Vaiz](https://vaiz.com) App

[![npm version](https://badge.fury.io/js/%40vaizapp%2Fvaiz-sdk.svg)](https://badge.fury.io/js/%40vaizapp%2Fvaiz-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

**Vaiz** is a modern project management app that helps teams collaborate and get work done.
This SDK provides a complete Node.js/TypeScript interface to the Vaiz API, making it easy to integrate Vaiz into your Node.js applications and workflows.

## Features

- ✅ **Full TypeScript support** with complete type definitions
- ✅ **Promise-based API** with async/await support
- ✅ **Comprehensive coverage** of all Vaiz API endpoints
- ✅ **Helper functions** for custom fields and document structure
- ✅ **Automatic file uploads** with local and remote files
- ✅ **Built-in caching** for better performance
- ✅ **Error handling** with custom error types

## Installation

```bash
npm install @vaizapp/vaiz-sdk
```

Or with yarn:

```bash
yarn add @vaizapp/vaiz-sdk
```

## Quick Start

```typescript
import { VaizClient, TaskPriority } from '@vaizapp/vaiz-sdk';

// Initialize the client
const client = new VaizClient({
  apiKey: 'your-api-key',
  spaceId: 'your-space-id',
});

// Create a task
async function createTask() {
  const response = await client.createTask({
    name: 'Implement user authentication',
    board: 'board-id',
    project: 'project-id',
    priority: TaskPriority.High,
  });
  
  console.log('Task created:', response.task);
}

createTask();
```

## Configuration

```typescript
const client = new VaizClient({
  apiKey: 'your-api-key',        // Required: Your Vaiz API key
  spaceId: 'your-space-id',      // Required: Your Vaiz space ID
  baseUrl: 'https://api.vaiz.com/v4',  // Optional: API base URL
  verifySsl: true,                // Optional: Verify SSL certificates
  verbose: false,                 // Optional: Enable debug logging
});
```

## Core Features

### Tasks

```typescript
// Get space members to find user IDs
const members = await client.getSpaceMembers();
const memberId = members.members[0].id; // Use Member.id, NOT _id

// Create a task
const task = await client.createTask({
  name: 'Task name',
  board: 'board-id',  // Required
  project: 'project-id',  // Optional
  priority: TaskPriority.High,
  assignees: [memberId],  // Use Member.id from getSpaceMembers
});

// Get a task
const taskInfo = await client.getTask('TASK-123');

// Edit a task
const updated = await client.editTask({
  taskId: 'TASK-123',  // Can use slug or database ID
  name: 'Updated name',
  priority: TaskPriority.Medium,
});

// Get tasks with filtering
const tasks = await client.getTasks({
  assignees: [memberId],  // Filter by Member.id
  limit: 50,
  skip: 0,  // Use 'skip' instead of 'offset'
});

// Set a blocking relationship between tasks
// Task 'TASK-123' blocks task 'TASK-456'
const blockerResult = await client.setTaskBlocker({
  blockedTaskId: 'TASK-456',  // The task being blocked
  blockerTaskId: 'TASK-123',  // The task that blocks
});
console.log('Blocked task:', blockerResult.blockedTask);
console.log('Blocker task:', blockerResult.blockerTask);
```

### History

Get change history for any entity with specialized methods:

```typescript
// Get task history
const taskHistory = await client.getTaskHistory({
  taskId: 'TASK-123',
  limit: 50,
  offset: 0,
});
console.log('Task changes:', taskHistory.histories);

// Get document history
const docHistory = await client.getDocumentHistory({
  documentId: 'doc-id',
  limit: 20,
});

// Get project history
const projectHistory = await client.getProjectHistory({
  projectId: 'project-id',
});

// Get milestone history
const milestoneHistory = await client.getMilestoneHistory({
  milestoneId: 'milestone-id',
});

// Get member history
const memberHistory = await client.getMemberHistory({
  memberId: 'member-id',
});

// Get space history
const spaceHistory = await client.getSpaceHistory({
  spaceId: 'space-id',
});
```

Each history response includes:

- `histories`: Array of history items with `id`, `kind`, `action`, `userId`, `createdAt`, and `changes`
- `total`: Total number of history entries

### Documents

```typescript
import {
  heading,
  paragraph,
  bulletList,
  codeBlock,
  text,
} from '@vaizapp/vaiz-sdk';

// Create a document
import { Kind } from '@vaizapp/vaiz-sdk';

const doc = await client.createDocument({
  kind: Kind.Project,
  kindId: 'project-id',
  title: 'API Documentation',
  index: 0,
});

// Build structured content
const content = [
  heading(1, 'Getting Started'),
  paragraph('Welcome to our API.'),
  bulletList('First step', 'Second step', 'Third step'),
  codeBlock('console.log("Hello, World!");', 'javascript'),
];

// Update document with structured content
await client.replaceJsonDocument({
  documentId: doc.document.id,
  content,
});

// Get document content (works for task descriptions too)
const jsonContent = await client.getJsonDocument(doc.document.id);
console.log('Document content:', jsonContent);
```

### Custom Fields

```typescript
import {
  makeSelectField,
  makeSelectOption,
  makeTextField,
  Color,
  Icon,
} from '@vaizapp/vaiz-sdk';

// Create a text field
const textField = makeTextField(
  'Customer Name',
  'board-id',
  'Customer name field'
);

await client.createBoardCustomField(textField);

// Create a select field with options
const options = [
  makeSelectOption('High', Color.Red, Icon.Flag),
  makeSelectOption('Medium', Color.Orange, Icon.Circle),
  makeSelectOption('Low', Color.Green, Icon.Target),
];

const selectField = makeSelectField(
  'Priority',
  'board-id',
  options,
  'Priority field'
);

await client.createBoardCustomField(selectField);
```

### File Uploads

```typescript
// Upload a file
const uploaded = await client.uploadFile('./path/to/file.pdf');

// Upload from URL
const fromUrl = await client.uploadFileFromUrl(
  'https://example.com/file.pdf'
);

// Create task with file attachment
await client.createTask(
  {
    name: 'Review document',
    board: 'board-id',
    project: 'project-id',
  },
  'Please review this document',
  { path: './document.pdf' }
);
```

### Comments

```typescript
import { CommentReactionType } from '@vaizapp/vaiz-sdk';

// Get task to find its description document ID
const task = await client.getTask('TASK-123');
// Note: Comments are attached to documents, not directly to tasks.
// For task comments, you need to get the task's description document ID.
// The document ID is typically available in the task's description field.

// Post a comment to a document
await client.postComment({
  documentId: 'document-id',  // Document ID (e.g., task description document)
  content: 'Great work on this task!',
});

// Get comments for a document
const comments = await client.getComments({
  documentId: 'document-id',
});

// Add a reaction to a comment (for popular emojis)
await client.addReaction({
  commentId: 'comment-id',
  reaction: CommentReactionType.Like,
});

// React with custom emoji (advanced)
await client.reactToComment({
  commentId: 'comment-id',
  id: 'heart',
  name: 'Heart',
  native: '❤️',
  unified: '2764-fe0f',
  shortcodes: ':heart:',
});
```

## Document Structure Helpers

The SDK provides comprehensive helpers for building document content:

### Text Formatting

```typescript
import { text, paragraph, heading } from '@vaizapp/vaiz-sdk';

// Basic text
paragraph('Normal text');

// Formatted text
paragraph(
  text('Bold text', true),
  text('Italic text', false, true),
  text('Code', false, false, true),
  text('Link', false, false, false, 'https://example.com')
);
```

### Lists

```typescript
import { bulletList, orderedList, taskList, taskItem } from '@vaizapp/vaiz-sdk';

// Bullet list
bulletList('Item 1', 'Item 2', 'Item 3');

// Numbered list
orderedList('First', 'Second', 'Third');

// Task list (checklist)
taskList(
  taskItem('Todo item', false),
  taskItem('Completed item', true)
);
```

### Tables

```typescript
import { table, tableRow, tableHeader, tableCell } from '@vaizapp/vaiz-sdk';

table(
  tableRow(
    tableHeader('Name'),
    tableHeader('Status'),
    tableHeader('Priority')
  ),
  tableRow('Task 1', 'In Progress', 'High'),
  tableRow('Task 2', 'Done', 'Medium')
);
```

### Embeds

```typescript
import { embedBlock, EmbedType } from '@vaizapp/vaiz-sdk';

// YouTube video
embedBlock(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  EmbedType.YouTube
);

// Figma design
embedBlock(
  'https://www.figma.com/file/...',
  EmbedType.Figma,
  'large'
);

// CodeSandbox
embedBlock(
  'https://codesandbox.io/s/...',
  EmbedType.CodeSandbox
);
```

## Error Handling

```typescript
import {
  VaizAuthError,
  VaizValidationError,
  VaizNotFoundError,
} from '@vaizapp/vaiz-sdk';

try {
  await client.getTask('INVALID-SLUG');
} catch (error) {
  if (error instanceof VaizAuthError) {
    console.error('Authentication failed');
  } else if (error instanceof VaizValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof VaizNotFoundError) {
    console.error('Task not found');
  }
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
VAIZ_API_KEY=your_api_key_here
VAIZ_SPACE_ID=your_space_id_here
```

Then use in your code:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();

const client = new VaizClient({
  apiKey: process.env.VAIZ_API_KEY!,
  spaceId: process.env.VAIZ_SPACE_ID!,
});
```

## API Reference

For detailed API documentation, visit [https://docs-python-sdk.vaiz.com](https://docs-python-sdk.vaiz.com)

## TypeScript

This SDK is written in TypeScript and includes complete type definitions. All API methods, models, and helpers are fully typed for excellent IDE support and type safety.

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.0.0 (for TypeScript projects)

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.
