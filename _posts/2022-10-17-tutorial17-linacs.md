
Linear accelerator simulations

The BEAMnrc application has long been the workhorse for linear accelerator (LINAC) simulations using EGSnrc. 

It has been used by many clinical groups to build radiotherapy modelling systems. 

In such situations BEAMnrc is typically coupled with a second application to perform voxelized transport (e.g. patient modelling), 
like DOSXYZnrc, vmc++ or any egs++ application.

BEAMnrc is distributed with a powerful GUI that enables the user to easily create new accelerators, compile them, design input files and run simulations. 

It requires the tcl/tk packages to be installed, 
as mentioned in the installation instructions. 

To launch the GUI,
either find the shortcut on your desktop or in a linux terminal type:

beamnrc_gui

Build a new BEAMnrc accelerator

In the BEAMnrc GUI, 
click File -> Specify a new accelerator (figure 4). 

In the window that pops up (figure 5), 
select SYNCJAWS and click >>. 

Type in any name for the component module under CM Identifier , 
and click Add then Save & close.

Figure 5: BEAMnrc: Selecting components

Save the accelerator module file as syncjaws.module - 
this will provide the name of the accelerator. 

The next window (figure 6) allows you to select the material data to use. 

Click Browse HEN_HOUSE and select 700icru.pegs4dat.

Compile the accelerator! 

In the main BEAMnrc GUI window, 
go to Execute -> Compile and click Build & Compile , 
as in figure 7.

Now you are ready to start editing a new input file. 

To do this, click on Edit main input parameters in the Selected components window. 

Set a title, and change the parameters to match figure 8. 

When selecting source 1, set the parameters as in figure 9. 

For scoring options, 
set a plane to be scored after the jaws (component 1) as in figure 10.

Close the main input parameters, 
and instead click the Edit button next to SYNCJAWS to edit the input parameters for the jaws. 

Enter the parameters suggested in figure 11, 
clicking the Define jaw orientation/media button to fill out the jaw settings. 
Set the ECUT and PCUT of the jaw material to 10 MeV. 

This is an approximation, but will greatly speed up the simulation for demonstration purposes.

For now, leave File containing jaw opening data: empty. 

We are setting up the component module (CM) for dynamic mode - 
motion of the jaws that can be synchronized with other components. 

Now would be a good time to save our progress (File -> Save input parameters as...) giving the file a name like example.egsinp .

Create a new text file, that will provide the dynamic motion of the jaws. 

There are examples for all of the syncronized CMs in $HEN_HOUSE/omega/beamnrc/CMs/sample_sequences/.

Copy the text at the end of this section and save the file as example.sequence in $EGS_HOME/BEAM_syncjaws . 

Now go back to the settings of the SYNCJAWS CM, click the 

Browse button and select the file (make sure the mode is set to Dynamic ). 

Click Preview to view the first position of the jaws, before motion begins.

The format of the sequence file is described in section 15.3.8 of the BEAMnrc Users Manual (PIRS509a). 

Using this file, it is possible to model motion like jaw tracking, based on the the index parameter (i.e. fractional MU or cumulative meterset weight). 

If multiple SYNC CMs are included, the index is used to synchronize motion. 

Use a repeated index to simulate motion with the beam off.

In the following, we define 2 static fields and 1 dynamic field in 6 steps. 

The upper y-jaws are at 40 ≤ z ≤ 50 and x-jaws at 51 ≤ z ≤ 61. 

From index 0.0 to 3.0 (30% of the simulation),
the jaws are statically positioned. 

Similarly from 0.3 to 0.6. The repeated indices, 0.3 and 0.6, result in simulated collimator shifts while the beam is off. 

Finally, from index 0.6 to 1.0 (40%) there is a motion of the x-jaws from a nearly-closed position to a 2 × 2 opening.

Ex: 2 static fields, 1 dynamic, for 2 jaws

6
0.0
40, 50, -1, -1, -2, -2
51, 61, -1, -1, -2, -2
0.3
40, 50, -1, -1, -2, -2
51, 61, -1, -1, -2, -2
0.3
40, 50, 2, 2, 1, 1
51, 61, 2, 2, 1, 1
0.6
40, 50, 2, 2, 1, 1
51, 61, 2, 2, 1, 1
0.6
40, 50, 1, 1, -1, -1
51, 61, 0.05, 0.05, -0.05, -0.05
1.0
40, 50, 1, 1, -1, -1
51, 61, 1, 1, -1, -1

Run a BEAMnrc simulation

