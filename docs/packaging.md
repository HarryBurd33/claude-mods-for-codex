# Build a local source package

The runtime needs Node.js 22 or newer and has no dependencies to install. If npm is available, build a distributable source tarball from this repository:

```sh
npm pack --ignore-scripts --pack-destination /absolute/path/to/output
```

The output directory must already exist. This command creates a local archive; it does not publish to npm or install the plugin. The package is marked private to prevent accidental npm publication. Its explicit file list includes the plugin, runtime, skills, examples, tests, and guides, while excluding Git history, checkpoints, dependencies, and journals.

Extract the archive into a new directory, enter its `package/` folder, and run the README's offline checks. Add that extracted folder to a local marketplace only after reviewing its contents and following [setup](setup.md). The tarball is a manual source distribution, not an OpenAI directory submission.
