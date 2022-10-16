---
layout: post
title:  "Nix and Haskell"
---


new project, 

create a cabal file. 

nix-shell --packages ghc --run 'cabal init'

create a dir 

name it same as your intended haskell package
if not the same name as intended package , then set a name attribute in default.nix if the folder is not the package name

cd dir

touch default.nix

vim default.nix :

let
  pkgs = import <nixpkgs> { };
in
  pkgs.haskellPackages.developPackage {
    root = ./.;
  }

 
run nix-build.

or 

run nix-shell  ---   and then use cabal


package is not in Hackage? 

add it .e.g  path to package called grid.

let
  pkgs = import <nixpkgs> { };
in
  pkgs.haskellPackages.developPackage {
    root = ./.;
    source-overrides = {
      grid = ../grid;
    };
  }


or once in the nix-shell , use cabal to install packages ;  and use a cabal.project to say where they are.  

hm, you could have 2 packages installed in your nix shell development environment; 

one by Nix (because it was listed in default.nix) 

and another by cabal-install (because it was listed in cabal.project). 

no harm, but a little confusing.

just use default.nix, and don't bother with the cabal.project file. 

rebuild a dependency:

exit the shell and re-enter it 

Any packages listed in default.nix 
will automatically be rebuilt

# create an executable haskell script

Add to the top of Haskell source file. 
e.g. a dependency on a package called pandoc

/usr/bin/env nix-shell

nix-shell -p "haskellPackages.ghcWithPackages (p: [p.pandoc])"

nix-shell -i runghc

Make the file executable, 

run it 

./something.hs




# Use cabal:

nix-shell -p haskell.compiler.ghc8104 -p cabal-instal -p zlib 

(zlib here is the system library, not the Haskell package)

now, this is within the nix-shell:

cabal build 

# Use stack

Use shellFor from nixpkgs:

similar to developPackage

can develop multiple Haskell packages together 

similar to cabal.project

# Use haskell.nix

can 

generate your own Haskell package 

from a stack.yaml file, 

or Cabal solver  

then compile this Haskell package set with Nix

have some people using stack , others using cabal , others using nix.  

haskell.nix skeleton repo/ template 

e.g. jonascarpay/template-haskell 


simple project:

no cabal.project file  (i.e. simple project) 

then use developPackage 

complicated project:

multiple Haskell libraries 

use shellFor function

most flexible project: 

use haskell.nix





























nix shell / nix build environment ~ docker container 







Haskell dependency downloads from Stackage 

stack locally builds it 

stack uses nix for any non-haskell dependency 



Add this to stack.yaml

nix:
  enable: true
  packages: [glpk, pcre]


is this ghc compiler on your pc ? 

nix-env -f "<nixpkgs>" -qaP -A haskell.compiler.ghc801

what ghc's are available? 

nix-instantiate --eval -E "with import <nixpkgs> {}; lib.attrNames haskell.compiler"

or use nix repl

nix repl

:l <nixpkgs>

haskell.compiler.ghc<Tab>

stack finds libraries in the lib folder of a nix package, 

stack finds header files in the include folder of a nix package. 




If nix package does not use this standard layout of lib and include 
use a shell file

stack build 

stack exec 

use nix-shell 


build in nix-shell env

stack --nix build 

or any --nix* option 




stack builds in a nix shell


where does nix-shell find the nixpkgs attrs / package set ? 

NIX_PATH env var

or 

use your own local checkout of the nixpkgs repo 

--nix-path="nixpkgs=/my/own/nixpkgs/clone" 

or

in stack.yaml

nix:
  path: [nixpkgs=/my/own/nixpkgs/clone]

Nix options

stack --nix-help 

nix section in in stack.yaml

```nix
nix:

  # false by default. Must be present and set to `true` to enable Nix, except on
  # NixOS where it is enabled by default (see #3938).  You can set set it in your
  # `$HOME/.stack/config.yaml` to enable Nix for all your projects without having
  # to repeat it
  # enable: true

  # true by default. Tells Nix whether to run in a pure shell or not.
  pure: true

  # Empty by default. The list of packages you want to be
  # available in the nix-shell at build time (with `stack
  # build`) and run time (with `stack exec`).
  packages: []

  # Unset by default. You cannot set this option if `packages:`
  # is already present and not empty.
  shell-file: shell.nix

  # A list of strings, empty by default. Additional options that
  # will be passed verbatim to the `nix-shell` command.
  nix-shell-options: []

  # A list of strings, empty by default, such as
  # `[nixpkgs=/my/local/nixpkgs/clone]` that will be used to override
  # NIX_PATH.
  path: []

  # false by default. Whether to add your nix dependencies as nix garbage
  # collection roots. This way, calling nix-collect-garbage will not remove
  # those packages from the nix store, saving you some time when running
  # stack build again with nix support activated.
  # This creates a `nix-gc-symlinks` directory in the project `.stack-work`.
  # To revert that, just delete this `nix-gc-symlinks` directory.
  add-gc-roots: false
```

in shell.nix file :

```
{ghc}:
with (import <nixpkgs> {});

haskell.lib.buildStackProject {
  inherit ghc;
  name = "myEnv";
  buildInputs = [ glpk pcre ];
}
```


Defining manually a shell.nix file gives you the possibility to override some Nix derivations ("packages"), for instance to change some build options of the libraries you use, or to set additional environment variables. See the Nix manual for more. The buildStackProject utility function is documented in the Nixpkgs manual. In such case, stack expect this file to define a function of exactly one argument that should be called ghc (as arguments within a set are non-positional), which you should give to buildStackProject. This is the ghc from the resolver you set in the stack.yaml.

And now for the stack.yaml file:

nix:
  enable: true
  shell-file: shell.nix
The stack build command will behave exactly the same as above. Note that specifying both packages: and a shell-file: results in an error. (Comment one out before adding the other.)