In the BEAMnrc GUI, go to Execute -> Run and click the EXECUTE button. 

Since we only set 100 histories to simulate, this will complete very quickly. 

Check the accelerator directory to find the phase-space that was saved as output ( $EGS_HOME/BEAM_syncjaws/example.egsphsp1 ). 

The 1 in *.egsphsp1 refers to the scoring plane number of the phase-space (we scored after CM 1, 
but if you had more CMs you could score multiple phase-spaces in the same simulation). 

Additional output is recorded in the *.egslst file.

Run a BEAMnrc simulation

Analyze the phase-space with beamdp

Let’s do a sanity check on the output of the BEAMnrc simulation by analyzing the phasespace using beamdp. 

Open the beamdp GUI. 

On linux this should be aliased:

beamdp_gui

Perform a scatter plot of the phase-space to observe how the jaws have collimated the source (figure 12). 

Suggested settings are shown in figure 13, and the results in figure 14. 

As expected, there are two off-axis fields, and one in the centre. 

Since the phase-space is scored immediately below the second set of jaws, 
it is easy to confirm that the field openings appear to match the collimator openings that were specified.

Analyze the phase-space with beamdp

Analyze the phase-space with beamdp

Convert CT DICOM data to egsphant Getting Started with EGSnrc

Convert CT DICOM data to egsphant

In order to perform a MC simulation on a patient phantom, 
measured images need to be converted to the egsphant format. 

This is a rectilinear voxel format in a plain text file.

There is a tool distributed with EGSnrc called ctcreate that can be used to convert CT DICOM files to the egsphant format.

A set of example CT DICOM files is provided in the EGSnrc-sample-data.zip file on the release page. 

Extract the zip file, and navigate to the CT/DICOM directory.

Edit the CT_create_DICOM.inp file so that the path to the slice_files file is correct (on line 2). 

Then open the slice_files file, and edit the paths to the ct files similarly.

Also adjust the input parameters so that a higher resolution phantom is created. 

Note that this will use a default CT ramp that should be modified to agree with your imager (see the ctcreate section in the DOSXYZnrc Users Manual).

DICOM

/yourPath/EGSnrc-sample-data/CT/DICOM/slice_files

-150.0, 150.0, -150.0, 150.0, -45.0, 45.0
0.4, 0.4, 0.1
0,0

There is no GUI for ctcreate , so it has to be run from the command line (even on windows).

From the directory containing the CT files, execute the command:

ctcreate CT_create_DICOM.inp

This should create a new file in the directory, named slice_names.egsphant. 

Open this in a text editor to observe CT slices represented as 2D blocks of numbers. 

Each number corresponds to the material index (in the order they are listed at the top of the file). 

Following these blocks of integers are similar 2D blocks of floating point values - the density of each voxel. 

This format is described in the DOSXYZnrc Users Manual.

Move the egsphant file into the $EGS_HOME/dosxyznrc directory for later use.

Convert CT DICOM data to egsphant

Calculate dose with DOSXYZnrc

The next task in the radiotherapy simulation process is to perform the dose calculation. 

To do this, create an input file for DOSXYZnrc and direct it to use a BEAMnrc source model and the egsphant file that was just created.

In order to use a BEAMnrc accelerator as a dynamic shared library source in DOSXYZnrc,
the accelerator must be compiled as a shared library. 

This is an extra compilation step that is not performed by default. 

This must be done via command line (there is not an option to compile libraries in egs_gui ). 

Navigate to the accelerator directory on the command line and type:

make library

Open the DOSXYZnrc GUI, and start a new input file (figure 15). 

Make sure to select the same material data file that was used in BEAMnrc (i.e. 700icru from the HEN_HOUSE ).

dosxyznrc_gui

Set the input parameters as shown in figure 16. 

Select source 21, which can be a dynamically synchronized source of particles from BEAMnrc. 

As long as the accelerator is compiled as a shared library, each particle that DOSXYZnrc needs will be requested from BEAMnrc.

The accelerator model then simulates source particles until a particle reaches the scoring plane, 
at which point the DOSXYZnrc simulation can continue. 

Each particle is assigned a monitor unit value, 
to allow for the synchronization of time-dependent components. 

Notice that large values of ECUT and PCUT were chosen - this is just to speed up the simulation while we test parameters! 

If you would like an accurate simulation, reduce them to ECUT=0.7 and PCUT=0.01 .

For the synchronized source parameters, 
set two static source positions (later, play around with motion). 

