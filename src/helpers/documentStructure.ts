/**
 * Document Structure Helper Functions
 * 
 * This module provides type-safe builders for document nodes and marks,
 * ensuring only validated elements are used with the replaceJsonDocument API.
 */

import { EmbedType, Kind } from '../models';

// Text formatting mark interfaces
export interface BoldMark {
  type: 'bold';
}

export interface ItalicMark {
  type: 'italic';
}

export interface CodeMark {
  type: 'code';
}

export interface LinkMark {
  type: 'link';
  attrs: {
    href: string;
    target?: string;
  };
}

export type Mark = BoldMark | ItalicMark | CodeMark | LinkMark;

// Text node interface
export interface TextNode {
  type: 'text';
  text: string;
  marks?: Mark[];
}

// Node interfaces
export interface ParagraphNode {
  type: 'paragraph';
  content?: any[];
}

export interface HeadingNode {
  type: 'heading';
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    uid?: string;
  };
  content?: any[];
}

export interface ListItemNode {
  type: 'listItem';
  content?: any[];
}

export interface BulletListNode {
  type: 'bulletList';
  content: ListItemNode[];
}

export interface OrderedListNode {
  type: 'orderedList';
  attrs?: {
    start?: number;
  };
  content: ListItemNode[];
}

export interface TaskItemNode {
  type: 'taskItem';
  attrs: {
    checked: boolean;
  };
  content?: any[];
}

export interface TaskListNode {
  type: 'taskList';
  attrs?: {
    uid?: string;
  };
  content: TaskItemNode[];
}

export interface HorizontalRuleNode {
  type: 'horizontalRule';
}

export interface BlockquoteNode {
  type: 'blockquote';
  content?: any[];
}

export interface DetailsSummaryNode {
  type: 'detailsSummary';
  content?: any[];
}

export interface DetailsContentNode {
  type: 'detailsContent';
  content?: any[];
}

export interface DetailsNode {
  type: 'details';
  content: (DetailsSummaryNode | DetailsContentNode)[];
}

export interface TableCellNode {
  type: 'tableCell';
  attrs?: {
    colspan?: number;
    rowspan?: number;
  };
  content?: any[];
}

export interface TableHeaderNode {
  type: 'tableHeader';
  attrs?: {
    colspan?: number;
    rowspan?: number;
  };
  content?: any[];
}

export interface TableRowNode {
  type: 'tableRow';
  attrs?: {
    showRowNumbers?: boolean;
  };
  content: (TableCellNode | TableHeaderNode)[];
}

export interface TableNode {
  type: 'extension-table';
  attrs?: {
    uid?: string;
    showRowNumbers?: boolean;
  };
  content: TableRowNode[];
}

export interface MentionNode {
  type: 'custom-mention';
  attrs: {
    uid: string;
    custom: 1;
    inline: true;
    data: {
      item: {
        id: string;
        kind: Kind;
      };
    };
  };
  content: TextNode[];
}

export interface ImageBlockNode {
  type: 'image-block';
  attrs: {
    uid: string;
    custom: 1;
    contenteditable: 'false';
    widthPercent?: number;
  };
  content: TextNode[];
}

export interface FilesBlockNode {
  type: 'files';
  attrs: {
    uid: string;
    custom: 1;
    contenteditable: 'false';
  };
  content: TextNode[];
}

export interface DocSiblingsNode {
  type: 'doc-siblings';
  attrs: {
    uid: string;
    custom: 1;
    contenteditable: 'false';
  };
  content: TextNode[];
}

export interface CodeBlockNode {
  type: 'codeBlock';
  attrs?: {
    uid?: string;
    language?: string;
  };
  content?: TextNode[];
}

export interface EmbedBlockNode {
  type: 'embed';
  attrs: {
    uid: string;
    custom: 1;
    contenteditable: 'false';
    size?: 'small' | 'medium' | 'large';
    isContentHidden?: boolean;
  };
  content: TextNode[];
}

export type DocumentNode =
  | ParagraphNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode
  | ListItemNode
  | TaskListNode
  | TaskItemNode
  | TableNode
  | HorizontalRuleNode
  | BlockquoteNode
  | DetailsNode
  | ImageBlockNode
  | FilesBlockNode
  | MentionNode
  | DocSiblingsNode
  | CodeBlockNode
  | EmbedBlockNode;

// Helper functions

/**
 * Generate a unique identifier (12 characters)
 */
