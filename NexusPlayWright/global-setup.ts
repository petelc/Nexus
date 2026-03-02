/**
 * Playwright global setup — runs once before all tests.
 *
 * 1. Elevates TEST_USER to "Editor" role using ADMIN_USER credentials.
 * 2. Logs in as TEST_USER and ensures a default team + workspace exist.
 *
 * All steps fail gracefully: if anything goes wrong, tests continue as-is
 * (workspace-scoped tests may skip or fail, but auth/layout tests still run).
 */
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import * as https from 'https';

loadEnv({ path: resolve(__dirname, '.env') });

const API_BASE = process.env.API_URL ?? 'https://localhost:57679';
const ADMIN_EMAIL = process.env.ADMIN_USER_EMAIL ?? 'admin@nexus.dev';
const ADMIN_PASSWORD = process.env.ADMIN_USER_PASSWORD ?? 'AdminPass123!';
const TEST_EMAIL = process.env.TEST_USER_EMAIL ?? 'testuser@nexus.dev';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD ?? 'TestPass123!';

/** Simple fetch wrapper that ignores self-signed TLS errors */
function apiCall(method: string, path: string, body?: unknown, token?: string): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload).toString();

    const url = new URL(`${API_BASE}${path}`);
    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers,
      rejectUnauthorized: false, // allow self-signed certs in dev
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode ?? 0, data: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode ?? 0, data: raw });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

export default async function globalSetup() {
  console.log('\n[Setup] Running Playwright global setup...');

  try {
    // ── Step 1: Elevate TEST_USER to Editor via Admin API ──────────────────
    const adminLoginResult = await apiCall('POST', '/api/v1/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (adminLoginResult.status === 200) {
      const adminToken = (adminLoginResult.data as { AccessToken?: string })?.AccessToken;

      if (adminToken) {
        const usersResult = await apiCall(
          'GET',
          `/api/v1/admin/users?search=${encodeURIComponent(TEST_EMAIL)}&page=1&pageSize=10`,
          undefined,
          adminToken,
        );

        if (usersResult.status === 200) {
          const usersData = usersResult.data as { Items?: Array<{ UserId: string; Email: string; Roles: string[] }> };
          const testUser = usersData?.Items?.find((u) => u.Email.toLowerCase() === TEST_EMAIL.toLowerCase());

          if (testUser) {
            const currentRoles: string[] = testUser.Roles ?? [];
            const hasEditorOrAdmin = currentRoles.some((r) => r === 'Editor' || r === 'Admin');

            if (hasEditorOrAdmin) {
              console.log(`[Setup] ${TEST_EMAIL} already has ${currentRoles.join(', ')} role(s).`);
            } else {
              console.log(`[Setup] Elevating ${TEST_EMAIL} to Editor role...`);
              const updateResult = await apiCall(
                'PUT',
                `/api/v1/admin/users/${testUser.UserId}/roles`,
                { Roles: ['Editor'] },
                adminToken,
              );
              if (updateResult.status === 200) {
                console.log(`[Setup] ✓ ${TEST_EMAIL} elevated to Editor.`);
              } else {
                console.log(`[Setup] Role elevation failed (HTTP ${updateResult.status}).`);
              }
            }
          } else {
            console.log(`[Setup] ${TEST_EMAIL} not found in user list.`);
          }
        } else {
          console.log(`[Setup] Could not list users (HTTP ${usersResult.status}).`);
        }
      }
    } else {
      console.log(`[Setup] Admin login failed (HTTP ${adminLoginResult.status}). Skipping role elevation.`);
    }

    // ── Step 2: Login as TEST_USER (gets fresh JWT with elevated role) ─────
    const testLoginResult = await apiCall('POST', '/api/v1/auth/login', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (testLoginResult.status !== 200) {
      console.log(`[Setup] TEST_USER login failed (HTTP ${testLoginResult.status}). Skipping team/workspace setup.`);
      return;
    }

    const testToken = (testLoginResult.data as { AccessToken?: string })?.AccessToken;
    if (!testToken) {
      console.log('[Setup] No TEST_USER token. Skipping team/workspace setup.');
      return;
    }

    // ── Step 3: Ensure a team exists ───────────────────────────────────────
    let teamId: string | null = null;

    const teamsResult = await apiCall('GET', '/api/v1/teams/my', undefined, testToken);
    if (teamsResult.status === 200) {
      const teams = teamsResult.data as Array<{ TeamId: string }>;
      teamId = Array.isArray(teams) && teams.length > 0 ? (teams[0].TeamId ?? null) : null;
    }

    if (teamId) {
      console.log(`[Setup] Team already exists (${teamId}).`);
    } else {
      console.log('[Setup] No team found — creating E2E Test Team...');
      const createTeamResult = await apiCall(
        'POST',
        '/api/v1/teams',
        { Name: 'E2E Test Team', Description: 'Created by Playwright global setup' },
        testToken,
      );

      if (createTeamResult.status === 201) {
        teamId = (createTeamResult.data as { TeamId?: string })?.TeamId ?? null;
        console.log(`[Setup] ✓ Created E2E Test Team (${teamId}).`);
      } else {
        console.log(`[Setup] Failed to create team (HTTP ${createTeamResult.status}). Workspace tests may skip.`);
        return;
      }
    }

    // ── Step 4: Ensure a workspace exists ──────────────────────────────────
    const workspacesResult = await apiCall('GET', '/api/v1/workspaces/my', undefined, testToken);
    if (workspacesResult.status === 200) {
      const workspaces = workspacesResult.data as Array<unknown>;
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        console.log('[Setup] Workspace already exists.');
        return;
      }
    }

    console.log('[Setup] No workspace found — creating E2E Test Workspace...');
    const createWorkspaceResult = await apiCall(
      'POST',
      '/api/v1/workspaces',
      { Name: 'E2E Test Workspace', Description: 'Created by Playwright global setup', TeamId: teamId },
      testToken,
    );

    if (createWorkspaceResult.status === 201) {
      console.log('[Setup] ✓ Created E2E Test Workspace.');
    } else {
      console.log(`[Setup] Failed to create workspace (HTTP ${createWorkspaceResult.status}).`);
    }
  } catch (err) {
    console.log(`[Setup] Error during global setup: ${err}. Tests will run with current state.`);
  }
}
