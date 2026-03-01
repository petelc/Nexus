using Ardalis.Result;
using Nexus.API.Core.Aggregates.UserAggregate;
using Nexus.API.Core.Aggregates.WorkspaceAggregate;
using Nexus.API.Core.Interfaces;
using Nexus.API.Core.ValueObjects;
using Nexus.API.UseCases.Workspaces.DTOs;
using Nexus.API.UseCases.Workspaces.Queries;

namespace Nexus.API.UseCases.Workspaces.Handlers;

/// <summary>
/// Handler for getting all workspaces for the current user
/// </summary>
public class GetUserWorkspacesHandler : IRequestHandler<GetUserWorkspacesQuery, Result<List<WorkspaceDto>>>
{
  private readonly IWorkspaceRepository _workspaceRepository;
  private readonly ICurrentUserService _currentUserService;
  private readonly IDocumentRepository _documentRepository;
  private readonly ICodeSnippetRepository _snippetRepository;
  private readonly IDiagramRepository _diagramRepository;

  public GetUserWorkspacesHandler(
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

  public async Task<Result<List<WorkspaceDto>>> Handle(
    GetUserWorkspacesQuery request,
    CancellationToken cancellationToken)
  {
    var userId = _currentUserService.UserId;
    if (userId == null || userId == Guid.Empty)
      return Result.Unauthorized();

    // Get workspaces
    var workspaces = await _workspaceRepository.GetByUserIdAsync(
      UserId.Create(userId.Value),
      cancellationToken);

    // Map to DTOs with content counts
    var dtos = new List<WorkspaceDto>();
    foreach (var w in workspaces)
    {
      var docCount = await _documentRepository.CountByWorkspaceIdAsync(w.Id.Value, cancellationToken);
      var snippetCount = await _snippetRepository.CountByWorkspaceIdAsync(w.Id.Value, cancellationToken);
      var diagramCount = await _diagramRepository.CountByWorkspaceIdAsync(w.Id.Value, cancellationToken);

      dtos.Add(new WorkspaceDto
      {
        WorkspaceId = w.Id.Value,
        Name = w.Name,
        Description = w.Description,
        TeamId = w.TeamId.Value,
        CreatedBy = w.CreatedBy.Value,
        CreatedAt = w.CreatedAt,
        UpdatedAt = w.UpdatedAt,
        MemberCount = w.Members.Count(m => m.IsActive),
        DocumentCount = docCount,
        SnippetCount = snippetCount,
        DiagramCount = diagramCount,
        Members = new List<WorkspaceMemberDto>() // Don't include members in list view
      });
    }

    return Result.Success(dtos);
  }
}
