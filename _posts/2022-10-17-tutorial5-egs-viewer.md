
To visualize it launch egs_view with the name of the tracks file:

egs_view myinput.egsinp myinput.ptracks

In section 4, we wrote the simplest of egs++ applications 
and used egs_view for the first time. 

This geometry viewing tool turns out to be essential when writing complex geometries 
; to visually confirm the accuracy of the design, 
and to determine the number assigned to regions in the geometry. 

In the following sections, use this tool frequently!

The egs_view tool actually uses the HOWFAR function of each geometry to render the view.

This means that what you see is what a particle in your simulation sees. 

Note that egs_view is only compatible with egs++ input files (not the MORTRAN3 codes).

For more explanation of egs_view, refer to the online documentation for the geometry module.

When trying to simulate a particular experiment, 
constructing the geometry is half the battle! 

Take your time to learn what can be done; 
starting from a similar example and tweaking it for your purposes is a key time-saver.

There are geometry examples online, and in the distribution:

$HEN_HOUSE/egs++/geometry/examples

Before building an ionization chamber, 
we’ll lay a bit more foundation in geometry design and use of egs_view. 

In a text editor, 
create a new document with the following geometry input, 
describing a cubic box:

```
:start geometry definition:
### a simple box definition
:start geometry:
name = my_box # this name is up to you
library = egs_box
box size = 10 # length units are cm
:start media input:
media = my_medium
:stop media input:
:stop geometry:
### name of the geometry to load in the viewer
simulation geometry = my_box
:stop geometry definition:
```

Note that white space is irrelevant—
except for line returns because egs++ reads one input per line. 

Comment your code as you go, 
and remember the simulation geometry input to tell the viewer which geometry to load (by name).

Media names are up to you: 
the viewer merely assigns different colors to different media.

These names will ultimately have to be defined in the media definition input block (or a PEGS4 data file) to run a simulation. 

However, the viewer displays media even if they are not yet defined.

For a description of the egs++ input syntax for each geometry, and for input examples,
refer to the online manual: http://nrc-cnrc.github.io/EGSnrc/doc/pirs898/index.html, 
in the Geometries section, e.g., Geometries > EGS_Box.

Save your box geometry input in a file named simple.egsinp

From the directory where you saved the file, launch the geometry viewer:

egs_view simple.egsinp &

You should see a red square in the geometry window, 
along with a View Control window.

The viewer starts with the camera on the positive z-axis, 
but you can rotate the geometry in 3D by dragging with the mouse, as shown in figure 1a.

You can pan the view by dragging while pressing the Ctrl key, and zoom in and out with the middle mouse button or the mouse wheel. 

Note that these manipulations do not affect your input: 
egs_view never writes to the input file.

Spend a few minutes exploring the tabs 
to get a feel for what controls are available. 

At any time you can export the current view as an image with File->Save image.

Using File->Reload the input file will be read again, 
which is useful to update the view after making changes. 

Just keep in mind that if there is a typo in your updated input file, egs_view might crash!

What are the region numbers inside and outside the cube ?

When hovering the mouse over the cube, 
a small red square appears in the top left corner of the image window, 
indicating that the inside of the cube is region 0.

The region outside the cube is not displayed in the list. 

In egs++ everything outside the defined geometry is region −1. 

Particles that reach region −1 in the simulation are immediately discarded: 
they have reached the “end of the world” !

Figure 1: 

a) snapshot of the cube defined in the simple.egsinp input file. 

b) snapshot of the point of view you are asked to reproduce using viewer clipping planes in Section 6.2.

