import { Autocomplete, TextField, Chip, Box } from '@mui/material';

// Popular programming languages supported by Monaco Editor
export const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'csharp', label: 'C#', icon: '🔵' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'c', label: 'C', icon: '⚙️' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'swift', label: 'Swift', icon: '🕊️' },
  { value: 'kotlin', label: 'Kotlin', icon: '🟣' },
  { value: 'scala', label: 'Scala', icon: '🔴' },
  { value: 'dart', label: 'Dart', icon: '🎯' },
  { value: 'r', label: 'R', icon: '📊' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'scss', label: 'SCSS', icon: '🎨' },
  { value: 'less', label: 'Less', icon: '🎨' },
  { value: 'json', label: 'JSON', icon: '📋' },
  { value: 'xml', label: 'XML', icon: '📄' },
  { value: 'yaml', label: 'YAML', icon: '📝' },
  { value: 'markdown', label: 'Markdown', icon: '📝' },
  { value: 'shell', label: 'Shell', icon: '🐚' },
  { value: 'bash', label: 'Bash', icon: '🐚' },
  { value: 'powershell', label: 'PowerShell', icon: '💙' },
  { value: 'dockerfile', label: 'Dockerfile', icon: '🐳' },
  { value: 'graphql', label: 'GraphQL', icon: '🔺' },
  { value: 'solidity', label: 'Solidity', icon: '⬡' },
  { value: 'lua', label: 'Lua', icon: '🌙' },
  { value: 'perl', label: 'Perl', icon: '🐪' },
  { value: 'elixir', label: 'Elixir', icon: '💧' },
  { value: 'erlang', label: 'Erlang', icon: '📞' },
  { value: 'haskell', label: 'Haskell', icon: '🔷' },
  { value: 'clojure', label: 'Clojure', icon: '🌀' },
  { value: 'fsharp', label: 'F#', icon: '🔵' },
  { value: 'objectivec', label: 'Objective-C', icon: '🍎' },
  { value: 'vb', label: 'Visual Basic', icon: '🔷' },
  { value: 'vbnet', label: 'VB.NET', icon: '🔷' },
  { value: 'plaintext', label: 'Plain Text', icon: '📄' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export const LanguageSelector = ({
  value,
  onChange,
  label = 'Language',
  required = false,
  error = false,
  helperText,
  disabled = false,
  size = 'medium',
}: LanguageSelectorProps) => {
  const selectedLanguage = PROGRAMMING_LANGUAGES.find((lang) => lang.value === value);

  return (
    <Autocomplete
      value={selectedLanguage || null}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange(newValue.value);
        }
      }}
      options={PROGRAMMING_LANGUAGES}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          size={size}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span style={{ fontSize: '1.2rem' }}>{option.icon}</span>
            <span>{option.label}</span>
          </Box>
        </Box>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.value}
            label={option.label}
            icon={<span style={{ fontSize: '1rem' }}>{option.icon}</span>}
            size="small"
          />
        ))
      }
      disabled={disabled}
      disableClearable={required}
      autoHighlight
      openOnFocus
    />
  );
};

// Helper function to get language icon
export const getLanguageIcon = (language: string): string => {
  const lang = PROGRAMMING_LANGUAGES.find((l) => l.value === language);
  return lang?.icon || '📄';
};

// Helper function to get language label
export const getLanguageLabel = (language: string): string => {
  const lang = PROGRAMMING_LANGUAGES.find((l) => l.value === language);
  return lang?.label || language;
};
