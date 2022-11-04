# Install:

- Fortran compiler ; prefer gnu compilers , gfortran (just cos the dev team use that)
- C compiler ; prefer gcc
- C++ compiler ; g++
- make ; gnu make ; must use GNU implementation (also called gmake on some systems)


If you use other compilers, 
adjust the compilation options in the configuration stage 

gfortran --version          

gcc --version               

g++ --version  ;  Use a compiler that supports the C++14 standard (g++ option -std=c++14). (are latest compilers e.g. c++20 backwards compatible?)

make --version              # should report "GNU Make" on first line

clear any existing env vars : export HEN_HOUSE="" EGS_HOME="" EGS_CONFIG=""

cd <path to egsnrc home dir> 

./HEN_HOUSE/scripts/configure    #=> the config script

generates config file in $HEN_HOUSE/specs dir

set $EGS_CONFIG = $HEN_HOUSE/specs/config_file 

use this script to generate configurations (any number of, i.e. one config per compiler, or per OS) 


put the stuff in ~/.bashrc

```
export EGS_HOME=/home/galactus/learn-egsnrc/egs_home/
export EGS_CONFIG=/home/galactus/learn-egsnrc/EGSnrc/HEN_HOUSE/specs/linux.conf
source /home/galactus/learn-egsnrc/EGSnrc/HEN_HOUSE/scripts/egsnrc_bashrc_additions
```

done (other stuff could be done below)




download EGSnrc-guis-linux.tar.gz ; provides pre-compiled EGSnrc GUIs (Or compile them yourself! then make available on your cachix)

Optional stuff to install:

- Tcl/Tk interpreter and widget toolkit; version 8.0 or later
- Grace plotting tool (providing the xmgrace command), version 5.0 or later
- Open Motif development package, to compile dosxyz_show (e.g. libmotif-dev)
- the Qt4 or Qt5 development tools (e.g. qt5-default and qt5-qmake), to re-compile the Qt GUIs
- a job scheduler of your choice (e.g. the package at), for parallel processing



# quick way - use an expect script

Install expect

git clone https://github.com/nrc-cnrc/EGSnrc.git

cd EGSnrc

HEN_HOUSE/scripts/configure.expect $(git rev-parse --short HEAD) 3

$(git rev-parse --short HEAD) is the git hash , we're using it here to provide the config's name  

(but use another name if you want) 

3 -> skips the compilation of the egsnrc applications in $EGS_HOME. 

1 -> compile all applications 

cd $EGS_HOME/egs_app

make        #=>  this puts it in egs_user_dir/bin dir

egs_app -i slab.egsinp




# Upgrading egsnrc

egsnrc ==  toolkit: 

compile the source code files --> program that models the passage of ionizing radiation in materials. 

Modify sw to suit your needs. 

upgrading == compile new / modified files 

file structure:

egsnrc top-level dir:

- EGSnrc/
  - HEN_HOUSE/
  - LICENCE
  - LICENCE.md
  - README.md
  - egs_home/    # this is the personal user home dir if you put it here ; your work area ; modify an application ; create new application


 HEN_HOUSE dir ; contains egsnrc build files  

ready made apps:  
DOSXYZnrc, 
egs_chamber 

copied from HEN_HOUSE/user_codes/ to egs_home 

apps run from egs_home.

apps read from and write to egs_home/app-name/

e.g.  egs_home/egs_chamber/<input and output files> 


Upgrade; 

option 1 , use my upgrade script (like nix)

backup old release 

download release tar file 

install

put your egs home dir back  ; if egs home is elsewhere no need to do this ;  its just a simple matter of a release update, see how nix does this with its script and tar file ?
for egs i could create a sh < script.sh install method !  with releases on cachix or from a s3 ? 


Hacking: using git 

git clone

Checkout a new branch (e.g., myegsnrc)  -- add your user dir ; local configuration

Configure EGSnrc ; 

do not compile any user application

Commit the config on branch myegsnrc 

Compile the user apps in egs_home/

Checkout a new branch (e.g., mychanges) ; add your changes ; Modify code ;Commit changes on the mychanges branch

compile  modified apps ; reconfigure egsnrc as needed

# or

Clone the repository

