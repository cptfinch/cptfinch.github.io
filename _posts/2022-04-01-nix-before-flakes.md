---
layout: post
title:  "Nix before flakes"
---

nix-repl> with donkey; ({cat, dog, ... }: let blah= "blah1"; in {cat2="${cat.kitten} yeah"; dog2="${dog} yeah"; inherit blah donkey;}) {cat={kitten="mew mew";}; d{ blah = "blah1"; cat2 = "mew mew yeah"; dog2 = "woof1 yeah"; donkey = "eeawwww"; }


# References:

how-to guide: 

https://nixos.org/guides/nix-pills/our-first-derivation.html

manual:

https://nixos.org/manual/nix/stable/expressions/derivations.html


# create a derivation file

nix-repl> d = derivation { name = "myname"; builder = "mybuilder"; system = "mysystem"; }

nix-repl> d = derivation { name = "foo"; builder = "${bash}/bin/bash"; args = [ ./builder.sh ]; system = builtins.currentSystem; }

nix-repl> d = derivation { name = "myname"; builder = "${coreutils}/bin/true"; system = builtins.currentSystem; }



# Build the derivation 

nix-repl> :b d

or

```
$ nix-store --realise /nix/store/z3hhlxbckx4g3n9sw91nnvlkjvyw754p-myname.drv
```

or 

nix-build simple.nix 

you get a symlink in the current directory, pointing to the derivation's out path

nix-build :  

nix-instantiate : 

nix expression --> .drv file in nix store

nix-store --reaslise : 

.drv file to out path

creates result symlink

# What's in a derivation?

```sh
$ nix show-derivation /nix/store/z3hhlxbckx4g3n9sw91nnvlkjvyw754p-myname.drv
```

# outPath 

A derivation's outPath

nix-repl> d.outPath

or

nix-repl> builtins.toString d

or

nix-repl> "${d}"

or

nix-repl> "${coreutils}/bin/true"

"/nix/store/8w4cbiy7wqvaqsnsnb3zvabq1cp2zhyz-coreutils-8.21/bin/true"


notice:

nix-repl> builtins.toString { outPath = "foo"; }

"foo"

We put stuff in the $out folder

# InputDrvs

Dependency/requirements in inputDrvs. 

# args  

<builder>  <args parameter>

<builder> = bash  and <args parameter> = bash_script_to_build_the_derivation.sh

bash bash_script_to_build_the_derivation.sh

script could be
```sh
declare -xp
echo foo > $out
```

# inputSrcs

The sh script given in args is put in the nix store and out path added to the derivation's inputSrcs. 

nixos put this input builder.sh in to the nix store ,  and puts it into the derivation expression as a requirement.  it then u ses it in the build command

# Example - gnu hello world


Set up env vars -> unpack the source -> compile it , install it



```bash
export PATH="$gnutar/bin:$gcc/bin:$gnumake/bin:$coreutils/bin:$gawk/bin:$gzip/bin:$gnugrep/bin:$gnused/bin:$bintools/bin"

tar -xzf $src

cd hello-2.10

./configure --prefix=$out

make

make install
```

Download http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz

builder: bash

args: hello_builder.sh

hello.nix:

```nix
with (import <nixpkgs> {});
derivation {
  name = "hello";
  builder = "${bash}/bin/bash";
  args = [ ./hello_builder.sh ];
  inherit gnutar gzip gnumake gcc coreutils gawk gnused gnugrep;
  bintools = binutils.bintools;
  src = ./hello-2.10.tar.gz;
  system = builtins.currentSystem;
}
```

build it: 

nix-build hello.nix 

launch it 

result/bin/hello 


lets improve our build script !

```bash
set -e
unset PATH
for p in $buildInputs; do
  export PATH=$p/bin${PATH:+:}$PATH
done

tar -xf $src

for d in *; do
  if [ -d "$d" ]; then
    cd "$d"
    break
  fi
done

./configure --prefix=$out
make
make install
```

set -e    --->   exit if get an error 

unset PATH --->  path is set as a non-existing path to begin with ,  and because we want to add to the path ,  lets first delete this as we don't want this non-existing path there. 

for each path in $buildInputs, append bin to it

Unpack the source  /  tarball

cd into it.

configure

make 

install.


Now lets improve our nix source code  (in hello.nix)

```nix
with (import <nixpkgs> {});
derivation {
  name = "hello";
  builder = "${bash}/bin/bash";
  args = [ ./builder.sh ];
  buildInputs = [ gnutar gzip gnumake gcc coreutils gawk gnused gnugrep binutils.bintools ];
  src = ./hello-2.10.tar.gz;
  system = builtins.currentSystem;
}
```

# use a set containing commonly used parameters

autotools.nix:

```nix
pkgs: attrs:
  with pkgs;
  let defaultAttrs = {
    builder = "${bash}/bin/bash";
    args = [ ./builder.sh ];
    baseInputs = [ gnutar gzip gnumake gcc coreutils gawk gnused gnugrep binutils.bintools ];
    buildInputs = [];
    system = builtins.currentSystem;
  };
  in
  derivation (defaultAttrs // attrs)
```

this nix expression is a function. 

function input : parameter pkgs 

function output: a function expecting input parameter attrs.

with pkgs: put in scope pkgs .  pkgs is a set,  an attribute set , a set containing the parameters 

variable defaultAttrs is a set , a set of the common parameters we want 

derivation()    create the derivation 

Exercise: Complete the new builder.sh by adding $baseInputs in the for loop together with $buildInputs. 

As you noticed, we passed that new variable in the derivation. Instead of merging buildInputs with the base ones, we prefer to preserve buildInputs as seen by the caller, so we keep them separated. Just a matter of choice.

Rewrite hello.nix 

```nix
let
  pkgs = import <nixpkgs> {};
  mkDerivation = import ./autotools.nix pkgs;
in mkDerivation {
  name = "hello";
  src = ./hello-2.10.tar.gz;
}
```

Difference to last time: 
pkgs = import   is  the same as what we did with the 'with pkgs'  

mkDerivation variable is a partial application

(import ./autotools.nix) pkgs 

First we import the expression, then we apply the pkgs parameter. 

gives us a function that accepts the attribute set attrs.

create the derivation specifying the dependencies , only name and src,  in the PATH. 


C flags 

may be needed to give 

include files of libraries at compile time, 

ld flags at link time.



derivation ---> instruction on how to build/package something in to the nix store 

builder for autotools projects

function mkDerivation

composes the common parameters/attributes/components used in autotools projects.


# Analogies

Compile a c program in a .c file

Input it to a derivation

Nix builds a derivation:

Nix 'compiles' derivation expression to .drv file  

Nix 'links' or builds to create the output

It does this linking or building also for the / dependencies / inputs 
C language analogy: 

in c you create objects in the heap, 

you compose these objects in the heap in to new objects on the heap 

in this new object on the heap ,  you refer to the contained objects by pointing to them with pointers. 


In nix you create derivations in the nix store, 

you compose the derivations in the nix store to create new derivations in the nix store. 

In these new derivations, you refer to other derivations with the store path




nix-instantiate and nix build   analogy with compile and link (in C)

.nix expression --->  .drv file ---->  out path

derivation source code in .nix file ---->  compiled to .drv file 

built:
.drv file ---->  stored in out path

# Runtime requirements

Does GNU-hello-world , the package , have any requirements/dependencies when it runs?  (runtime dependencies) 



# nix language reference 

# Set union example 1 

nix-repl> { a = "b"; } // { c = "d"; }

{ a = "b"; c = "d"; }

# Set union example 2

override the attributes from attrs.

nix-repl> { a = "b"; } // { a = "c"; }

{ a = "c"; }









```bash
nix-instantiate hello.nix

/nix/store/z77vn965a59irqnrrjvbspiyl2rph0jp-hello.drv

nix-store -q --references /nix/store/z77vn965a59irqnrrjvbspiyl2rph0jp-hello.drv
```

mkDerivation function pulls common dependencies 

analogy:  build-essential of Debian 

hello.drv file 

instructions to build the hello out path

contains the input derivations needed 

nar == nix archive 

analogy :   nar == tar

create nar 

nix-store --dump 

unpack nar

nix-store --restore 

runtime dependency:

Nix detects a derivations runtime requirements/dependencies 

How? due to the hash of the store paths.

nix does this: 

serialize the output of hte derivation --->  create a nar (zip up the derivation output) 

for a build dependency, i.e. the derivation file in the nix store, get its location , its out path, look inside the nar , is hte out path of the build dependency inside this nar ? 

If yes, this means it is a runtime dependency.


```sh
$ nix-instantiate hello.nix

/nix/store/z77vn965a59irqnrrjvbspiyl2rph0jp-hello.drv

$ nix-store -r /nix/store/z77vn965a59irqnrrjvbspiyl2rph0jp-hello.drv

/nix/store/a42k52zwv6idmf50r9lps1nzwq9khvpf-hello

$ nix-store -q --references /nix/store/a42k52zwv6idmf50r9lps1nzwq9khvpf-hello

/nix/store/94n64qy99ja0vgbkf675nyk39g9b978n-glibc-2.19

/nix/store/8jm0wksask7cpf85miyakihyfch1y21q-gcc-4.8.3

/nix/store/a42k52zwv6idmf50r9lps1nzwq9khvpf-hello

```

Ok glibc and gcc. 

(gotcha ;   gcc shouldn't really be a runtime dependency)

$ strings result/bin/hello | grep gcc

/nix/store/94n64qy99ja0vgbkf675nyk39g9b978n-glibc-2.19/lib:/nix/store/8jm0wksask7cpf85miyakihyfch1y21q-gcc-4.8.3/lib64

Nix added gcc because its out path is mentioned in the "hello" binary. 

Why is that? 

That's the ld rpath. 

It's the list of directories where libraries can be found at runtime. 

In other distributions, this is usually not abused. 

But in Nix, we have to refer to particular versions of libraries, thus the rpath has an important role.

The build process adds that gcc lib path thinking it may be useful at runtime, but really it's not. 

How do we get rid of it? 

Nix authors have written another magical tool called patchelf, 

which is able to reduce the rpath to the paths that are really used by the binary.

Even after reducing the rpath, the hello binary would still depend upon gcc because of some debugging information. 

This unnecesarily increases the size of our runtime dependencies. 

We'll explore how strip can help us with that in the next section.

autotools builder , phases:

set the environment up 

unpack the sources in the current directory (tempy dir)

Change source root to the directory that has been unpacked

Configure: ./configure

Build: make

Install: make install

fixup: 
find $out -type f -exec patchelf --shrink-rpath '{}' \; -exec strip '{}' \; 2>/dev/null

for each file we run 

patchelf 

--shrink-rpath 

strip 

commands find and patchelf: 

Exercise: These two deserve a place in baseInputs of autotools.nix as findutils and patchelf.

$ nix-build hello.nix

$ nix-store -q --references result

/nix/store/94n64qy99ja0vgbkf675nyk39g9b978n-glibc-2.19
/nix/store/md4a3zv0ipqzsybhjb8ndjhhga1dj88x-hello

Notice !  that only glibc is the runtime dependency. Exactly what we wanted.

The package is self-contained, 

copy its closure on another machine 

and you will be able to run it. 

The hello binary will use that exact version of glibc library and interpreter, not the system one:

$ ldd result/bin/hello

 linux-vdso.so.1 (0x00007fff11294000)

 libc.so.6 => /nix/store/94n64qy99ja0vgbkf675nyk39g9b978n-glibc-2.19/lib/libc.so.6 (0x00007f7ab7362000)
 /nix/store/94n64qy99ja0vgbkf675nyk39g9b978n-glibc-2.19/lib/ld-linux-x86-64.so.2 (0x00007f7ab770f000)

Nix detects runtime dependencies automatically:

shared libraries, 

referenced executables

scripts, 

Python libraries 

etc

--->  therefore packages are self-contained

---> therefore can run programs without installation using nix-shell 

---> or deployment in the cloud

---> nix-build unpacks source , configures , builds , installed

---> may take a long time, analogy WebKit 

nix-shell like nix-build (self-contained) but can compile incrementally instead






Automatic discovery of runtime dependencies  - nix automatically discovers the runtime dependencies


nix-build --->  an environment (isolated --prefix ) while building the derivation. 

nix-shell sets up the environment variables from the nix file (the nix expression) in a new cli shell 

nix-shell on a nix expression returns a derivation; enters a new bash shell. 

$ nix-shell hello.nix

[nix-shell]$ make

bash: make: command not found

[nix-shell]$ echo $baseInputs

/nix/store/jff4a6zqi0yrladx3kwy4v6844s3swpc-gnutar-1.27.1 [...]

We expected to have the GNU hello world build inputs available in PATH, including GNU make, but it's not the case.

But, we have the environment variables that we set in the derivation, like $baseInputs, $buildInputs, $src and so on.

That means we can source our builder.sh, and it will build the derivation. 

[nix-shell]$ source builder.sh

We sourced builder.sh, therefore it ran all the steps including setting up the PATH for us.

The working directory is not the temp directory created by nix-build, 

the working direcotry is hte the current directory. 

hello-2.10 has been unpacked there.

cd into hello-2.10 

and type make, 

see, now it's available.

nix-shell drops us in a shell with the same environment used to run the builder

improve our builder 

we were able to source builder.sh because it was in our current directory, but --- 

We want the builder.sh that is stored in the nix store, 

the one that would be used by nix-build. 

To do so, pass the usual environment variable through the derivation.

$builder is defined, but it's the bash executable, not builder.sh. 

Our builder.sh is an argument to bash , i.e. args

we don't want to run the whole builder, 

we only want it to setup the necessary environment , then we can manually building the project.

So write two files, 

one for setting up the environment, 

and the real builder.sh that runs with nix-build.

wrap the phases in functions, it may be useful, 

move the set -e to the builder instead of the setup. 

because the set -e is annoying in nix-shell.

Here is our modified nix ,  autotools.nix. 

note setup = ./setup.sh; attribute in the derivation, 

This adds setup.sh to the nix store 

adds a $setup environment variable  which is in the scope of the builder.

```nix
pkgs: attrs:
  with pkgs;
  let defaultAttrs = {
    builder = "${bash}/bin/bash";
    args = [ ./builder.sh ];
    setup = ./setup.sh;
    baseInputs = [ gnutar gzip gnumake gcc coreutils gawk gnused gnugrep binutils.bintools patchelf findutils ];
    buildInputs = [];
    system = builtins.currentSystem;
  };
  in
derivation (defaultAttrs // attrs)
```

we split builder.sh into setup.sh and builder.sh. 

builder.sh sources $setup 

then calls the genericBuild function. 

new added setup.sh.

```bash

unset PATH
for p in $baseInputs $buildInputs; do
  export PATH=$p/bin${PATH:+:}$PATH
done

function unpackPhase() {
  tar -xzf $src

  for d in *; do
    if [ -d "$d" ]; then
      cd "$d"
      break
    fi
  done
}

function configurePhase() {
  ./configure --prefix=$out
}

function buildPhase() {
  make
}

function installPhase() {
  make install
}

function fixupPhase() {
  find $out -type f -exec patchelf --shrink-rpath '{}' \; -exec strip '{}' \; 2>/dev/null
}

function genericBuild() {
  unpackPhase
  configurePhase
  buildPhase
  installPhase
  fixupPhase
}
```

modified builder.sh.
```bash
set -e
source $setup
genericBuild
```

the new hello.nix.

```nix
let
  pkgs = import <nixpkgs> {};
  mkDerivation = import ./autotools.nix pkgs;
in mkDerivation {
  name = "hello";
  src = ./hello-2.10.tar.gz;
}
```

$ nix-shell hello.nix

[nix-shell]$ source $setup

unpackPhase 

unpacks $src and enters the directory. 

run ./configure, 

run make 

etc. manually

nix-shell builds the .drv file 

nix-shell builds the input dependencies 

nix -shell creates a shell with the environment variables 

collect some garbage.




a self-contained development environment 

nix-build builds a derivation in isolation, 

nix-shell drops us in a shell with the same environment used by nix-build. 

Artifacts: .drv files ,  out paths

these artifacts go in the nix store. 

package managers, e.g. dpkg, remove unused software. 

Is an artifact in nix store needed? 

analogy :   how does a garbage collector decide if an object is still alive.? GC roots. 

GC root is an always-alive object  

GC root refers to other objects; 

an object referred to by GC root is live

garbage collection process 

starts from GC roots, 

recursively marks referenced objects as live. 

other objects are collected and deleted (garbage collected)

In Nix same concept 

Programming language  to   nix
GC roots are objects  ~  GC roots are store paths. 

GC roots reside in /nix/var/nix/gcroots 

e.g. in /nix/var/nix/gcroots  there is a symlink to a store path, 

this store path is therefore a GC root.

recurse directories , find any symlinks to store paths. we have our list of GC roots.

dead store paths = all store paths - (that's minus) list of live store paths 

delete them  ;  move them to /nix/store/trash

$ nix-collect-garbage

What's left in the nix store ?  live store paths ;  i.e. anything referenced from the GC roots.

Example : install bsd-games

$ nix-env -iA nixpkgs.bsdgames

$ readlink -f `which fortune`

/nix/store/b3lxx3d3ggxcggvjw5n0m1ya1gcrmbyn-bsd-games-2.17/bin/fortune

$ nix-store -q --roots `which fortune`

/nix/var/nix/profiles/default-9-link

query the GC roots that refer to this derivation out path , which fortune

$ nix-env --list-generations

9   2014-08-20 12:44:14   (current)

In this case, our current user environment does refer to bsd-games.

remove it, 

$ nix-env -e bsd-games

collect garbage 

$ nix-collect-garbage

note that bsd-games is still in the nix store:

$ ls /nix/store/b3lxx3d3ggxcggvjw5n0m1ya1gcrmbyn-bsd-games-2.17


why still in the nix store?  it is an old generation . it is a GC root 

profiles and their generations are GC roots.

Removing a GC root

delete the generation that refers to bsd-games, 

$ rm /nix/var/nix/profiles/default-9-link

$ nix-env --list-generations

   8   2014-07-28 10:23:24
  10   2014-08-20 12:47:16   (current)

collect garbage, 

$ nix-collect-garbage

and note that now bsd-games is no longer in the nix store:

$ ls /nix/store/b3lxx3d3ggxcggvjw5n0m1ya1gcrmbyn-bsd-games-2.17

ls: cannot access /nix/store/b3lxx3d3ggxcggvjw5n0m1ya1gcrmbyn-bsd-games-2.17: No such file or directory

we removed the link from /nix/var/nix/profiles, not from /nix/var/nix/gcroots. 

/nix/var/nix/profiles is also a nix GC root. 

any profile and its generations are GC roots. 

/run/booted-system is a nix GC root 

print all the paths considered before performing a GC.

nix-store --gc --print-roots 

anything under /nix/var/nix/gcroots is a GC root. 

if not referred to from one of the GC roots , then you are garbage collected

Building a package with nix-build --->   gives a symlink called result in the current directory.

this result symlink is set as a GC root in /nix/var/nix/gcroots/auto

$ ls -l /nix/var/nix/gcroots/auto/

total 8

drwxr-xr-x 2 nix nix 4096 Aug 20 10:24 ./

drwxr-xr-x 3 nix nix 4096 Jul 24 10:38 ../

lrwxrwxrwx 1 nix nix   16 Jul 31 10:51 xlgz5x2ppa0m72z5qfc78b8wlciwvgiz -> /home/nix/result/


symlink points to /home/nix/result. 

an indirect GC root 

the GC root is specified outside of /nix/var/nix/gcroots. 

Whatever result points to, it will not be garbage collected.

How do we remove the derivation then? 

option 1: Remove the indirect GC root from /nix/var/nix/gcroots/auto.

derivation is deleted from the nix store, and result becomes a dangling symlink.

option 2: Remove the result symlink.

the derivation is removed as well as the indirect root in /nix/var/nix/gcroots/auto.

Running nix-collect-garbage after deleting the GC root or the indirect GC root, 

removes the derivation from the store.

duplication in the nix store? 

due to GC roots due to nix-build and profile generations 

nix-build results in a GC root for a build that somehow will refer to a specific version of glibc, and other libraries. 

After an upgrade, if that build is not deleted by the user, it will not be garbage collected. 

Thus the old dependencies referred to by the build will not be deleted either.

Same goes for profiles. 

Manipulating the nix-env profile will create further generations. 

Old generations refer to old software, thus increasing duplication in the nix store after an upgrade.

What are the basic steps for upgrading and removing everything old, including old generations?

how do an upgrade where forget everything about the older state:

First, we download a new version of the nixpkgs channel, which holds the description of all the software.

$ nix-channel --update

Then we upgrade our installed packages with nix-env -u. That will bring us into a fresh new generation with all updated software.

$ nix-env -u --always

Then we remove all the indirect roots generated by nix-build: beware, this will result in dangling symlinks. You may be smarter and also remove the target of those symlinks.

$ rm /nix/var/nix/gcroots/auto/*

Finally, the -d option of nix-collect-garbage is used to delete old generations of all profiles, then collect garbage.

$ nix-collect-garbage -d

nix-store commands --->  find out why a derivation is in the nix store.

multiple generations, 

multiple profiles, 

multiple versions of software, 





organize a repository of software. 

inputs design pattern - decouple derivations from the repository

packaging, building and deploying

organize packages  --  a repository for packages  -- a package repository

nixpkgs repository structure 

Single repository pattern

Debian system puts packages in multiple repositories. 

Gentoo system splits ,  e.g. it puts package descriptions in a single repository.

nixpkgs -  package descriptions in a single repository - single repository

create a top-level Nix expression

create an expression for each package 

top-level nix expression imports all expressions 

top-level nix expression combines expressions, merges to make a set , a parameter set , an attribute set,  made of pairs    name -> package


example , lets package graphviz

repository of two projects 

graphviz  - uses autotools 

Download graphviz 

graphviz.nix expression 

```nix
let
  pkgs = import <nixpkgs> {};
  mkDerivation = import ./autotools.nix pkgs;
in mkDerivation {
  name = "graphviz";
  src = ./graphviz-2.49.3.tar.gz;
}
```

nix-build graphviz.nix 

executable / runnable binary / program at result/bin. 

$ echo 'graph test { a -- b }'|result/bin/dot -Tpng -o test.png

Format: "png" not recognized. Use one of: canon cmap [...]

autotools.nix  ----  

nixos concatenates buildInputs to baseInputs. 

why not add build dependency here? 

buildInputs has this purpose, override it in package expressions.

graphviz plugin to enable png  ---> libgd

gcc wrapper 

ld wrapper

graphviz configure script 

uses pkg-config 

specifies the compiler flags/opitons 

there is no global location for libraries, 

tell pkg-config where to find pkg-config description files, 

then it can tell the configure script where to find headers and libraries.

In normal POSIX systems, 

pkg-config finds the .pc files of libraries in system folders like /usr/lib/pkgconfig, 

but in nix ---> tell pkg-config the location of libraries using the environment variable PKG_CONFIG_PATH.

get the variables from buildInputs. 

in setup.sh:

```bash
for p in $baseInputs $buildInputs; do
  if [ -d $p/bin ]; then
    export PATH="$p/bin${PATH:+:}$PATH"
  fi
  if [ -d $p/lib/pkgconfig ]; then
    export PKG_CONFIG_PATH="$p/lib/pkgconfig${PKG_CONFIG_PATH:+:}$PKG_CONFIG_PATH"
  fi
done
```
now adding derivations to buildInputs --- adds  lib/pkgconfig and bin 

graphviz with gd support 

```nix
let
  pkgs = import <nixpkgs> {};
  mkDerivation = import ./autotools.nix pkgs;
in mkDerivation {
  name = "graphviz";
  src = ./graphviz-2.49.3.tar.gz;
  buildInputs = with pkgs; [
    pkg-config
    (pkgs.lib.getLib gd)
    (pkgs.lib.getDev gd)
  ];
}
```

using 'with pkgs' avoids repeating the word pkgs inside buildInputs

adding pkg-config  ---- now it is available ; to the configure script 

gd has split outputs, 

therefore we add both



With nixpkgs, we import it 

then we pick derivations from the attribute set.

instead of REPO/some/sub/dir/package.nix we can say importedRepo.package 

try the same here: 


put 2 packages , hello and graphviz, in to a repo. 

Create default.nix in current directory:

```
{
  hello = import ./hello.nix; 
  graphviz = import ./graphviz.nix;
}
```

$ nix repl

nix-repl> :l default.nix

Added 2 variables.

nix-repl> hello

«derivation /nix/store/dkib02g54fpdqgpskswgp6m7bd7mgx89-hello.drv»

nix-repl> graphviz

«derivation /nix/store/zqv520v9mk13is0w980c91z7q1vkhhil-graphviz.drv»

With nix-build:

$ nix-build default.nix -A hello

$ result/bin/hello

Hello, world!

-A <attribute>  access attribute in the set .

analogy :  python __init__.py  ~   default.nix

install the package into your user environment:

$ nix-env -f . -iA graphviz

$ dot -V

-f <file with expression to use> , using -f . uses the default ./default.nix.

-i install


hello.nix and graphviz.nix are dependent on nixpkgs

problem 1; they import nixpkgs .

better:  In autotools.nix nixpkgs is an argument. 

inputs pattern 

let the user change the inputs of the expression  - the set of derivations needed to build the expression. 

mkDerivation from autotools. 

Recall that mkDerivation has an implicit dependency on the toolchain.

libgd and its dependencies.

make package expressions independent of the repository.

How?  use function to declare inputs for a derivation. 

for graphviz.nix, makes the derivation independent of the repository

{ mkDerivation, lib, gdSupport ? true, gd, pkg-config }:

mkDerivation {
  name = "graphviz";
  src = ./graphviz-2.49.3.tar.gz;
  buildInputs =
    if gdSupport
      then [
          pkg-config
          (lib.getLib gd)
          (lib.getDev gd)
        ]
      else [];
}

{...}: ... 

defines a function  , argument is  a set / attribute set  / paraeter set 

If gdSupport is true we give buildInputs the filled set 

default.nix

```nix
let
  pkgs = import <nixpkgs> {};
  mkDerivation = import ./autotools.nix pkgs;
in with pkgs; {
  hello = import ./hello.nix { inherit mkDerivation; };
  graphviz = import ./graphviz.nix { inherit mkDerivation lib gd pkg-config; };
  graphvizCore = import ./graphviz.nix {
    inherit mkDerivation lib gd pkg-config;
    gdSupport = false;
  };
}
```

hello.nix 

graphviz.nix 

are independent of the repository 

can be customized by passing inputs.

want to build graphviz with a specific version of gd?   

pass gd = ...;

want to change the toolchain? 

pass a different mkDerivation function.

default.nix returns an attribute set

define local variables using let 

import hello.nix , this returns a function 

call this function with a set of inputs 

this gets back the derivation.

'inherit gd' and 'with pkgs;' together gives 'gd = pkgs.gd'

inputs pattern ---->  use a set of arguments to customize expressions

arguments can be flags, derivations, opitons etc.  

package expressions are functions

expressions are independent of the repository. 

callPackage design pattern 


callPackage pattern: 

inputs from the top-level expression (default.nix) are passed to the package expression.

-- rather than have to mention them twice 

way to import packages in a repository. 

used in nixpkgs

inputs pattern ---->   decouple packages from the repository, 

how?  caller gives the inputs

derivation uses inpiuts 

{ input1, input2, ... }:
rec {
  lib1 = import package1.nix { inherit input1 input2 ...; };
  program2 = import package1.nix { inherit inputX inputY lib1 ...; };
}

define a callPackage function

{
  lib1 = callPackage package1.nix { };
  program2 = callPackage package2.nix { someoverride = overriddenDerivation; };
}

rec ----> inputs may be packages in the repository itself  

instead pass those inputs from the repository automatically 

but able if wish to override the automatically passed argument 


to automatically pass arguments need to use reflection at runtime

callPackage finds the packages to pass automatically from inside packages set, 

nix-repl> add = { a ? 3, b }: a+b

nix-repl> builtins.functionArgs add

{ a = true; b = false; }

set called values 

nix-repl> values = { a = 3; b = 5; c = 10; }

intersect:  parameters of values    with    function arguments:

nix-repl> builtins.intersectAttrs values (builtins.functionArgs add)

{ a = true; b = false; }

nix-repl> builtins.intersectAttrs (builtins.functionArgs add) values
{ a = 3; b = 5; }

names are the intersection, 

attribute values are from the second set.

we have a way to get argument names from a function! 

and match with an existing set of attributes. 


This is our simple implementation of callPackage:

nix-repl> callPackage = set: f: f (builtins.intersectAttrs (builtins.functionArgs f) set)

nix-repl> callPackage values add
8

nix-repl> with values; add { inherit a b; }
8

We define a callPackage variable which is a function.

The second parameter is the function to "autocall".

We take the argument names of the function and intersect with the set of all values.

Finally we call the passed function f with the resulting intersection.


callPackage is equivalent to  add a b.

Automatically call functions given a set of possible arguments. 

Being able to override some of the parameters. 

We may not want to always call functions with values taken from the big set. 

Then we add a further parameter, which takes a set of overrides:

nix-repl> callPackage = set: f: overrides: f ((builtins.intersectAttrs (builtins.functionArgs f) set) // overrides)

nix-repl> callPackage values add { }

8

nix-repl> callPackage values add { b = 12; }

15

a set union between the default arguments, and the overriding set.




simplify the repository expression (default.nix).

let
  nixpkgs = import <nixpkgs> {};
  allPkgs = nixpkgs // pkgs;
  callPackage = path: overrides:
    let f = import path;
    in f ((builtins.intersectAttrs (builtins.functionArgs f) allPkgs) // overrides);
  pkgs = with nixpkgs; {
    mkDerivation = import ./autotools.nix nixpkgs;
    hello = callPackage ./hello.nix { };
    graphviz = callPackage ./graphviz.nix { };
    graphvizCore = callPackage ./graphviz.nix { gdSupport = false; };
  };
in pkgs

We moved mkDerivation into pkgs itself, so that it also gets passed automatically.

callPackage pattern 

simplifies repository

import packages that require some named arguments 

call them automatically, 

given the set of all packages.

override design pattern. 

graphvizCore starts from graphviz.nix and builds it without gd. 

opiton 2 :  start from pkgs.graphviz and disable gd









callPackage pattern : simplifies composing software in a repository.


derivation drv 

we want drv to have debugging information 

and to apply a custom patches

debugVersion (applyPatches [ ./patch1.patch ./patch2.patch ] drv)

the original derivation plus some changes. 

inputs design pattern. we declare the inputs and let the callers pass the necessary arguments.

(We do not return a derivation picking dependencies directly from the repository)

we have a set of attributes that import the expressions of the packages and pass these arguments, getting back a derivation. 

e.g. the graphviz attribute:

graphviz = import ./graphviz.nix { inherit mkDerivation gd fontconfig libjpeg bzip2; };

derivation of graphviz with a custom gd version, 

mygraphviz = import ./graphviz.nix {
  inherit mkDerivation fontconfig libjpeg bzip2;
  gd = customgd;
};

Using callPackage is better 

mygraphviz = callPackage ./graphviz.nix { gd = customgd; };

avoid specifying the nix expression again, 

instead reuse the original graphviz attribute in the repository 

add our overrides:

mygraphviz = graphviz.override { gd = customgd; };

override is an attribute of a set.

add a further attribute named "override" 

create a function "makeOverridable" 

takes a function and a set of arguments

The function must return a set.

lib.nix:

{
  makeOverridable = f: origArgs:
    let
      origRes = f origArgs;
    in
      origRes // { override = newArgs: f (origArgs // newArgs); };
}

makeOverridable takes a function and a set of original arguments. 

It returns the original returned set, 

plus a new override attribute.

override attribute is a function taking a set of new arguments, 

and returns the result of 

call the original function with the original-arguments-unified-with-the-new-arguments. 

$ nix repl

nix-repl> :l lib.nix

Added 1 variables.

nix-repl> f = { a, b }: { result = a+b; }

nix-repl> f { a = 3; b = 5; }

{ result = 8; }

nix-repl> res = makeOverridable f { a = 3; b = 5; }

nix-repl> res

{ override = «lambda»; result = 8; }

nix-repl> res.override { a = 10; }

{ result = 15; }

function f returns a set  (the contract)

res is the result of calling the function without overrides 

the .override function should make the result overridable again:

rec {
  makeOverridable = f: origArgs:
    let
      origRes = f origArgs;
    in
      origRes // { override = newArgs: makeOverridable f (origArgs // newArgs); };
}

rec keyword --  can refer to makeOverridable from makeOverridable itself.

Now override twice:

nix-repl> :l lib.nix

Added 1 variables.

nix-repl> f = { a, b }: { result = a+b; }

nix-repl> res = makeOverridable f { a = 3; b = 5; }

nix-repl> res2 = res.override { a = 10; }

nix-repl> res2

{ override = «lambda»; result = 15; }

nix-repl> res2.override { b = 20; }

{ override = «lambda»; result = 30; }

The result is 30, 
a is overridden to 10 in the first override, 
and b to 20.

callPackage should make our derivations overridable. 

override pattern makes it easier to customize  a package. 

can use a big central repository like nixpkgs, 

override laptop without changing nixpkgs 


nix-shell environment 

test graphviz with a custom gd

debugVersion (graphviz.override { gd = customgd; })

Nix search paths. 

where does Nix look for expressions? 

where does <nixpkgs> come from?


override pattern :  change a derivation by giving different inputs.

environment variables used by nix

NIX_PATH 

PATH ~ NIX_PATH 

paths separated by a colon : 

nix expressions use NIX_PATH env var

e.g.
in linux

ping   

linux looks in the PATH folders 

In nix 

<ping>



can override abstract path e.g. <nixpkgs> from the command line.

nix-instantiate --eval 


nix-instantiate ---->  nix expression to .drv file 

we don't need the derivation, hence --eval  


just for fun: 
use PATH as NIX_PATH, 
locate ping 

$ nix-instantiate --eval -E '<ping>'

error: file `ping' was not found in the Nix search path (add it using $NIX_PATH or -I)

$ NIX_PATH=$PATH nix-instantiate --eval -E '<ping>'

/bin/ping

$ nix-instantiate -I /bin --eval -E '<ping>'

/bin/ping

or can do 

$ NIX_PATH="ping=/bin/ping" nix-instantiate --eval -E '<ping>'

/bin/ping




$ nix-instantiate --eval -E '<nixpkgs>'

/home/nix/.nix-defexpr/channels/nixpkgs


$ echo $NIX_PATH

nixpkgs=/home/nix/.nix-defexpr/channels/nixpkgs


<nixpkgs> refers path in NIX_PATH.


it is a checkout of the nixpkgs repository 

nix.sh exports NIX_PATH env var 

that is why you source nix.sh


nixpkgs ---->   could do a git checkout of nixpkgs 


say default.nix, graphviz.nix etc. are in /home/nix/mypkgs:

$ export NIX_PATH=mypkgs=/home/nix/mypkgs:$NIX_PATH

$ nix-instantiate --eval '<mypkgs>'

{ graphviz = <code>; graphvizCore = <code>; hello = <code>; mkDerivation = <code>; }


commands nix-instantiate and nix-build require a nix expression

nix-env does not require a nix expression

nix-env does not use NIX_PATH to find the nixpkgs repository

nix-env command uses ~/.nix-defexpr, 

~/.nix-defexpr   is part of NIX_PATH 

If you empty NIX_PATH, nix-env will still be able to find derivations because of ~/.nix-defexpr.

nix-env -i graphviz      

inside your repository, 

installs nixpkgs version 

alternative to ~/.nix-defexpr 
use the [-f] option:

$ nix-env -f '<mypkgs>' -i graphviz

in nixpkgs, 

mkDerivation, 

callPackage, 

override, 











nix finds expressions with the angular brackets syntax


nixpkgs repository

our default.nix ,  we composed the expressions of packages.

nixpkgs has default.nix, 

loaded when referring to <nixpkgs> 

import pkgs/top-level/all-packages.nix 

this set of packages ==  pkgs.

all-packages.nix composes all packages. 


all-packages.nix is a function. 

nix-build -A psmisc --argstr system i686-linux

builds the psmisc derivation for i686-linux instead of x86_64-linux. 

~ multi-arch of Debian.

see cross compiling 

all-packages.nix expression accepts the config parameter. 

If config parameter is not given ---> all-packages.nix expression reads NIXPKGS_CONFIG environment variable. 

If nixpkgs_config env var not set, ---->  nixpkgs looks in $HOME/.nixpkgs/config.nix.

config.nix imports as nix expression

$ nix repl

nix-repl> pkgs = import <nixpkgs> {}

nix-repl> pkgs.config

{ }

nix-repl> pkgs = import <nixpkgs> { config = { foo = "bar"; }; }

nix-repl> pkgs.config

{ foo = "bar"; }



config.allowUnfree  

config.pulseaudio 

A .nix file contains a nix expression. 

Thus it can also be a function. 

nix-build expects the expression to return a derivation. 

to modify the derivation being returned from nix-build, 

give the .nix file some parameters, 


If the expression is a derivation, build it.
if a function ,  build the returned derivation

nix-build this .nix  file

{ pkgs ? import <nixpkgs> {} }:
pkgs.psmisc

pass a different value for pkgs using the --arg option.

<nixpkgs> repository 

is a function that accepts some parameters, and returns the set of all packages.

use this repository to build your own packages 



override packages in the nixpkgs repository 

change an option of a library 

make other packages pick this new library 

Option 1: use the config parameter 

Option 2: override derivations.













Nixpkgs is a function, 

parameters of the function include system and config.

special attribute: 

config.packageOverrides 

'Overriding packages in a set with fixed point'

a design pattern in nixpkgs.

Instead of calling a function with parameters directly, 

we make the function call i.e. function parameters  overridable.


put the override function in the returned attribute set of the original function call.

e.g. graphviz 

input parameter xorg. 

If xorg = null, graphviz builds without X support.

$ nix repl

nix-repl> :l <nixpkgs>

Added 4360 variables.

nix-repl> :b graphviz.override { xorg = null; }

This will build graphviz without X support

package P depends on graphviz, 

how to make P depend on this new graphviz , i.e. graphviz without X support?



fixed point 

evaluate a function with its own returned value

fix = f: let result = f result; in result;

this is  f(f(f(

It is a function that accepts a function f, calls f result on the result just returned by f result and returns it. 


nix-repl> fix = f: let result = f result; in result

nix-repl> pkgs = self: { a = 3; b = 4; c = self.a+self.b; }

nix-repl> fix pkgs

{ a = 3; b = 4; c = 7; }






Override a set with fixed point

nix-repl> overrides = { a = 1; b = 2; }

nix-repl> let newpkgs = pkgs (newpkgs // overrides); in newpkgs

{ a = 3; b = 4; c = 3; }

nix-repl> let newpkgs = pkgs (newpkgs // overrides); in newpkgs // overrides

{ a = 1; b = 2; c = 3; }

In the first case we computed pkgs with the overrides, 

in the second case we also included the overriden attributes in the result.

Overriding nixpkgs packages

config.packageOverrides 

nixpkgs returns a fixed point of the package set, 

packageOverrides injects the overrides.

Create a config.nix 

{
  packageOverrides = pkgs: {
    graphviz = pkgs.graphviz.override { xorg = null; };
  };
}

Now we build 

e.g. asciidocFull 

it will automatically use the overridden graphviz:

nix-repl> pkgs = import <nixpkgs> { config = import ./config.nix; }

nix-repl> :b pkgs.asciidocFull

pass the config with packageOverrides when importing nixpkgs. 

Then pkgs.asciidocFull is a derivation that has graphviz input (pkgs.asciidoc is the lighter version and doesn't use graphviz at all).

~/.nixpkgs/config.nix 

config.nix that we just wrote could be the content of ~/.nixpkgs/config.nix.

design pattern: fixed point for overriding packages in a package set.


in normal package managers, a library is installed replacing the old version and applications will use it, 

in Nix no 

Nix applications depend on specific versions of libraries, 

we recompile asciidoc to use the new graphviz library.

The new asciidoc depends on the new graphviz, 

old asciidoc uses the old graphviz

store paths. 

How does Nix compute the path in the store where to place the result of builds? 

How to add files to the store for which we have an integrity hash?





nixpkgs repository structure. 

is a set of packages

can override these packages 

can override these packages so that other packages use the override versions.


store paths depend on an sha256 hash (integrity hash) 

which is usually applied to source tarballs.

how does nix calculate the store path for a file?

$ echo mycontent > myfile

a derivation must have 
name, 
builder 
system

$ nix repl

nix-repl> derivation { system = "x86_64-linux"; builder = ./myfile; name = "foo"; }

«derivation /nix/store/y4h73bmrc9ii5bxg6i7ck6hsf5gqv8ck-foo.drv»

Where is ./myfile to be stored when built?

$ nix show-derivation /nix/store/y4h73bmrc9ii5bxg6i7ck6hsf5gqv8ck-foo.drv

{
  "/nix/store/y4h73bmrc9ii5bxg6i7ck6hsf5gqv8ck-foo.drv": {
    "outputs": {
      "out": {
        "path": "/nix/store/hs0yi5n5nw6micqhy8l1igkbhqdkzqa1-foo"
      }
    },
    "inputSrcs": [
      "/nix/store/xv2iccirbrvklck36f1g7vldn5v58vck-myfile"
    ],
    "inputDrvs": {},
    "platform": "x86_64-linux",
    "builder": "/nix/store/xv2iccirbrvklck36f1g7vldn5v58vck-myfile",
    "args": [],
    "env": {
      "builder": "/nix/store/xv2iccirbrvklck36f1g7vldn5v58vck-myfile",
      "name": "foo",
      "out": "/nix/store/hs0yi5n5nw6micqhy8l1igkbhqdkzqa1-foo",
      "system": "x86_64-linux"
    }
  }
}

How did nix calculate the hash xv2iccirbrvklck36f1g7vldn5v58vck ? 

nix-store --add myfile 

this calculates the same hash , and therefore the same store path / out path / location in nix store / nix store slot 


calculate the sha256 of the NAR serialization of the file

method 1:

$ nix-hash --type sha256 myfile

2bfef67de873c54551d884fdab3055d84d573e654efa79db3c0d7b98883f9ee3

method 2:

$ nix-store --dump myfile | sha256sum

2bfef67de873c54551d884fdab3055d84d573e654efa79db3c0d7b98883f9ee3


nix creates string of hash, the path type and the file name. 

store this in another file:

$ echo -n "source:sha256:2bfef67de873c54551d884fdab3055d84d573e654efa79db3c0d7b98883f9ee3:/nix/store:myfile" > myfile.str


compute the base-32 representation of the first 160 bits (truncation) of a sha256 of the above string:

$ nix-hash --type sha256 --truncate --base32 --flat myfile.str
xv2iccirbrvklck36f1g7vldn5v58vck


out path hash : depends only on the inputs.

the .drv is hashed 

the type of derivation is output:out 


integrity hash of a file already known? e .g. for tarballs.

3 attributes: 
outputHashMode, 
outputHash 
outputHashAlgo 

builder creates the out path 

makes sure its hash is the same as the one declared with outputHash.

e.g. builder creates a file whose contents is mycontent:

$ echo mycontent > myfile

$ sha256sum myfile

f3f3c4763037e059b4d834eaf68595bbc02ba19f6d2a500dce06d124e2cd99bb  myfile

nix-repl> derivation { name = "bar"; system = "x86_64-linux"; builder = "none"; outputHashMode = "flat"; outputHashAlgo = "sha256"; outputHash = "f3f3c4763037e059b4d834eaf68595bbc02ba19f6d2a500dce06d124e2cd99bb"; }

«derivation /nix/store/ymsf5zcqr9wlkkqdjwhqllgwa97rff5i-bar.drv»

Inspect the .drv and see that it also stored the fact that it's a fixed-output derivation with sha256 algorithm, compared to the previous examples:

$ nix show-derivation /nix/store/ymsf5zcqr9wlkkqdjwhqllgwa97rff5i-bar.drv
{
  "/nix/store/ymsf5zcqr9wlkkqdjwhqllgwa97rff5i-bar.drv": {
    "outputs": {
      "out": {
        "path": "/nix/store/a00d5f71k0vp5a6klkls0mvr1f7sx6ch-bar",
        "hashAlgo": "sha256",
        "hash": "f3f3c4763037e059b4d834eaf68595bbc02ba19f6d2a500dce06d124e2cd99bb"
      }
    },
[...]
}

Nix first hashes the contents, 

then creates a string description, 

and the final store path is the hash of this string.


Nix knows beforehand the out path of a derivation since it only depends on the inputs. 

fixed-output derivations ----> used by nixpkgs repo for downloading and verifying source tarballs.

stdenv

our own mkDerivation function for wrapping the builtin derivation, 
 
but nixpkgs repo also has its own convenience functions 

for dealing with autotools projects

and other build systems


the algorithm to compute the store paths 

fixed-output store paths



nixpkgs, 

a core derivation: 

stdenv

base for packaging software. 

e.g. pulls in commonly needed tools/ dependencies for compiling stuff in nixpkgs

e.g. 

gcc / gcc toolchain 

GNU make, 

core utilities, 

patch 

diff  


stdenv is a derivation  ,  a derivation is just a set?  

$ nix-build '<nixpkgs>' -A stdenv

/nix/store/k4jklkcag4zq4xkqhkpy156mgfm34ipn-stdenv

$ ls -R result/

result/:

nix-support/  setup

result/nix-support:

propagated-user-env-packages

i.e. two files: 

/setup 

/nix-support/propagated-user-env-packages 

runtime dependencies:

$ nix-store -q --references result

/nix/store/3a45nb37s0ndljp68228snsqr3qsyp96-bzip2-1.0.6
/nix/store/a457ywa1haa0sgr9g7a1pgldrg3s798d-coreutils-8.24
/nix/store/zmd4jk4db5lgxb8l93mhkvr3x92g2sx2-bash-4.3-p39
/nix/store/47sfpm2qclpqvrzijizimk4md1739b1b-gcc-wrapper-4.9.3

How it is referring to these packages? 

The package must be referring to those package somehow. 

they are mentioned in the /setup file!

$ head result/setup

export SHELL=/nix/store/zmd4jk4db5lgxb8l93mhkvr3x92g2sx2-bash-4.3-p39/bin/bash

initialPath="/nix/store/a457ywa1haa0sgr9g7a1pgldrg3s798d-coreutils-8.24 ..."

defaultNativeBuildInputs="/nix/store/sgwq15xg00xnm435gjicspm048rqg9y6-patchelf-0.8 ..."

generic builder.sh from above 

sets up PATH, 

unpacks the source 

and runs the usual autotools commands

stdenv setup file is the same. 

sets up environment variables like PATH 

creates bash functions to build a package. 


The mentioned toolchain and utilities 

fill up the environment variables 

similar to what we did with our builder with baseInputs and buildInputs.


The build with stdenv works in phases. 

Phases are like 

unpackPhase, 
configurePhase, 
buildPhase, 
checkPhase, 
installPhase, 
fixupPhase. 

in the genericBuild function.

genericBuild runs these phases. 

Each phase contains 
a before hook 
to run before the phase is run 

a after hook 
run after the phase has run. 

test 

enter a empty derivation 'fake', 

$ nix-shell -E 'derivation { name = "fake"; builder = "fake"; system = "x86_64-linux"; }'

source the stdenv setup, 

nix-shell$ unset PATH
nix-shell$ source /nix/store/k4jklkcag4zq4xkqhkpy156mgfm34ipn-stdenv/setup

unpack the hello sources 
nix-shell$ tar -xf hello-2.10.tar.gz

and build it:
nix-shell$ cd hello-2.10
nix-shell$ configurePhase
nix-shell$ buildPhase


stdenv.mkDerivation

a wrapper around the derivation function 

loads/brings in to scope the stdenv for us, 

and runs genericBuild


stdenv is a derivation 

but also an attribute set 

which contains other attributes, 

e.g. mkDerivation. 


hello.nix expression 

using stdenv

```
with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "hello";
  src = ./hello-2.10.tar.gz;
}
```

pull nixpkgs repo in to scope, 

then can use stdenv. 


$ nix-build hello.nix

/nix/store/6y0mzdarm5qxfafvn2zm9nr01d1j0a72-hello

$ result/bin/hello

builder in mkDerivation 

{
  ...
  builder = attrs.realBuilder or shell;
  args = attrs.args or ["-e" (attrs.builder or ./default-builder.sh)];
  stdenv = result;
  ...
}

The builder is bash (that shell variable), 

the argument to the builder (bash) is default-builder.sh, 

we add the environment variable $stdenv in the derivation, which is the stdenv derivation.





default-builder.sh 

source $stdenv/setup

genericBuild

makes the derivations nix-shell friendly. 

When entering the shell, 

the setup file only sets up the environment 

it doesn't build 


nix-build runs the build process.


environment variables, 

nix show-derivation $(nix-instantiate hello.nix)

warning: you did not specify '--add-root'; the result might be removed by the garbage collector
{
  "/nix/store/abwj50lycl0m515yblnrvwyydlhhqvj2-hello.drv": {
    "outputs": {
      "out": {
        "path": "/nix/store/6y0mzdarm5qxfafvn2zm9nr01d1j0a72-hello"
      }
    },
    "inputSrcs": [
      "/nix/store/9krlzvny65gdc8s7kpb6lkx8cd02c25b-default-builder.sh",
      "/nix/store/svc70mmzrlgq42m9acs0prsmci7ksh6h-hello-2.10.tar.gz"
    ],
    "inputDrvs": {
      "/nix/store/hcgwbx42mcxr7ksnv0i1fg7kw6jvxshb-bash-4.4-p19.drv": [
        "out"
      ],
      "/nix/store/sfxh3ybqh97cgl4s59nrpi78kgcc8f3d-stdenv-linux.drv": [
        "out"
      ]
    },
    "platform": "x86_64-linux",
    "builder": "/nix/store/q1g0rl8zfmz7r371fp5p42p4acmv297d-bash-4.4-p19/bin/bash",
    "args": [
      "-e",
      "/nix/store/9krlzvny65gdc8s7kpb6lkx8cd02c25b-default-builder.sh"
    ],
    "env": {
      "buildInputs": "",
      "builder": "/nix/store/q1g0rl8zfmz7r371fp5p42p4acmv297d-bash-4.4-p19/bin/bash",
      "configureFlags": "",
      "depsBuildBuild": "",
      "depsBuildBuildPropagated": "",
      "depsBuildTarget": "",
      "depsBuildTargetPropagated": "",
      "depsHostBuild": "",
      "depsHostBuildPropagated": "",
      "depsTargetTarget": "",
      "depsTargetTargetPropagated": "",
      "name": "hello",
      "nativeBuildInputs": "",
      "out": "/nix/store/6y0mzdarm5qxfafvn2zm9nr01d1j0a72-hello",
      "propagatedBuildInputs": "",
      "propagatedNativeBuildInputs": "",
      "src": "/nix/store/svc70mmzrlgq42m9acs0prsmci7ksh6h-hello-2.10.tar.gz",
      "stdenv": "/nix/store/6kz2vbh98s2r1pfshidkzhiy2s2qdw0a-stdenv-linux",
      "system": "x86_64-linux"
    }
  }
}

The builder is bash, 

with -e default-builder.sh arguments. 

src env var 

stdenv env vars

unpackPhase 

unpack the sources 

enter the directory

packages in nixpkgs use stdenv.mkDerivation 

stdenv.mkDerivation is a wrapper around the derivation. 

it sets up the environment for building.

Process is

nix-build

bash -e default-builder.sh

source $stdenv/setup

genericBuild

how to add dependencies 

to where? 

to packages 

How? 

use buildInputs 

use propagatedBuildInputs 

influence builds with hooks 

setup hooks 

env hooks











Nixpkgs' stdenv 

setup.sh script, 

default-builder.sh script, 

stdenv.mkDerivation builder 

phases of genericBuild.


interaction of packages built with stdenv.mkDerivation. 

Packages depend on each other

attributes:

buildInputs 

propagatedBuildInputs 

hooks:

setup hooks 

env hooks. 

nixpkgs commit 6675f0a5 -- version of stdenv before cross-compilation complexity was added


buildInputs
the current package needs another package, 

e.g. 

let

  nixpkgs = import <nixpkgs> {};

  inherit (nixpkgs) stdenv fetchurl which;

  actualHello = stdenv.mkDerivation {
    name = "hello-2.3";

    src = fetchurl {
      url = mirror://gnu/hello/hello-2.3.tar.bz2;
      sha256 = "0c7vijq8y68bpr7g6dh1gny0bff8qq81vnp4ch8pjzvg56wb3js1";
    };
  };

  wrappedHello = stdenv.mkDerivation {
    name = "hello-wrapper";

    buildInputs = [ actualHello which ];

    unpackPhase = "true";

    installPhase = ''
      mkdir -p "$out/bin"
      echo "#! ${stdenv.shell}" >> "$out/bin/hello"
      echo "exec $(which hello)" >> "$out/bin/hello"
    '';
  };

wrappedHello derivation gets hello binary from the PATH. 

buildInputs covers direct dependencies,

propagatedBuildInputs Attribute

indirect dependencies 

one package needs a second package which needs a third? 

let

  nixpkgs = import <nixpkgs> {};

  inherit (nixpkgs) stdenv fetchurl which;

  actualHello = stdenv.mkDerivation {
    name = "hello-2.3";

    src = fetchurl {
      url = mirror://gnu/hello/hello-2.3.tar.bz2;
      sha256 = "0c7vijq8y68bpr7g6dh1gny0bff8qq81vnp4ch8pjzvg56wb3js1";
    };
  };

  intermediary = stdenv.mkDerivation {
    name = "middle-man";

    propagatedBuildInputs = [ actualHello ];

    unpackPhase = "true";

    installPhase = ''
      mkdir -p "$out"
    '';
  };

  wrappedHello = stdenv.mkDerivation {
    name = "hello-wrapper";

    buildInputs = [ intermediary which ];

    unpackPhase = "true";

    installPhase = ''
      mkdir -p "$out/bin"
      echo "#! ${stdenv.shell}" >> "$out/bin/hello"
      echo "exec $(which hello)" >> "$out/bin/hello"
    '';
  };

in wrappedHello

the intermediate package has a propagatedBuildInputs dependency, 

the wrapper has a buildInputs dependency 


Setup Hooks

sometimes dependencies need to influence the packages that use them in ways other than just being a dependency. 

a dependency might affect the packages 

use Setup hooks 
a hook is a bash callback

environment hooks. 

anEnvHook() {
    local pkg=$1

    echo "I'm depending on \"$pkg\""
}

envHooks+=(anEnvHook)

if dependency has that setup hook then all of them will be so echoed. 



normal package managers change the the global state 

e.g. package foo-1.0 installs a program to /usr/bin/foo, 

you cannot install foo-1.1 as well, 

unless you change the installation path 

or change the binary/program name. 

changing the name means things depending on it can't find it 

How do they have different versions then?

Debian uses 'alternatives'

you have nginx service and nginx-openresty service 

e.g. create a new package that has paths with suffix of openresty.

run two different instances of mysql: 5.2 and 5.5 

make sure the two mysqlclient libraries are not named the same 

use containers. 

container per service

need orchestration tool, 

set up a shared cache of packages, 

machine to monitor rather than simple services.

use virtualenv for python, 

use jhbuild for gnome

how to mix the two stacks? 

avoid recompiling the same thing? when it could be shared? 

set up your development tool to point to the different library folders 

some of the software may use system libraries.

instead : 

Nix store,  /nix/store, 

nix tools to deal with the store

in nix , nix derivation ~ package 

Derivations/packages 

/nix/store/hash-name 

e.g. 

/nix/store/s4zia7hhqkin1di0f187b79sa2srhv6k-bash-4.2-p45/ 

this dir contains bin/bash.

there is no /bin/bash, 

Nix puts these binaries/programs in the PATH env var 

a store of all packages/derivations 

there is no ldconfig cache !
where does bash find libc?

$ ldd  `which bash`

libc.so.6 => /nix/store/94n64qy99ja0vgbkf675nyk39g9b978n-glibc-2.19/lib/libc.so.6 (0x00007f0248cce000)

this bash was built using that version of glibc in the Nix store, 

at runtime it requires that glibc version.

run mysql 5.2 with glibc-2.18, 

run mysql 5.5 with glibc-2.19. 

python module with python 2.7 compiled with gcc 4.6 

python module with python 3 compiled with gcc 4.

no dependency resolution algorithm. 


PHP version 1 for an application, 

PHP version 2 for other applications



webkit with llvm 3.4 

webkit with llvm 3.3


Normal package managers

upgrade a library  --->  replace existing one in same location. 

applications then run with the new library 

the applications do not get recompiled. 

they refer dynamically to libc6.so


Nix derivations , upgrade a library e.g. glibc 

for applications to use this new glibc ,  recompile

because the store location for glibc is precise , static? 


Firefox 

install flash, 

then flash works, how? 

because Firefox looks in global-plugin-path 

and finds the flash plugin

In Nix, 

no global-path-for-plugins 

must therefore tell Firefox exactly where flash is , the path

wrap Firefox program/binary/executable/applicaiton 

with the environment variable that allows it to find flash in the nix store 

this forms a new Firefox package/derivation

disadvantages:

more difficult:

dynamic composition at runtime 

replacing low level libraries 

why ?  must rebuild dependencies.


as non-root user:

curl -L https://nixos.org/nix/install | sh 


derivations in the store refer/point to other derivations in the store 

derivations/packages do not use libc  

nix database:

/nix/var/nix/db 

lists the dependencies between derivations

schema : auto increment id and a store path.

a relation from path to paths upon which they depend

install sqlite 

nix-env -iA sqlite -f '<nixpkgs>' 

sqlite3 /nix/var/nix/db/db.sqlite.




creating /home/nix/.nix-profile

installing 'nix-2.1.3'

building path(s) `/nix/store/a7p1w3z2h8pl00ywvw6icr3g5l9vm5r7-user-environment'

created 7 symlinks in user environment


$ ls -l ~/.nix-profile/

bin -> /nix/store/ig31y9gfpp8pf3szdd7d4sf29zr7igbr-nix-2.1.3/bin

manifest.nix -> /nix/store/q8b5238akq07lj9gfb3qb5ycq4dxxiwm-env-manifest.nix

share -> /nix/store/ig31y9gfpp8pf3szdd7d4sf29zr7igbr-nix-2.1.3/share

nix-2.1.3 derivation is Nix binaries and libraries. 


"installing" the derivation in the profile 
reproduces the hierarchy of the nix-2.1.3 derivation in the profile 
by means of symbolic links.

~/.nix-profile is a symbolic link to /nix/var/nix/profiles/default

Nixpkgs is the repository containing all of the expressions: 

https://github.com/NixOS/nixpkgs.

concepts

profiles manage multiple generations of a composition of packages

channels.download binaries from nixos.org.


install software as a user, 

managed user profile, 

switch generations, 

query the Nix store. 

write expressions 

nix-build tool ---->  takes the expression, builds a derivation 

nix repl 

Types:
integer 
floating point 
string
path
boolean 
null 

lists, 
sets 
functions


interpolate Nix expression inside a string 
"${}"

List 

nix-repl> [ 2 "foo" true (2+3) ]

sets
sets/attribute sets 
keys and values 

nix-repl> s = { foo = "bar"; a-b = "baz"; "123" = "num"; }

access an element

nix-repl> s.a-b
"baz"

nix-repl> s."123"
"num"

rec
can refer to other attributes in same set; 

nix-repl> rec { a = 3; b = a+4; }


nix-repl> a = 3

nix-repl> b = 4

nix-repl> if a > b then "yes" else "no"

"no"

let
define local variable in inner expression

nix-repl> let a = "foo"; in a

"foo"

nix-repl> let a = 3; b = 4; in a + b

7

with  ~   from module import *   ( Python) 

nix-repl> longName = { a = 3; b = 4; }

nix-repl> longName.a + longName.b
7

nix-repl> with longName; a + b
7



types 

expressions 
if
with 
let 


Functions are anonymous 
lambdas

functions have 1 parameter 

<parameter name>: <function body> 

nix-repl> x: x*2

store function in variable

nix-repl> double = x: x*2

nix-repl> mul = a: (b: a*b)

nix-repl> mul 3

nix-repl> (mul 3) 4

mul 3 

returns function 
b: 3*b 

call the returned function with 4

nix-repl> mul = a: b: a*b

partial application:

nix-repl> foo = mul 3

nix-repl> foo 4
12

nix-repl> foo 5
15


use a set as argument, then using pattern matching.

nix-repl> mul = s: s.a*s.b

nix-repl> mul { a = 3; b = 4; }
12

nix-repl> mul = { a, b }: a*b

nix-repl> mul { a = 3; b = 4; }
12

arguments set
{ a, b} is a set except without the values. 

nix-repl> mul = { a, b }: a*b

nix-repl> mul { a = 3; b = 4; c = 6; }


default values of attributes in the arguments set:

nix-repl> mul = { a, b ? 2 }: a*b

nix-repl> mul { a = 3; }
6

nix-repl> mul { a = 3; b = 4; }
12

pass more attributes (variadic) than the expected ones:

nix-repl> mul = { a, b, ... }: a*b

nix-repl> mul { a = 3; b = 4; c = 2; }

However, in the function body you cannot access the "c" attribute. The solution is to give a name to the given set with the @-pattern:

nix-repl> mul = s@{ a, b, ... }: a*b*s.c

nix-repl> mul { a = 3; b = 4; c = 2; }
24

That's it, you give a name to the whole parameter with name@ before the set pattern.

Advantages of using argument sets:

Named unordered arguments: you don't have to remember the order of the arguments.

You can pass sets, that adds a whole new layer of flexibility and convenience.

Disadvantages:

Partial application does not work with argument sets. You have to specify the whole attribute set, not part of it.

argument sets ~ python **kwargs.



import parses a .nix file. reads the derivation expression 


a.nix:

3

b.nix:

4

mul.nix:

a: b: a*b

nix-repl> a = import ./a.nix

nix-repl> b = import ./b.nix

nix-repl> mul = import ./mul.nix

nix-repl> mul a b

12

test.nix:

x

nix-repl> let x = 5; in import ./test.nix

error: undefined variable `x' at /home/lethal/test.nix:1:1


test.nix:

{ a, b ? 3, trueMsg ? "yes", falseMsg ? "no" }:
if a > b
  then builtins.trace trueMsg true
  else builtins.trace falseMsg false

nix-repl> import ./test.nix { a = 5; trueMsg = "ok"; }
trace: ok
true


In test.nix we return a function. 

It accepts a set, with default attributes b, trueMsg and falseMsg.

builtins.trace is a built-in function that takes two arguments. The first is the message to display, the second is the value to return. 

It's usually used for debugging purposes.

Then we import test.nix, and call the function with that set.


# a gotcha; using autotools,  

```
$out is the --prefix path 
```
i.e. it is not the make DESTDIR 

i.e. stateless packaging! don't install the package relative to / , the global common root, 

instead , set the environment to a nix store folder ,  i.e. set its common root dir , the install path , its prefix , to the nix store folder.

# Functions 

# Imports

# Enter the Nix environment  (only for nix not nixos ? )

source ~/.nix-profile/etc/profile.d/nix.sh

# Questions
can builder be a derivation function or 
a file reference such as ./builder.sh ?

# comments

( also sets TMPDIR, TEMPDIR, TMP, TEMP to this temporary folder) . i.e. stop builder program writing temp files to elsewhere by mistake )


# non-essential

# attribute set

Set of attibutes is  { <attributes> }

# Derivation function

A derivation function == a build

# { name } name for the package

# { system }  

system := "i686-linux" or "x86_64-darwin". 

run nix -vv --version to find your system type 

or set this as the system

system = builtins.currentSystem;

# { builder } 

A derivation's 'builder' parameter : use bash , and pass it a bash script 

remember that the builder parameter refers to the executable / to the binary . So the parameter is the bash program and we pass to that the bash script to run. 


an executable / binary / program to run the build

If an attribute is a file path, 
such as ../foo/sources.tar, 
Nixos first copies this file to the nix store 
and then stores the new location in an environment variable. 
 
If the attribute is a derivation, 
this is first built and the derivation output path is saved to an environment variable.

# optional attributes 

Nixos calls the builder with the optional attributes as arguments 

# $out

Nixos saves the output of the derivation to the output path called out. 

You can set multiple outpus 

e.g.

outputs = [ "lib" "headers" "doc" ];

Nixos first creates folders in the nix store for these outputs lib headers and doc and stores the folder locations in environement variables called $lib  $ headers  and $doc  

Then the script given to the builder can refer to these locations: 

```
./configure \
  --libdir=$lib/lib \
  --includedir=$headers/include \
  --docdir=$doc/share/doc
```

# Nixpkgs

Nixpkgs is an environment

# mkDerivation

mkDerivation is in Nixpkgs 

mkderivation sets system env var 
and then calls a derivation 
( it could be described as a wrapper around derivation) 

# Steps nix takes when running/building a derivation

Creates a temporary folder called /tmp 

cd /tmp 

Clears the env vars 

Sets NIX_BUILD_TOP to the location of /tmp 

Sets derivation parameters/attributes to env vars 

Sets PATH to /path-not-set . This stops from using default PATH.

Sets HOME to /homeless-shelter .  Stops any interaction of something with HOME 

Set NIX_STORE to location of nix store ; default is  /nix/store

Sets each parameter in outputs to environment variables

Runs builder program with the args 

Writes standard output (and stderr) to file /nix/var/log/nix.

Removes the temporary directory

# Finding out runtime dependencies

Nixos looks in each output path for any hashes

looks for that hash path in the nix store;  

registers them as runtime dependencies 

outputs : 

list of output paths 

inputs: 

list of any input derivation paths

system: 

builder: 

the builder executable program

environment variables:

a list passed to the builder program

# analogies

Analogy with C:

.drv ~ .o 

.nix ~ .c 

out path ~ build outcome


# Things to learn

# d.drvAttrs  -  what is this ? 

nix-repl> d.drvAttrs

{ builder = "mybuilder"; name = "myname"; system = "mysystem"; }

# You might see multiple versions of a package
```
$ ls /nix/store/*coreutils*/bin
```

# derivation function:

provide a attrs with information on how to build a package

get back a set with the full instructions on how to build the package . 

This full instruction set is stored in a .drv file in the nix store. 


# What is a derivation?  

derivation is a function which takes a attribute set (attrs is short for attribute set)

Here we set whatever calling derivation with this attrs to the variable d:

nix-repl> d = derivation { name = "myname"; builder = "mybuilder"; system = "mysystem"; }

nix-repl> builtins.isAttrs d

true 

this means that d (the thing returned from the derivation function called with attrs) is an attrs

An attrs consists of key values ,  or name values

nix-repl> builtins.attrNames d

[ "all" "builder" "drvAttrs" "drvPath" "name" "out" "outPath" "outputName" "system" "type" ]







# Example of nix-shell: hello world 

hello is not installed:

```
$ hello
```

install hello in to a shell environement 
```
$ nix-shell -p hello
```

```
[nix-shell:~]$ hello
```

# search the package list

nix-env -qaP git


# Example; using Python and $PYTHONPATH

$ nix-shell -p 'python38.withPackages (packages: [ packages.django ])'

[nix-shell:~]$ python -c 'import django; print(django)'
<module 'django' from '/nix/store/c8ipxqsgh8xd6zmwb026lldsgr7hi315-python3-3.8.1-env/lib/python3.8/site-packages/django/__init__.py'>
We create an ad hoc environment with $PYTHONPATH set and python available, along with the django package as well.

The -p argument can handle more than attribute names. You can use a full Nix expression, but we’ll cover that in later tutorials.

Towards reproducibility
Even running in these basic Nix shells, if you handed over these commands to another developer, they could get different results.

These shell environments are really convenient, but they are not perfectly reproducible in this form.

What do we mean by reproducible? A fully reproducible example would give exactly the same results no matter when or on what machine you run the command. The environment provided would be identical each time.

Nix also offers fully reproducible environments, which it calls pure environments.

The following is a fully reproducible example and something that different colleagues with different machines, for example, could share.

$ nix-shell --pure -p git -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/2a601aafdc5605a5133a2ca506a34a3a73377247.tar.gz

[nix-shell:~]$ git --version
git version 2.25.4
There are two things going on here:

--pure flag makes sure that the bash environment from your system is not inherited. That means only the git that Nix installed is available inside the shell. This is useful for one-liners and scripts that run for example within a CI environment. While developing, however, we’d like to have our editor around and a bunch of other things. Therefore we might skip the flag for development environments but use it in build ones.

The -I flag pins the nixpkgs revision to an exact git revision, leaving no doubt which exact version of Nix packages will be used.

Reproducible executables
Finally, we can wrap scripts with Nix to provide a reproducible shell environment that we can commit to a git repository and share with strangers online. As long as they have Nix installed, they’ll be able to execute the script without worrying about manually installing and later uninstalling dependencies at all.

#! /usr/bin/env nix-shell
#! nix-shell --pure -i python -p "python38.withPackages (ps: [ ps.django ])"
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/2a601aafdc5605a5133a2ca506a34a3a73377247.tar.gz

import django

print(django)
This is essentially the same example as in the previous section, but this time declaratively source controlled! All of the required Nix commands are included as #! shebang headers in the scripts itself.

Note

The multi-line shebang format is a feature of nix-shell. All the subsequent #! nix-shell lines are used to build up the shells configuration before building the shell and executing the body of the script.

Next steps
We’ve only covered the bare essentials of Nix here. Once you’re comfortable with these examples, take a look at:

Towards reproducibility: pinning Nixpkgs to see different ways to import nixpkgs

Declarative and reproducible developer environments

Garbage Collection- as when using nix-shell, packages are downloaded into /nix/store, but never removed.

See man nix-shell for all of the options.

To quickly setup a Nix project read through Getting started Nix template.



-----
# Use angle brackets to specify a path

Specify a path between angle brackets:

<nixpkgs> 

nix searches for for the nixpkgs file/dir in the env var NIX_PATH and returns the path to it

# List 

[ 123 ./foo.nix "abc" (f { x = y; }) ]

(f {x=y;}) this is the result of a call to function f with attrs {x=y;}


# Functor
A set that has a __functor attribute whose value is callable 

let add = { __functor = self: x: x + self.x; };
    inc = add // { x = 1; };
in inc 1

evaluates to 2. 

This can be used to attach metadata to a function without the caller needing to treat it specially, or to implement a form of object-oriented programming, for example.


# recursive set

a set where attributes can refer to each other

rec {  x = y; y = 123; }.x


# let 

define variables for an expression
let x = "blah"; y = "arse" in x + y

let
  x = "foo";
  y = "bar";
in x + y


# Load our <nixpkgs>

add our nixpkgs :

nix-repl> :l <nixpkgs>

