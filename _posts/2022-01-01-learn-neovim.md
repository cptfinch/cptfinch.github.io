---
layout: post
title:  "Neovim setup"
---

## My set up - an isolated environment

Set the env vars XDG_DATA_HOME and XDG_CONFIG_HOME.

XDG_CONFIG_HOME -> keep your neovim configuration files here.

XDG_DATA_HOME -> keep your neovim data here, including plugins.

## Using neovim beginner repo

Search for alpha2phi. alpha2phi.medium.com

git clone the repo

source ./install.sh 

nvb

```bash
#!/usr/bin/sh
NVIM_BEGINNER=~/.config/nvim-beginner
export NVIM_BEGINNER
rm -rf $NVIM_BEGINNER
mkdir -p $NVIM_BEGINNER/share
mkdir -p $NVIM_BEGINNER/nvim
stow --restow --target=$NVIM_BEGINNER/nvim .
alias nvb='XDG_DATA_HOME=$NVIM_BEGINNER/share XDG_CONFIG_HOME=$NVIM_BEGINNER nvim'
```

# init.lua

Require plugins.lua. 

```
require("plugins").setup()
```

The plugins.lua file is found in the lua folder 

```
:h lua-require 
:h lua
```

## plugins.lua

packer_init downloads and installs packer.nvim to the XDG_CONFIG_DATA folder.

Load packer.nvim after download, with packadd

```
:h packadd 
```

autocmd in plugins.lua compiles the file after any changes are saved. 

autocmd generates the compiled loader file 

```
:h packer-commands-compile
```


# to learn

Filetype plugin :

:h ftplugin
---
layout: post
title:  "Neovim setup"
---

## My set up - an isolated environment

Set the env vars XDG_DATA_HOME and XDG_CONFIG_HOME.

XDG_CONFIG_HOME -> keep your neovim configuration files here.

XDG_DATA_HOME -> keep your neovim data here, including plugins.

## Using neovim beginner repo

Search for alpha2phi. alpha2phi.medium.com

git clone the repo

source ./install.sh 

nvb

```bash
#!/usr/bin/sh
NVIM_BEGINNER=~/.config/nvim-beginner
export NVIM_BEGINNER
rm -rf $NVIM_BEGINNER
mkdir -p $NVIM_BEGINNER/share
mkdir -p $NVIM_BEGINNER/nvim
stow --restow --target=$NVIM_BEGINNER/nvim .
alias nvb='XDG_DATA_HOME=$NVIM_BEGINNER/share XDG_CONFIG_HOME=$NVIM_BEGINNER nvim'
```

# init.lua

Require plugins.lua. 

```
require("plugins").setup()
```

The plugins.lua file is found in the lua folder 

```
:h lua-require 
:h lua
```

## plugins.lua

packer_init downloads and installs packer.nvim to the XDG_CONFIG_DATA folder.

Load packer.nvim after download, with packadd

```
:h packadd 
```

autocmd in plugins.lua compiles the file after any changes are saved. 

autocmd generates the compiled loader file 

```
:h packer-commands-compile
```