function generateUid(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uid = '';
  for (let i = 0; i < 12; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uid;
}

/**
 * Create a text node with optional formatting
 */
export function text(
  content: string,
  bold: boolean = false,
  italic: boolean = false,
  code: boolean = false,
  link?: string,
  linkTarget: string = '_blank'
): TextNode {
  // Normalize empty text to a single space
  const normalizedContent = content === '' ? ' ' : content;
  const node: TextNode = { type: 'text', text: normalizedContent };
  const marks: Mark[] = [];

  if (bold) marks.push({ type: 'bold' });
  if (italic) marks.push({ type: 'italic' });
  if (code) marks.push({ type: 'code' });
  if (link) marks.push({ type: 'link', attrs: { href: link, target: linkTarget } });

  if (marks.length > 0) {
    node.marks = marks;
  }

  return node;
}

/**
 * Create a paragraph node
 */
export function paragraph(...content: (TextNode | string)[]): ParagraphNode {
  const node: ParagraphNode = { type: 'paragraph' };
  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? text(item) : item
    );
  }
  return node;
}

/**
 * Create a heading node with automatic UID generation
 */
export function heading(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  ...content: (TextNode | string)[]
): HeadingNode {
  const node: HeadingNode = {
    type: 'heading',
    attrs: {
      level,
      uid: generateUid(),
    },
  };
  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? text(item) : item
    );
  }
  return node;
}

/**
 * Create a list item node
 */
export function listItem(...content: any[]): ListItemNode {
  const node: ListItemNode = { type: 'listItem' };
  if (content.length > 0) {
    node.content = content;
  }
  return node;
}

/**
 * Create a bullet list
 */
export function bulletList(...items: (ListItemNode | string)[]): BulletListNode {
  const content: ListItemNode[] = items.map(item =>
    typeof item === 'string' ? listItem(paragraph(item)) : item
  );
  return { type: 'bulletList', content };
}

/**
 * Create an ordered list
 */
export function orderedList(
  ...items: (ListItemNode | string)[]
): OrderedListNode;
export function orderedList(
  start: number,
  ...items: (ListItemNode | string)[]
): OrderedListNode;
export function orderedList(
  startOrFirstItem: number | ListItemNode | string,
  ...items: (ListItemNode | string)[]
): OrderedListNode {
  let start: number | undefined;
  let allItems: (ListItemNode | string)[];

  if (typeof startOrFirstItem === 'number') {
    start = startOrFirstItem;
    allItems = items;
  } else {
    start = undefined;
    allItems = [startOrFirstItem, ...items];
  }

  const content: ListItemNode[] = allItems.map(item =>
    typeof item === 'string' ? listItem(paragraph(item)) : item
  );

  const node: OrderedListNode = { type: 'orderedList', content };
  if (start !== undefined && start !== 1) {
    node.attrs = { start };
  }

  return node;
}

/**
 * Create a task item node
 */
export function taskItem(
  ...contentOrChecked: any[]
): TaskItemNode {
  let checked = false;
  let content: any[] = [];

  // Parse arguments
  if (contentOrChecked.length > 0) {
    const lastArg = contentOrChecked[contentOrChecked.length - 1];
    if (typeof lastArg === 'boolean') {
      checked = lastArg;
      content = contentOrChecked.slice(0, -1);
    } else {
      content = contentOrChecked;
    }
  }

  const node: TaskItemNode = {
    type: 'taskItem',
    attrs: { checked },
  };

  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? paragraph(item) : item
    );
  }

  return node;
}

/**
 * Create a task list (checklist)
 */
export function taskList(...items: (TaskItemNode | string)[]): TaskListNode {
  const content: TaskItemNode[] = items.map(item =>
    typeof item === 'string' ? taskItem(item, false) : item
  );

  return {
    type: 'taskList',
    attrs: { uid: generateUid().replace(/-/g, '').substring(0, 12) },
    content,
  };
}

/**
 * Create a hyperlink text node
 */
export function linkText(
  content: string,
  href: string,
  target: string = '_blank',
  bold: boolean = false,
  italic: boolean = false
): TextNode {
  return text(content, bold, italic, false, href, target);
}

/**
 * Create a horizontal rule
 */
export function horizontalRule(): HorizontalRuleNode {
  return { type: 'horizontalRule' };
}

/**
 * Create a blockquote
 */
export function blockquote(...content: (ParagraphNode | string)[]): BlockquoteNode {
  const node: BlockquoteNode = { type: 'blockquote' };
  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? paragraph(item) : item
    );
  }
  return node;
}

/**
 * Create a details summary node
 */
export function detailsSummary(...content: (TextNode | string)[]): DetailsSummaryNode {
  const node: DetailsSummaryNode = { type: 'detailsSummary' };
  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? text(item) : item
    );
  }
  return node;
}

/**
 * Create a details content node
 */
export function detailsContent(...content: (ParagraphNode | string)[]): DetailsContentNode {
  const node: DetailsContentNode = { type: 'detailsContent' };
  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? paragraph(item) : item
    );
  }
  return node;
}

/**
 * Create a collapsible details section
 */
