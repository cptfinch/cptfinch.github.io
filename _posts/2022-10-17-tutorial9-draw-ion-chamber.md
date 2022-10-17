# draw an ion chambeer - and questions after tut5 

What is the region number outside the defined geometry ?

As always in egs++, the space outside the defined geometry is region −1, 
and it is not included in the list of regions in the image window.

Use your newly acquired expertise in egs++ syntax to model the geometry of NRC’s reference ionization chamber ”3C”, 
the schematic of which is reproduced in figure 2. 
This is a cylindrically symmetric geometry with 4 distinct layers along its axis, 
so the natural option is a conestack geometry. 

Put the conestack along the z-axis, and position it according to the numbers given in the diagram. 
Below is an input template to get you started. 
Inspect the geometry with egs_view.

Read the conestack documentation for more information.

You can expect to end up with 4 layers in the conestack. 
Since there are no sloped surfaces (all of the cones are in fact cylinders), 
the top and bottom radii will be the same within each layer. 

Layer 1 requires a single radius, 
1.175 for top and bottom. 

Layer 2 requires two radii for air and graphite, 0.7919 and 1.175, respectively.

And so on...

Figure 2: Simplified schematic of NRC’s 3C ionization chamber which is Canada’s primary standard for air kerma in a 60Co beam. 

Dimensions are in centimetres. 

Drawing is not to scale.

```
:start geometry:
name = 3C
library = egs_cones
type = EGS_ConeStack
axis = # ... figure out the input for ’axis’
6.3 Build an egs++ model of the 3C chamber
6 MODELLING AN IONIZATION CHAMBER 37
### top layer
:start layer:
thickness = # ...
top radii = # ...
bottom radii = # ...
media = graphite
:stop layer:
:stop geometry:
```

What are the region numbers which correspond to the air cavity ?
The air cavity comprises regions 3 and 7.

Where are regions 1 and 2 ?
Regions 1 and 2 are not visible in this geometry: they are virtual regions. 

In some cases, egs++ attributes region numbers in a way that is more efficient internally. 

But the algorithm is deterministic: the same geometry always yields the same region numbers.

Can you figure out the conestack region numbering scheme ?

In the case of the conestack, 
egs++ attributes a fixed number of regions to each layer.

This is more efficient because only a single modulo operation is then needed to convert the region number to the layer index.

In the 3C conestack, there are at most three radii per layer, so egs++ attributes 3 regions per layer, whether or not they are used. 

The first layer has only one radial dimension— region 0—hence regions 1 and 2 are not used: 
they become virtual regions and don’t show up in the viewer. 

The next layer in the conestack then starts at region 3, and the same logic applies the virtual region 5.

