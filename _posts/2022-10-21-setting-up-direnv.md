
# direnv stuff

Warning: TODO: there is an alternative version where the defaultPackage is a pkgs.buildEnv that contains all the dependencies. And then nix shell is used to open the environment.
Direnv integration
Assuming that the flake defines a devShell output attribute and that you are using direnv. Here is how to replace the old use nix stdlib function with the faster flake version:

use_flake() {
  watch_file flake.nix
  watch_file flake.lock
  eval "$(nix print-dev-env --profile "$(direnv_layout_dir)/flake-profile")"
}
Copy this in ~/.config/direnv/lib/use_flake.sh or in ~/.config/direnv/direnvrc or directly in your project specific .envrc.

Note: You may not need to create use_flake() yourself; as of direnv 2.29, use flake is part of direnv's standard library.

With this in place, you can now replace the use nix invocation in the .envrc file with use flake:

```
# .envrc
use flake
```

The nice thing about this approach is that evaluation is cached.

# direnv stuff; Faster reloads

Nix Flakes uses Nix-evaluation-caching 

Is it possible to expose that somehow to automatically trigger direnv reloads?

With the previous solution, direnv would only reload if the flake.nix or flake.lock files have changed. This is not completely precise as the flake.nix file might import other files in the repository.


