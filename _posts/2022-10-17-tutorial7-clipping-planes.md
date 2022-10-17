
# clipping planes

Dig in with clipping planes

Edit your input file to add a second geometry (inside the same geometry definition input block) defining a set of concentric spheres:

```
:start geometry:
name = my_spheres # this name is up to you
library = egs_spheres
radii = 0.3 1.8 2 # three concentric spheres
:start media input:
media = default shell center # names of media 0 1 2 ...
set medium = 2 1 # set region 2 to medium 1 (shell)
set medium = 0 2 # set region 0 to medium 2 (center)
:stop media input:
:stop geometry:
```

By default the whole geometry is filled with medium 0 
(default, the first one in the media list), 
so it is redundant to specify set medium for regions containing medium 0.

Change the simulation geometry to my_spheres (or the name you chose) 
and reload the input in the viewer. 

You can play with transparency to reveal the internal structure of the geometry, 
but clipping planes provide a more direct route. 

On the Display tab in egs_view,
see the clipping planes table. 

Apply a clipping plane oriented along the positive z-axis and passing through the origin. 

Make the default medium partially transparent and rotate the geometry around. 

Apply a clipping plane to get a view similar to the one shown in figure 1b.

For clipping planes, ax, ay and az define the unit normal to a planar surface. 

The surface can then be offset from the origin by setting the distance d [cm]. 

After typing in the 4 parameters, 
hit Enter to apply the clipping plane, or click away. 

Use the checkbox to the right of each clipping plane to toggle them on and off.

From this point of view, what is the list of regions when you hover your mouse over the small central sphere ?

When hovering the mouse over the central sphere—with a clipping plane as shown in the figure—the list of regions is {1, 0, 1, 2}. 

These are all the regions under the mouse pointer, 
from the nearest to the farthest. 

Regions clipped by clipping planes are not included in the list.

