# nix flakes

List requirements in flake.nix ;  an attribute set . 

Attribute keys :  

inputs: attribute set of dependencies/requirements

outputs: function :  from    attribute set of realized inputs  to  attribute set 

description 

Example :

{
  inputs = {
    home-manager.url = "github:nix-community/home-manager";
  };
}


# Use a flake: 

Create a git repo

git init

Create the file flake.nix

nix flake init . 

Add flake.nix to the staging area 

git add flake.nix 


{
 
# description, inputs and outputs only needed

  description = "...";

  nixConfig.bash-prompt = "\[nix-develop\]$ "; # You wanna set up the nix develop bash prompt for each development env?

  inputs = {

    # github 

    nixpkgs.url = "github:Mic92/nixpkgs/master";

    # git url

    git-example.url = "git+https://git.somehost.tld/user/path";

    # local directory

    directory-example.url = "path:/path/to/repo";
    
    # if the dependency is not a flake!

    bar.url = "github:foo/bar/branch";
    bar.flake = false;

    # change/overwrite a dependency's input parameter -- e.g. give it this flake's nixpkgs version

    sops-nix.url = "github:Mic92/sops-nix";
    sops-nix.inputs.nixpkgs.follows = "nixpkgs";

    # specify the revision/version of the dependency

    nix-doom-emacs.url = "github:vlaci/nix-doom-emacs?rev=238b18d7b2c8239f676358634bfb32693d3706f3";
    nix-doom-emacs.flake = false;

    # use a sub folder (here called shu) of a repo
    nixpkgs.url = "github:foo/bar?dir=shu";
  }


# now here is the outputs part;  could use outputs = { self, nixpkgs }: { insteadh 
  { self, ... }@inputs:  
  {

# Stuff for `nix flake init -t <flake>#<name>`  ; We can output a template ! perhaps take its structure from a github repo

    templates."<name>" = { path = "<store-path>"; description = ""; };
    defaultTemplate = {path = "<store-path>"; description = "template description goes here?"; }; # this is if not giving hte name e.g. nix flake init -t <flake>

# output stuff for nix build .#<name>
    packages."<system>"."<name>" = derivation;
    packages.<system>.default = derivation;    # this is if not giving the name, e.g. nix build .
    defaultPackage."<system>" = derivation;    # this is if not giving the name for older nix 

# You wanna be able to run it like an app using nix run ? (if using just nix-build then you can run it from the result symlink)
# output stuff for `nix run .#<name>`
    apps."<system>"."<name>" = { type = "app"; program = "<store-path>"; };
    apps.<system>.default = { type = "app"; program = "..."; }; # if not giving a name , e..g nix run .
    defaultApp."<system>" = { type = "app"; program = "..."; }; # if not giving a name, but for old nix

# You wanna use this flake for nixos modules? # (nixosConfigurations."<hostname>".config.system.build.toplevel must be a derivation)
# Stuff for `nixos-rebuild --flake .#<hostname>` 
#  or stick this flake.nix in /etc/nixos alongside the configuration.nix , and just run nixos-rebuild switch like normal 

    nixosConfigurations."<hostname>" = {};
# e.g. 
    nixosConfigurations.my-nixos-laptop = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [ ./configuration.nix ];
    };

# provide a default module to be used by other flakes

    nixosModule = { config }: { options = {}; config = {}; };
    nixosModules = {};  # or a list or attrs of modules to be used by other flakes

# You wanna be able to have a development shell with all the env vars of this flake ? 
# Stuff for `nix develop .#<name>`

    devShells."<system>"."<name>" = derivation;
    devShells.<system>.default= derivation; #  `nix develop` without name
    devShell."<system>" = derivation; # without name for older nix

# You want a hydra build job?
    hydraJobs."<attr>"."<system>" = derivation;

  }
}



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






# Pushing Flakes to Cachix

https://docs.cachix.org/pushing#flakes



# Build specific attributes in a flake repository

When in the repository top-level, run nix build .#<attr>. 

It will look in the legacyPackages and packages output attributes 

for the corresponding derivation.

Eg, in nixpkgs:

 nix build .#hello

# Importing packages from multiple channels

Create an overlay on the pkgs attribute :

let
  overlay-unstable = final: prev: {
    unstable = nixpkgs-unstable.legacyPackages.${prev.system}; # considering nixpkgs-unstable is an input registered before.
  };
in nixpkgs.overlays = [ overlay-unstable ]; # we assign the overlay created before to the overlays of nixpkgs.

should make a package accessible through pkgs.unstable.package For example, a NixOS config flake skeleton could be as follows:

