namespace Nexus.API.UseCases.Auth.DTOs;

public record AuthResponseDto(
  string AccessToken,
  string RefreshToken,
  DateTime ExpiresAt,
  UserDto User);

public record UserDto(
  Guid UserId,
  string Email,
  string Username,
  string FirstName,
  string LastName,
  string? AvatarUrl,
  bool EmailConfirmed,
  bool TwoFactorEnabled,
  // Extended profile fields (populated by /auth/me; null from login/register)
  string? Bio = null,
  string? Title = null,
  string? Department = null,
  string? Theme = null,
  string? Language = null,
  bool? NotificationsEnabled = null,
  string? EmailDigest = null);

public record RegisterRequestDto(
  string Email,
  string Username,
  string FirstName,
  string LastName,
  string Password,
  string ConfirmPassword);

public record LoginRequestDto(
  string Email,
  string Password,
  bool RememberMe = false);

public record UpdateProfileRequest(
  string FirstName,
  string LastName,
  string? AvatarUrl,
  string? Bio,
  string? Title,
  string? Department);

public record UpdatePreferencesRequest(
  string Theme,        // "Light" | "Dark" | "Auto"
  string Language,
  bool NotificationsEnabled,
  string EmailDigest); // "Daily" | "Weekly" | "None"

public record ChangePasswordRequest(
  string CurrentPassword,
  string NewPassword,
  string ConfirmNewPassword);
