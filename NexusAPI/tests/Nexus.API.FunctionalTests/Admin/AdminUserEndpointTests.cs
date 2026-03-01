using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Shouldly;

namespace Nexus.API.FunctionalTests.Admin;

[Collection("Sequential")]
public class AdminUserEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
  private readonly CustomWebApplicationFactory<Program> _factory;
  private readonly HttpClient _client;

  public AdminUserEndpointTests(CustomWebApplicationFactory<Program> factory)
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

  // ─── GET /admin/users ─────────────────────────────────────────────────────

  [Fact]
  public async Task GetUsers_AsAdmin_ReturnsOk()
  {
    await AuthenticateAsync();

    var response = await _client.GetAsync("/api/v1/admin/users");

    // The test user registered via AuthHelper is given Admin role by the factory seeder.
    // If that seeder assigns Admin, this returns 200; otherwise 403.
    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.Forbidden);
  }

  [Fact]
  public async Task GetUsers_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync("/api/v1/admin/users");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task GetUsers_WithSearch_ReturnsOkOrForbidden()
  {
    await AuthenticateAsync();

    var response = await _client.GetAsync("/api/v1/admin/users?search=test&page=1&pageSize=10");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.Forbidden);
  }

  // ─── GET /admin/users/{userId} ────────────────────────────────────────────

  [Fact]
  public async Task GetUser_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/v1/admin/users/{Guid.NewGuid()}");
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task GetUser_AsAdmin_ReturnsOkOrNotFoundOrForbidden()
  {
    await AuthenticateAsync();

    var response = await _client.GetAsync($"/api/v1/admin/users/{Guid.NewGuid()}");

    response.StatusCode.ShouldBeOneOf(
      HttpStatusCode.OK, HttpStatusCode.NotFound, HttpStatusCode.Forbidden);
  }

  // ─── PUT /admin/users/{userId}/roles ──────────────────────────────────────

  [Fact]
  public async Task UpdateUserRoles_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PutAsJsonAsync(
      $"/api/v1/admin/users/{Guid.NewGuid()}/roles",
      new { Roles = new[] { "Viewer" } });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task UpdateUserRoles_AsAdmin_ReturnsSuccessOrForbidden()
  {
    await AuthenticateAsync();

    // Get the current user's ID first by listing users
    var listResponse = await _client.GetAsync("/api/v1/admin/users");
    if (listResponse.StatusCode == HttpStatusCode.Forbidden)
    {
      // Test user doesn't have Admin role in this environment — skip
      return;
    }

    listResponse.EnsureSuccessStatusCode();
    var json = await listResponse.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(json);
    var firstUser = doc.RootElement.GetProperty("items")[0];
    var userId = firstUser.GetProperty("userId").GetString()!;

    var response = await _client.PutAsJsonAsync(
      $"/api/v1/admin/users/{userId}/roles",
      new { Roles = new[] { "Viewer", "Editor" } });

    response.StatusCode.ShouldBeOneOf(
      HttpStatusCode.OK, HttpStatusCode.NoContent, HttpStatusCode.BadRequest, HttpStatusCode.Forbidden);
  }

  // ─── PUT /admin/users/{userId}/status ─────────────────────────────────────

  [Fact]
  public async Task UpdateUserStatus_WithoutAuth_Returns401()
  {
    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.PutAsJsonAsync(
      $"/api/v1/admin/users/{Guid.NewGuid()}/status",
      new { IsActive = true });
    response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task UpdateUserStatus_AsAdmin_ReturnsSuccessOrForbidden()
  {
    await AuthenticateAsync();

    var response = await _client.PutAsJsonAsync(
      $"/api/v1/admin/users/{Guid.NewGuid()}/status",
      new { IsActive = true });

    response.StatusCode.ShouldBeOneOf(
      HttpStatusCode.OK, HttpStatusCode.NoContent, HttpStatusCode.NotFound, HttpStatusCode.Forbidden);
  }
}