{
  description = "NixOS configuration with two or more channels";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-21.11"; 
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable"; 
  };

  outputs = { self, nixpkgs, nixpkgs-unstable }:
    let
      system = "x86_64-linux";
      overlay-unstable = final: prev: {
        unstable = nixpkgs-unstable.legacyPackages.${prev.system};
        # use this variant if unfree packages are needed:
        # unstable = import nixpkgs-unstable {
        #   inherit system;
        #   config.allowUnfree = true;
        # };

      };
    in {
      nixosConfigurations."<hostname>" = nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          # Overlays-module makes "pkgs.unstable" available in configuration.nix
          ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-unstable ]; })
          ./configuration.nix
        ];
      };
    };
}

# NixOS configuration.nix, can now use "pkgs.package" or "pkgs.unstable.package"

{ config, pkgs, ... }: {
  environment.systemPackages = [pkgs.firefox pkgs.unstable.chromium];
  # ...
}

Same can be done with the NURs, 
as it already has an overlay attribute in the flake.nix of the project, 
you can just add
nixpkgs.overlays = [ nur.overlay ];

If the variable nixpkgs points to the flake, 
you can also define pkgs with overlays with:

pkgs = import nixpkgs { overlays = [ /*the overlay in question*/ ]; };

# Getting Instant System Flakes Repl

How to get a nix repl out of your system flake:

# nix repl 
>> :lf /etc/nixos
>> nixosConfigurations.myhost.config
{ ... }

Or out of your current flake:

# nix repl 
>> :lf .#

However, this won't be instant upon evaluation if any file changes have been done 
since your last configuration rebuild. 

Instead, if one puts:

nix.nixPath = let path = toString ./.; in [ "repl=${path}/repl.nix" "nixpkgs=${inputs.nixpkgs}" ];

In their system flake.nix configuration file, 

and includes the following file in their root directory flake as repl.nix:

let
  flake = builtins.getFlake (toString ./.);
  nixpkgs = import <nixpkgs> { };
in
{ inherit flake; }
// flake
// builtins
// nixpkgs
// nixpkgs.lib
// flake.nixosConfigurations

(Don't forget to git add repl.nix && nixos-rebuild switch --flake "/etc/nixos") 
Then one can run (or bind a shell alias):

source /etc/set-environment && nix repl $(echo $NIX_PATH | perl -pe 's|.*(/nix/store/.*-source/repl.nix).*|\1|')

This will launch a repl with access to nixpkgs, lib, and the flake options in a split of a second.

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




# Update a requirement

nix flake lock --update-input home-manager


Analogy alert:  

flakes  ~   package managers cargo or npm    but flakes is not a central repo. 

Flakes replaces: 

nix-channels program 

builtins.fetchgit 


# Install flakes on nixos

In configuration.nix:

{ pkgs, ... }: {
  nix = {
    package = pkgs.nixFlakes; # or versioned attributes like nixVersions.nix_2_8
    extraOptions = ''
      experimental-features = nix-command flakes
    '';
   };
}

# Install flakes on nix

nix-env -iA nixpkgs.nixFlakes

Add this to either 

~/.config/nix/nix.conf or /etc/nix/nix.conf

experimental-features = nix-command flakes

nix flake manual.

Output schema
This is described in the nix package manager src/nix/flake.cc in CmdFlakeCheck.
The nix flake subcommand is described in command reference page of the unstable manual 



# How can I use a project made with flakes  if I am using an older nix version ? 

Use flake-compat

to shim: 

default.nix 

shell.nix 

flake-compat downloads the flake inputs, 

flake-compat passes inputs to the flake’s output function 

returns attribute set containing defaultNix and shellNix attributes. 

defaultNix and shellNix contain: 

output attribute set 

with an attribute pointing to defaultPackage e.g. devShell for shellNix


Place the following into default.nix 

(for shell.nix, replace defaultNix with shellNix) 

to use the shim:

(import (
  fetchTarball {
    url = "https://github.com/edolstra/flake-compat/archive/12c64ca55c1014cdc1b16ed5a804aa8576601ff2.tar.gz";
    sha256 = "0jm6nzb83wa6ai17ly9fzpqc40wg1viib8klq8lby54agpl213w5"; }
) {
  src =  ./.;
}).defaultNix

nix flake lock --update-input flake-compat

Add the following to your flake.nix:

  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };

add flake-compat to the arguments of outputs attribute. 

Then use default.nix like the following:

(import (
  let
    lock = builtins.fromJSON (builtins.readFile ./flake.lock);
  in fetchTarball {
    url = "https://github.com/edolstra/flake-compat/archive/${lock.nodes.flake-compat.locked.rev}.tar.gz";
    sha256 = lock.nodes.flake-compat.locked.narHash; }
) {
  src =  ./.;
}).defaultNix



# Used for nixpkgs packages, also accessible via `nix build .#<name>`

legacyPackages."<system>"."<name>" = derivation;

# Wanna do a check ? 

