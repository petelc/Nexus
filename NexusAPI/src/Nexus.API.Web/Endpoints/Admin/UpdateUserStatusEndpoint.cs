using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Nexus.API.Infrastructure.Identity;
using Nexus.API.UseCases.Auth.DTOs;

namespace Nexus.API.Web.Endpoints.Admin;

/// <summary>
/// Activate or deactivate a user account
/// PUT /api/v1/admin/users/{userId}/status
/// </summary>
public class UpdateUserStatusEndpoint : EndpointWithoutRequest
{
  private readonly UserManager<ApplicationUser> _userManager;

  public UpdateUserStatusEndpoint(UserManager<ApplicationUser> userManager)
  {
    _userManager = userManager;
  }

  public override void Configure()
  {
    Put("/admin/users/{userId}/status");
    Roles("Admin");

    Description(b => b
      .WithTags("Admin")
      .WithSummary("Activate or deactivate a user")
      .WithDescription("Sets the IsActive flag on a user account. Admin only."));
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

    var request = await HttpContext.Request.ReadFromJsonAsync<UpdateUserStatusRequest>(ct);
    if (request == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "Invalid request body" }, ct);
      return;
    }

    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "User not found" }, ct);
      return;
    }

    user.IsActive = request.IsActive;

    var result = await _userManager.UpdateAsync(user);
    if (!result.Succeeded)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new
      {
        error = result.Errors.FirstOrDefault()?.Description ?? "Failed to update user status"
      }, ct);
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
