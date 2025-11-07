import { BaseAPIClientConfig } from './api/base';
import { TasksAPIClient } from './api/tasks';
import { BoardsAPIClient } from './api/boards';
import { DocumentsAPIClient } from './api/documents';
import { ProjectsAPIClient } from './api/projects';
import { MilestonesAPIClient } from './api/milestones';
import { UploadAPIClient } from './api/upload';
import { CommentsAPIClient } from './api/comments';
import { ProfileAPIClient } from './api/profile';
import { SpacesAPIClient } from './api/spaces';
import { MembersAPIClient } from './api/members';

/**
 * Main client for interacting with the Vaiz API.
 * This class inherits all operations from specialized API clients:
 * - TasksAPIClient: Task-related operations
 * - BoardsAPIClient: Board-related operations
 * - DocumentsAPIClient: Document-related operations
 * - ProjectsAPIClient: Project-related operations
 * - MilestonesAPIClient: Milestone-related operations
 * - UploadAPIClient: File upload operations
 * - CommentsAPIClient: Comment-related operations
 * - ProfileAPIClient: User profile operations
 * - SpacesAPIClient: Space-related operations
 * - MembersAPIClient: Member-related operations
 */
export class VaizClient extends TasksAPIClient {
  // Mixin all API client methods
  private boardsClient: BoardsAPIClient;
  private documentsClient: DocumentsAPIClient;
  private projectsClient: ProjectsAPIClient;
  private milestonesClient: MilestonesAPIClient;
  private uploadClient: UploadAPIClient;
  private commentsClient: CommentsAPIClient;
  private profileClient: ProfileAPIClient;
  private spacesClient: SpacesAPIClient;
  private membersClient: MembersAPIClient;

  constructor(config: BaseAPIClientConfig) {
    super(config);
    
    // Initialize all API clients
    this.boardsClient = new BoardsAPIClient(config);
    this.documentsClient = new DocumentsAPIClient(config);
    this.projectsClient = new ProjectsAPIClient(config);
    this.milestonesClient = new MilestonesAPIClient(config);
    this.uploadClient = new UploadAPIClient(config);
    this.commentsClient = new CommentsAPIClient(config);
    this.profileClient = new ProfileAPIClient(config);
    this.spacesClient = new SpacesAPIClient(config);
    this.membersClient = new MembersAPIClient(config);

    // Bind all methods from each client
    this.bindClientMethods(this.boardsClient);
    this.bindClientMethods(this.documentsClient);
    this.bindClientMethods(this.projectsClient);
    this.bindClientMethods(this.milestonesClient);
    this.bindClientMethods(this.uploadClient);
    this.bindClientMethods(this.commentsClient);
    this.bindClientMethods(this.profileClient);
    this.bindClientMethods(this.spacesClient);
    this.bindClientMethods(this.membersClient);
  }

  /**
   * Bind all methods from a client to the main class
   */
  private bindClientMethods(client: any): void {
    const proto = Object.getPrototypeOf(client);
    Object.getOwnPropertyNames(proto).forEach((name) => {
      if (
        name !== 'constructor' &&
        typeof proto[name] === 'function' &&
        !name.startsWith('_') &&
        !(name in this)
      ) {
        (this as any)[name] = proto[name].bind(client);
      }
    });
  }
}

// Apply mixins to combine all API clients
export interface VaizClient
  extends BoardsAPIClient,
    DocumentsAPIClient,
    ProjectsAPIClient,
    MilestonesAPIClient,
    UploadAPIClient,
    CommentsAPIClient,
    ProfileAPIClient,
    SpacesAPIClient,
    MembersAPIClient {}

