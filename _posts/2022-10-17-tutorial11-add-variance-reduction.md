
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
