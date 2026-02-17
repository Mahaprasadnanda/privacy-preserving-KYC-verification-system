# # from prover.signature_verify import verify_aadhaar_signature

# from prover.signature_verify import verify_aadhaar_signature

# result = verify_aadhaar_signature()
# print(result)


"""
FULL SYSTEM INTEGRATION TEST

This script tests the complete flow:

1. Aadhaar Signature Verification
2. ZKP Proof Generation (Age / Address / Both)
3. Proof Verification (Verifier Side)

This simulates real end-to-end architecture.
"""

from prover.proof_runner import (
    generate_age_proof,
    generate_address_proof,
    generate_kyc_proof
)

from verifier.verify_runner import (
    verify_age_proof,
    verify_address_proof,
    verify_kyc_proof
)


# ==========================================================
# AGE TEST
# ==========================================================

print("\n=== AGE VERIFICATION TEST ===")

age_prover_result = generate_age_proof(
    current_year=2026,
    min_age=18
)

print("Prover Result:", age_prover_result)

if age_prover_result["status"] == "success":
    age_verifier_result = verify_age_proof()
    print("Verifier Result:", age_verifier_result)
else:
    print("Age Verification Failed at Prover Stage")


# ==========================================================
# ADDRESS TEST
# ==========================================================

print("\n=== ADDRESS VERIFICATION TEST ===")

address_prover_result = generate_address_proof(
    required_country=1,
    allowed_state1=10,
    allowed_state2=20
)

print("Prover Result:", address_prover_result)

if address_prover_result["status"] == "success":
    address_verifier_result = verify_address_proof()
    print("Verifier Result:", address_verifier_result)
else:
    print("Address Verification Failed at Prover Stage")


# ==========================================================
# COMBINED KYC TEST
# ==========================================================

print("\n=== COMBINED KYC TEST ===")

kyc_prover_result = generate_kyc_proof(
    current_year=2026,
    min_age=18,
    required_country=1,
    allowed_state1=10,
    allowed_state2=20
)

print("Prover Result:", kyc_prover_result)

if kyc_prover_result["status"] == "success":
    kyc_verifier_result = verify_kyc_proof()
    print("Verifier Result:", kyc_verifier_result)
else:
    print("KYC Verification Failed at Prover Stage")
