# Stop-only proposal offline verification — 2026-10-26

GPT-6.1 Sol High on source0.2.0-dev.38, starting7eff539. No runtime/test/CI code or
version change. These are existing components and synthetic Node callbacks, **not
native Codex events**. Detailed contract: [proposal](STOP-ONLY-PROPOSAL.md).

Commands actually run:

```sh
node --test test/components.test.mjs test/observers.test.mjs test/scope.test.mjs
```

20cases: **19pass0fail1Windows-only skip**,1.31seconds, Node24.22.0/macOS.
Includes strict component/access/privacy/malformed bounds, independent storage,
private bundle/partial generation, fixed Node busy/config/excluded-path outputs,
selected-scope and sibling-prefix exclusion. No broad full suite/CI/package rerun.

A separate private review harness then invoked existing scaffoldComponent,
loadComponentBundle, componentIntent/Plan, replayComponentBundle, dispatch and fixed
Node hook-main callbacks against throwaway synthetic directories. **15cases0fail**:

1. Observer-only Stop spec generates a complete private disabled/inert bundle;
   no registration/retention/display, not installed.
2. Four reception/retention combinations produce exact Stop-only/no-registration
   and storage fragments; independent runtime-delivery behavior explicitly asserted.
3. Unrelated optional events remain unretained with ordinary state disabled and
   dormant legacy Interrupt present. No status selection or model/network request.
4. Matching Stop callback emits `{}` plus newline/exit0; one record in selected scope.
5. Another synthetic session uses a different bucket; first count unchanged.
6. Descendant cwd accepted into original session bucket; exact-session filter is
   deliberately **not** claimed.
7. Parent and sibling events produce fixed unavailable diagnostic/empty JSON,
   without creating excluded data.
8. Retention off writes no data. Existing lock causes fixed empty-output failure,
   preserves lock and existing count. Missing config emits fixed empty JSON.
9. Malformed envelope exits1/no stdout/fixed diagnostic; no continuation/approval.
10. All retained bytes contain only event/recordedAt, no synthetic raw message,
    transcript path/session/turn/model/permission text. Three records across two
    session buckets. Synthetic state/lock fixture directories removed in finally.

The list groups related cases; count15 includes all four matrix cases and two
exclusions separately. No native request, arbitrary process executor or new transport.
Only this Node executable/known callback ran, sanitized environment, max5s/8192bytes
per call; callbacks spawn no native client/descendant. No model/API test run.

Review artifacts stay ignored: disabled complete bundle, four separate boolean
intents/plans, unresolved project-command template, proposed `.json.txt` config,
source-only38file pins, primary sources, fixed logs/results/hashes. All generated
files private; no `.codex/` native configuration created. No new native PLAN/INPUT,
binary/hash/config snapshot or previous manifest rewrite. Current component source
and defaults equal exact implementation9016cb0; source-only pins are not native inputs.
Installed31/owned251/settings/data/rawconfig/guard and known unaccepted project-trust
observations retained. Medium should verify these artifacts without rerunning the
exclusive-output generator or source37/38packaging. No new native-support claim.
