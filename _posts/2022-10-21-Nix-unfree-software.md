
# Enable unfree software

Because flake evalutations are hermetic, 
they will ignore the system configuration on nonfree software 
and the NIXPKGS_ALLOW_UNFREE environment variable by default.

To use nonfree software with CLI tools like nix shell or nix run, 
the --impure flag must be used for Nixpkgs to access the current environment variables:

$ NIXPKGS_ALLOW_UNFREE=1 nix run --impure nixpkgs#discord

To use nonfree software in a flake, 
add nixpkgs as an input in your flake and import it with the allowUnfree option:

pkgs = import nixpkgs { config = { allowUnfree = true; }; };

Enable unfree software in home-manager

If you want to install software using home-manager 
via nix flakes 
in non NixOS systems (like darwin) 
you can use the home-manager nixpkgs.config option 
for example

nixpkgs.config.allowUnfree = true;