# output stuff for nix flake check

{ self, ... }@inputs:
{
  checks."<system>"."<name>" = derivation;
}


# You wanna give an overlay that other flakes can use ? 

## provide a default overlay to be used by other flakes

overlay = final: prev: { };

## provide an attrs of overlays for other flakes to use

overlays = {};

# References

Eelco Dolstra's RFC #49 
This is the initial RFC for Flakes to be included in NixOS, 
from July 2019

https://www.tweag.io/blog/2020-05-25-flakes/















nix shell github:edolstra/dwarffs --command dwarffs --version

nix shell github:edolstra/dwarffs/cd7955af31698c571c30b7a0f78e59fd624d0229 --command dwarffs --version

# View the dependencies of a flake: 

nix flake metadata github:edolstra/dwarffs

# View the outputs of a flake

nix flake show github:edolstra/dwarffs

nix build github:edolstra/dwarffs#checks.aarch64-linux.build

lock file locks all dependencies, 

# add something to the flake registry

flake registry maps 
identifiers e.g. nixpkgs 
to locations e.g. https://github.com/NixOS/nixpkgs 

equivalent by default:

nix shell nixpkgs#cowsay --command cowsay Hi!

nix shell github:NixOS/nixpkgs#cowsay --command cowsay Hi!

override the registry locally 
e.g. override the nixpkgs flake to your own Nixpkgs

nix registry add nixpkgs ~/my-nixpkgs

nix registry add nixpkgs github:NixOS/nixpkgs/5272327b81ed355bbed5659b8d303cf2979b6953



# Change channels 

~/.nix-channel  add the unstable repo here

e.g.

sudo cat /root/.nix-channels

https://nixos.org/channels/nixos-unstable nixos

nix-channel --update

nixos-rebuild switch


# Example

git init hello

cd hello

echo 'int main() { printf("Hello World"); }' > hello.c

git add hello.c

To turn this Git repository into a flake, 
we add a file named flake.nix at the root of the repository with the following contents:

{
  description = "A flake for building Hello World";

  inputs.nixpkgs.url = github:NixOS/nixpkgs/nixos-20.03;

  outputs = { self, nixpkgs }: {

    defaultPackage.x86_64-linux =
      # Notice the reference to nixpkgs here.
      with import nixpkgs { system = "x86_64-linux"; };
      stdenv.mkDerivation {
        name = "hello";
        src = self;
        buildPhase = "gcc -o hello ./hello.c";
        installPhase = "mkdir -p $out/bin; install -t $out/bin hello";
      };

  };
}

nix flake init 
creates a basic flake.nix

git add flake.nix

nix build

$ ./result/bin/hello

or 

$ nix shell --command hello

development environment 
with dependencies like gcc 
and shell variables 
and functions 
from the derivation are in scope:

nix develop

eval "$buildPhase"

./hello


attributes:
inputs :
specifies other flakes that this flake depends on. 
nix fetches them passes them as arguments to the outputs function.

The outputs attribute is a function 
that produces an attribute set. 

function arguments are the flakes specified in inputs.

The self argument is this flake. 
e.g. in outputs could put  src = self; 

or 
self.defaultPackage.x86_64-linux

outputs are attributes

these attributes could be anything  ,  but some tools like nix develop expect the certain attrs

dependency specification github:NixOS/nixpkgs/nixos-20.03 is imprecise: 
it says that we want to use the nixos-20.03 branch of Nixpkgs, 
but doesn’t say which Git revision. 
however when we ran nix build, Nix automatically generated a lock file 
that precisely states which revision of nixpkgs to use:

$ cat flake.lock

Another build of this flake will use the nixpkgs version that is written in the lock file

add new inputs to flake.nix ? 
then when you run any command such as nix build, 
Nix will automatically add corresponding locks to flake.lock. 


to update these already locked versionsj: 

 nix flake lock --update-input nixpkgs
 nix build

make sure all in order
 nix flake check

then commit project 
 git commit -a -m 'Initial version'

then  push it to GitHub
 git remote add origin git@github.com:edolstra/hello.git
 git push -u origin master

someone else can run this flake like this 

 nix shell github:edolstra/hello -c hello


managing NixOS system configurations, 

distributing Nixpkgs overlays 

distributing NixOS modules, 

using CI 












If something is slow because it has to keep going a long distance to get something ;  
then bring the big heap of what it is getting closer by first ,  and then it only has to reach for it ; 
result --  time saved. 
this is called caching 


Nix evaluation is slow. 
Nix first needs to evaluate a substantial Nix program. 
parsing potentially thousands of .nix files
 and running a Turing-complete language.

flakes does caching 


e.g.  nix-env -qa 

shows available packages in Nixpkgs. 

see how slow it is ! 

command time nix-env -qa | wc -l

