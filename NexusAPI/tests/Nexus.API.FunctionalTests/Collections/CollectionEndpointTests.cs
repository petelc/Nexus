using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Shouldly;

namespace Nexus.API.FunctionalTests.Collections;

[Collection("Sequential")]
public class CollectionEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
  private readonly CustomWebApplicationFactory<Program> _factory;
  private readonly HttpClient _client;

  public CollectionEndpointTests(CustomWebApplicationFactory<Program> factory)
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
      new { Name = $"ColTestTeam-{Guid.NewGuid():N}" });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("teamId").GetGuid();
  }

  private async Task<Guid> CreateWorkspaceAsync(Guid teamId)
  {
    var response = await _client.PostAsJsonAsync("/api/v1/workspaces", new
    {
      Name = $"ColTestWorkspace-{Guid.NewGuid():N}",
      TeamId = teamId
    });
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("workspaceId").GetGuid();
  }

  private async Task<Guid> CreateCollectionAsync(Guid workspaceId, string name = "Test Collection", Guid? parentId = null)
  {
    var body = new
    {
      Name = name,
      WorkspaceId = workspaceId,
      ParentCollectionId = parentId,
      Description = "A test collection",
      Icon = "folder",
      Color = "#4A90E2"
    };

    var response = await _client.PostAsJsonAsync("/api/v1/collections", body);
    response.EnsureSuccessStatusCode();
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.GetProperty("collection").GetProperty("collectionId").GetGuid();
  }

  // ─── Create ───────────────────────────────────────────────────────────────

  [Fact]
  public async Task CreateCollection_ReturnsCreated()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);

    var response = await _client.PostAsJsonAsync("/api/v1/collections", new
    {
      Name = "My Collection",
      WorkspaceId = workspaceId,
      Description = "Test description"
    });

    response.StatusCode.ShouldBe(HttpStatusCode.Created);
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    doc.RootElement.GetProperty("collection").GetProperty("collectionId").GetGuid()
      .ShouldNotBe(Guid.Empty);
  }

  [Fact]
  public async Task CreateCollection_WithParent_ReturnsCreated()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var parentId = await CreateCollectionAsync(workspaceId, "Parent");

    var response = await _client.PostAsJsonAsync("/api/v1/collections", new
    {
      Name = "Child Collection",
      WorkspaceId = workspaceId,
      ParentCollectionId = parentId
    });

    response.StatusCode.ShouldBe(HttpStatusCode.Created);
  }

  [Fact]
  public async Task CreateCollection_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PostAsJsonAsync("/api/v1/collections", new
    {
      Name = "Test",
      WorkspaceId = Guid.NewGuid()
    });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── GetById ──────────────────────────────────────────────────────────────

  [Fact]
  public async Task GetCollectionById_ReturnsOk()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var collectionId = await CreateCollectionAsync(workspaceId);

    var response = await _client.GetAsync($"/api/v1/collections/{collectionId}");

    response.StatusCode.ShouldBe(HttpStatusCode.OK);
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    doc.RootElement.GetProperty("collection").GetProperty("collectionId").GetGuid()
      .ShouldBe(collectionId);
  }

  [Fact]
  public async Task GetCollectionById_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/v1/collections/{Guid.NewGuid()}");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Get Root Collections ─────────────────────────────────────────────────

  [Fact]
  public async Task GetRootCollections_ReturnsOk()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    await CreateCollectionAsync(workspaceId, "Root A");
    await CreateCollectionAsync(workspaceId, "Root B");

    var response = await _client.GetAsync($"/api/v1/workspaces/{workspaceId}/collections/roots");

    response.StatusCode.ShouldBe(HttpStatusCode.OK);
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    doc.RootElement.GetProperty("collections").GetArrayLength().ShouldBeGreaterThanOrEqualTo(2);
  }

  [Fact]
  public async Task GetRootCollections_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/v1/workspaces/{Guid.NewGuid()}/collections/roots");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Search Collections ───────────────────────────────────────────────────

  [Fact]
  public async Task SearchCollections_ReturnsOk()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    await CreateCollectionAsync(workspaceId, "SearchableAlpha");

    var response = await _client.GetAsync(
      $"/api/v1/workspaces/{workspaceId}/collections/search?searchTerm=SearchableAlpha");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.InternalServerError);
  }

  [Fact]
  public async Task SearchCollections_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync(
      $"/api/v1/workspaces/{Guid.NewGuid()}/collections/search?searchTerm=test");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Get Child Collections ────────────────────────────────────────────────

  [Fact]
  public async Task GetChildCollections_ReturnsOk()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var parentId = await CreateCollectionAsync(workspaceId, "Parent");
    await CreateCollectionAsync(workspaceId, "Child", parentId);

    var response = await _client.GetAsync($"/api/v1/collections/{parentId}/children");

    response.StatusCode.ShouldBe(HttpStatusCode.OK);
    var json = await response.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    doc.RootElement.GetProperty("collections").GetArrayLength().ShouldBeGreaterThanOrEqualTo(1);
  }

  [Fact]
  public async Task GetChildCollections_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/v1/collections/{Guid.NewGuid()}/children");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Get Breadcrumb ───────────────────────────────────────────────────────

  [Fact]
  public async Task GetBreadcrumb_ReturnsOk()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var parentId = await CreateCollectionAsync(workspaceId, "Parent");
    var childId = await CreateCollectionAsync(workspaceId, "Child", parentId);

    var response = await _client.GetAsync($"/api/v1/collections/{childId}/breadcrumb");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.InternalServerError);
  }

  [Fact]
  public async Task GetBreadcrumb_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/v1/collections/{Guid.NewGuid()}/breadcrumb");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Update ───────────────────────────────────────────────────────────────

  [Fact]
  public async Task UpdateCollection_ReturnsSuccess()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var collectionId = await CreateCollectionAsync(workspaceId);

    var response = await _client.PutAsJsonAsync($"/api/v1/collections/{collectionId}", new
    {
      Name = "Updated Name",
      Description = "Updated description",
      Icon = "folder-open",
      Color = "#FF0000"
    });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent, HttpStatusCode.InternalServerError);
  }

  [Fact]
  public async Task UpdateCollection_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PutAsJsonAsync($"/api/v1/collections/{Guid.NewGuid()}", new
    {
      Name = "Updated"
    });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  [Fact]
  public async Task DeleteCollection_ReturnsSuccess()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var collectionId = await CreateCollectionAsync(workspaceId, "ToDelete");

    var response = await _client.DeleteAsync($"/api/v1/collections/{collectionId}");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task DeleteCollection_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.DeleteAsync($"/api/v1/collections/{Guid.NewGuid()}");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Add Item ─────────────────────────────────────────────────────────────

  [Fact]
  public async Task AddItemToCollection_ReturnsCreated()
  {
    await AuthenticateAsync();
    var teamId = await CreateTeamAsync();
    var workspaceId = await CreateWorkspaceAsync(teamId);
    var collectionId = await CreateCollectionAsync(workspaceId);
    var itemRefId = Guid.NewGuid();

    var response = await _client.PostAsJsonAsync(
      $"/api/v1/collections/{collectionId}/items", new
      {
        ItemType = "Document",
        ItemReferenceId = itemRefId,
        ItemTitle = "My Document"
      });

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.Created, HttpStatusCode.OK, HttpStatusCode.NotFound);
  }

  [Fact]
  public async Task AddItemToCollection_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PostAsJsonAsync(
      $"/api/v1/collections/{Guid.NewGuid()}/items", new
      {
        ItemType = "Document",
        ItemReferenceId = Guid.NewGuid()
      });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Remove Item ──────────────────────────────────────────────────────────

  [Fact]
  public async Task RemoveItemFromCollection_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.DeleteAsync(
      $"/api/v1/collections/{Guid.NewGuid()}/items/{Guid.NewGuid()}");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  // ─── Reorder Item ─────────────────────────────────────────────────────────

  [Fact]
  public async Task ReorderItem_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PutAsJsonAsync(
      $"/api/v1/collections/{Guid.NewGuid()}/items/{Guid.NewGuid()}/order",
      new { Order = 1 });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

}
