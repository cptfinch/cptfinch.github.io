---
layout: post
title:  "Putting shell scripts in to the Nix store"
---

non flake:

writeShellScript 

# Option 1 ; shell script inside the derivation

  ```nix
someBuildHelper = { name, sha256 }:
  stdenv.mkDerivation {
    inherit name;
    outputHashMode = "recursive";
    outputHashAlgo = "sha256";
    outputHash = sha256;
    builder = writeShellScript "builder.sh" ''
      echo "hi, my name is ''${0}" # escape bash variable
      echo "hi, my hash is ${sha256}" # use nix variable
      echo "hello world" >output.txt
    '';
  };
```
# Option 2 ; separate shell script , refer to it in the derivation 

default.nix
```nix
{
  outputTxtDrv = stdenv.mkDerivation rec {
    name = "output.txt";
    # disable unpackPhase etc
    phases = "buildPhase";
    builder = ./builder.sh;
    nativeBuildInputs = [ coreutils jq ];
    PATH = lib.makeBinPath nativeBuildInputs;
    # only strings can be passed to builder
    someString = "hello";
    someNumber = builtins.toString 42;
    someJson = builtins.toJSON { dst = "world"; };
  };
}
```

builder.sh
```bash
echo "$someString $(echo "$someJson" | jq -r '.dst') $someNumber" >$out
```

# Option 3 ; use runConmand instead of stdenv.mkderivation

runCommand on an external script 

# default.nix
```nix
{
  outputTxtDrv = runCommand "output.txt" {
    nativeBuildInputs = [ coreutils jq ];
    # only strings can be passed to builder
    someString = "hello";
    someNumber = builtins.toString 42;
    someJson = builtins.toJSON { dst = "world"; };
  } (builtins.readFile ./builder.sh);
}
```

# Wrap a program with env vars

here, wrapProgram moves the script to .github-downloader.sh-wrapped


```nix

# nix-build -E 'with import <nixpkgs> { }; callPackage ./default.nix { }'

{ stdenv
, lib
, fetchFromGitHub
, bash
, subversion
, makeWrapper
}:
  stdenv.mkDerivation {
    pname = "github-downloader";
    version = "08049f6";
    src = fetchFromGitHub {
      # https://github.com/Decad/github-downloader
      owner = "Decad";
      repo = "github-downloader";
      rev = "08049f6183e559a9a97b1d144c070a36118cca97";
      sha256 = "073jkky5svrb7hmbx3ycgzpb37hdap7nd9i0id5b5yxlcnf7930r";
    };
    buildInputs = [ bash subversion ];
    nativeBuildInputs = [ makeWrapper ];
    installPhase = ''
      mkdir -p $out/bin
      cp github-downloader.sh $out/bin/github-downloader.sh
      wrapProgram $out/bin/github-downloader.sh \
        --prefix PATH : ${lib.makeBinPath [ bash subversion ]}
    '';
  }
```

makeWrapper <executable> <wrapperfile> <args>

add `FOOBAR=baz` to `$out/bin/foo` environment

makeWrapper $out/bin/foo $wrapperfile --set FOOBAR baz

prefix the paths of `hello` and `git`

makeWrapper $out/bin/foo $wrapperfile --prefix PATH : ${lib.makeBinPath [ hello git ]}

Read: nixpkgs/pkgs/build-support/setup-hooks/make-wrapper.sh 

and 

nixpkgs/pkgs/build-support/setup-hooks/make-binary-wrapper/make-binary-wrapper.sh 

wrapProgram is a convenience function you probably want to use most of the time, implemented by both makeWrapper and makeBinaryWrapper.

a command is not found?: 

nix-locate bin/stat | grep 'bin/stat$'

# trace sh commands 

test-trace.nix
```nix
{ runCommand, coreutils }:
  runCommand "output.txt" {
    nativeBuildInputs = [ coreutils ];
  } ''
    # line 5 in nix file = line 1 in bash script -> offset 4
    PS4='+ Line $(expr $LINENO + 4): '
    set -o xtrace # print commands

    echo hello >$out # line 9 in nix file

    set +o xtrace # hide commands
  ''
```