also evaluating individual packages 
or configurations is slow. 

e.g. nix-shell to enter a development environment for Hydra, 
we wait

$ command time nix-shell --command 'exit 0'

one or two or more seconds too slow!


if something is already present in the Nix store, 
Nix won’t build or download it again. 
But it still re-evaluates the Nix files 
to determine which Nix store paths are needed.

Caching evaluations 

evaluation produces the same result = funcitonal  


keep a cache that records 
attribute A of file X 
evaluates to derivation D 

( cache invalidation is hard however ,  look it up !) 

doesn't work - 
past Nix evaluation was not hermetic. 
e.g. nix file can import other Nix files through relative or absolute paths 
(such as ~/.config/nixpkgs/config.nix for Nixpkgs) or 
by looking them up in the Nix search path ($NIX_PATH). 

So a cached result might be inconsistent with the input.

there was an alternative to nix-env -qa 
called nix search, 
it used a cache
It had this cache invalidation problem: 
can not figure out whether its cache was up to date with 
whatever Nixpkgs version you're using. 
So it had a manual flag --update-cache to allow the user to force cache invalidation

Flakes solve this 
flakes ensure hermetic evaluation. 

When you evaluate an output attribute 
of a flake 
e.g. the attribute defaultPackage.x86_64-linux 
, Nix does not allow access to any file outside of this flake 
or the flake dependencies. 

nix running a flake also does not allow platform-dependent feature 
such as access to environment variables 
or the current system type.

so nix command can cache evaluation results 

e..g run Firefox from the nixpkgs flake. 

do this with an empty evaluation cache, 
then Nix needs to evaluate the entire dependency graph of Firefox, 
which takes a quarter of a second:

$ command time nix shell nixpkgs#firefox -c firefox --version

do it again! 

 command time nix shell nixpkgs#firefox -c firefox --version
Mozilla Firefox 75.0

The cache is a database (sqlite) 
in db -->  values of flake output attributes. 

After the first command above, the cache looks like this:

$ sqlite3 ~/.cache/nix/eval-cache-v1/302043eedfbce13ecd8169612849f6ce789c26365c9aa0e6cfd3a772d746e3ba.sqlite .dump
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Attributes (
    parent      integer not null,
    name        text,
    type        integer not null,
    value       text,
    primary key (parent, name)
);
INSERT INTO Attributes VALUES(0,'',0,NULL);
INSERT INTO Attributes VALUES(1,'packages',3,NULL);
INSERT INTO Attributes VALUES(1,'legacyPackages',0,NULL);
INSERT INTO Attributes VALUES(3,'x86_64-linux',0,NULL);
INSERT INTO Attributes VALUES(4,'firefox',0,NULL);
INSERT INTO Attributes VALUES(5,'type',2,'derivation');
INSERT INTO Attributes VALUES(5,'drvPath',2,'/nix/store/7mz8pkgpl24wyab8nny0zclvca7ki2m8-firefox-75.0.drv');
INSERT INTO Attributes VALUES(5,'outPath',2,'/nix/store/5x1i2gp8k95f2mihd6aj61b5lydpz5dy-firefox-75.0');
INSERT INTO Attributes VALUES(5,'outputName',2,'out');
COMMIT;

the cache, the db, has the attributes 
that nix shell had to evaluate, 

which was legacyPackages.x86_64-linux.firefox.{type,drvPath,outPath,outputName}. 

also stored are attributes that don’t exist (such as packages).

nix search 
now uses this evaluation cache 

e.g. search for Blender

$ command time nix search nixpkgs blender

second time it is fast with less memory:

$ command time nix search nixpkgs blender

The evaluation cache here is about 10.9 MiB 
so the overhead for creating the cache is modest: 

with the flag --no-eval-cache, 
nix search nixpkgs blender 
takes long time 

drv files are a serialization of the dependency graph of a package 

derivations may be garbage-collected. 
then evaluation cache points to a non-existing path 
Nix checks whether the .drv file still exist, and if not, falls back to evaluating normally.

In future!  Nix, download the pre-made cache! 
you already have binary cache with the contents of store paths! 
e.g. 
we need a cache like 302043eedf….sqlite, 
first check if it’s available on cache.nixos.org 
yes? ok fetch it  

then run a command such as nix shell nixpkgs#firefox, 
no need to even fetch the flake src  

nix shell nixpkgs#firefox 
create a cache entry for firefox, 
but not for the dependencies of firefox; 
thus a subsequent nix shell nixpkgs#thunderbird won’t see a speed improvement 
even though it shares most of its dependencies. 
So, have knowledge of the evaluation cache. 
e.g. the evaluation of thunks that represent attributes like 
nixpkgs.legacyPackages.x86_64-linux.<package name> 
could check and update the cache.

