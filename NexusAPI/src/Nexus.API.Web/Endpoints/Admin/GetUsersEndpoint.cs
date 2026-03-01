using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Nexus.API.Infrastructure.Identity;
using Nexus.API.UseCases.Auth.DTOs;

namespace Nexus.API.Web.Endpoints.Admin;

/// <summary>
/// List all users (paginated)
/// GET /api/v1/admin/users?page=1&amp;pageSize=20&amp;search=...
/// </summary>
public class GetUsersEndpoint : EndpointWithoutRequest
{
  private readonly UserManager<ApplicationUser> _userManager;

  public GetUsersEndpoint(UserManager<ApplicationUser> userManager)
  {
    _userManager = userManager;
  }

  public override void Configure()
  {
    Get("/admin/users");
    Roles("Admin");

    Description(b => b
      .WithTags("Admin")
      .WithSummary("List all users")
      .WithDescription("Returns a paginated list of all users. Admin only."));
  }

  public override async Task HandleAsync(CancellationToken ct)
  {
    var page = int.TryParse(HttpContext.Request.Query["page"], out var p) ? Math.Max(1, p) : 1;
    var pageSize = int.TryParse(HttpContext.Request.Query["pageSize"], out var ps) ? Math.Clamp(ps, 1, 100) : 20;
    var search = HttpContext.Request.Query["search"].ToString();

    var query = _userManager.Users.AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
      var term = search.ToLower();
      query = query.Where(u =>
        u.Email!.ToLower().Contains(term) ||
        u.UserName!.ToLower().Contains(term) ||
        u.FirstName.ToLower().Contains(term) ||
        u.LastName.ToLower().Contains(term));
    }

    var totalCount = await query.CountAsync(ct);
    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var users = await query
      .OrderBy(u => u.LastName)
      .ThenBy(u => u.FirstName)
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .ToListAsync(ct);

    var items = new List<AdminUserDto>(users.Count);
    foreach (var user in users)
    {
      var roles = await _userManager.GetRolesAsync(user);
      items.Add(new AdminUserDto(
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
        roles));
    }

    HttpContext.Response.StatusCode = StatusCodes.Status200OK;
    await HttpContext.Response.WriteAsJsonAsync(new AdminUsersPagedDto(
      items, page, pageSize, totalCount, totalPages), ct);
  }
}
