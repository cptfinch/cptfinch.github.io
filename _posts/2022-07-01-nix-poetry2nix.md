---
layout: post
title:  "Learning poetry2nix"
---


# How-to guides

Package and deploy Python apps faster with Poetry and Nix This is a short (11 minutes) video tutorial by Steve Purcell from Tweag walking you through how to get started with a small web development project.

# poetry2nix as a flake

an overlay to use with nixpkgs. 

a flake template to start a poetry2nix project

nix flake init --template github:nix-community/poetry2nix

converts pyproject.toml and poetry.lock to nix derivation 

# API 

# mkPoetryApplication:

takes 

an attribute set with 

projectDir: path to the root of the project.

src: project source 

pyproject: path to pyproject.toml (default: projectDir + "/pyproject.toml").

poetrylock: poetry.lock file path (default: projectDir + "/poetry.lock").

overrides: Python overrides to apply (default: [defaultPoetryOverrides]).

meta: application meta data (default: {}).

python: The Python interpreter to use (default: pkgs.python3).

preferWheels : Use wheels rather than sdist as much as possible (default: false).

Other attributes are passed through to buildPythonApplication.

Example:

```nix
poetry2nix.mkPoetryApplication {
    projectDir = ./.;
}
```

See ./pkgs/poetry/default.nix for a working example.

a CLI for the module admin and a gunicorn app for the module web, 

default.nix 
```nix
let
    app = poetry2nix.mkPoetryApplication {
        projectDir = ./.;
    };
in app.dependencyEnv
```

After building this expression, your CLI and app can be called with these commands

$ result/bin/python -m admin

$ result/bin/gunicorn web:app

Note: If you need to perform overrides on the application, use app.dependencyEnv.override { app = app.override { ... }; }. See ./tests/dependency-environment/default.nix for a full example.

# mkPoetryEnv

env with Python interpreter and dependencies in lock files 

mkPoetryEnv takes an attribute set with the following attributes 

projectDir: path to the root of the project.

pyproject: path to pyproject.toml (default: projectDir + "/pyproject.toml").

poetrylock: poetry.lock file path (default: projectDir + "/poetry.lock").

overrides: Python overrides to apply (default: [defaultPoetryOverrides]).

python: The Python interpreter to use (default: pkgs.python3).

editablePackageSources: A mapping from package name to source directory, these will be installed in editable mode. Note that path dependencies with develop = true will be installed in editable mode unless explicitly passed to editablePackageSources as null. (default: {}).

extraPackages: A function taking a Python package set and returning a list of extra packages to include in the environment. This is intended for packages deliberately not added to pyproject.toml that you still want to include. An example of such a package may be pip. (default: (ps: [ ])).

preferWheels : Use wheels rather than sdist as much as possible (default: false).

```nix
poetry2nix.mkPoetryEnv {
    projectDir = ./.;
}
```

See ./tests/env/default.nix for a working example.

Example with editable packages:

```nix
poetry2nix.mkPoetryEnv {
    projectDir = ./.;
    editablePackageSources = {
        my-app = ./src;
    };
}
```

See ./tests/editable/default.nix for a working example of an editable package.

Example shell.nix

The env attribute of the attribute set created by mkPoetryEnv contains a shell environment.

```nix
{ pkgs ? import <nixpkgs> {} }:
let
  myAppEnv = pkgs.poetry2nix.mkPoetryEnv {
    projectDir = ./.;
    editablePackageSources = {
      my-app = ./src;
    };
  };
in myAppEnv.env
```

Example shell.nix with external dependencies

override the env to add dependency packages (for example, pkgs.hello) as build inputs.

```nix
{ pkgs ? import <nixpkgs> {} }:
let
  myAppEnv = pkgs.poetry2nix.mkPoetryEnv {
    projectDir = ./.;
    editablePackageSources = {
      my-app = ./src;
    };
  };
in myAppEnv.env.overrideAttrs (oldAttrs: {
  buildInputs = [ pkgs.hello ];
})
```


# mkPoetryPackages

Creates an attribute set of the shape { python, poetryPackages, pyProject, poetryLock }. Where python is the interpreter specified, poetryPackages is a list of all generated python packages, pyProject is the parsed pyproject.toml and poetryLock is the parsed poetry.lock file. mkPoetryPackages takes an attribute set with the following attributes (attributes without default are mandatory):

projectDir: path to the root of the project.
pyproject: path to pyproject.toml (default: projectDir + "/pyproject.toml").
poetrylock: poetry.lock file path (default: projectDir + "/poetry.lock").
overrides: Python overrides to apply (default: [defaultPoetryOverrides]).
python: The Python interpreter to use (default: pkgs.python3).
editablePackageSources: A mapping from package name to source directory, these will be installed in editable mode (default: {}).
preferWheels : Use wheels rather than sdist as much as possible (default: false).
Example

poetry2nix.mkPoetryPackages {
    projectDir = ./.;
    python = python35;
}

# mkPoetryScriptsPackage

Creates a package containing the scripts from tool.poetry.scripts of the pyproject.toml:

projectDir: path to the root of the project.
pyproject: path to pyproject.toml (default: projectDir + "/pyproject.toml").
python: The Python interpreter to use (default: pkgs.python3).
Example

poetry2nix.mkPoetryScriptsPackage {
    projectDir = ./.;
    python = python35;
}

# mkPoetryEditablePackage

Creates a package containing editable sources. Changes in the specified paths will be reflected in an interactive nix-shell session without the need to restart it:

projectDir: path to the root of the project.
pyproject: path to pyproject.toml (default: projectDir + "/pyproject.toml").
python: The Python interpreter to use (default: pkgs.python3).
editablePackageSources: A mapping from package name to source directory, these will be installed in editable mode (default: {}).
Example

poetry2nix.mkPoetryEditablePackage {
    projectDir = ./.;
    python = python35;
    editablePackageSources = {
        my-app = ./src;
    };
}

defaultPoetryOverrides
poetry2nix bundles a set of default overrides that fix problems with various Python packages. These overrides are implemented in overrides.

overrides.withDefaults
Returns a list containing the specified overlay and defaultPoetryOverrides.

Takes an attribute set with the following attributes (attributes without default are mandatory):

src: project source directory
Example

poetry2nix.mkPoetryEnv {
    projectDir = ./.;
    overrides = poetry2nix.overrides.withDefaults (self: super: { foo = null; });
}

See ./tests/override-support/default.nix for a working example.

overrides.withoutDefaults

Returns a list containing just the specified overlay, ignoring defaultPoetryOverrides.

Example

poetry2nix.mkPoetryEnv {
    projectDir = ./.;
    overrides = poetry2nix.overrides.withoutDefaults (self: super: { foo = null; });
}

cleanPythonSources

Provides a source filtering mechanism that:

Filters gitignore's

Filters pycache/pyc files

Uses cleanSourceFilter to filter out .git/.hg, .o/.so, editor backup files & nix result symlinks

Example

poetry2nix.cleanPythonSources {
    src = ./.;
}

