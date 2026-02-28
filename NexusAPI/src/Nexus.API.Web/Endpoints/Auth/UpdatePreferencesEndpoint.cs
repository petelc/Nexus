using System.Security.Claims;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Nexus.API.Infrastructure.Identity;
using Nexus.API.UseCases.Auth.DTOs;

namespace Nexus.API.Web.Endpoints.Auth;

/// <summary>
/// Update current user's preferences (theme, notifications, etc.)
/// PUT /api/v1/auth/preferences
/// </summary>
public class UpdatePreferencesEndpoint : EndpointWithoutRequest
{
  private readonly UserManager<ApplicationUser> _userManager;

  public UpdatePreferencesEndpoint(UserManager<ApplicationUser> userManager)
  {
    _userManager = userManager;
  }

  public override void Configure()
  {
    Put("/auth/preferences");
    Roles("Viewer", "Editor", "Admin");

    Description(b => b
      .WithTags("Authentication")
      .WithSummary("Update user preferences")
      .WithDescription("Updates the authenticated user's preferences (theme, language, notifications)."));
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

    var request = await HttpContext.Request.ReadFromJsonAsync<UpdatePreferencesRequest>(ct);
    if (request == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "Invalid request body" }, ct);
      return;
    }

    var validThemes = new[] { "Light", "Dark", "Auto" };
    var validDigests = new[] { "Daily", "Weekly", "None" };

    if (!validThemes.Contains(request.Theme, StringComparer.OrdinalIgnoreCase))
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "Theme must be Light, Dark, or Auto" }, ct);
      return;
    }

    if (!validDigests.Contains(request.EmailDigest, StringComparer.OrdinalIgnoreCase))
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "EmailDigest must be Daily, Weekly, or None" }, ct);
      return;
    }

    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "User not found" }, ct);
      return;
    }

    user.Theme = request.Theme;
    user.Language = request.Language;
    user.NotificationsEnabled = request.NotificationsEnabled;
    user.EmailDigest = request.EmailDigest;

    var result = await _userManager.UpdateAsync(user);
    if (!result.Succeeded)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new
      {
        error = result.Errors.FirstOrDefault()?.Description ?? "Failed to update preferences"
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
