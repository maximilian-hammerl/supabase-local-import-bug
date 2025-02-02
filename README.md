# Supabase Edge Function Bug: Imports Side Effects

## Overview

This repository demonstrates a potential bug in Supabase edge functions related to module imports.
The issue arises when switching from relative path imports to `mod.ts` imports of another project, causing unexpected failures when edge functions are either refactored to all use `mod.ts` imports or removed.

## Repository Structure

```
.
├── another-project/
│   ├── file_a.ts
│   └── mod.ts
└── supabase/
    └── functions/
        ├── import-mod-ts/
        └── import-relative-path/
```

### `another-project/`

A simple Deno project just containing:

- `file_a.ts`: Defines function `functionA`, which logs a message to the console.
- `mod.ts`: Re-exports everything from `file_a.ts`.

### `supabase/`

Contains two Supabase edge functions demonstrating the bug:

#### `import-mod-ts/`: Imports `another-project` via `mod.ts`

```
"imports": {
  "another-project": "../../../another-project/mod.ts"
}
```

#### `import-relative-path/`: Imports `another-project` using a relative path

```
"imports": {
  "another-project/": "../../../another-project/"
}
```

Both edge functions simply import function `functionA`, execute it, and return a JSON object.

## The Bug

When both edge functions exist, they function correctly.
However, when `import-relative-path` is either refactored to also use a `mod.ts` import or deleted, `import-mod-ts` fails with the following error:

```
Using supabase-edge-runtime-1.66.5 (compatible with Deno v1.45.2)
serving the request with supabase/functions/import-mod-ts
worker boot error: failed to create the graph: Module not found "file:///.../supabase-local-import-bug/another-project/file_a.ts".
    at file:///.../supabase-local-import-bug/another-project/mod.ts:1:15
worker boot error: failed to create the graph: Module not found "file:///Users/maximilianhammerl/Documents/Repositories/supabase-local-import-bug/another-project/file_a.ts".
    at file:///...supabase-local-import-bug/another-project/mod.ts:1:15
InvalidWorkerCreation: worker boot error: failed to create the graph: Module not found "file:///Users/maximilianhammerl/Documents/Repositories/supabase-local-import-bug/another-project/file_a.ts".
    at file:///.../supabase-local-import-bug/another-project/mod.ts:1:15
    at async UserWorker.create (ext:sb_user_workers/user_workers.js:139:15)
    at async Object.handler (file:///root/index.ts:157:22)
    at async respond (ext:sb_core_main_js/js/http.js:197:14) {
  name: "InvalidWorkerCreation"
```

This contradicts Supabase's documentation, which states that each edge function is [an independent project with its own dependencies and configurations](https://supabase.com/docs/guides/functions/dependencies#managing-dependencies).

## Background

While refactoring my project to use `mod.ts` imports instead of relative paths, everything worked fine until the last edge function was switched.
Once all edge functions used `mod.ts`, no edge function worked anymore.
(All failed with the same error message from above.)

## Expected Behavior

Each edge function should be independent, and removing one should not affect the functionality of the others.
This bug suggests that dependencies are somehow shared across edge functions in a way that isn't documented.

## How to Reproduce

1. Clone this repository.
2. Start Supabase (`cd supabase`, `supabase start` and `supabase functions serve`).
3. Invoke the edge functions (for example with the `test-edge-functions.sh` script or using curl) and observe that everything works as expected.
4. Either refactor or remove edge function `import-relative-path`.
5. Stop and start `supabase functions serve` again.
6. Invoke the edge functions (for example with the `test-edge-functions.sh` script or using curl) and observe that nothing works anymore.

## Conclusion

This proof-of-concept suggests a deeper issue with how Supabase handles module imports in edge functions.
Further investigation is needed to confirm whether this is a bug or an undocumented behavior.

## License

This repository is open-source and available under the MIT License.