From index 0.0 to 0.6, set the source to be incident along the negative z-axis.

From 0.6 to 1.0, set the source to be incident along the positive z-axis.

Run the simulation! 

The output file of interest is the example.3ddose . file - 

this contains a 3D map of dose on the same grid as the *.egsphant file that we created from the CT data. 

To view the dose distribution, use the dosxyz_show tool.

cd $EGS_HOME/dosxyznrc

dosxyz_show slice_files.egsphant example.3ddose

Calculate dose with DOSXYZnrc

Extract dose profiles from 3ddose

It is commonly of interest to obtain profile and depth-dose curves from dose files. 

For the 3ddose format, there is a tool distributed with EGSnrc that can do this called statdose (though many users design their own analysis software).

First, it may be necessary to adjust the statdose maximum array dimensions. 

Navigate to $HEN_HOUSE/omega/progs/statdose and open statdose.mortran . 

Change the $MAXVOX values to 300. 

The $MAXVOXEL parameter should be set to the maximum value of $MAXVOXX,

$MAXVOXY and $MAXVOXZ. 

The save the file and recompile statdose ( make clean; make ).

REPLACE {$MAXVOXX} WITH {200};
REPLACE {$MAXVOXY} WITH {200};
REPLACE {$MAXVOXZ} WITH {200};
REPLACE {$MAXVOXEL} WITH {200};

The statdose code does not have a GUI, so must be run from the command line. 

Navigate to $EGS_HOME/dosxyznrc , and type statdose to launch the program. 

This software uses text input - an example of both the output and input is shown below. 

Start with Selection: 1 to read in dose distributions. 

In our directory we had 9 *.3ddose files listed, but you will probably just have one to choose. 

The number to the left of example is the file number to select (7 for us). Assign this file an internal reference number (use 1).

```
*****************************************
STATDOSE.MORTRAN
Max array dimensions: 200 200 200
Max # data sets: 15
*****************************************
MAIN MENU
--------
0 - Exit
1 - Read dose distributions
2 - Statistical analysis
3 - Normalization
4 - Rebinning
5 - Plot
6 - Save
Selection: 1
READ DOSE DISTRIBUTIONS
-----------------------
1 16MVp_h2o_phantom_beamsource_example
2 16MVp_h2o_phantom_phsp_example
3 5MeV-2
4 5MeV
5 CT_example_electron
6 edge_rot
7 example
8 tg195_test
9 tg195_validation
Input file number to Read in: (1- 9 or 0-Main Menu): 7
File number for temporary storage: (1-* or 0-Main Menu): 1
Number of voxels in X,Y,Z directions: 88 88 50
Voxel-boundary values in X-direction: -17.66 - 17.66
Voxel-boundary values in Y-direction: -17.66 - 17.66
Voxel-boundary values in Z-direction: -0.70 - 4.30
Reading dose distribution...
Reading in the uncertainties on DOSE Distribution...
```

After this, type 0 to return to the main menu, then select 5 to begin plotting. 

Plot profiles of 1 file, and select the x-axis to plot 3 curves at different y-positions. 

If you have xmgrace installed, it will launch automatically at this point to display the profiles. 

However, the data is also saved to the output file selected (e.g. example.agr ). 

This is a plain text file, so even if you do not have xmgrace it is easy to load into a spreadsheet for data analysis and plotting.

```
Input file number to Read in: (1- 9 or 0-Main Menu): 0
MAIN MENU
--------
0 - Exit
1 - Read dose distributions
2 - Statistical analysis
3 - Normalization
4 - Rebinning
5 - Plot
6 - Save
Selection: 5
PLOT MENU
--------
0 - Main menu
1 - Plot profiles
2 - Comparison plot
Selection: 1
Data for dose plot
------------------
Files currently loaded
----------------------
1 - example
Number of file to Plot (0-PlotMenu): 1
Axis for Profile (0-PlotMenu,1-X,2-Y,3-Z): 1
Graph Title (default=Profile for example):
Output Filename (default=example):
Number of curves to Plot: 3
Generate Automatic Offset? (y/n) [n]:
Coordinates of Axis (y,z): 4,3
3D-dose distribution 1: example
Coordinates of Axis (y,z): 0,3
3D-dose distribution 1: example
Coordinates of Axis (y,z): -4,3
3D-dose distribution 1: example
Calling xmgrace...Please be patient!
```

If you have xmgrace installed, load the *.agr file later using the command:

xmgrace example.agr

 Extract dose profiles from 3ddose