nix-build -E 'with import <nixpkgs> { }; callPackage ./test-trace.nix { }'




# package a shell script  

writeShellScriptBin ; in nixpkgs ; function ;  takes script filename and its contents

~/bin/simple-script.sh
```sh
DATE=$(ddate +'the %e of %B%, %Y')

cowsay Hello, world! Today is $DATE.
```

dependencies: ddate ; cowsay

now make it A flake

./simple-script/flake.nix
```nix
{
  description = "A simple script";

  outputs = { self, nixpkgs }: {
    defaultPackage.x86_64-linux = self.packages.x86_64-linux.my-script;

    packages.x86_64-linux.my-script =
      let
        pkgs = import nixpkgs { system = "x86_64-linux"; };
      in
      pkgs.writeShellScriptBin "my-script" ''
        DATE="$(${pkgs.ddate}/bin/ddate +'the %e of %B%, %Y')"
        ${pkgs.cowsay}/bin/cowsay Hello, world! Today is $DATE.
      '';
  };
}
```

Run this flake ,  it will run the default package in flake.nix

nix run ./simple-script#

or

cd ./simple-script 
nix run .#

Run a non-default package of the flake.nix

nix run ./simple-script#my-script

or...

cd ./simple-script 
nix run .#my-script


ok , i don't wanna make this script only usable on nix 

multiple OSes, 

or multiple Linux distros

use these:

symlinkJoin ; nix function

wrapProgram ; shell script


now: 

./better-script/flake.nix
```nix
{
  description = "A better version";

  outputs = { self, nixpkgs }: {
    defaultPackage.x86_64-linux = self.packages.x86_64-linux.my-script;

    packages.x86_64-linux.my-script =
      let
        pkgs = import nixpkgs { system = "x86_64-linux"; };

        my-name = "my-script";
        my-script = pkgs.writeShellScriptBin my-name ''
          DATE=$(ddate +'the %e of %B%, %Y')
          cowsay Hello, world! Today is $DATE.
        '';
        my-buildInputs = with pkgs; [ cowsay ddate ];
      in pkgs.symlinkJoin {
        name = my-name;
        paths = [ my-script ] ++ my-buildInputs;
        buildInputs = [ pkgs.makeWrapper ];
        postBuild = "wrapProgram $out/bin/${my-name} --prefix PATH : $out/bin";
      };
  };
}
```

Breakdown

my-name = "my-script";
my-script = pkgs.writeShellScriptBin my-name ''
  DATE=$(ddate +'the %e of %B%, %Y')
  cowsay Hello, world! Today is $DATE.
'';
On lines 11-15, we create a derivation for our script7. This version is exactly the same as the very first one we created back in 3.1. This isn’t the end of the story though, as we once again have lost track of what our dependencies (cowsay and ddate) are! This version of the script assumes these apps will be available on the PATH.

my-buildInputs = with pkgs; [ cowsay ddate ];
On line 16, we create a variable to store the list of dependencies our script has. Now we just need to deploy our script in such a way that these are available in its PATH at runtime.

pkgs.symlinkJoin {
  name = my-name;
  paths = [ my-script ] ++ my-buildInputs;
  buildInputs = [ pkgs.makeWrapper ];
  postBuild = "wrapProgram $out/bin/${my-name} --prefix PATH : $out/bin";
};

symlinkJoin is where the magic happens. This Nix function creates a derivation that combines the files of several different packages into a single package. You can see on line 19, we provide a list of all the packages to join together (our script, plus our two dependencies). This will ensure that all of our dependencies are installed when our script is installed, but we still need to arrange things so these apps are on the PATH at runtime.

The NixOS package makeWrapper provides a very handy shell script, wrapProgram, that will let us specify our script’s PATH. On line 20 we let Nix know that makeWrapper is needed to build this package, and line 21 instructs wrapProgram to append $out/bin to our script’s PATH. $out/bin is the directory where our shell script is installed to and, thanks to symlinkJoin, also where cowsay and ddate live!

nix build

ls -ogA result/bin

