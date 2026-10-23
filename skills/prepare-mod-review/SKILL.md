---
name: prepare-mod-review
description: Prepare a review of Claude Mods source or a generated mod, including access changes and relevant verification, without publishing unless requested.
---

Inspect the selected diff and current package contracts. Explain the user-visible trigger and behavior, then the permissions/privacy delta: selected roots, executable processes, network domains, retained data and model usage. Check deny precedence, exact replacement disclosure, unchanged permission fields, opt-in sensitive data and supported update/trust flow where affected.

Use relevant tests and label missing native checks. Inspect generated access declarations as claims about code, not a sandbox. Check that packages include compatibility manifests and required resources and exclude private root handoffs, local logs, credentials and unintended links.

Produce concise reviewer notes with concrete findings, file locations, observed validation and limits. Do not stage unrelated changes, publish comments/PRs, push or install merely because review was requested. Existing explicit authorization still governs requested delivery.

The skill consumes selected-model usage; reads are the requested source/diff and relevant public evidence. Writes are requested review artifacts only. No private-session discovery, credential collection, model switching, automatic permission approval or paid keepalive calls.
