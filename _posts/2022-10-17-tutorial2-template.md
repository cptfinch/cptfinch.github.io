
# Use template

get this input file:

$EGS_HOME/tutor7pp/test1.egsinp

look inside the test1.egsinp file, 

geometry is defined as 
an infinite slab of tantalum, 
1 mm thick. 

A beam (parallel) of 20 MeV electrons is directed at the slab, 
the simulation runs 1,000,000 particles. 

tutor7pp has some custom scoring options / input params (that are not found in other apps)

tutor7pp has some scoring regions 
these regions are used to score pulse height distributions 
(see bottom of the input file).

Compile and run tutor7pp : (using cli, egs_gui can be used as well)

cd $EGS_HOME/tutor7pp

make clean

make

tutor7pp -i test1 -p tutor_data | tee test1.output

app dir now contains test1.egsdat and test1.output

.egsdat file is used by EGSnrc to restart jobs that crashed, or combine parallel runs. 

output file , 
observe the 
reflected, 
deposited 
and transmitted energy 
fractions for the simulation of electrons through a single slab. 

then the pulse height distribution for region 1 (the slab itself).



# creating an input file (egs++ ?)  

cd $EGS_HOME/tutor7pp 

touch <name>.egsinp  



input files have:
- Geometries
- Particle sources
- Run control
- MC transport parameters
- Media (optional)
- Ausgab output (optional)
- Scoring options (application specific)

define the geometry, 

cylinder 
axis parallel to the z-axis 
5 cm radius. 

units are cm and MeV

infinitely long cylinder 
of 5 cm radius  :
```
:start geometry definition:
:start geometry:
library = egs_cylinders
type = EGS_ZCylinders
name = the_cylinder
midpoint = 0 0 0 # in cm
radii = 5 # in cm
:stop geometry:
:stop geometry definition:
```
look at the documentation for egs cylinders


finite cylinder 
of 10 cm height 
with its front face at z = 0, 
first define bounding planes 
then put everything together using an ND geometry. 

Add these geometries to the geometry definition block:
```
:start geometry:
library = egs_planes
type = EGS_Zplanes
name = the_planes
positions = 0 10 # in cm
:stop geometry:
:start geometry:
library = egs_ndgeometry
name = phantom
dimensions = the_planes the_cylinder
:start media input:
media = H2O521ICRU
:stop media input:
:stop geometry:
```

creates a composite geometry. 

As described in the egs ndgeometry documentation, 
the egs ndgeometry creates regions 
where the listed geometries (dimensions) intersect. 

Since the_planes contains only one region between z = 0 and z = 10, 
the intersection with the_cylinder contains a cylinder that has been cut by those planes.

Instead of defining media in the input file, 
can do the old way. 

The media used was H2O521ICRU, 
which is the name of water material 
defined in a PEGS data file 
HEN_HOUSE/pegs4/data/521icru.pegs4dat 

521icru PEGS4 data file needs to be included as an arg

simulation geometry = phantom

visualize the geometry with egs_view 

egs_view yourFile.egsinp

define the source 
isotropic point source 
of 100 keV photons 
emits uniformly in all directions. 
Position the source at −100 cm from the origin on the z-axis:

```
:start source definition:
:start source:
library = egs_point_source
name = the_point_source
position = 0, 0, -100 # in cm
:start spectrum:
type = monoenergetic
energy = 0.1 # in MeV
:stop spectrum:
charge = 0
:stop source:
simulation source = the_point_source
:stop source definition:
:start ausgab object definitions: delimiter and corresponding stop delimiter:
:start ausgab object definition:
:start ausgab object:
library = egs_dose_scoring
volume = 785.398163397 # in cm^3
region dose = yes
name = my_dose_scoring
:stop ausgab object:
:stop ausgab object definition:
```

number of histories to run == ncase 

define in the run control block

```
:start run control:
ncase = 100000
:stop run control:
```

start run:

tutor7pp -i myinput -p 521icru | tee myoutput.txt

# refs 

egs++ applications share the input format, 
input file == common input stuff + added input blocks + added input parameters (blocks and parameters)

(refer to PIRS-898 ; http://nrc-cnrc.github.io/EGSnrc/doc/pirs898/index.html)
(manuals: https://github.com/nrc-cnrc/EGSnrc/releases)
(for list of inputs see PIRS-898 ; http://nrc-cnrc.github.io/EGSnrc/doc/pirs898/common.html)

