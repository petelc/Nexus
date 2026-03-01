namespace Nexus.API.UseCases.Auth.DTOs;

public record AdminUserDto(
  Guid UserId,
  string Email,
  string Username,
  string FirstName,
  string LastName,
  string? AvatarUrl,
  bool EmailConfirmed,
  bool TwoFactorEnabled,
  bool IsActive,
  DateTime CreatedAt,
  DateTime? LastLoginAt,
  IList<string> Roles);

public record AdminUsersPagedDto(
  IList<AdminUserDto> Items,
  int Page,
  int PageSize,
  int TotalCount,
  int TotalPages);

public record UpdateUserRolesRequest(IList<string> Roles);

public record UpdateUserStatusRequest(bool IsActive);
