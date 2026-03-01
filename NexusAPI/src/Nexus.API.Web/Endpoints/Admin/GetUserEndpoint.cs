using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Nexus.API.Infrastructure.Identity;
using Nexus.API.UseCases.Auth.DTOs;

namespace Nexus.API.Web.Endpoints.Admin;

/// <summary>
/// Get a single user by ID
/// GET /api/v1/admin/users/{userId}
/// </summary>
public class GetUserEndpoint : EndpointWithoutRequest
{
  private readonly UserManager<ApplicationUser> _userManager;

  public GetUserEndpoint(UserManager<ApplicationUser> userManager)
  {
    _userManager = userManager;
  }

  public override void Configure()
  {
    Get("/admin/users/{userId}");
    Roles("Admin");

    Description(b => b
      .WithTags("Admin")
      .WithSummary("Get user by ID")
      .WithDescription("Returns a single user's details including roles. Admin only."));
  }

  public override async Task HandleAsync(CancellationToken ct)
  {
    var userId = Route<string>("userId");
    if (string.IsNullOrEmpty(userId))
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "userId is required" }, ct);
      return;
    }

    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "User not found" }, ct);
      return;
    }

    var roles = await _userManager.GetRolesAsync(user);

    HttpContext.Response.StatusCode = StatusCodes.Status200OK;
    await HttpContext.Response.WriteAsJsonAsync(new AdminUserDto(
      user.Id,
      user.Email!,
      user.UserName!,
      user.FirstName,
      user.LastName,
      user.AvatarUrl,
      user.EmailConfirmed,
      user.TwoFactorEnabled,
      user.IsActive,
      user.CreatedAt,
      user.LastLoginAt,
      roles), ct);
  }
}
