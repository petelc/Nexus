import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Code as CodeIcon,
  AccountTree as DiagramIcon,
  Layers as TotalIcon,
  Add as AddIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  FolderSpecial as WorkspaceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAppSelector } from '@app/hooks';
import { useGetDocumentsQuery } from '@api/documentsApi';
import { useGetSnippetsQuery } from '@api/snippetsApi';
import { useGetDiagramsQuery } from '@api/diagramsApi';
import { useGetMyWorkspacesQuery } from '@api/workspacesApi';
import { buildRoute, ROUTE_PATHS } from '@routes/routePaths';

dayjs.extend(relativeTime);

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting(firstName: string): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return `Good ${time}, ${firstName}`;
}

function fromNow(date: string) {
  return dayjs(date).fromNow();
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

function StatCard({ label, value, icon: Icon, color, loading }: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '12px',
            backgroundColor: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color, fontSize: 26 }} />
        </Box>
        <Box>
          {loading ? (
            <Skeleton width={40} height={36} />
          ) : (
            <Typography variant="h4" fontWeight={700} lineHeight={1}>
              {value ?? 0}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Recent item card ──────────────────────────────────────────────────────────

interface RecentItemProps {
  title: string;
  subtitle?: string;
  updatedAt: string;
  onClick: () => void;
  chip?: { label: string; color?: 'default' | 'primary' | 'success' | 'warning' };
}

function RecentItem({ title, subtitle, updatedAt, onClick, chip }: RecentItemProps) {
  return (
    <CardActionArea onClick={onClick} sx={{ borderRadius: 1 }}>
      <Box sx={{ py: 1.25, px: 1.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Stack direction="column" alignItems="flex-end" gap={0.5} flexShrink={0}>
            {chip && (
              <Chip label={chip.label} size="small" color={chip.color ?? 'default'} variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
            )}
            <Typography variant="caption" color="text.disabled" whiteSpace="nowrap">
              {fromNow(updatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </CardActionArea>
  );
}

// ── Recent section ────────────────────────────────────────────────────────────

interface RecentSectionProps {
  title: string;
  icon: React.ElementType;
  color: string;
  loading: boolean;
  isEmpty: boolean;
  viewAllPath: string;
  children: React.ReactNode;
}

function RecentSection({ title, icon: Icon, color, loading, isEmpty, viewAllPath, children }: RecentSectionProps) {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon sx={{ color, fontSize: 18 }} />
        <Typography variant="subtitle2" fontWeight={700} flex={1}>
          {title}
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
          onClick={() => navigate(viewAllPath)}
          sx={{ fontSize: '0.75rem', minWidth: 0 }}
        >
          All
        </Button>
      </Box>
      <Divider />
      <Box sx={{ flex: 1 }}>
        {loading ? (
          <Box sx={{ p: 1.5 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={44} sx={{ mb: 0.5 }} />
            ))}
          </Box>
        ) : isEmpty ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.disabled">
              Nothing here yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 0.5, py: 0.5 }}>{children}</Box>
        )}
      </Box>
    </Card>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);

  const { data: workspaces } = useGetMyWorkspacesQuery({});
  const currentWorkspace = workspaces?.find((w) => w.workspaceId === currentWorkspaceId) ?? null;

  const { data: docs, isLoading: docsLoading } = useGetDocumentsQuery({
    pageSize: 5,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    ...(currentWorkspaceId ? { workspaceId: currentWorkspaceId } : {}),
  });

  const { data: snippets, isLoading: snippetsLoading } = useGetSnippetsQuery({
    ...(currentWorkspaceId ? { workspaceId: currentWorkspaceId } : {}),
  });

  const { data: diagrams, isLoading: diagramsLoading } = useGetDiagramsQuery({
    pageSize: 5,
    ...(currentWorkspaceId ? { workspaceId: currentWorkspaceId } : {}),
  });

  // When a workspace is selected, use its pre-computed counts (more accurate).
  // Fallback to API totals when viewing across all workspaces.
  const docCount = currentWorkspace ? currentWorkspace.documentCount : (docs?.totalCount ?? 0);
  const snippetCount = currentWorkspace ? currentWorkspace.snippetCount : (snippets?.totalCount ?? 0);
  const diagramCount = currentWorkspace ? currentWorkspace.diagramCount : (diagrams?.totalCount ?? 0);
  const totalItems = docCount + snippetCount + diagramCount;

  const statsLoading = docsLoading || snippetsLoading || diagramsLoading;

  const recentDocs = docs?.items ?? [];
  const recentSnippets = (snippets?.items ?? []).slice(0, 5);
  const recentDiagrams = diagrams?.items ?? [];

  const greeting = getGreeting(user?.firstName ?? 'there');
  const scopeLabel = currentWorkspace ? currentWorkspace.name : 'all your workspaces';

  return (
    <Box>
      {/* ── Greeting ── */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          {greeting}
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.75} mt={0.5}>
          {currentWorkspace && (
            <WorkspaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          )}
          <Typography variant="body1" color="text.secondary">
            {currentWorkspace
              ? `Showing stats for ${scopeLabel}.`
              : `Here's your knowledge workspace at a glance.`}
          </Typography>
        </Stack>
      </Box>

      {/* ── Stat cards ── */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Documents"
            value={statsLoading ? undefined : docCount}
            icon={DocumentIcon}
            color={theme.palette.primary.main}
            loading={docsLoading && !currentWorkspace}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Snippets"
            value={statsLoading ? undefined : snippetCount}
            icon={CodeIcon}
            color={theme.palette.info.main}
            loading={snippetsLoading && !currentWorkspace}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Diagrams"
            value={statsLoading ? undefined : diagramCount}
            icon={DiagramIcon}
            color={theme.palette.success.main}
            loading={diagramsLoading && !currentWorkspace}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Total items"
            value={statsLoading ? undefined : totalItems}
            icon={TotalIcon}
            color={theme.palette.warning.main}
            loading={statsLoading && !currentWorkspace}
          />
        </Grid>
      </Grid>

      {/* ── Quick actions ── */}
      <Stack direction="row" spacing={1.5} mb={4} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTE_PATHS.DOCUMENT_CREATE)}
        >
          New Document
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTE_PATHS.SNIPPET_CREATE)}
        >
          New Snippet
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTE_PATHS.DIAGRAM_CREATE)}
        >
          New Diagram
        </Button>
        <Button
          variant="text"
          startIcon={<SearchIcon />}
          onClick={() => navigate(ROUTE_PATHS.SEARCH)}
        >
          Search
        </Button>
      </Stack>

      {/* ── Recently updated ── */}
      <Stack direction="row" alignItems="baseline" gap={1} mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Recently updated
        </Typography>
        {!currentWorkspace && (
          <Typography variant="caption" color="text.disabled">
            across all workspaces
          </Typography>
        )}
      </Stack>
      <Grid container spacing={2}>
        {/* Documents */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentSection
            title="Documents"
            icon={DocumentIcon}
            color={theme.palette.primary.main}
            loading={docsLoading}
            isEmpty={recentDocs.length === 0}
            viewAllPath={ROUTE_PATHS.DOCUMENTS}
          >
            {recentDocs.map((doc) => (
              <RecentItem
                key={doc.documentId}
                title={doc.title}
                subtitle={doc.excerpt ?? doc.createdBy?.fullName}
                updatedAt={doc.updatedAt}
                onClick={() => navigate(buildRoute.documentDetail(doc.documentId))}
                chip={
                  doc.status === 'published'
                    ? { label: 'Published', color: 'success' }
                    : doc.status === 'draft'
                    ? { label: 'Draft', color: 'default' }
                    : undefined
                }
              />
            ))}
          </RecentSection>
        </Grid>

        {/* Snippets */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentSection
            title="Snippets"
            icon={CodeIcon}
            color={theme.palette.info.main}
            loading={snippetsLoading}
            isEmpty={recentSnippets.length === 0}
            viewAllPath={ROUTE_PATHS.SNIPPETS}
          >
            {recentSnippets.map((snip) => (
              <RecentItem
                key={snip.snippetId}
                title={snip.title}
                subtitle={snip.description}
                updatedAt={snip.updatedAt}
                onClick={() => navigate(buildRoute.snippetDetail(snip.snippetId))}
                chip={{ label: snip.language, color: 'primary' }}
              />
            ))}
          </RecentSection>
        </Grid>

        {/* Diagrams */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentSection
            title="Diagrams"
            icon={DiagramIcon}
            color={theme.palette.success.main}
            loading={diagramsLoading}
            isEmpty={recentDiagrams.length === 0}
            viewAllPath={ROUTE_PATHS.DIAGRAMS}
          >
            {recentDiagrams.map((diag) => (
              <RecentItem
                key={diag.diagramId}
                title={diag.title}
                subtitle={`${diag.elementCount} element${diag.elementCount !== 1 ? 's' : ''}`}
                updatedAt={diag.updatedAt}
                onClick={() => navigate(buildRoute.diagramDetail(diag.diagramId))}
                chip={{ label: diag.diagramType, color: 'warning' }}
              />
            ))}
          </RecentSection>
        </Grid>
      </Grid>
    </Box>
  );
};