git clone git@github.com:nrc-cnrc/EGSnrc.git

cd EGSnrc/

git checkout -b myegsnrc           # create and checkout new branch (pick any name)

run the egsnrc configure script; 
config name -> use the first 7 characters of the current commit e.g a6fc389  ;  is there a better way of doing this ? e.g. see how nix does it, does it use the version then pre, then the commit hash? 
option: compile user codes? select option 3,  none ; this will avoid source code copying to egs_home.

idea: reproducibility of research -- >  have my website give nix env and also standardise the version numbers  , to aid all these thousands of research articles !

update .bashrc ; as prompted by the script, 

source .bashrc 

git status ; you will see the new files added during the script ran (the config step) 

> git status --ignored
On branch myegsnrc
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	HEN_HOUSE/specs/a6fc389.conf
	HEN_HOUSE/specs/dosxyznrc_a6fc389.spec
	HEN_HOUSE/specs/egspp_a6fc389.conf

Ignored files:
  (use "git add -f <file>..." to include in what will be committed)
	HEN_HOUSE/bin/
	HEN_HOUSE/egs++/dso/
	HEN_HOUSE/lib/
	HEN_HOUSE/log/
	HEN_HOUSE/mortran3/mornew77.lst
	HEN_HOUSE/omega/beamnrc/tools/beam_build.lst
	HEN_HOUSE/omega/beamnrc/tools/beam_build_a6fc389.f
	HEN_HOUSE/omega/beamnrc/tools/mortjob.mortran
	HEN_HOUSE/omega/progs/addphsp/addphsp_a6fc389.f
	HEN_HOUSE/omega/progs/addphsp/addphsp_a6fc389.mortlst
	HEN_HOUSE/omega/progs/addphsp/mortjob.mortran
	HEN_HOUSE/omega/progs/beamdp/beamdp_a6fc389.f
	HEN_HOUSE/omega/progs/beamdp/beamdp_a6fc389.mortlst
	HEN_HOUSE/omega/progs/beamdp/mortjob.mortran
	HEN_HOUSE/omega/progs/ctcreate/ReadCT_DICOM.o
	HEN_HOUSE/omega/progs/ctcreate/ctcreate_a6fc389.F
	HEN_HOUSE/omega/progs/ctcreate/ctcreate_a6fc389.mortlst
	HEN_HOUSE/omega/progs/ctcreate/mortjob.mortran
	HEN_HOUSE/omega/progs/readphsp/mortjob.mortran
	HEN_HOUSE/omega/progs/readphsp/readphsp_a6fc389.f
	HEN_HOUSE/omega/progs/readphsp/readphsp_a6fc389.mortlst
	HEN_HOUSE/omega/progs/statdose/mortjob.mortran
	HEN_HOUSE/omega/progs/statdose/statdose_a6fc389.f
	HEN_HOUSE/omega/progs/statdose/statdose_a6fc389.mortlst
	HEN_HOUSE/pegs4/mortjob.mortran
	HEN_HOUSE/pegs4/pegs4_a6fc389.f
	HEN_HOUSE/pegs4/pegs4_a6fc389.mortlst
	egs_home/

git add

The --ignored option lists even the files it has been told to ignore in terms of version control (in the EGSnrc/.gitignore file). As you can see, there are 3 untracked files (configuration settings) and, beyond a bunch of intermediate compilation file, the entire egs_home directory is also ignored by git.

on the myegsnrc branch:

git add HEN_HOUSE/specs/

git add --force egs_home/   #=> The --force option here instructs git to add the egs_home/ directory even if it is normally ignored. 

git commit -m "Add local configuration and egs_home"

congrats -- a clean working dir ; installed egsnrc ; configured egsnrc


Compile user applications:

remember you skipped compiling EGSnrc applications in egs_home/ during the config script step

compile them now

run 

HEN_HOUSE/scripts/finalize_egs_foruser

check target egs_home/ location is the one you created during the config step, 

select the option to compile it ; or only some of the user apps 

or: 

compile a user application, as needed, by running make in the app dir, inside egs_home/.


hacking example:

git branch mychanges

git checkout mychanges

change the core source code file HEN_HOUSE/src/egsnrc.mortran,  

