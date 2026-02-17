pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template KYC() {

    signal input dob_year;
    signal input current_year;
    signal input country_code;
    signal input state_code;

    signal input min_age;
    signal input required_country;
    signal input allowed_state1;
    signal input allowed_state2;

    signal age;

    // Compute age
    age <== current_year - dob_year;

    // Age >= min_age
    component lt = LessThan(16);
    lt.in[0] <== age;
    lt.in[1] <== min_age;

    lt.out === 0;

    // Country match
    country_code === required_country;

    // State match (OR condition)
    signal diff1;
    signal diff2;

    diff1 <== state_code - allowed_state1;
    diff2 <== state_code - allowed_state2;

    signal product;
    product <== diff1 * diff2;

    product === 0;
}

component main = KYC();
