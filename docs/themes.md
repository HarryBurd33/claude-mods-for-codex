# Appearance in the owned panel and native Codex

These are separate surfaces. Installing Claude Mods changes neither a native
client preference nor the whole-app background. No fork, private injection,
installed-app patch or alternative client is included.

## Owned dashboard — development source30

Open **Appearance for this panel** in the header. **Follow host** is the default;
**Quiet dark** and **Quiet light** are original fixed palettes. **Reset to host
colors** immediately restores host variables/system colors. Selection remains in
this view's memory only; a new view starts at Follow host. Changing colors keeps
preview/impact drafts and results intact, while their existing Clear and real
view teardown still clear text. Nothing is saved or sent to a tool, model or
network, and no settings/path/credential access is added. Arbitrary CSS, HTML,
URLs, images and modules are not accepted.

Text, code, diffs, chart bars, diagram backgrounds, controls and focus outlines
share owned color tokens. System forced colors take precedence. Fixed palette
contrast tests check normal text at least4.5:1 and focus/borders/chart colors at
least3:1 against their tested backgrounds, using unrounded sRGB ratios. These
checks follow [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
(retrieved2026-10-24); they do not certify every host theme or all accessibility.
Tables and literal/sign semantics remain available independently of color.

Automated/simulated checks and a disconnected browser preview passed. [Bounded native30](continuation/NATIVE-DEV30.md) default/dark/light/Reset and
human keyboard/width checks passed; native forced colors/full accessibility remain
unverified. Exact package242files/62focused tests passed; installed30 is reviewed.
See [source review](continuation/DEV30-REVIEW.md). No screenshot or browser test
is presented as an official-host result.

## Native CLI theme — picker verified, physical colors unverified

Official [CLI customization](https://learn.chatgpt.com/docs/cli-customization),
retrieved2026-10-24, documents `/theme`, saving to `tui.theme`, and custom
`.tmTheme` files under `$CODEX_HOME/themes`. The original MIT
`examples/themes/claude-mods-quiet-dark.tmTheme` is a syntax palette without code
or external assets. Native0.163 `/theme` discovered the temporary original custom file and showed
the code/diff sample; Escape cancelled before saving. Config bytes unchanged,
temporary file/new empty directory removed and owned session exited0. Physical
terminal color accuracy remains unverified; no preference or client upgrade.
See [native evidence](continuation/NATIVE-DEV30.md).

On a compatible POSIX CLI, record the previous theme, make a private configuration
backup, inspect the destination directory and avoid following unexpected links or
overwriting an existing file. Copy only the reviewed example:

```sh
mkdir -p "${CODEX_HOME:-$HOME/.codex}/themes"
cp -n examples/themes/claude-mods-quiet-dark.tmTheme "${CODEX_HOME:-$HOME/.codex}/themes/"
```

Open `/theme` and preview it; cancel the picker before saving for a preview-only
check. No model prompt/run is needed. Confirm only if you want a persisted native
setting. Verify code and diffs on that exact client. To undo a saved selection,
select the recorded prior theme and remove only the copied example if unwanted.
Preserve other themes/settings; a whole-config restore could erase unrelated
changes. Native Windows setup/rendering remain unverified; use its documented
host paths rather than this POSIX shell example.

Installed CLI0.163.0 is distinct from the desktop host. [Released0.164.0](https://github.com/openai/codex/releases/tag/rust-v0.164.0)
(published2026-10-23, rechecked2026-10-24) includes#54217 applying syntax colors to
Markdown prose. It is not installed/tested here; no silent upgrade is made.
[Prismantis's Codex README](https://github.com/NahumLitvin/prismantis/blob/main/codex/README.md),
retrieved2026-10-24, describes17themes but still calls prose support unreleased.
That statement is superseded by the official release; the separate custom
renderer [issue#53663](https://github.com/openai/codex/issues/53663) remains open
at this check. No Prismantis/Claude implementation code or theme was copied.
Native tool rows, spinners, dialogs and transcript structure are separately
assessed in the ledger; this owned palette proves none of those interfaces.

## Native indicators

Previously retrieved [developer commands](https://learn.chatgpt.com/docs/developer-commands)
document `/statusline` footer fields and `/title` terminal-title items. These are
host pickers, not plugin callbacks. Review before saving and restore previous
selections to undo. Exact installed behavior and desktop equivalents remain
unverified. Host context/token/rate-limit indicators do not populate dashboard
context, billing or cache fields through the existing hook feed. Missing data
stays unavailable; there are no paid keepalive calls.
