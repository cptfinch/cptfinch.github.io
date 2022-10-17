
comment out the variance reduction input block before running a very short simulation just for track generation. 

Comment out the tracks ausgab object for long simulations.

To list the dose in each of the cavity regions, use the label that was defined as chamber_cavity_label. 

Then, for the regions in order of increasing number, calculate and provide the volume for each region. 

This is used to calculate dose from the energy deposited in each region. 

If you are only interested in the energy deposited, 
you can neglect this input.

In the example below, notice that particle track scoring is commented out. 

It is possible to comment out an entire input block by just commenting out the :start line.

```
##############################################################################
### Ausgab
##############################################################################
:start ausgab object definition:
#:start ausgab object:
name = tracks
library = egs_track_scoring
stop scoring = 1000
:stop ausgab object:
:start ausgab object:
library = egs_dose_scoring
name = doseScoring
medium dose = yes
# List of individual regions
dose regions = chamber_cavity_label
# List of each region volume (in same order), cm^3
volume = 0.02880 0.57732 0.05916
:stop ausgab object:
:stop ausgab object definition:
```

Run the simulation! 

Make sure that your input file resides in the $EGS_HOME/egs_chamber directory, 
and has the .egsinp extension. 

It is only necessary to compile egs_chamber if you have not done so previously. 

On linux systems, run egs_chamber using the following command (replacing the input/output file names accordingly). 

Alternatively, use egs_gui.

egs_chamber -i yourInput.egsinp | tee yourOutput.txt

Add ausgab (output) options

Of course the most useful part of a simulation is the output! 

This is done using ausgab objects. 

Include one for track scoring and one for dose scoring.

Important note: 
currently, track scoring is incorrect when used with variance reduction techniques turned on. 

The simulation results are unchanged, 
but the tracks paths are incorrect. 

In order to view tracks and avoid this problem, 
comment out the variance reduction input block before running a very short simulation just for track generation. 

Comment out the tracks ausgab object for long simulations.

To list the dose in each of the cavity regions, use the label that was defined as chamber_cavity_label. 

Then, for the regions in order of increasing number, calculate and provide the volume for each region. 

This is used to calculate dose from the energy deposited in each region. 

If you are only interested in the energy deposited, 
you can neglect this input.

In the example below, notice that particle track scoring is commented out. 

It is possible to comment out an entire input block by just commenting out the :start line.

```
##############################################################################
### Ausgab
##############################################################################
:start ausgab object definition:
#:start ausgab object:
name = tracks
library = egs_track_scoring
stop scoring = 1000
:stop ausgab object:
:start ausgab object:
library = egs_dose_scoring
name = doseScoring
medium dose = yes
# List of individual regions
dose regions = chamber_cavity_label
# List of each region volume (in same order), cm^3
volume = 0.02880 0.57732 0.05916
:stop ausgab object:
:stop ausgab object definition:
```

Run the simulation! 

Make sure that your input file resides in the $EGS_HOME/egs_chamber directory, 
and has the .egsinp extension. 

It is only necessary to compile egs_chamber if you have not done so previously. 

On linux systems, run egs_chamber using the following command (replacing the input/output file names accordingly). 

Alternatively, use egs_gui.

egs_chamber -i yourInput.egsinp | tee yourOutput.txt