export function details(
  summary: DetailsSummaryNode | string,
  ...content: (DetailsContentNode | ParagraphNode | string)[]
): DetailsNode {
  const summaryNode: DetailsSummaryNode =
    typeof summary === 'string' ? detailsSummary(summary) : summary;

  const contentItems: any[] = content.map(item => {
    if (typeof item === 'string') {
      return paragraph(item);
    }
    return item;
  });

  // Wrap content in detailsContent if not already wrapped
  const hasDetailsContent = contentItems.some(item => item.type === 'detailsContent');
  const resultContent: (DetailsSummaryNode | DetailsContentNode)[] = hasDetailsContent
    ? [summaryNode, ...contentItems.filter((item: any) => item.type === 'detailsContent')]
    : [summaryNode, detailsContent(...contentItems)];

  return { type: 'details', content: resultContent };
}

/**
 * Create a table cell
 */
export function tableCell(
  ...content: (ParagraphNode | string)[]
): TableCellNode;
export function tableCell(
  colspan: number,
  rowspan: number,
  ...content: (ParagraphNode | string)[]
): TableCellNode;
export function tableCell(
  ...args: any[]
): TableCellNode {
  let colspan = 1;
  let rowspan = 1;
  let content: any[] = [];

  if (args.length >= 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
    colspan = args[0];
    rowspan = args[1];
    content = args.slice(2);
  } else {
    content = args;
  }

  const node: TableCellNode = {
    type: 'tableCell',
    attrs: { colspan, rowspan },
  };

  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? paragraph(item) : item
    );
  }

  return node;
}

/**
 * Create a table header cell
 */
export function tableHeader(
  ...content: (ParagraphNode | string)[]
): TableHeaderNode;
export function tableHeader(
  colspan: number,
  rowspan: number,
  ...content: (ParagraphNode | string)[]
): TableHeaderNode;
export function tableHeader(
  ...args: any[]
): TableHeaderNode {
  let colspan = 1;
  let rowspan = 1;
  let content: any[] = [];

  if (args.length >= 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
    colspan = args[0];
    rowspan = args[1];
    content = args.slice(2);
  } else {
    content = args;
  }

  const node: TableHeaderNode = {
    type: 'tableHeader',
    attrs: { colspan, rowspan },
  };

  if (content.length > 0) {
    node.content = content.map(item =>
      typeof item === 'string' ? paragraph(item) : item
    );
  }

  return node;
}

/**
 * Create a table row
 */
export function tableRow(
  ...cells: (TableCellNode | TableHeaderNode | string)[]
): TableRowNode {
  const content: (TableCellNode | TableHeaderNode)[] = cells.map(cell =>
    typeof cell === 'string' ? tableCell(cell) : cell
  );

  return {
    type: 'tableRow',
    attrs: { showRowNumbers: false },
    content,
  };
}

/**
 * Create a table
 */
export function table(...rows: TableRowNode[]): TableNode {
  return {
    type: 'extension-table',
    attrs: {
      uid: generateUid().replace(/-/g, '').substring(0, 12),
      showRowNumbers: false,
    },
    content: rows,
  };
}

/**
 * Create a mention node
 */
export function mention(itemId: string, kind: Kind): MentionNode {
  return {
    type: 'custom-mention',
    attrs: {
      uid: generateUid().replace(/-/g, '').substring(0, 12),
      custom: 1,
      inline: true,
      data: {
        item: {
          id: itemId,
          kind,
        },
      },
    },
    content: [{ type: 'text', text: ' ' }],
  };
}

/**
 * Create a user mention
 */
export function mentionUser(memberId: string): MentionNode {
  return mention(memberId, Kind.User);
}

/**
 * Create a document mention
 */
export function mentionDocument(documentId: string): MentionNode {
  return mention(documentId, Kind.Document);
}

/**
 * Create a task mention
 */
export function mentionTask(taskId: string): MentionNode {
  return mention(taskId, Kind.Task);
}

/**
 * Create a milestone mention
 */
export function mentionMilestone(milestoneId: string): MentionNode {
  return mention(milestoneId, Kind.Milestone);
}

/**
 * Create an image block from an uploaded file
 */
