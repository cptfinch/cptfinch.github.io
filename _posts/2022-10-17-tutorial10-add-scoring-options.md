
Add egs chamber scoring options

The scoring options in this section can be used only in input files for the egs_chamber application.

Calculate the cavity mass (in grams) by determining the volume of each air cavity region,
then multiplying by the density of air. 

To be consistent with the simulation, use the density that is the 3rd value in the air density correction file.

To use the variance reduction technique photon cross-section enhancement, 
set the enhance regions to all of the chamber regions, and the value of enhancement to −128.

The negative value of enhancement sets the same value to all of the regions. 

This will cause photons to interact with 128 times higher probability within the chamber, 
resulting in more electron production and energy deposition in the cavity region. 

This is a true variance reduction technique and does not degrade accuracy in any way.

```
##############################################################################
### Scoring options
##############################################################################
:start scoring options:
:start calculation geometry:
geometry name = chamber_in_water_in_air # The simulation geometry
cavity regions = chamber_cavity_label # Air cavity regions
cavity mass = 0.00080152267 # g, used density = 1.20478997E-03 g/cm^3
cavity geometry = chamber # For russian roulette
enhance regions = chamber_xcse # All the chamber regions
enhancement = -128 # Use negative to set the same for all regions
:stop calculation geometry:
:stop scoring options:
```
