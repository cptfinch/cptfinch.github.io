Build an Exradin A12 chamber

The Exradin A12 is a thimble ionization chamber, 
shown schematically in figure 3. 
The basic strategy to model such an instrument is to use a conestack for most of the chamber,
which is cylindrically symmetric, except for the spherical tip. 

Build the chamber tip with spheres (as shown by dashed lines in the diagram) and join it with the 7-layer conestack
chamber body, using a composite cd geometry.

Model the spherical chamber tip

Start a new input file for this chamber geometry. 

Save this input file in the 

$EGS_HOME/egs_chamber directory. 

It is recommended to use the egs_chamber application 

Figure 3: Simplified schematic of an Exradin A12 thimble chamber, 
based on information from the manufacturer’s product brochure. 

All units are in centimetres. 

Radial dimensions are given, as well as the position of the various points along the chamber’s axis 

(with the centroid of the collecting volume at 0 cm). 

The central electrode, the thimble shell and the chamber body are made of C552 plastic.

for ionization chamber simulations due to its useful suite of variance reduction parameters.

There are a number of useful features, found in the egs chamber documentation.

Define a geometry for the chamber tip using 2 concentric spheres, as in Section 6.2.

The smallest sphere will become the spherical tip of the central electrode ! 

The outer sphere should be water - 
the entire chamber will be placed in water and we will end up using a small water shell surrounding the chamber 
for a variance reduction technique called cross section enhancement. 

Position the midpoint of the set of spheres on axis in their final location at x = 0.935 cm, as shown in figure 3.

```
#-------------------------------------------------------------------------
# Spherical chamber tip
#-------------------------------------------------------------------------
:start geometry:
name = chamber_tip
library = egs_spheres
midpoint = 0.935 0 0
radii = 0.05 0.305 0.355 2.0
:start media input:
media = c552 air water # media 0,1,2
set medium = 1 1 # set region 1 to air (1)
set medium = 3 2 # set region 3 to water (2)
# by default the rest of the regions are c552
:stop media input:
:stop geometry:
Include the following bounding box view control input block in your input file (outside
6.4 Build an Exradin A12 chamber
6 MODELLING AN IONIZATION CHAMBER 39
the geometry definition block) to help the viewer find the spheres. Inspect the geometry in
egs_view.
:start view control:
xmin = -4
xmax = 4
ymin = -4
ymax = 4
zmin = -4
zmax = 4
:stop view control:
```

Model the chamber body
Use a conestack to define the cylindrically symmetric chamber body. 
Set the axis of the conestack so that layers are added in the -x direction. 

In the next step you will join this conestack to the spheres using a cd geometry plane located at x = 0.935 cm, 
so set the top of the conestack at that point. 

Surround the chamber in water out to 2 cm radius. 

See if you can design the chamber without copy-pasting the text below!

```
#-------------------------------------------------------------------------
# Main chamber body (as a conestack)
#-------------------------------------------------------------------------
:start geometry:
name = chamber_body
library = egs_cones
type = EGS_ConeStack
axis = 0.985 0 0 -1 0 0 # x-axis
### sensitive volume (cylindrical portion)
:start layer:
thickness = 2.03
top radii = 0.05 0.305 0.355 2.0
bottom radii = 0.05 0.305 0.355 2.0
media = c552 air c552 water
:stop layer:
### electrode base
:start layer:
thickness = 0.13
top radii = 0.15 0.305 0.355 2.0
bottom radii = 0.15 0.305 0.355 2.0
media = c552 air c552 water
:stop layer:
### up to first kink
:start layer:
6.4 Build an Exradin A12 chamber
6.4 Build an Exradin A12 chamber Getting Started with EGSnrc
thickness = 0.11
top radii = 0.355 2.0
bottom radii = 0.355 2.0
media = c552 water
:stop layer:
### first widening
:start layer:
thickness = 0.08
bottom radii = 0.48 2.0
media = c552 water
:stop layer:
### up to second kink
:start layer:
thickness = 0.48
bottom radii = 0.48 2.0
media = c552 water
:stop layer:
### second widening
:start layer:
thickness = 0.08
bottom radii = 0.61 2.0
media = c552 water
:stop layer:
### to end
:start layer:
thickness = 2.0
bottom radii = 0.61 2.0
media = c552 water
:stop layer:
:stop geometry:
```

Join the chamber body to the chamber tip

Create a set of 3 planes perpendicular to the chamber axis, 
so as to define two regions,
numbered 0 and 1. 

The middle plane should be located at the joining point x = 0.935 cm.

The other two planes should be located beyond the chamber on either side.

```
### Planes for cd geometry base
:start geometry:
name = cd_planes
library = egs_planes
type = EGS_Xplanes
6.4 Build an Exradin A12 chamber
6 MODELLING AN IONIZATION CHAMBER 41
# These 3 plane positions define 2 regions for us to use (0 and 1)
# the outer planes (-4 and 4) could be anything large
positions = -4 0.935 4
:stop geometry:
```

Finally, use a cd geometry to combine the chamber body and the chamber tip, 
using the planes you just defined as the base geometry. 

