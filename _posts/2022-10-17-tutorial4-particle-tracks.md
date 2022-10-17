
# particle tracks

And now comes the fun part: particle tracks !

You will be generating particle tracks with the collimated source. 

To this end, you must define an egs track scoring object between the ausgab object definition delimiters 
in our input file. 

Here is an example:

```
:start ausgab object:
library = egs_track_scoring
name = tracker
score electrons = no
score positrons = no
score photons = yes
# start scoring = 0 # default is 0
# stop scoring = 1024 # default is 1024
# buffer size = 1024 # default is 1024
:stop ausgab object:
```

Tracks are only scored inside the geometry, 

hence particle tracks are only generated inside the water cylinder. 

To see the particle track from the source all the way to the phantom, you need to embed the cylinder and the source inside another geometrical object.

Use a large box of air as an envelope geometry. 

Add the following two geometries in your geometry definition block:

```
:start geometry:
library = egs_box
box size = 500 500 500
name = air_box
:start media input:
media = AIR521ICRU
:stop media input:
:stop geometry:
:start geometry:
library = egs_genvelope
name = phantom_in_air
base geometry = air_box
inscribed geometries = phantom
:stop geometry:
```

and switch the simulation geometry to be phantom_in_air. 

Run the simulation once more with 10 times fewer particles. 

This simulation should take a fraction of a second and produce the particle track file myinput.ptracks. 

