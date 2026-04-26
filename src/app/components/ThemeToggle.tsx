'use client';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        background: 'none',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '0.35rem 0.75rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: 'var(--text-nav)',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>
        {isDark ? '☀️' : '🌙'}
      </span>
      <span style={{ display: 'none', fontSize: '0.7rem' }}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
