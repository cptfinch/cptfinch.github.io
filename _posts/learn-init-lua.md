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

