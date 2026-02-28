using System.Security.Claims;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Nexus.API.Infrastructure.Identity;
using Nexus.API.UseCases.Auth.DTOs;

namespace Nexus.API.Web.Endpoints.Auth;

/// <summary>
/// Update current user's profile
/// PUT /api/v1/auth/profile
/// </summary>
public class UpdateProfileEndpoint : EndpointWithoutRequest
{
  private readonly UserManager<ApplicationUser> _userManager;

  public UpdateProfileEndpoint(UserManager<ApplicationUser> userManager)
  {
    _userManager = userManager;
  }

  public override void Configure()
  {
    Put("/auth/profile");
    Roles("Viewer", "Editor", "Admin");

    Description(b => b
      .WithTags("Authentication")
      .WithSummary("Update current user profile")
      .WithDescription("Updates the authenticated user's profile information."));
  }

  public override async Task HandleAsync(CancellationToken ct)
  {
    var userId = User.FindFirstValue("uid");
    if (string.IsNullOrEmpty(userId))
    {
      HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "Unauthorized" }, ct);
      return;
    }

    var request = await HttpContext.Request.ReadFromJsonAsync<UpdateProfileRequest>(ct);
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

    user.FirstName = request.FirstName;
    user.LastName = request.LastName;
    user.AvatarUrl = request.AvatarUrl;
    user.Bio = request.Bio;
    user.Title = request.Title;
    user.Department = request.Department;

    var result = await _userManager.UpdateAsync(user);
    if (!result.Succeeded)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new
      {
        error = result.Errors.FirstOrDefault()?.Description ?? "Failed to update profile"
      }, ct);
      return;
    }

    HttpContext.Response.StatusCode = StatusCodes.Status200OK;
    await HttpContext.Response.WriteAsJsonAsync(new UserDto(
      user.Id,
      user.Email!,
      user.UserName!,
      user.FirstName,
      user.LastName,
      user.AvatarUrl,
      user.EmailConfirmed,
      user.TwoFactorEnabled,
      user.Bio,
      user.Title,
      user.Department,
      user.Theme,
      user.Language,
      user.NotificationsEnabled,
      user.EmailDigest), ct);
  }
}
