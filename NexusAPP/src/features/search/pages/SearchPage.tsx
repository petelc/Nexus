import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Link,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Code as SnippetIcon,
  AccountTree as DiagramIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { buildRoute } from '@routes/routePaths';
import { useSearchQuery, type SearchResult } from '@api/searchApi';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Document: <DocumentIcon fontSize="small" />,
  CodeSnippet: <SnippetIcon fontSize="small" />,
  Diagram: <DiagramIcon fontSize="small" />,
};

const TYPE_LABELS: Record<string, string> = {
  Document: 'Document',
  CodeSnippet: 'Snippet',
  Diagram: 'Diagram',
};

const TYPE_COLORS: Record<string, 'primary' | 'success' | 'warning'> = {
  Document: 'primary',
  CodeSnippet: 'success',
  Diagram: 'warning',
};

function getItemRoute(result: SearchResult): string {
  switch (result.type) {
    case 'Document':
      return buildRoute.documentDetail(result.id);
    case 'CodeSnippet':
      return buildRoute.snippetDetail(result.id);
    case 'Diagram':
      return buildRoute.diagramDetail(result.id);
    default:
      return '#';
  }
}

const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'document', label: 'Documents' },
  { value: 'snippet', label: 'Snippets' },
  { value: 'diagram', label: 'Diagrams' },
];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const urlTypes = searchParams.get('types') ?? '';
  const urlPage = parseInt(searchParams.get('page') ?? '1', 10);

  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [typeFilter, setTypeFilter] = useState(urlTypes);
  const [page, setPage] = useState(urlPage);

  // Sync local state when URL changes (e.g. from Header search bar)
  useEffect(() => {
    setLocalQuery(urlQuery);
    setTypeFilter(urlTypes);
    setPage(urlPage);
  }, [urlQuery, urlTypes, urlPage]);

  const shouldSearch = urlQuery.trim().length > 0;

  const { data, isLoading, isFetching, isError } = useSearchQuery(
    { query: urlQuery, types: urlTypes || undefined, page, pageSize: 20 },
    { skip: !shouldSearch },
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = { q: localQuery };
    if (typeFilter) params.types = typeFilter;
    setSearchParams(params);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const params: Record<string, string> = { q: urlQuery, page: String(value) };
    if (urlTypes) params.types = urlTypes;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Search
      </Typography>

      {/* Search form */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}
      >
        <TextField
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search documents, snippets, diagrams…"
          size="small"
          sx={{ flex: 1, minWidth: 260 }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            },
          }}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
          displayEmpty
        >
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Loading */}
      {(isLoading || isFetching) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Search failed. Please try again.
        </Alert>
      )}

      {/* No query yet */}
      {!shouldSearch && !isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Enter a search term above to find documents, snippets, and diagrams.
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
            Tip: Press ⌘K from anywhere to focus the search bar.
          </Typography>
        </Box>
      )}

      {/* Results */}
      {data && !isLoading && (
        <>
          {/* Result count + type facets */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              {data.pagination.totalItems === 0
                ? `No results for "${data.query}"`
                : `${data.pagination.totalItems} result${data.pagination.totalItems !== 1 ? 's' : ''} for "${data.query}"`}
            </Typography>
            {Object.entries(data.facets.types).map(([type, count]) => (
              <Chip
                key={type}
                label={`${TYPE_LABELS[type] ?? type}: ${count}`}
                size="small"
                icon={TYPE_ICONS[type] as React.ReactElement}
                color={TYPE_COLORS[type] ?? 'default'}
                variant="outlined"
              />
            ))}
          </Box>

          {data.results.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No results found. Try different keywords or remove type filters.
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />} spacing={0}>
              {data.results.map((result) => (
                <ResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={data.pagination.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

// ── Individual result card ───────────────────────────────────────────────────

function ResultCard({ result }: { result: SearchResult }) {
  const route = getItemRoute(result);
  const label = TYPE_LABELS[result.type] ?? result.type;
  const color = TYPE_COLORS[result.type] ?? 'default';
  const icon = TYPE_ICONS[result.type];

  return (
    <Box sx={{ py: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Chip
          label={label}
          size="small"
          icon={icon as React.ReactElement}
          color={color}
          variant="outlined"
        />
        <Typography variant="caption" color="text.secondary">
          by {result.createdBy.username}
        </Typography>
      </Box>
      <Link
        component={RouterLink}
        to={route}
        variant="h6"
        underline="hover"
        color="text.primary"
        sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
      >
        {result.title}
      </Link>
      {result.excerpt && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {result.excerpt}
        </Typography>
      )}
      {result.highlights.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
          dangerouslySetInnerHTML={{ __html: `…${result.highlights[0]}…` }}
        />
      )}
    </Box>
  );
}
