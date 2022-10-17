
# physics questions after running the template tutorial 

Compare the energy deposited reported by the egs_dose_scoring object and the one corresponding to the fraction of energy deposited reported by tutor7pp.

Are they the same ?

tutor7pp reports the total energy entering the geometry, Etot, and the fractions, fi , 
of that energy deposited in the different regions i of the geometry. 

In this case there is only one region. 
The energy deposited in that region, Edep, 
is obtained as 
Edep = Etot · f0 = 104 MeV · 0.1934056 = 1934.056 MeV

The egs_dose_scoring scoring object reports the dose deposited in each region i divided by the source’s normalization 
which could be the number of particles emitted or the fluence. 

The isotropic point source uses the number of particles emitted as normalization.

Hence to obtain the energy deposited in the geometry, 
one has to multiply the reported energy deposited per particle 

Edep

N

by the number of particles emited, N (last case):

Edep =

Edep

N

· N = 1.2082 · 10−5 MeV · 160072124 = 1933.991 MeV

Note above that 105 is the number of particles hitting the geometry !

What is the solid angle, Ω, subtended by the isotropic source and the front face of the geometry ?

The number of particles emited by the isotropic point source in 4π is 160072124, 

while only 105 of these particles actually hit the front face of the cylinder. 

Hence Ω can be obtained from

Ω = 105

160072124

· 4π = 0.00785 radians

Compute the efficiency ε based on the uncertainty in the energy deposited calculated 
with the egs_dose_scoring object 
and take note of it for a later comparison with the collimated source.

ε =
1
tCPU · σ
2
=
1
0.4822
· 67.67s
= 0.0636 s
−1

