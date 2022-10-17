
Add transport parameters and run control

For ionization chamber simulation, 
it is OK to use most of the EGSnrc default settings.

There are two parameters that you should always set manually: 
the total energy cut-offs for electrons and photons, ECUT and PCUT , respectively.

Why are these parameters so important?

In short, they constitute a stage in the simulation where approximations may occur. 

Particles whose total energy fall below the cut-off are absorbed in the current region, 
depositing all energy and no longer being transported. 

This means that secondary particles will no longer be produced, 
so even if the energy of the particle was so low that it would not leave the current region, 
there is a loss of secondary production. 

For this reason, it is essential to set ECUT and PCUT sufficiently low. 

However, smaller cut-off values means longer simulation times, 
and in some cases result in negligible changes to quantities of interest.

For now, use ECUT=0.521 and PCUT=0.01.

```
:start MC transport parameter:
Global Ecut = 0.521
Global Pcut = 0.01
:stop MC transport parameter:
:start run control:
ncase = 1e5 # simulate 10^5 source particles
:stop run control:
```
