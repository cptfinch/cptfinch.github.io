
# Add a particle source

Add a simple collimated 10 MeV photon source. 

The source shape should be a point,
positioned at -100 cm on the z-axis. 

Set the target shape to be a rectangle at the origin, 10 × 10 cm2

To model a linear accelerator instead, you will need to replace this with a BEAMnrc shared library source, 
or a phase-space source.

```
##############################################################################
### Source definition
##############################################################################
:start source definition:
:start source:
name = photons
library = egs_collimated_source
charge = 0
:start source shape:
type = point
position = 0 0 -100
:stop source shape:
:start target shape:
library = egs_rectangle
rectangle = -5 -5 5 5
:stop target shape:
:start spectrum:
type = monoenergetic
energy = 10
:stop spectrum:
:stop source:
simulation source = photons
:stop source definition:
```

