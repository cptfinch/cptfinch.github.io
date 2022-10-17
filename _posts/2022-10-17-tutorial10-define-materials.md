
# adding material / media

Add media definitions to the input file (pegsless mode). 

Assign the same names that we used to media in the geometry (air, c552, water), and set the density correction files appropriately. 

The full set of density correction files distributed with EGSnrc can be found in 

$HEN_HOUSE/pegs4/density_corrections/. 

If the density correction file you are using resides in that directory, 
or in $EGS_HOME/pegs4/density_corrections/, 

then the ‘.density‘ extension can be omitted. 

To use a density correction file located elsewhere, type the full path and file extension.

The big benefit of this style of media definition is the ability to set AE and AP in the input file. 

Previously it was necessary to generate a new pegs4 data file each time these parameters were changed (the 521 in 521icru refers to the AE ).

```
##############################################################################
### Media definition
##############################################################################
:start media definition:
### Cutoff energies
6.4 Build an Exradin A12 chamber
6 MODELLING AN IONIZATION CHAMBER 45
ae = 0.521 # lowest energy for electrons (kinetic+0.511)
ap = 0.01 # lowest energy for photons (kinetic)
ue = 50.511 # maximum energy for electrons (kinetic+0.511)
up = 50 # maximum energy for photons (kinetic)
# I chose the name ’air’, use something easy to type
:start air:
# .density extension omitted for density correction files located in
# $HEN_HOUSE/pegs4/density_corrections or $EGS_HOME/pegs4/
,→ density_corrections
density correction file = air_dry_nearsealevel
:stop air:
:start c552:
density correction file = c-552air-equivalentplastic
:stop c552:
:start water:
density correction file = water_liquid
:stop water:
:stop media definition:
```

