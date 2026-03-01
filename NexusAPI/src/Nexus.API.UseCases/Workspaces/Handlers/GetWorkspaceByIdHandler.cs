using Ardalis.Result;
using Nexus.API.Core.Aggregates.UserAggregate;
using Nexus.API.Core.Aggregates.WorkspaceAggregate;
using Nexus.API.Core.Interfaces;
using Nexus.API.Core.ValueObjects;
using Nexus.API.UseCases.Workspaces.DTOs;
using Nexus.API.UseCases.Workspaces.Queries;

namespace Nexus.API.UseCases.Workspaces.Handlers;

/// <summary>
/// Handler for getting a workspace by ID
/// </summary>
public class GetWorkspaceByIdHandler : IRequestHandler<GetWorkspaceByIdQuery, Result<WorkspaceDto>>
{
  private readonly IWorkspaceRepository _workspaceRepository;
  private readonly ICurrentUserService _currentUserService;
  private readonly IDocumentRepository _documentRepository;
  private readonly ICodeSnippetRepository _snippetRepository;
  private readonly IDiagramRepository _diagramRepository;

  public GetWorkspaceByIdHandler(
    IWorkspaceRepository workspaceRepository,
    ICurrentUserService currentUserService,
    IDocumentRepository documentRepository,
    ICodeSnippetRepository snippetRepository,
    IDiagramRepository diagramRepository)
  {
    _workspaceRepository = workspaceRepository;
    _currentUserService = currentUserService;
    _documentRepository = documentRepository;
    _snippetRepository = snippetRepository;
    _diagramRepository = diagramRepository;
  }

  public async Task<Result<WorkspaceDto>> Handle(
    GetWorkspaceByIdQuery request,
    CancellationToken cancellationToken)
  {
    var userId = _currentUserService.UserId;
    if (userId == null || userId == Guid.Empty)
      return Result.Unauthorized();

    // Get workspace
    var workspaceId = WorkspaceId.Create(request.WorkspaceId);
    var workspace = request.IncludeMembers
      ? await _workspaceRepository.GetByIdWithMembersAsync(workspaceId, cancellationToken)
      : await _workspaceRepository.GetByIdAsync(workspaceId, cancellationToken);

    if (workspace == null)
      return Result.NotFound("Workspace not found");

    // Check if user is a member
    if (!workspace.IsMember(UserId.Create(userId.Value)))
      return Result.Forbidden();

    var docCount = await _documentRepository.CountByWorkspaceIdAsync(workspace.Id.Value, cancellationToken);
    var snippetCount = await _snippetRepository.CountByWorkspaceIdAsync(workspace.Id.Value, cancellationToken);
    var diagramCount = await _diagramRepository.CountByWorkspaceIdAsync(workspace.Id.Value, cancellationToken);

    // Map to DTO
    var dto = new WorkspaceDto
    {
      WorkspaceId = workspace.Id.Value,
      Name = workspace.Name,
      Description = workspace.Description,
      TeamId = workspace.TeamId.Value,
      CreatedBy = workspace.CreatedBy.Value,
      CreatedAt = workspace.CreatedAt,
      UpdatedAt = workspace.UpdatedAt,
      MemberCount = workspace.Members.Count(m => m.IsActive),
      DocumentCount = docCount,
      SnippetCount = snippetCount,
      DiagramCount = diagramCount,
      Members = request.IncludeMembers
        ? workspace.Members
            .Where(m => m.IsActive)
            .Select(m => new WorkspaceMemberDto
            {
              MemberId = m.Id.Value,
              UserId = m.UserId.Value,
              Role = m.Role.ToString(),
              JoinedAt = m.JoinedAt,
              InvitedBy = m.InvitedBy?.Value,
              IsActive = m.IsActive
            }).ToList()
        : new List<WorkspaceMemberDto>()
    };

    return Result.Success(dto);
  }
}
