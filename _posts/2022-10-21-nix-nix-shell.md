
# nix develop 

Let’s say that your project has a shell.nix file that looks like this:

{ pkgs ? import <nixpkgs> { } }:
with pkgs;
mkShell {
  buildInputs = [
    nixpkgs-fmt
  ];

  shellHook = ''
    # ...
  '';
}

Running nix-shell can be a bit slow and take 1-3 seconds.

Now create a flake.nix file in the same repository:

{
  description = "my project description";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system}; in
        {
          devShell = import ./shell.nix { inherit pkgs; };
        }
      );
}

Run git add flake.nix so that Nix recognizes it.

And finally, run nix develop. This is what replaces the old nix-shell invocation.

Exit and run again, this command should now be super fast.
