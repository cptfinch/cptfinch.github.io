
Add variance reduction

Turn on photon cross section enhancement using the variance reduction input block. 
These variance reduction parameters are valid only for egs chamber, 
and are designed specifically for high efficiency in ionization chamber simulations.

Since a cross-section enhancement of 128 was set in the scoring options, 
turn on Russian Roulette using the rejection input, 
setting it to 128. 

Then 1/128 will be the probability for survival in a Russian Roulette game played with electrons that cannot reach the cavity.

We will not be using electron range rejection, so set Esave to the same value as ECUT.

```
##############################################################################
### Variance reduction
##############################################################################
:start variance reduction:
# Turn on photon cross-section enhancement (xcse)
cs enhancement = 1
# Turn on Russian Roulette for electrons that cannot reach the cavity
:start range rejection:
rejection = 128 # 1/128 is the Russian Roulette survival probability
Esave = 0.521 # The energy below which electrons that are in the
# cavity and cannot escape the current region
# are immediate discarded and energy deposited
# 0.521 (same as ecut) implies no range rejection
cavity geometry = chamber
rejection range medium = air # Not using range rejection so this
# doesn’t matter
:stop range rejection:
:stop variance reduction:
```
Once the simulation is complete, the output near the end should look something like the following (the example simulated 106 histories).

```
last case = 1000000 fluence = 1e+06
Geometry Cavity dose
-----------------------------------------------
chamber_in_water_in_air 2.1911e-15 +/- 1.081 %
======================================================
Dose Scoring Object(doseScoring)
======================================================
=> last case = 1000000 fluence = 1e+06
==> Summary of region dosimetry (per particle)
ir medium rho/[g/cm3] V/cm3 Edep/[MeV] D/[Gy]
-------------------------------------------------------------------------------
3 air 0.001 0.5773 9.4809e-09 +/- 1.125 % 2.1836e-15 +/- 1.125 %
7 air 0.001 0.0288 4.7904e-10 +/- 2.005 % 2.2117e-15 +/- 2.005 %
31 air 0.001 0.0592 1.0028e-09 +/- 1.921 % 2.2538e-15 +/- 1.921 %
-------------------------------------------------------------------------------
==> Summary of media dosimetry (per particle)
medium Edep/[MeV] D/[Gy]
--------------------------------------------------------
c552 6.5399e-05 +/- 3.936 % 9.3737e-16 +/- 3.936 %
air 3.1250e-05 +/- 1.086 % 3.3441e-12 +/- 1.086 %
water 1.1111e-02 +/- 0.477 % 3.4258e-13 +/- 0.477 %
--------------------------------------------------------
``` 

