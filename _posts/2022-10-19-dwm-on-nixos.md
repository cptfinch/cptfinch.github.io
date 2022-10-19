
Using DWM
However, this will not work for dwm. (Probably services.xserver.windowManager.dwm can only see the dwm in pkgs, not the one in environment.systemPackages.) But you can use an overlay, like this:

nixpkgs.overlays = [
  (self: super: {
    dwm = super.dwm.overrideAttrs (oldAttrs: rec {
      patches = [
        ./path/to/my-dwm-patch.patch
        ];
      configFile = super.writeText "config.h" (builtins.readFile ./dwm-config.h);
      postPatch = oldAttrs.postPatch or "" + "\necho 'Using own config file...'\n cp ${configFile} config.def.h";
      });
    })
  ];
It should also be mentioned that the st.overrideAttrs should be added to the overlays when using dwm with dwm changes and st changes the overlay could look like this

nixpkgs.overlays = [
  (self: super: {
    dwm = super.dwm.overrideAttrs (oldAttrs: rec {
      patches = [
        ./path/to/my-dwm-patch.patch
        ];
      configFile = super.writeText "config.h" (builtins.readFile ./dwm-config.h);
      postPatch = oldAttrs.postPatch or "" + "\necho 'Using own config file...'\n cp ${configFile} config.def.h";
      });
    })
    st = super.st.overrideAttrs (oldAttrs: rec {
      patches = [
        ./path/to/my-dwm-patch.patch
        ];
      configFile = super.writeText "config.h" (builtins.readFile ./st-config.h);
      postPatch = "${oldAttrs.postPatch}\ncp ${configFile} config.def.h\n"
      });
    })
  ];