total 16
lrwxrwxrwx 1  66 Dec 31  1969 cowsay -> /nix/store/qznd0pqdw925g7vz0iaynbszlvypdcvq-cowsay-3.04/bin/cowsay
lrwxrwxrwx 1  65 Dec 31  1969 ddate -> /nix/store/g9prmy4a60khk5021w2awrzzfr1fkpgq-ddate-0.2.2/bin/ddate
-r-xr-xr-x 1 259 Dec 31  1969 my-script
lrwxrwxrwx 1  67 Dec 31  1969 .my-script-wrapped -> /nix/store/x6j48dklxm9d7cjwga5arzpcq6n2w461-my-script/bin/my-script

cowsay and ddate are here as promised, but note that we also have two versions of my-script. These two files are the result of wrapProgram:

.my-script-wrapped

This hidden file is a symlink to the script we created on lines 12-15 above (using writeShellScriptBin). If you cat it, you’ll see it’s our shell script, verbatim.

my-script

This is the script users will actually call. If you cat this file, you’ll see a very small shell script that updates the PATH, as we’ve instructed, then replaces itself (exec) with .my-script-wrapped. Magic!

# The best version 

Our script is currently written inline, in flake.nix itself. That’s not ideal.

Move script to its own file

script :

provide a flake.nix for Nix-systems 

provide a PKGBUILD file for Arch-systems. 

./best-version/simple-script.sh
```sh
#!/usr/bin/env bash
DATE=$(ddate +'the %e of %B%, %Y')
cowsay Hello, world! Today is $DATE.
```

This is the same script from the beginning of this article… except we’ve added in a shebang on the first line. Now that we’ve specified the script’s interpreter, it’s a proper shell script in its own right!

The reason why we’re adding the shebang at this point is to fully decouple the script from our Nix package. You can run it directly (assuming cowsay and ddate are available on your system) or package it for another OS.

Update flake.nix

The only part of our package we need to change is our my-script variable. The original (inline) definition of this variable is:

my-script = pkgs.writeShellScriptBin my-name ''
  DATE=$(ddate +'the %e of %B%, %Y')
  cowsay Hello, world! Today is $DATE.
'';
Our new definition of this variable is:

my-src = builtins.readFile ./simple-script.sh;
my-script = (pkgs.writeScriptBin my-name my-src).overrideAttrs(old: {
  buildCommand = "${old.buildCommand}\n patchShebangs $out";
});

We’ve got three changes here:

Instead of our script being inline, we read it from ./simple-script.sh.

We use writeScriptBin instead of writeShellScriptBin. 

writeShellScriptBin prepends a shebang line, but our script already has one.

We update our package’s buildCommand by appending patchShebangs .. 

This command will update our script’s interpreter to point to the correct binary on the system. ie: #!/usr/bin/env bash will be replaced with something like #!/nix/store/1flh34xxg9q3fpc88xyp2qynxpkfg8py-bash-4.4-p23/bin/bash.



./best-version/flake.nix
```nix
{
  description = "A best script!";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        my-name = "my-script";
        my-buildInputs = with pkgs; [ cowsay ddate ];
        my-script = (pkgs.writeScriptBin my-name (builtins.readFile ./simple-script.sh)).overrideAttrs(old: {
          buildCommand = "${old.buildCommand}\n patchShebangs $out";
        });
      in rec {
        defaultPackage = packages.my-script;
        packages.my-script = pkgs.symlinkJoin {
          name = my-name;
          paths = [ my-script ] ++ my-buildInputs;
          buildInputs = [ pkgs.makeWrapper ];
          postBuild = "wrapProgram $out/bin/${my-name} --prefix PATH : $out/bin";
        };
      }
    );
}
```



# How do i have a local file as a dependency ?

use symlinkjoin to have other nix packages such as cowsay available to the script ;  

but i want to make a file in the same dir as the flake.nix and the script  available ;

so that the script can call this file ,  

it is a csv file and the script uses awk to get some data from it ..

add fw-data.csv to 'paths' in symlinkjoin? :

 paths = [ script2 "./fw-data.csv"  ] ++ buildInputs2;