export function imageBlock(
  file: any,
  widthPercent: number = 100,
  caption: string = ''
): ImageBlockNode {
  const fileId = file.id;
  const src = file.url;
  const fileName = file.name;
  const fileSize = file.size;
  const extension = file.ext;
  const dimensions = file.dimension || null;
  const dominantColor = file.dominantColor || null;

  // Auto-detect MIME type
  let fileType = 'image/png';
  if (file.mime) {
    fileType = file.mime;
  }

  const blockUid = generateUid();
  const imageId = generateUid();

  const imageData: any = {
    id: imageId,
    src,
    fileName,
    fileType,
    extension,
    title: fileName,
    fileSize,
    fileId,
  };

  if (dimensions) {
    imageData.dimensions = dimensions;
    if (dimensions.length === 2 && dimensions[1] > 0) {
      imageData.aspectRatio = dimensions[0] / dimensions[1];
    }
  }

  if (caption) {
    imageData.caption = caption;
  }

  if (dominantColor) {
    imageData.dominantColor = dominantColor;
  }

  return {
    type: 'image-block',
    attrs: {
      uid: blockUid,
      custom: 1,
      contenteditable: 'false',
      widthPercent,
    },
    content: [{ type: 'text', text: JSON.stringify(imageData) }],
  };
}

/**
 * Create a files block with one or more file attachments
 */
export function filesBlock(...fileItems: any[]): FilesBlockNode {
  const blockUid = generateUid();
  const currentTimestamp = Date.now();

  const filesList = fileItems.map(item => ({
    id: generateUid().replace(/-/g, '').substring(0, 12),
    fileId: item.fileId,
    createAt: currentTimestamp,
    url: item.url,
    extension: item.extension,
    name: item.name,
    size: item.size,
    type: item.type,
    ...(item.dominantColor && { dominantColor: item.dominantColor }),
  }));

  const filesData = { files: filesList };

  return {
    type: 'files',
    attrs: {
      uid: blockUid,
      custom: 1,
      contenteditable: 'false',
    },
    content: [{ type: 'text', text: JSON.stringify(filesData) }],
  };
}

/**
 * Create a Table of Contents (TOC) block
 */
export function tocBlock(): DocSiblingsNode {
  const blockUid = generateUid();
  const tocData = { type: 'toc' };

  return {
    type: 'doc-siblings',
    attrs: {
      uid: blockUid,
      custom: 1,
      contenteditable: 'false',
    },
    content: [{ type: 'text', text: JSON.stringify(tocData) }],
  };
}

/**
 * Create an Anchors block
 */
export function anchorsBlock(): DocSiblingsNode {
  const blockUid = generateUid();
  const anchorsData = { type: 'anchors' };

  return {
    type: 'doc-siblings',
    attrs: {
      uid: blockUid,
      custom: 1,
      contenteditable: 'false',
    },
    content: [{ type: 'text', text: JSON.stringify(anchorsData) }],
  };
}

/**
 * Create a Siblings block (Previous/Next navigation)
 */
export function siblingsBlock(): DocSiblingsNode {
  const blockUid = generateUid();
  const siblingsData = { type: 'siblings' };

  return {
    type: 'doc-siblings',
    attrs: {
      uid: blockUid,
      custom: 1,
      contenteditable: 'false',
    },
    content: [{ type: 'text', text: JSON.stringify(siblingsData) }],
  };
}

/**
 * Create a code block
 */
export function codeBlock(code: string = '', language: string = ''): CodeBlockNode {
  const blockUid = generateUid();

  const node: CodeBlockNode = {
    type: 'codeBlock',
  };

  const attrs: any = { uid: blockUid };
  if (language) {
    attrs.language = language;
  }
  node.attrs = attrs;

  if (code) {
    node.content = [{ type: 'text', text: code }];
  }

  return node;
}

/**
 * Extract proper embed URL for different platforms
 */
function extractEmbedUrl(url: string, embedType: EmbedType): string {
  if (embedType === EmbedType.YouTube) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (embedType === EmbedType.Figma) {
    const figmaUrl = url.replace('/design/', '/file/');
    return `https://www.figma.com/embed?embed_host=share&url=${figmaUrl}`;
  } else if (embedType === EmbedType.GitHubGist) {
    return `data:text/html;charset=utf-8,
      <head><base target='_blank'/></head>
      <body><script src='${url}.js'></script>
      </body>`;
  }

  return url;
}

/**
 * Create an embed block
 */
export function embedBlock(
  url: string = '',
  embedType: EmbedType = EmbedType.Iframe,
  size: 'small' | 'medium' | 'large' = 'medium',
  isContentHidden: boolean = false
): EmbedBlockNode {
  const blockUid = generateUid();
  const extractedUrl = extractEmbedUrl(url, embedType);

  const embedData: any = {
    type: embedType,
    url,
    extractedUrl,
  };

  if (embedType === EmbedType.Figma) {
    embedData.isContentHidden = true;
  } else if (embedType === EmbedType.Miro && isContentHidden) {
    embedData.isContentHidden = true;
  }

  return {
    type: 'embed',
    attrs: {
      uid: blockUid,
      custom: 1,
      contenteditable: 'false',
      size,
      isContentHidden,
    },
    content: [{ type: 'text', text: JSON.stringify(embedData) }],
  };
}

