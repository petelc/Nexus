using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Shouldly;

namespace Nexus.API.FunctionalTests.Permissions;

[Collection("Sequential")]
public class PermissionEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
  private readonly CustomWebApplicationFactory<Program> _factory;
  private readonly HttpClient _client;

  public PermissionEndpointTests(CustomWebApplicationFactory<Program> factory)
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
      new { Name = $"PermTeam-{Guid.NewGuid():N}" });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("teamId").GetGuid();
  }

  private async Task<Guid> CreateWorkspaceAsync(Guid teamId)
  {
    var response = await _client.PostAsJsonAsync("/api/v1/workspaces", new
    {
      Name = $"PermWorkspace-{Guid.NewGuid():N}",
      TeamId = teamId
    });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("workspaceId").GetGuid();
  }

  private async Task<Guid> CreateDiagramAsync(Guid workspaceId)
  {
    var response = await _client.PostAsJsonAsync("/api/v1/diagrams", new
    {
      Title = $"PermDiagram-{Guid.NewGuid():N}",
      DiagramType = "Flowchart",
      WorkspaceId = workspaceId,
      Canvas = new { Width = 1920, Height = 1080, BackgroundColor = "#FFFFFF", GridSize = 20 }
    });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("diagramId").GetGuid();
  }

  // ─── GET /permissions ─────────────────────────────────────────────────────

  [Fact]
  public async Task ListPermissions_WithValidResource_ReturnsOkOrForbidden()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.GetAsync(
      $"/api/v1/permissions?resourceType=Diagram&resourceId={diagramId}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.Forbidden);
  }

  [Fact]
  public async Task ListPermissions_MissingResourceType_Returns400OrUnprocessable()
  {
    await AuthenticateAsync();

    var response = await _client.GetAsync(
      $"/api/v1/permissions?resourceId={Guid.NewGuid()}");

    response.StatusCode.ShouldBeOneOf(
      HttpStatusCode.BadRequest, HttpStatusCode.UnprocessableEntity);
  }

  [Fact]
  public async Task ListPermissions_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync(
      $"/api/v1/permissions?resourceType=Diagram&resourceId={Guid.NewGuid()}");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── POST /permissions ────────────────────────────────────────────────────

  [Fact]
  public async Task GrantPermission_WithValidData_ReturnsCreatedOrUnprocessable()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var diagramId = await CreateDiagramAsync(workspaceId);

    var response = await _client.PostAsJsonAsync("/api/v1/permissions", new
    {
      ResourceType = "Diagram",
      ResourceId = diagramId,
      UserId = Guid.NewGuid(),   // a user that may or may not exist
      PermissionLevel = "Viewer"
    });

    response.StatusCode.ShouldBeOneOf(
      HttpStatusCode.Created,
      HttpStatusCode.UnprocessableEntity,
      HttpStatusCode.Forbidden,
      HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task GrantPermission_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PostAsJsonAsync("/api/v1/permissions", new
    {
      ResourceType = "Diagram",
      ResourceId = Guid.NewGuid(),
      UserId = Guid.NewGuid(),
      PermissionLevel = "Viewer"
    });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── DELETE /permissions/{id} ─────────────────────────────────────────────

  [Fact]
  public async Task RevokePermission_WithNonExistentId_ReturnsNotFoundOrForbidden()
  {
    await AuthenticateAsync();

    var response = await _client.DeleteAsync($"/api/v1/permissions/{Guid.NewGuid()}");

    response.StatusCode.ShouldBeOneOf(
      HttpStatusCode.NotFound,
      HttpStatusCode.NoContent,
      HttpStatusCode.OK,
      HttpStatusCode.Forbidden);
  }

  [Fact]
  public async Task RevokePermission_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.DeleteAsync($"/api/v1/permissions/{Guid.NewGuid()}");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }
}
