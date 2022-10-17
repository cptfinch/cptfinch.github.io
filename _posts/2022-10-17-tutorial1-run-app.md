# create an app (egs++ ?)

cd $EGS_HOME

mkdir myapp 

cp ../tutor7pp/array_sizes.h ./    #copy from app tutor7pp files array_sizes.h and Makefile

cp ../tutor7pp/Makefile ./

vim Makefile 

change tutor7pp to myapp # looks like this tutor7pp is being used as a template -- see nix flake.nix templates how that is done..  :

2 places:

USER_CODE = myapp

EGSPP_USER_MACROS = myapp.macros

touch myapp.macros    # may be used for more advanced applications
 
touch myapp.cpp   # create egs++ input file 

copy this to it:

```c
#include "egs_advanced_application.h"

APP_MAIN (EGS_AdvancedApplication);
```

.. the smallest EGSnrc app ! 

APP_MAIN == function macro

make 

find built file myapp in $EGS_HOME/bin/ 


# create the app's input file   

defines the simulation conditions 

cd $EGS_HOME/myapp/     # app dir

touch slab.egsinp   

Copy and paste
```c++
################################
#
# Simple slab simulation
#
################################
################################
### RUN CONTROL
################################
:start run control:
ncase = 1e3 # The number of histories to simulate
:stop run control:
################################
### GEOMETRY
################################
:start geometry definition: # Only 1 geometry definition block allowed
### Define a plate of tantalum
:start geometry: # Many geometry blocks can be defined
name = slab # This name can be anything you like
4.2 Create an egs++ input file
4 GETTING DIRTY: WRITING YOUR FIRST EGSNRC APPLICATION 13
library = egs_ndgeometry
type = EGS_XYZGeometry
x-planes = -5, 5 # in cm
y-planes = -5, 5 # in cm
z-planes = -10, 0, 0.1, 10 # in cm
:start media input:
media = vacuum tantalum # Indexed as 0 1
set medium = 1 1 # Set region 1 to medium 1 (tantalum)
# Other regions default to medium 0 (vacuum)
:stop media input:
:stop geometry:
### Use the geometry with this name for the simulation
simulation geometry = slab
:stop geometry definition:
################################
### MEDIA
################################
:start media definition: # Only 1 media definition block allowed
# Defining media in the input file like this is called "pegsless" mode
### Cutoff energies, in MeV
ae = 0.521 # lowest energy for electrons (kinetic+0.511)
ap = 0.01 # lowest energy for photons (kinetic)
ue = 50.511 # maximum energy for electrons (kinetic+0.511)
up = 50 # maximum energy for photons (kinetic)
### Tantalum
:start tantalum: # this name can be anything
density correction file = tantalum # name the file (no ext.)
:stop tantalum:
### Lead
:start lead:
density correction file = lead
:stop lead:
### Water
:start water:
density correction file = water_liquid
:stop water:
4.2 Create an egs++ input file
4.2 Create an egs++ input file Getting Started with EGSnrc
:stop media definition:
################################
### SOURCE
################################
:start source definition: # Only 1 source definition block allowed
### Pencil beam
:start source:
name = pencil_beam # This name can be anything you like
library = egs_parallel_beam
charge = -1
direction = 0 0 1
:start spectrum:
type = monoenergetic
energy = 20 # in MeV
:stop spectrum:
:start shape:
type = point
position = 0 0 -10 # in cm
:stop shape:
:stop source:
### Use the source by this name for the simulation
simulation source = pencil_beam
:stop source definition:
################################
### VIEWER CONTROL
################################
:start view control:
# Here we are just assigning some colors for nice
# viewing in the egs_view application
set color = lead 120 120 200 200
set color = tantalum 120 255 120 255
set color = water 0 220 255 200
:stop view control:
################################
### AUSGAB OBJECTS
################################
:start ausgab object definition: # Only 1 ausgab definition block allowed
### Particle tracks
:start ausgab object:
name = tracks
library = egs_track_scoring
:stop ausgab object:
:stop ausgab object definition:
```

a thousand 20 MeV electrons
incident on 
a 1 mm thick tantalum plate

# run the app

myapp -i slab.egsinp              #=> -i == input file  ; prints results to terminal ; saves info in slab.ptracks file

# view the results 

egs_view slab.egsinp slab.ptracks       #=> Loads the slab.egsinp input file and slab.ptracks in egs_view utility ; to understand the geometry of the simulation 

This app just transported the particles in the geometry 

myapp returned particle tracks, 
but returned no energy deposited, no dose, no spectrum (no physical quantity was scored; no quantity of interest)



# extend: Add scoring objects to input file

write a method to get simulation info

add a dose scoring objects to your input file 

dose deposited in every region of the geometry 

open the input file, 
add this inside the ausgab object definition,
(the one ausgab object definition will have two ausgab object blocks)
```
:start ausgab object definition:
# ... there is an existing object here for ptracks
:start ausgab object:
name = dose
library = egs_dose_scoring
dose regions = 1
volume = 10
:stop ausgab object:
:stop ausgab object definition:
```

Run the simulation again 

myapp -i slab.egsinp

find "Summary of region dosimetry" in the output:

How much energy is deposited inside the tantalum plate ?  
2.5506±1.828% MeV

What is the dose ?  
2.4535 × 10−12 ± 1.828%) Gy

```console
==> Summary of region dosimetry (per particle)
ir medium rho/[g/cm3] V/cm3 Edep/[MeV] D/[Gy]
-----------------------------------------------------------------------------
1 tantalum 16.654 10.0000 2.5506e+00 +/- 1.828 % 2.4535e-12 +/- 1.828 %
-----------------------------------------------------------------------------
```

