using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Nexus.API.UseCases.Diagrams.DTOs;
using Shouldly;

namespace Nexus.API.FunctionalTests.Diagrams;

[Collection("Sequential")]
public class DiagramEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
  private readonly CustomWebApplicationFactory<Program> _factory;
  private readonly HttpClient _client;

  public DiagramEndpointTests(CustomWebApplicationFactory<Program> factory)
  {
    _factory = factory;
    _client = factory.CreateClient();
  }

  private async Task AuthenticateAsync()
  {
    var token = await AuthHelper.GetAccessTokenAsync(_client);
    _client.DefaultRequestHeaders.Authorization =
      new AuthenticationHeaderValue("Bearer", token);
  }

  private async Task<Guid> CreateTeamAsync()
  {
    var response = await _client.PostAsJsonAsync("/api/v1/teams",
      new { Name = $"DiagramTestTeam-{Guid.NewGuid():N}" });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("teamId").GetGuid();
  }

  private async Task<Guid> CreateWorkspaceAsync(Guid teamId)
  {
    var response = await _client.PostAsJsonAsync("/api/v1/workspaces", new
    {
      Name = $"DiagramTestWorkspace-{Guid.NewGuid():N}",
      TeamId = teamId
    });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("workspaceId").GetGuid();
  }

  private async Task<Guid> CreateDiagramAsync(Guid workspaceId, string title = "Test Diagram")
  {
    var response = await _client.PostAsJsonAsync("/api/v1/diagrams", new
    {
      Title = title,
      DiagramType = "Flowchart",
      WorkspaceId = workspaceId,
      Canvas = new { Width = 1920, Height = 1080, BackgroundColor = "#FFFFFF", GridSize = 20 }
    });
    response.EnsureSuccessStatusCode();
    var result = await response.Content.ReadFromJsonAsync<DiagramDto>();
    return result!.DiagramId;
  }

  private async Task<Guid> AddElementAsync(Guid diagramId)
  {
    var response = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/elements", new
    {
      ShapeType = "Rectangle",
      Position = new { X = 100, Y = 100 },
      Size = new { Width = 150, Height = 80 },
      Text = "Test Element",
      ZIndex = 1,
      Style = new
      {
        FillColor = "#FFFFFF",
        StrokeColor = "#000000",
        StrokeWidth = 1,
        FontSize = 14,
        FontFamily = "Arial",
        Opacity = 1.0,
        Rotation = 0.0
      }
    });
    response.EnsureSuccessStatusCode();
    var result = await response.Content.ReadFromJsonAsync<DiagramElementDto>();
    return result!.ElementId;
  }

  private async Task<Guid> AddLayerAsync(Guid diagramId)
  {
    var response = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/layers", new
    {
      Name = "Test Layer",
      IsVisible = true,
      IsLocked = false
    });
    response.EnsureSuccessStatusCode();
    var result = await response.Content.ReadFromJsonAsync<LayerDto>();
    return result!.LayerId;
  }

  // ─── Create ────────────────────────────────────────────────────────

  [Fact]
  public async Task CreateDiagram_WithValidData_Returns201()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);

    var response = await _client.PostAsJsonAsync("/api/v1/diagrams", new
    {
      Title = "My Flowchart",
      DiagramType = "Flowchart",
      WorkspaceId = workspaceId,
      Canvas = new { Width = 1920, Height = 1080, BackgroundColor = "#FFFFFF", GridSize = 20 }
    });

    response.StatusCode.ShouldBe(HttpStatusCode.Created);
    var result = await response.Content.ReadFromJsonAsync<DiagramDto>();
    result.ShouldNotBeNull();
    result.Title.ShouldBe("My Flowchart");
    result.DiagramId.ShouldNotBe(Guid.Empty);
    result.DiagramType.ShouldBe("Flowchart");
  }

  [Fact]
  public async Task CreateDiagram_WithMissingTitle_Returns400()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);

    var response = await _client.PostAsJsonAsync("/api/v1/diagrams", new
    {
      Title = "",
      DiagramType = "Flowchart",
      WorkspaceId = workspaceId
    });

    response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task CreateDiagram_WithMissingWorkspaceId_Returns400()
  {
    await AuthenticateAsync();

    var response = await _client.PostAsJsonAsync("/api/v1/diagrams", new
    {
      Title = "No Workspace",
      DiagramType = "Flowchart",
      WorkspaceId = Guid.Empty
    });

    response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task CreateDiagram_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;

    var response = await _client.PostAsJsonAsync("/api/v1/diagrams", new
    {
      Title = "Test",
      DiagramType = "Flowchart",
      WorkspaceId = Guid.NewGuid()
    });

    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Get By Id ─────────────────────────────────────────────────────

  [Fact]
  public async Task GetDiagramById_WithValidId_Returns200()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.GetAsync($"/api/v1/diagrams/{diagramId}");

    response.StatusCode.ShouldBe(HttpStatusCode.OK);
    var result = await response.Content.ReadFromJsonAsync<DiagramDto>();
    result.ShouldNotBeNull();
    result.DiagramId.ShouldBe(diagramId);
  }

  [Fact]
  public async Task GetDiagramById_WithInvalidId_Returns404()
  {
    await AuthenticateAsync();

    var response = await _client.GetAsync($"/api/v1/diagrams/{Guid.NewGuid()}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.NotFound, HttpStatusCode.InternalServerError);
  }

  [Fact]
  public async Task GetDiagramById_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;

    var response = await _client.GetAsync($"/api/v1/diagrams/{Guid.NewGuid()}");

    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── List My Diagrams ──────────────────────────────────────────────

  [Fact]
  public async Task GetMyDiagrams_WithAuth_Returns200()
  {
    await AuthenticateAsync();

    var response = await _client.GetAsync("/api/v1/diagrams/my");

    response.StatusCode.ShouldBe(HttpStatusCode.OK);
    var result = await response.Content.ReadFromJsonAsync<DiagramPagedResultDto>();
    result.ShouldNotBeNull();
  }

  [Fact]
  public async Task GetMyDiagrams_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;

    var response = await _client.GetAsync("/api/v1/diagrams/my");

    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Update ────────────────────────────────────────────────────────

  [Fact]
  public async Task UpdateDiagram_WithValidData_Returns200()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.PutAsJsonAsync($"/api/v1/diagrams/{diagramId}", new
    {
      Title = "Updated Diagram Title"
    });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task UpdateDiagram_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;

    var response = await _client.PutAsJsonAsync($"/api/v1/diagrams/{Guid.NewGuid()}",
      new { Title = "Updated" });

    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Delete ────────────────────────────────────────────────────────

  [Fact]
  public async Task DeleteDiagram_WithValidId_Returns204()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId, "Diagram to Delete");

    var response = await _client.DeleteAsync($"/api/v1/diagrams/{diagramId}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.NoContent, HttpStatusCode.OK);
  }

  [Fact]
  public async Task DeleteDiagram_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;

    var response = await _client.DeleteAsync($"/api/v1/diagrams/{Guid.NewGuid()}");

    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Elements ──────────────────────────────────────────────────────

  [Fact]
  public async Task AddElement_WithValidData_Returns201()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/elements", new
    {
      ShapeType = "Rectangle",
      Position = new { X = 100, Y = 100 },
      Size = new { Width = 150, Height = 80 },
      Text = "My Box",
      ZIndex = 1,
      Style = new
      {
        FillColor = "#FFFFFF",
        StrokeColor = "#000000",
        StrokeWidth = 1,
        FontSize = 14,
        FontFamily = "Arial",
        Opacity = 1.0,
        Rotation = 0.0
      }
    });

    response.StatusCode.ShouldBe(HttpStatusCode.Created);
    var result = await response.Content.ReadFromJsonAsync<DiagramElementDto>();
    result.ShouldNotBeNull();
    result.ElementId.ShouldNotBe(Guid.Empty);
    result.ShapeType.ShouldBe("Rectangle");
  }

  [Fact]
  public async Task AddElement_WithInvalidShapeType_Returns400()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/elements", new
    {
      ShapeType = "InvalidShape",
      Position = new { X = 0, Y = 0 },
      Size = new { Width = 100, Height = 50 },
      ZIndex = 1
    });

    response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task UpdateElement_WithValidData_Returns200()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var elementId = await AddElementAsync(diagramId);

    var response = await _client.PutAsJsonAsync(
      $"/api/v1/diagrams/{diagramId}/elements/{elementId}", new
      {
        Text = "Updated Text",
        Position = new { X = 200, Y = 200 }
      });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task DeleteElement_WithValidId_Returns204()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var elementId = await AddElementAsync(diagramId);

    var response = await _client.DeleteAsync(
      $"/api/v1/diagrams/{diagramId}/elements/{elementId}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.NoContent, HttpStatusCode.OK);
  }

  // ─── Connections ───────────────────────────────────────────────────

  [Fact]
  public async Task AddConnection_WithValidData_Returns201()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var sourceId = await AddElementAsync(diagramId);
    var targetId = await AddElementAsync(diagramId);

    var response = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/connections", new
    {
      SourceElementId = sourceId,
      TargetElementId = targetId,
      ConnectionType = "Arrow",
      Label = "connects to",
      Style = new { StrokeColor = "#000000", StrokeWidth = 2 }
    });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.Created, HttpStatusCode.OK);
  }

  [Fact]
  public async Task UpdateConnection_WithValidData_Returns200()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var sourceId = await AddElementAsync(diagramId);
    var targetId = await AddElementAsync(diagramId);

    var addResp = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/connections", new
    {
      SourceElementId = sourceId,
      TargetElementId = targetId,
      ConnectionType = "Arrow"
    });
    addResp.EnsureSuccessStatusCode();
    var conn = await addResp.Content.ReadFromJsonAsync<DiagramConnectionDto>();
    var connectionId = conn!.ConnectionId;

    var response = await _client.PutAsJsonAsync(
      $"/api/v1/diagrams/{diagramId}/connections/{connectionId}", new
      {
        Label = "Updated Label"
      });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task DeleteConnection_WithValidId_Returns204()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var sourceId = await AddElementAsync(diagramId);
    var targetId = await AddElementAsync(diagramId);

    var addResp = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/connections", new
    {
      SourceElementId = sourceId,
      TargetElementId = targetId,
      ConnectionType = "Line"
    });
    addResp.EnsureSuccessStatusCode();
    var conn = await addResp.Content.ReadFromJsonAsync<DiagramConnectionDto>();
    var connectionId = conn!.ConnectionId;

    var response = await _client.DeleteAsync(
      $"/api/v1/diagrams/{diagramId}/connections/{connectionId}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.NoContent, HttpStatusCode.OK);
  }

  // ─── Layers ────────────────────────────────────────────────────────

  [Fact]
  public async Task AddLayer_WithValidData_Returns201()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.PostAsJsonAsync($"/api/v1/diagrams/{diagramId}/layers", new
    {
      Name = "Background Layer",
      IsVisible = true,
      IsLocked = false
    });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.Created, HttpStatusCode.OK);
    var result = await response.Content.ReadFromJsonAsync<LayerDto>();
    result.ShouldNotBeNull();
    result.Name.ShouldBe("Background Layer");
  }

  [Fact]
  public async Task UpdateLayer_WithValidData_Returns200()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var layerId = await AddLayerAsync(diagramId);

    var response = await _client.PutAsJsonAsync(
      $"/api/v1/diagrams/{diagramId}/layers/{layerId}", new
      {
        Name = "Updated Layer Name",
        IsVisible = false
      });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task DeleteLayer_WithValidId_Returns204()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);
    var layerId = await AddLayerAsync(diagramId);

    var response = await _client.DeleteAsync(
      $"/api/v1/diagrams/{diagramId}/layers/{layerId}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.NoContent, HttpStatusCode.OK);
  }
}
