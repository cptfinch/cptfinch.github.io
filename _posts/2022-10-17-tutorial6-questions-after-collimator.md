
Compare the fraction of energy deposited with the result obtained for the isotropic point source. 

Are they the same ? Explain !

Although the normalization used by both sources is different, 

the fraction of energy deposited in the geometry, f0, 
is the same within statistics since as a relative quantity, it should be independent of the normalization.

f
isotropic
0 = 0.1934, fcollimated
0 = 0.1948

Compare the energy deposited reported by the egs_dose_scoring object 
with the same result obtained earlier for the isotropic point source. 
Are they the same ? Explain !

The collimated source uses the fluence F as normalization. 
For this reason, 
the values reported by the egs_dose_scoring in this case will be numerically different from the value reported for the isotropic source:

Edep
F
= 1.5272 MeV cm2
rad.

To get the absolute energy deposited in the geometry, Edep, one must use the following expression

Edep =
Edep
F
·
NΩ
(Ω · d
2
)
= 1.5272 ·
105
0.00785 · 104 MeV = 1945.478 MeV

This value differs by 0.6 % from the value obtained for the isotropic point source which is within the combined uncertainties of the calculations.

A side note : the value reported in this case for the total energy, called here E

0
tot,

does not correspond to the actual total energy Etot. 

The quantity E

0
tot 

is calculated in tutor7pp as

E
0
tot =
X
NΩ
i=1
w
0
i
ei

which for the collimated source actually corresponds to

E
0
tot = Etot · Ω .

Since the purpose of tutor7pp is to calculate the energy fractions, 
normalization is irrelevant. 

To get the actual total energy deposited Edep from 

E
0
tot, 

one needs to use the expression

Edep =
E
0
tot · f0
Ω
=
78.3926 MeV rad · 0.19482
0.00785 rad = 1945.535 MeV

This value is in excellent agreement with the value obtained above from the output of egs_dose_scoring.

Compute the efficiency based on the uncertainty in the energy deposited calculated with the egs_dose_scoring object and 
compare it with the efficiency of the isotropic source. 
Do you see any difference ?

ε =
1
tCPU · σ
2
=
1
0.3622
· 3.02s
= 2.5268 s
−1

The collimated source is about 40 times more efficient than the isotropic point source !

Can you think of a situation where the collimated source should not be used?

The collimated source does not emit particles in all directions, 

which may not be a good model of reality. 

If an isotropic source was used instead, 

the particles directed away from your region of interest may still contribute to it 
by scatter or secondary particles. 

By collimating the source, these contributions are lost! 

Thus it is essential to consider
whether scatter from the geometry surrounding the source is important 
for the situation you are modelling.

