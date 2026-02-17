pragma circom 2.0.0;

template AddressVerification() {

    // Private inputs (hidden)
    signal input country_code;
    signal input state_code;

    // Public policy inputs
    signal input required_country;
    signal input allowed_state1;
    signal input allowed_state2;

    // Enforce country match
    country_code === required_country;

    // Enforce state is one of allowed states
    signal diff1;
    signal diff2;

    diff1 <== state_code - allowed_state1;
    diff2 <== state_code - allowed_state2;

    signal product;
    product <== diff1 * diff2;

    // If either diff1 or diff2 is zero, product becomes zero
    product === 0;
}

component main = AddressVerification();
