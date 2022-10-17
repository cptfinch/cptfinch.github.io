
# run app
Run the simulation! 

Make sure that your input file resides in the $EGS_HOME/egs_chamber directory, 
and has the .egsinp extension. 

It is only necessary to compile egs_chamber if you have not done so previously. 

On linux systems, run egs_chamber using the following command (replacing the input/output file names accordingly). 

Alternatively, use egs_gui.

egs_chamber -i yourInput.egsinp | tee yourOutput.txt

Of course the most useful part of a simulation is the output! 

This is done using ausgab objects. 

Include one for track scoring and one for dose scoring.

Important note: 
currently, track scoring is incorrect when used with variance reduction techniques turned on. 

The simulation results are unchanged, 
but the tracks paths are incorrect. 

In order to view tracks and avoid this problem, 
