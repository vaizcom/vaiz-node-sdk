#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { VaizClient } from 'vaiz-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const VAIZ_API_KEY = process.env.VAIZ_API_KEY;
const VAIZ_SPACE_ID = process.env.VAIZ_SPACE_ID;

if (!VAIZ_API_KEY || !VAIZ_SPACE_ID) {
  console.error('Error: VAIZ_API_KEY and VAIZ_SPACE_ID must be set in environment variables');
  process.exit(1);
}

// Initialize Vaiz client
const vaizClient = new VaizClient({
  apiKey: VAIZ_API_KEY,
  spaceId: VAIZ_SPACE_ID,
  verbose: process.env.VAIZ_VERBOSE === 'true',
});

// Define available tools
const tools: Tool[] = [
  {
    name: 'vaiz_get_tasks',
    description:
      'Get a list of tasks from Vaiz with optional filtering. Returns tasks with their details including name, status, priority, assignees, and more. Supports filtering by IDs, board, project, assignees, completion status, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by specific task IDs',
        },
        board: {
          type: 'string',
          description: 'Filter tasks by board ID',
        },
        project: {
          type: 'string',
          description: 'Filter tasks by project ID',
        },
        assignees: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Filter tasks by assignee member IDs (use Member.id from vaiz_get_space_members)',
        },
        parentTask: {
          type: 'string',
          description: 'Filter by parent task ID (to get subtasks)',
        },
        milestones: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter tasks by milestone IDs',
        },
        completed: {
          type: 'boolean',
          description: 'Filter by completion status (true for completed, false for incomplete)',
        },
        archived: {
          type: 'boolean',
          description: 'Filter by archived status (true for archived, false for active)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of tasks to return (1-50, default: 50)',
        },
        skip: {
          type: 'number',
          description: 'Number of tasks to skip for pagination (default: 0)',
        },
      },
    },
  },
  {
    name: 'vaiz_get_task',
    description:
      "Get detailed information about a specific task by its slug (e.g., 'TASK-123'). Returns complete task details including description, custom fields, comments count, and attachments.",
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: "The task slug (e.g., 'TASK-123')",
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'vaiz_create_task',
    description:
      'Create a new task in Vaiz. Returns the created task with its assigned slug and ID.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Task name/title',
        },
        board: {
          type: 'string',
          description: 'Board ID where the task will be created',
        },
        group: {
          type: 'string',
          description: 'Group ID (optional)',
        },
        project: {
          type: 'string',
          description: 'Project ID (optional)',
        },
        description: {
          type: 'string',
          description: 'Task description (optional)',
        },
        priority: {
          type: 'string',
          description: "Task priority: 'urgent', 'high', 'normal', or 'low' (optional)",
        },
        completed: {
          type: 'boolean',
          description: 'Completion status (default: false)',
        },
        assignees: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Array of member IDs to assign to the task (use Member.id from vaiz_get_space_members, NOT _id)',
        },
        types: {
          type: 'array',
          items: { type: 'string' },
          description: 'Task type IDs',
        },
        parentTask: {
          type: 'string',
          description: 'Parent task ID (for creating subtasks)',
        },
        subtasks: {
          type: 'array',
          items: { type: 'string' },
          description: 'Subtask IDs',
        },
        milestones: {
          type: 'array',
          items: { type: 'string' },
          description: 'Milestone IDs',
        },
        dueStart: {
          type: 'string',
          description: 'Start date in ISO format (e.g., "2025-01-01T00:00:00Z")',
        },
        dueEnd: {
          type: 'string',
          description: 'Due date in ISO format (e.g., "2025-01-31T23:59:59Z")',
        },
        blockers: {
          type: 'array',
          items: { type: 'string' },
          description: 'Task IDs that block this task',
        },
        blocking: {
          type: 'array',
          items: { type: 'string' },
          description: 'Task IDs that this task blocks',
        },
      },
      required: ['name', 'board'],
    },
  },
  {
    name: 'vaiz_edit_task',
    description:
      'Edit an existing task. Can update name, description, priority, assignees, completion status, and other fields. Only provide fields you want to update.',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: "The task ID to edit (can use HRID like 'TASK-123' or database ID)",
        },
        name: {
          type: 'string',
          description: 'New task name',
        },
        description: {
          type: 'string',
          description: 'New task description',
        },
        priority: {
          type: 'string',
          description: "New task priority: 'urgent', 'high', 'normal', or 'low'",
        },
        completed: {
          type: 'boolean',
          description: 'New completion status (true for completed, false for incomplete)',
        },
        assignees: {
          type: 'array',
          items: { type: 'string' },
          description:
            'New array of member IDs to assign (use Member.id from vaiz_get_space_members, NOT _id)',
        },
        types: {
          type: 'array',
          items: { type: 'string' },
          description: 'New task type IDs',
        },
        parentTask: {
          type: 'string',
          description: 'New parent task ID',
        },
        subtasks: {
          type: 'array',
          items: { type: 'string' },
          description: 'New subtask IDs',
        },
        milestones: {
          type: 'array',
          items: { type: 'string' },
          description: 'New milestone IDs',
        },
        dueStart: {
          type: 'string',
          description: 'New start date in ISO format',
        },
        dueEnd: {
          type: 'string',
          description: 'New due date in ISO format',
        },
        blockers: {
          type: 'array',
          items: { type: 'string' },
          description: 'New blocker task IDs',
        },
        blocking: {
          type: 'array',
          items: { type: 'string' },
          description: 'New blocking task IDs',
        },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'vaiz_get_projects',
    description:
      'Get all projects in the workspace. Returns a list of projects with their IDs, names, and metadata.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vaiz_get_project',
    description: 'Get detailed information about a specific project by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The project ID',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'vaiz_get_documents',
    description:
      'Get a list of documents with optional filtering. Returns documents with their metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Filter documents by project ID (optional)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of documents to return (optional)',
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination (optional)',
        },
      },
    },
  },
  {
    name: 'vaiz_get_document',
    description: 'Get a specific document by its ID. Returns the document with its full content.',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'The document ID',
        },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'vaiz_create_document',
    description: 'Create a new document in Vaiz. Returns the created document with its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Document name/title',
        },
        projectId: {
          type: 'string',
          description: 'Project ID where the document belongs',
        },
        content: {
          type: 'string',
          description: 'Initial document content in HTML format (optional)',
        },
      },
      required: ['name', 'projectId'],
    },
  },
  {
    name: 'vaiz_append_to_document',
    description:
      'Append content to an existing document. The content will be added at the end of the document.',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'The document ID',
        },
        content: {
          type: 'string',
          description: 'HTML content to append',
        },
      },
      required: ['documentId', 'content'],
    },
  },
  {
    name: 'vaiz_get_document_content',
    description:
      'Get the JSON content structure of a document. Works for task descriptions, standalone documents, and any document by ID. Returns the parsed JSON structure of the document content.',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'The document ID (can be task description ID or standalone document ID)',
        },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'vaiz_post_comment',
    description:
      'Post a comment to a document in Vaiz. Supports HTML content, file attachments, and replies.',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'Document ID to comment on',
        },
        content: {
          type: 'string',
          description: 'Comment content (HTML supported)',
        },
        fileIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of file IDs to attach',
        },
        replyTo: {
          type: 'string',
          description: 'Optional parent comment ID for replies',
        },
      },
      required: ['documentId', 'content'],
    },
  },
  {
    name: 'vaiz_get_comments',
    description: 'Get all comments for a document.',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'Document ID',
        },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'vaiz_edit_comment',
    description: 'Edit a comment. Can update content and manage file attachments.',
    inputSchema: {
      type: 'object',
      properties: {
        commentId: {
          type: 'string',
          description: 'Comment ID to edit',
        },
        content: {
          type: 'string',
          description: 'New comment content (HTML supported)',
        },
        addFileIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'File IDs to add',
        },
        orderFileIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'New order of file IDs',
        },
        removeFileIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'File IDs to remove',
        },
      },
      required: ['commentId', 'content'],
    },
  },
  {
    name: 'vaiz_delete_comment',
    description: 'Soft delete a comment.',
    inputSchema: {
      type: 'object',
      properties: {
        commentId: {
          type: 'string',
          description: 'Comment ID to delete',
        },
      },
      required: ['commentId'],
    },
  },
  {
    name: 'vaiz_add_reaction',
    description: 'Add a popular emoji reaction to a comment (THUMBS_UP, HEART, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        commentId: {
          type: 'string',
          description: 'Comment ID',
        },
        reaction: {
          type: 'string',
          description: 'Reaction type (e.g., THUMBS_UP, HEART, LAUGH, SAD, SURPRISED, ANGRY)',
        },
      },
      required: ['commentId', 'reaction'],
    },
  },
  {
    name: 'vaiz_get_profile',
    description: "Get the current user's profile information.",
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vaiz_get_space',
    description: 'Get information about a specific space.',
    inputSchema: {
      type: 'object',
      properties: {
        spaceId: {
          type: 'string',
          description: 'The space ID (optional, uses configured space if not provided)',
        },
      },
    },
  },
  {
    name: 'vaiz_get_space_members',
    description: 'Get all members in the current space.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vaiz_get_boards',
    description: 'Get all boards in the workspace.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vaiz_get_milestones',
    description: 'Get milestones for a specific project.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The project ID',
        },
      },
      required: ['projectId'],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'vaiz-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'vaiz_get_tasks': {
        const result = await vaizClient.getTasks(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_task': {
        if (!args?.slug) {
          throw new Error('slug is required');
        }
        const result = await vaizClient.getTask(args.slug as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_create_task': {
        if (!args?.name || !args?.board) {
          throw new Error('name and board are required');
        }
        const result = await vaizClient.createTask({
          name: args.name as string,
          board: args.board as string,
          group: args.group as string | undefined,
          project: args.project as string | undefined,
          description: args.description as string | undefined,
          priority: args.priority as any,
          completed: args.completed as boolean | undefined,
          assignees: args.assignees as string[] | undefined,
          types: args.types as string[] | undefined,
          parentTask: args.parentTask as string | undefined,
          subtasks: args.subtasks as string[] | undefined,
          milestones: args.milestones as string[] | undefined,
          dueStart: args.dueStart as string | undefined,
          dueEnd: args.dueEnd as string | undefined,
          blockers: args.blockers as string[] | undefined,
          blocking: args.blocking as string[] | undefined,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_edit_task': {
        if (!args?.taskId) {
          throw new Error('taskId is required');
        }
        const result = await vaizClient.editTask({
          taskId: args.taskId as string,
          name: args.name as string | undefined,
          description: args.description as string | undefined,
          priority: args.priority as any,
          completed: args.completed as boolean | undefined,
          assignees: args.assignees as string[] | undefined,
          types: args.types as string[] | undefined,
          parentTask: args.parentTask as string | undefined,
          subtasks: args.subtasks as string[] | undefined,
          milestones: args.milestones as string[] | undefined,
          dueStart: args.dueStart as string | undefined,
          dueEnd: args.dueEnd as string | undefined,
          blockers: args.blockers as string[] | undefined,
          blocking: args.blocking as string[] | undefined,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_projects': {
        const result = await vaizClient.getProjects();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_project': {
        if (!args?.projectId) {
          throw new Error('projectId is required');
        }
        const result = await vaizClient.getProject(args.projectId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_documents': {
        const result = await vaizClient.getDocuments(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_document': {
        if (!args?.documentId) {
          throw new Error('documentId is required');
        }
        const result = await vaizClient.getDocument(args.documentId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_create_document': {
        if (!args?.name || !args?.projectId) {
          throw new Error('name and projectId are required');
        }
        const result = await vaizClient.createDocument({
          name: args.name as string,
          projectId: args.projectId as string,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_append_to_document': {
        if (!args?.documentId || !args?.content) {
          throw new Error('documentId and content are required');
        }
        const result = await vaizClient.appendDocument({
          documentId: args.documentId as string,
          content: args.content as string,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_document_content': {
        if (!args?.documentId) {
          throw new Error('documentId is required');
        }
        const result = await vaizClient.getJsonDocument(args.documentId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_post_comment': {
        if (!args?.documentId || !args?.content) {
          throw new Error('documentId and content are required');
        }
        const commentRequest: any = {
          documentId: args.documentId as string,
          content: args.content as string,
        };
        
        if (args.fileIds) {
          commentRequest.fileIds = args.fileIds as string[];
        }
        
        if (args.replyTo) {
          commentRequest.replyTo = args.replyTo as string;
        }
        
        const result = await vaizClient.postComment(commentRequest);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_comments': {
        if (!args?.documentId) {
          throw new Error('documentId is required');
        }
        const result = await vaizClient.getComments({
          documentId: args.documentId as string,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_edit_comment': {
        if (!args?.commentId || !args?.content) {
          throw new Error('commentId and content are required');
        }
        const result = await vaizClient.editComment({
          commentId: args.commentId as string,
          content: args.content as string,
          addFileIds: args.addFileIds as string[] | undefined,
          orderFileIds: args.orderFileIds as string[] | undefined,
          removeFileIds: args.removeFileIds as string[] | undefined,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_delete_comment': {
        if (!args?.commentId) {
          throw new Error('commentId is required');
        }
        const result = await vaizClient.deleteComment({
          commentId: args.commentId as string,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_add_reaction': {
        if (!args?.commentId || !args?.reaction) {
          throw new Error('commentId and reaction are required');
        }
        const result = await vaizClient.addReaction({
          commentId: args.commentId as string,
          reaction: args.reaction as any,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_profile': {
        const result = await vaizClient.getProfile();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_space': {
        const spaceId = (args?.spaceId as string) || VAIZ_SPACE_ID;
        const result = await vaizClient.getSpace(spaceId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_space_members': {
        const result = await vaizClient.getSpaceMembers();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_boards': {
        const result = await vaizClient.getBoards();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vaiz_get_milestones': {
        if (!args?.projectId) {
          throw new Error('projectId is required');
        }
        const result = await vaizClient.getMilestones(args.projectId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vaiz MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