change source code of dosxyznrc , under egs_home/  ; egs_home/dosxyznrc/dosxyznrc_user_macros.mortran

and egs_chamber applications under egs_home/.      ; egs_home/egs_chamber/egs_chamber.cpp

Recompile user applications:

after changing source code in a EGSnrc app, recompile it, 

cd egs_home/<app dir>  

make 

warning! you may need to run the EGSnrc configuration step again ! if changed something in main code you mean ? 

git log --stat myegsnrc..mychanges        

publishing your simulation work? provide your local modifications ; then others can rebuild egsnrc identical to your publication's version.  (see my thought about repeatable research reproducible research , use nix ! provides all of the environement , nix also good for medical software , these two tings reproducible research and medical devices, put on my web page)

A new EGSnrc release: 

Pull the new version into master

Merge master into myegsnrc

Reconfigure EGSnrc

Commit the new configuration on myegsnrc

Merge myegsnrc into mychanges

Compile user applications

Commit further local modifications (until the next upgrade)

Pull in changes for the new version:

git checkout master

git pull

git checkout myegsnrc

git merge master

Reconfigure EGSnrc ; use the new commit hash of the updated master branch as the configuration name; skip compilation of user apps

Commit the new config: to your myegsnrc branch

git add HEN_HOUSE/specs/

git add --force egs_home/

git commit -m "Update configuration and egs_home for 2022 release"

git checkout mychanges

git merge myegsnrc

git diff myegsnrc mychanges

compile apps in egs_home/ 

$HEN_HOUSE/scripts/finalize_egs_foruser

or 

cd app-dir ;  make 










pre-compiled GUIs, manuals and sample data are available:

https://github.com/nrc-cnrc/EGSnrc/releases

https://github.com/nrc-cnrc/EGSnrc/wiki

https://www.reddit.com/r/EGSnrc/

when asking for help, include: 

The EGSnrc application and version (e.g. egs_chamber, EGSnrc 2018 master branch)

Operating system

A clear description of the problem

Copy/pasted output including any errors

Optionally: compiler version, screenshots, input files and figures

Bug reports:

Have you found a bug? Report it on the github issues page! Make sure to include sufficient information for us to reproduce the bug.

https://github.com/nrc-cnrc/EGSnrc/issues

8.4 Submitting your code

Have you added a feature or fixed a bug? Submit the changes as a pull request! 

This requires learning the basics of “git” - if that is not feasible, you can also submit the changes as an issue and allow one of us to create the pull request.

https://github.com/nrc-cnrc/EGSnrc/pulls

Documentation

Documentation for EGSnrc is available online! 

However, keep in mind that the documentation applies to the most recent release of EGSnrc. 

In other words, the documentation is generated annually, at the same time as the release of the master branch (usually near the start of the year).

The online documentation:

http://nrc-cnrc.github.io/EGSnrc/

Each release is posted with the full set of manuals in a zip file. 

Find this on the release page:

https://github.com/nrc-cnrc/EGSnrc/releases

If you are using an older version of EGSnrc, or if you are working on the develop experimental branch, 
you may not find the matching documentation on the release page. 

To obtain the documentation that exactly matches your installation, 
find the documentation source code within your installation:

$HEN_HOUSE/docs/src

Some additional steps are required to compile the documentation locally.

Compiling documentation locally

1. Install a suite that includes pdflatex, bibtex, texmf and makeindex (e.g. the texlive suite includes all of these)

2. Install doxygen (for the egs++ documentation)

3. cd $HEN_HOUSE/docs/src (linux instructions)

4. ./makedoc.sh all (linux instructions)

EGSnrc file structure

$HEN_HOUSE: Points to location of the EGSnrc system (user-defined)

$EGS_HOME: Points to user’s working directory, where applications are copied (userdefined)

BEWARE: Path to these folders cannot have spaces! 

EGSnrc relies on GNU make which doesn’t handle blank spaces in names. 

Also avoid special characters like &.

The $HEN HOUSE
The $HEN_HOUSE directory contains all source code and data files for the EGSnrc system.

After installation, 
the contents of this directory generally remain unchanged.

