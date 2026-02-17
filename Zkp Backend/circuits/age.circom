pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template AgeVerification() {

    // Private inputs
    signal input dob_year;
    signal input current_year;

    // Public input (policy)
    signal input min_age;

    signal age;

    // Compute age
    age <== current_year - dob_year;

    // Enforce age >= min_age
    component lt = LessThan(16);
    lt.in[0] <== age;
    lt.in[1] <== min_age;

    lt.out === 0;
}

component main = AgeVerification();
