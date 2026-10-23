# Supported themes and native indicators

This is a **Codex terminal UI setup**, separate from the plugin-owned dashboard.
No theme, footer or client version is changed by installing Claude Mods.

Official [CLI customization](https://learn.chatgpt.com/docs/cli-customization)
documents `/theme`, the `tui.theme` setting and custom `.tmTheme` files under
`$CODEX_HOME/themes`. Retrieved2026-10-23. The original MIT example
`examples/themes/claude-mods-quiet-dark.tmTheme` provides a dark syntax palette;
it contains no executable code, external assets or copied Prismantis theme.
XML parsing was checked; actual picker/rendering acceptance remains unverified.

On a compatible POSIX CLI, record the existing selection and keep a private
configuration backup. Copy the reviewed example without overwriting a prior file:

```sh
mkdir -p "${CODEX_HOME:-$HOME/.codex}/themes"
cp -n examples/themes/claude-mods-quiet-dark.tmTheme "${CODEX_HOME:-$HOME/.codex}/themes/"
```

Open `/theme` and preview the custom palette; confirm only if you want it saved.
No model prompt/run is needed. Verify fenced code and diffs in that exact client.
To roll back, select the recorded previous theme; remove only the copied example
if no longer needed. Preserve other themes/settings. Native Windows setup and
rendering are unverified; use its documented host paths rather than this shell.

System CLI0.163.0 is installed here. Prose foreground support is corroborated in
[released0.164.0](https://github.com/openai/codex/releases/tag/rust-v0.164.0)
by merged#54217; that release is not installed/tested here. Do not silently update
the client or claim all native prose/background/dialog/tool-row restyling. The
Prismantis adaptation and unmerged renderer fork are assessed separately in
[research](continuation/CLAUDE-RESEARCH.md#prismantis-and-codex-release-check).
Dashboard CSS follows host style variables; it does not set the native TUI theme.

Official [developer commands](https://learn.chatgpt.com/docs/developer-commands)
also documents `/statusline` for footer fields and `/title` for terminal-title
items. These are host controls, not plugin callbacks. Review their pickers before
saving; restore previous selections to undo. Host context/token/rate-limit items
are useful native indicators where available, but the plugin cannot read them
through its hook feed. They do not populate the dashboard's context/billing/cache
fields. Exact installed-version behavior and desktop equivalents remain native
acceptance work. No spinner/dialog/transcript injection or private patch is used.