what does the output dir have now ? 



remember to git add .



If the flake is in a git repo; have you comitted the file to the repo as well? 

Flakes tend to follow gitignore rules when copying files to the build derivation  !!!!  is this why it was ignorming my my.config file ? this .config is a gitignore rule ? 

patch the script to find the file in the store

the CSV, either: 

patch it, 

or wrap it with args  

or wrap it with envvars 

or have it as a relative path in the script, but make sure to cd to it properly  


takes fw-data.csv as first argument 

fw-login.sh fw-data.csv

```nix
{
  outputs = {self, nixpkgs}: let 
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system}.default = with pkgs; stdenv.mkDerivation {
      name = "fw-login";
      nativeBuildInputs = [makeWrapper];
      dontUnpack = true;
      dontBuild = true;
      installPhase = ''
        install -Dm555 ${./fw-login.sh} $out/bin/fw-login
        wrapProgram $out/bin/fw-login \
          --add-flags "${./fw-data.csv}"
      '';
    };
  };
}
```


beware it could be using the CWD to lookup a file. 

it doesnt matter the files in the result package, if you use cd /tmp; nix run my-flake, it will look up /tmp/fw_data.csv

Well, whether a link is there or not doesn't matter if you simply do not point your script to the location of the link

```nix
{
  outputs = {self, nixpkgs}: let 
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system}.default = with pkgs; stdenv.mkDerivation {
      name = "fw-login";
      dontUnpack = true;
      dontBuild = true;
      installPhase = ''
        install -Dm555 ${./fw-login.sh} $out/bin/fw-login
        substituteInPlace $out/bin/fw-login --replace "./fw-data.csv" "${./fw-data.csv}"
      '';
    };
  };
}
``` 

it is as if those are put on the PATH env var ;  but the csv local file doesn't get put on path

As its not an executable, it doesn't belong in a location in the PATH

hm ok but i thought the wrapProgram was putting the dir on the PATH  ,  the dir where the script and dependencies are put by symlinkjoin

so if the csv file was in this dir  ,  then the script should see it

this has nothing to do with what Nix does, your script reads the file from CWD

what you are thinking is 

"$(cd "$(dirname "${BASH_SOURCE[0]}"; pwd)"/fw-data.csv

make the script aware of its environment by using an env var, such that you can wrap

or these would work ? 

SCRIPT=$(realpath "$0")

SCRIPTPATH=$(dirname "$SCRIPT")

"$SCRIPTPATH/fw_data.csv "

: ${CSV_FILE:=fw-data.csv} 

in the script will set $CSV_FILE to fw-data.csv if it isn't set already in the env.

Have you added some debuglogging that tells you what realpath $0 actually expands to?

Or dirname $(realpath $0)?

realpath might not actually do what you think it does

Stop doing the magic in the script, just accept an argument or envvar and use a default if its missing. 

Then use wrapProgram to wrap the script.

That is the most portable way that requires the minimum amount of changes

what does the ${./fw-data.csv}   expand to ?

The location of fw-data.csv, in a flake it would be within the flakes store path

When you say accept an envvar  ;  little more info on that please --- how is that normally done ?

By reading a variable from the environment

but the env var for csv file  ,  this has to point to somewhere in the nix store right ?

```sh
#!/usr/bin/env bash

: ${CSV_FILE:=fw-data.csv}

echo $CSV_FILE
```

Run this as ./script and as CSV_FILE=foo.csv ./script

or just keep csv file out of the store ?  but i thought all dependencies should have their place in the store

Of course, thats why I said, use wrapProgram to set it

I'm not sure if the CSV has to be considered a dependency or mutable runtime data…

it is read only

like a databae , to look up url

Do you want to redeploy if the CSV changes?

yes the csv file could change -- what do yo umean 'redeploy'  ?

it could change like once every few months or so ..

i.e. a new url line added to the file

For me this sounds like rarely touched runtime data, depending on how exactly the file is managed, I'd put it elsewhere and leave the shell script alone in the store reading the location of the file from an env var or argument




refs: https://ertt.ca/nix/shell-scripts/  ;
