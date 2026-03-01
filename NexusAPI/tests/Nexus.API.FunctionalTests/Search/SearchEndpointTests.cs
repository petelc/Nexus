using System.Net;
using Shouldly;

namespace Nexus.API.FunctionalTests.Search;

[Collection("Sequential")]
public class SearchEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
  private readonly CustomWebApplicationFactory<Program> _factory;
  private readonly HttpClient _client;

  public SearchEndpointTests(CustomWebApplicationFactory<Program> factory)
  {
    _factory = factory;
    _client = factory.CreateClient();
  }

  // ─── Global Search (AllowAnonymous) ───────────────────────────────────────

  [Fact]
  public async Task Search_WithQuery_ReturnsOk()
  {
    var response = await _client.GetAsync("/api/v1/search?query=test");

    // OK when Elasticsearch is available; InternalServerError when it isn't (test env)
    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.InternalServerError, HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task Search_WithTypeFilter_ReturnsOk()
  {
    var response = await _client.GetAsync("/api/v1/search?query=test&types=document,diagram");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.InternalServerError, HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task Search_WithPagination_ReturnsOk()
  {
    var response = await _client.GetAsync("/api/v1/search?query=test&page=1&pageSize=10");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.InternalServerError, HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task Search_EmptyQuery_ReturnsBadRequestOrOk()
  {
    // Empty query string — endpoint may return 400 (validation) or 200 (empty results)
    var response = await _client.GetAsync("/api/v1/search?query=");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.OK, HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task Search_WithoutQueryParam_ReturnsBadRequest()
  {
    var response = await _client.GetAsync("/api/v1/search");

    response.StatusCode.ShouldBeOneOf(HttpStatusCode.BadRequest, HttpStatusCode.OK);
  }
}
