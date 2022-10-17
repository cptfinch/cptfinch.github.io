
# template tutorial continued , now using collimator


Run the same calculation using a collimated source. 

Add the following source definition input to the source definition block

```
:start source:
library = egs_collimated_source
name = my_collimated_source
distance = 100
:start source shape:
type = point
position = 0 0 -100
:stop source shape:
:start target shape:
library = egs_circle
radius = 5
:stop target shape:
:start spectrum:
type = monoenergetic
energy = 0.1
:stop spectrum:
charge = 0
:stop source:
```

Set the simulation source to be my_collimated_source. 

You may want to make a copy of your input file.

Run the simulation again by issuing the following command (with your choice of names for the input and output files):

$ tutor7pp -i myinput -p 521icru | tee myoutput.txt

