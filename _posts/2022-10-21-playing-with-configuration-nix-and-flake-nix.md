
# Playing with configuration.nix and flake.nix

# Why not pass on the inputs through to the configuration.nix ?  e.g. lets pass on home-manager ! then configuraiton.nix can import it there

# use the specialArgs attribute:

{
  inputs.nixpkgs.url = github:NixOS/nixpkgs;
  inputs.home-manager.url = github:nix-community/home-manager;
  
  outputs = { self, nixpkgs, ... }@attrs: {
    nixosConfigurations.fnord = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = attrs;
      modules = [ ./configuration.nix ];
    };
  };
}
Then, you can access the flake inputs from the file configuration.nix like this:

{ config, lib, nixpkgs, home-manager, ... }: {
  # do something with home-manager here, for instance:
  imports = [ home-manager.nixosModule ];
  ...
}

sudo nixos-rebuild switch --flake '.#'
sudo nixos-rebuild switch --flake '/etc/nixos#joes-desktop'