EGSnrc core omega
- BEAMnrc source code
- addphsp, beamdp, ctcreate, dosxyz show, readphsp, and statdose
- tcl GUIs for beamdp, BEAMnrc and DOSXYZnrc

previewRZ - tcl GUI for viewing geometries from DOSRZnrc, CAVRZnrc, FLURZnrc and SPRRZnrc

src - EGSnrc core MORTRAN source code

user codes - Application source code (C++ and MORTRAN)

utils - Various MORTRAN tools egs++ and Qt

cutils - C tools for parallel jobs and BEAMnrc sources 

egs++
- C++ class library
- ausgab objects, geometries and sources

gui - Qt GUIs: egs configure, egs gui and egs inprz

iaea phsp - C++ tools for IAEA phase-spaces

interface - The code that connects C++ and MORTRAN

data
- photon cross section data
- bremsstrahlung cross section corrections
- eii cross sections
- molecular form factors

pegs4
- PEGS4 mortran code
- PEGS4 data files
- density correction files

spectra - various energy spectrum data
- radionuclide decay data

configuration

makefiles - template application makefiles

mortran3 - the MORTRAN core code

pieces - system test code

scripts - configuration and support scripts

specs - configuration specifications

documentation docs - documentation source code

Medium composition, electron stopping powers, and electron interaction cross sections, 
for media including with the EGSnrc distribution are contained in the pegs4 directory. 

The density correction files for pegsless mode are found in pegs4/density_corrections and the commonly used 521icru and 700icru pegs4 material data files are in pegs4/data.

There are a few example energy spectrum files contained in spectra/egsnrc. 

Radionuclide decay data in ensdf format for the egs++ radionuclide source are found in spectra/lnhb.

There are some scripts that help with configuration and parallel runs in scripts.

Compiled utility executables are found in bin, such as ctcreate, beamdp, etc.

Configuring for different machines

To compile EGSnrc on linux, there is a command line script that can be used instead of the installation GUI. 

This script is convenient to create different configurations that can be switched between - for example changing compile flags, 
or compiling for different machines.

$HEN_HOUSE/scripts/configure

The configure script does not create the $EGS_HOME directory, 
unless you opt to run the finalize_egs_foruser option at the end. 

Run the finalize script to create $EGS_HOME,
copy over application source and compile applications (this would overwrite an existing $EGS_HOME). 

At the end of this script, the suggested environment variables are printed as output to the terminal (to be copy/pasted into your shell environment, such as ~/.bashrc).

$HEN_HOUSE/scripts/finalize_egs_foruser

It is possible to have EGSnrc configured for execution on several servers, 
but sharing the same installation. 

This means that the configuration script is run once on each machine, 
and set to use a different configuration file (the *.conf file) each time. 

To do this, watch for the prompt to set the configuration name and make sure to give it a unique identifier (usually the default is linux.conf). 

On each server, the $EGS_CONFIG environment variable must be set uniquely, 
and should point to the main configuration file created by the installation script (but type it in as an absolute path, don’t use environment variables):

/full_path_to/HEN_HOUSE/specs/your_machine.conf

On linux systems, the $HEN_HOUSE and $my_machine environment variables are automatically set using the $EGS_CONFIG environment variable that you provide.

The $EGS HOME

The $EGS_HOME directory contains all of the applications and data created or provided by the user. 

Each application (previously called a user_code) has its own directory which contains the source code, 

a Makefile, and the user’s input files. 

Output files from simulations are also written to the application directories.

The user may store their own set of material data in $EGS_HOME/pegs4, 
which will automatically supplement the data that is available in $HEN_HOUSE/pegs4.

BEAMnrc has a folder structure different from other applications. Each accelerator that is built for BEAMnrc is assigned its own directory with the name BEAM_yourAccel, 
where yourAccel is the name of the accelerator. 

In other words, each accelerator is compiled as an independent EGSnrc application. 

The component module specifications for all accelerators are contained in $EGS_HOME/beamnrc/spec_modules.

The compiled executables for applications reside in $EGS_HOME/bin/$my_machine.

# archive

GNU make ; automates the software build ; run make in an egsnrc application's dir -> builds the application

configure egsnrc for your environment 

Configure using the shell script:
