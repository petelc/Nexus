using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Nexus.API.Infrastructure.Identity;
using Nexus.API.UseCases.Auth.DTOs;

namespace Nexus.API.Web.Endpoints.Admin;

/// <summary>
/// Update a user's roles
/// PUT /api/v1/admin/users/{userId}/roles
/// </summary>
public class UpdateUserRolesEndpoint : EndpointWithoutRequest
{
  private readonly UserManager<ApplicationUser> _userManager;

  private static readonly HashSet<string> ValidRoles =
    new(["Viewer", "Editor", "Admin", "Guest"], StringComparer.OrdinalIgnoreCase);

  public UpdateUserRolesEndpoint(UserManager<ApplicationUser> userManager)
  {
    _userManager = userManager;
  }

  public override void Configure()
  {
    Put("/admin/users/{userId}/roles");
    Roles("Admin");

    Description(b => b
      .WithTags("Admin")
      .WithSummary("Update user roles")
      .WithDescription("Replaces a user's roles with the provided list. Admin only."));
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

    var request = await HttpContext.Request.ReadFromJsonAsync<UpdateUserRolesRequest>(ct);
    if (request == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "Invalid request body" }, ct);
      return;
    }

    var invalidRoles = request.Roles.Where(r => !ValidRoles.Contains(r)).ToList();
    if (invalidRoles.Count > 0)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new
      {
        error = $"Invalid roles: {string.Join(", ", invalidRoles)}. Valid roles: Viewer, Editor, Admin, Guest"
      }, ct);
      return;
    }

    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
      await HttpContext.Response.WriteAsJsonAsync(new { error = "User not found" }, ct);
      return;
    }

    var currentRoles = await _userManager.GetRolesAsync(user);
    var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
    if (!removeResult.Succeeded)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      await HttpContext.Response.WriteAsJsonAsync(new
      {
        error = removeResult.Errors.FirstOrDefault()?.Description ?? "Failed to remove existing roles"
      }, ct);
      return;
    }

    if (request.Roles.Count > 0)
    {
      var addResult = await _userManager.AddToRolesAsync(user, request.Roles);
      if (!addResult.Succeeded)
      {
        HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        await HttpContext.Response.WriteAsJsonAsync(new
        {
          error = addResult.Errors.FirstOrDefault()?.Description ?? "Failed to assign roles"
        }, ct);
        return;
      }
    }

    var updatedRoles = await _userManager.GetRolesAsync(user);
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
      updatedRoles), ct);
  }
}
