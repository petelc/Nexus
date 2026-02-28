// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface UserDto {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  emailConfirmed: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

export interface LoginRequestDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequestDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface TwoFactorSetupResponseDto {
  secret: string;
  qrCodeUrl: string;
}

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export enum DocumentStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export interface DocumentCreatorDto {
  userId: string;
  username: string;
  fullName: string;
}

export interface DocumentDto {
  documentId: string;
  title: string;
  content: string;
  excerpt?: string;
  status: DocumentStatus;
  createdBy: DocumentCreatorDto;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  workspaceId: string;
  tags: TagDto[];
  versions?: DocumentVersionDto[];
  viewCount: number;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface DocumentVersionDto {
  versionId: string;
  versionNumber: number;
  content: string;
  createdBy: string;
  createdByUser?: UserDto;
  createdAt: string;
  changeNote?: string;
}

export interface CreateDocumentDto {
  title: string;
  content: string;
  workspaceId: string;
  status?: DocumentStatus;
  tags?: string[];
}

export interface UpdateDocumentDto {
  title?: string;
  content?: string;
  status?: DocumentStatus;
  tags?: string[];
}

// ============================================================================
// CODE SNIPPET TYPES
// ============================================================================

export interface CodeSnippetDto {
  snippetId: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  createdBy: string;
  createdByUser?: UserDto;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  metadata: CodeMetadataDto;
  tags: TagDto[];
  isPublic: boolean;
  forkCount: number;
  viewCount: number;
  forkedFromId?: string;
}

export interface CodeMetadataDto {
  lineCount: number;
  characterCount: number;
  hasTests: boolean;
  framework?: string;
  dependencies?: string[];
}

export interface CreateCodeSnippetDto {
  title: string;
  description?: string;
  code: string;
  language: string;
  workspaceId: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateCodeSnippetDto {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  isPublic?: boolean;
  tags?: string[];
}

// ============================================================================
// DIAGRAM TYPES
// ============================================================================

export type DiagramType = 'Flowchart' | 'NetworkDiagram' | 'UmlDiagram' | 'ErDiagram' | 'Custom';
export type ShapeType =
  | 'Rectangle' | 'Circle' | 'Diamond' | 'Triangle' | 'Ellipse' | 'Hexagon'  // general
  | 'Actor' | 'Note'       // UML
  | 'Cloud' | 'Database'   // Network
  | 'WeakEntity'           // ER
  | 'Custom';
export type ConnectionType = 'Arrow' | 'DoubleArrow' | 'Line' | 'Bezier';

export interface UserInfoDto {
  userId: string;
  username: string;
}

export interface DiagramCanvasDto {
  width: number;
  height: number;
  backgroundColor: string;
  gridSize: number;
}

export interface PointDto {
  x: number;
  y: number;
}

export interface SizeDto {
  width: number;
  height: number;
}

export interface ElementStyleDto {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
  rotation: number;
}

export interface ConnectionStyleDto {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray?: string;
}

export interface DiagramElementDto {
  elementId: string;
  shapeType: ShapeType;
  position: PointDto;
  size: SizeDto;
  text?: string;
  style: ElementStyleDto;
  layerId?: string;
  zIndex: number;
  isLocked: boolean;
  customProperties?: Record<string, unknown>;
}

export interface DiagramConnectionDto {
  connectionId: string;
  sourceElementId: string;
  targetElementId: string;
  connectionType: ConnectionType;
  label?: string;
  style: ConnectionStyleDto;
}

export interface LayerDto {
  layerId: string;
  name: string;
  order: number;
  isVisible: boolean;
  isLocked: boolean;
}

export interface DiagramDto {
  diagramId: string;
  title: string;
  diagramType: DiagramType;
  canvas: DiagramCanvasDto;
  elements: DiagramElementDto[];
  connections: DiagramConnectionDto[];
  layers: LayerDto[];
  createdBy: UserInfoDto;
  createdAt: string;
  updatedAt: string;
}

export interface DiagramListItemDto {
  diagramId: string;
  title: string;
  diagramType: DiagramType;
  elementCount: number;
  connectionCount: number;
  createdBy: UserInfoDto;
  createdAt: string;
  updatedAt: string;
}

export interface DiagramPagedResultDto {
  items: DiagramListItemDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateDiagramRequest {
  title: string;
  diagramType: DiagramType;
  canvas?: Partial<DiagramCanvasDto>;
  collectionId?: string;
}

export interface UpdateDiagramRequest {
  title?: string;
  canvas?: Partial<DiagramCanvasDto>;
}

export interface AddElementRequest {
  shapeType: ShapeType;
  position: PointDto;
  size: SizeDto;
  text?: string;
  style?: Partial<ElementStyleDto>;
  layerId?: string;
  zIndex: number;
}

export interface UpdateElementRequest {
  position?: PointDto;
  size?: SizeDto;
  text?: string;
  style?: Partial<ElementStyleDto>;
  zIndex?: number;
  isLocked?: boolean;
}

export interface AddConnectionRequest {
  sourceElementId: string;
  targetElementId: string;
  connectionType: ConnectionType;
  label?: string;
  style?: Partial<ConnectionStyleDto>;
}

export interface UpdateConnectionRequest {
  label?: string;
  style?: Partial<ConnectionStyleDto>;
}

export interface AddLayerRequest {
  name: string;
  isVisible?: boolean;
  isLocked?: boolean;
}

export interface UpdateLayerRequest {
  name?: string;
  order?: number;
  isVisible?: boolean;
  isLocked?: boolean;
}

// ============================================================================
// TEAM TYPES
// ============================================================================

export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  memberCount: number;
  workspaceCount: number;
}

export interface TeamMemberDto {
  userId: string;
  user?: UserDto;
  role: TeamRole;
  joinedAt: string;
}

export enum TeamRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
}

export interface CreateTeamDto {
  name: string;
  description?: string;
}

export interface InviteTeamMemberDto {
  email: string;
  role: TeamRole;
}

// ============================================================================
// WORKSPACE TYPES
// ============================================================================

export interface WorkspaceDto {
  workspaceId: string;
  name: string;
  description?: string;
  teamId: string;
  createdBy: string;
  createdAt: string;
  documentCount: number;
  snippetCount: number;
  diagramCount: number;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  teamId: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
}

// ============================================================================
// COLLECTION TYPES
// ============================================================================

// Returned by list/search/breadcrumb endpoints (subset)
export interface CollectionSummaryDto {
  collectionId: string;
  name: string;
  icon?: string;
  color?: string;
  parentCollectionId?: string;
  hierarchyLevel: number;
  itemCount: number;
  updatedAt: string;
}

// Returned by getCollectionById (full DTO)
export interface CollectionDto {
  collectionId: string;
  name: string;
  description?: string;
  parentCollectionId?: string;
  workspaceId: string;
  createdBy: string;
  createdByUsername?: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  color?: string;
  orderIndex: number;
  hierarchyLevel: number;
  hierarchyPath: string;
  itemCount: number;
  items: CollectionItemDto[];
}

export interface CollectionItemDto {
  collectionItemId: string;
  itemType: string;
  itemReferenceId: string;
  itemTitle?: string;
  order: number;
  addedBy: string;
  addedByUsername?: string;
  addedAt: string;
}

export interface CreateCollectionDto {
  name: string;
  description?: string;
  parentCollectionId?: string;
  workspaceId: string;
  icon?: string;
  color?: string;
}

export interface UpdateCollectionDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface AddItemToCollectionDto {
  itemType: string;
  itemReferenceId: string;
  itemTitle?: string;
}

export interface ReorderCollectionItemDto {
  newOrder: number;
}

// ============================================================================
// COLLABORATION TYPES
// ============================================================================

export enum ResourceType {
  Document = 'Document',
  CodeSnippet = 'CodeSnippet',
  Diagram = 'Diagram',
}

export interface CollaborationSessionDto {
  sessionId: string;
  resourceType: ResourceType;
  resourceId: string;
  participants: ParticipantDto[];
  startedAt: string;
  isActive: boolean;
}

export interface ParticipantDto {
  userId: string;
  user?: UserDto;
  joinedAt: string;
  isActive: boolean;
  cursorPosition?: CursorPositionDto;
}

export interface CursorPositionDto {
  x: number;
  y: number;
  color: string;
}

export interface CommentDto {
  commentId: string;
  content: string;
  createdBy: string;
  createdByUser?: UserDto;
  createdAt: string;
  resourceType: ResourceType;
  resourceId: string;
  position?: PointDto;
  replyToId?: string;
  replies?: CommentDto[];
}

export interface CreateCommentDto {
  content: string;
  resourceType: ResourceType;
  resourceId: string;
  position?: PointDto;
  replyToId?: string;
}

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface TagDto {
  tagId: string;
  name: string;
  color?: string;
}

export interface PaginatedResultDto<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchResultDto {
  itemId: string;
  itemType: 'Document' | 'CodeSnippet' | 'Diagram';
  title: string;
  excerpt: string;
  score: number;
  highlightedFields: Record<string, string[]>;
}

export interface ApiErrorDto {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
  traceId?: string;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface DocumentFilterDto {
  status?: DocumentStatus;
  tags?: string[];
  createdBy?: string;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SnippetFilterDto {
  language?: string;
  isPublic?: boolean;
  tags?: string[];
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DiagramFilterDto {
  diagramType?: DiagramType;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}