Put the body in region 0, and the tip spheres in region 1. 

Verify your geometry visually in egs_view. 

The cd geometry package is very useful for combining and cutting geometries. 

Check out the relevant documentation for more information.

```
:start geometry:
name = chamber
library = egs_cdgeometry
base geometry = cd_planes
set geometry = 0 chamber_body
set geometry = 1 chamber_tip
:stop geometry:
```

It is important to avoid having surfaces perfectly abutting (touching) in egs++, 
so start your conestack at a location x > 0.935 cm to avoid touching the conestack surface to the egs planes geometry. 

To do this, make the top layer slightly thicker (say 0.05 cm thicker, making it 1.045+.935+.05 = 2.03 cm), 

and position the conestack at 0.935+0.05 = 0.985 cm 
to effectively bleed the conestack into the other geometry. 

The cd geometry will cut this extra bit off at the plane we define, 
giving priority to the chamber tip.

What are the region numbers that correspond to the air cavity ? 

Hint: Use a clipping plane (0,1,0,0) in egs view.

The air cavity is comprised of regions 1, 5 and 29.

Why is the region number for the spherical tip of the air cavity so large ?

The spherical tip of the air cavity is region 29, 
because the conestack is added first in the cd geometry. 

Therefore, region numbers are attributed first to the conestack (regions 0 to 27, for 7 layers × 4 regions per layer), 
and only then to the spherical regions in the chamber tip.

How many regions are there in total in this model ? How many real regions ?

There are 32 regions in this chamber model, 
ranging from 0 to 31. 
However, there are many virtual regions in the chamber stem, 
where there are only two radii per conestack layer. 

There are 10 virtual regions, hence there are only 22 real regions in the geometry.

What is the largest region number in this geometry ?

The largest region number in this geometry is 31 (the chamber tip shell). 
Keep in mind that region numbering starts from 0, so if a geometry contains n regions, the largest region number is n − 1.

Add a region label for the cavity

You have already determined the region numbers for the cavity, but what happens if you add more components to the geometry? 

The global region number might change! 

For example, if we inscribe the chamber in a box of water and look at the region numbers of the cavity again,
they will be different. 

If you need to know the cavity region numbers for scoring quantities (we will), this can be quite inconvenient. 

Instead, use region labels. This assigns a series of local region numbers within a given geometry to a label that you can reference elsewhere.

Local region numbers are what you find when viewing a particular geometry (e.g. our geometry by the name of chamber). 

To find the local region numbers just set that geometry as the calculation geometry, and open egs_view. 

In contrast, the global region numbers are the numbers that get assigned to those same regions when the geometry gets included in a more complex composite geometry. 

For example, the composite geometry of a chamber inscribed in water.

To add a region label, place the following within a geometry block. 

In this example we give the label the name chamber_cavity_label (make sure it’s unique!) and assign the local regions 1, 5 and 29 (the air cavity regions). 

Now if we want to reference those regions elsewhere in the input file, 
we can reference the label instead of the global region numbers (which may change if other geometries in the input file are modified).

set label = chamber_cavity_label 1 5 29

Add region labels both for the air cavity regions, and for the entire chamber. 

The latter of these will be used for a variance reduction technique.

```
### Join tip and body, attached at the cd_planes
:start geometry:
name = chamber
library = egs_cdgeometry
base geometry = cd_planes
set geometry = 0 chamber_body
set geometry = 1 chamber_tip
# The label for the cavity regions
# View the chamber geometry alone to find these numbers
set label = chamber_cavity_label 1 5 29
set label = chamber_xcse 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 \\
18 19 20 21 22 23 24 25 26 27 28 29 30 31
:stop geometry:
```

Inscribe the chamber in air

Now that the chamber has the sensitive regions labelled, 
inscribe it in a box of water, 
then in a larger box of air. 

There are many ways to do this! 

Name the new composite geometry chamber_in_water_in_air, 
and set it to be the new simulation geometry (there can only be one).

View the geometry in egs_view again, 
setting air and water transparent and using a clipping plane. 

Notice how the region numbers of the sensitive volume of the chamber have changed
this is the motivation for region labels.

```
#-------------------------------------------------------------------------
# A water and air box surrounding the chamber
#-------------------------------------------------------------------------
# Air outside whole structure
:start geometry:
name = outer_air_box
library = egs_box
box size = 15 15 210
:start media input:
media = air
:stop media input:
:stop geometry:
# Water outside the chamber
:start geometry:
name = water_box
library = egs_box
box size = 10
:start media input:
media = water
:stop media input:
:stop geometry:
# Inscribe the chamber in the water
:start geometry:
name = chamber_in_water
library = egs_genvelope
base geometry = water_box
inscribed geometries = chamber
:stop geometry:
# Inscribe the water and chamber in the air
:start geometry:
name = chamber_in_water_in_air
library = egs_genvelope
base geometry = outer_air_box
inscribed geometries = chamber_in_water
:stop geometry:
simulation geometry = chamber_in_water_in_air
```

