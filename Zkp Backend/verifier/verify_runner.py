# import subprocess
# import os

# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# def run_command(command):
#     result = subprocess.run(
#         command,
#         shell=True,
#         capture_output=True,
#         text=True
#     )
#     return result


# def verify_proof(proof_type):

#     if proof_type == "age":
#         verification_key = os.path.join(BASE_DIR, "age_verification_key.json")
#         public_file = os.path.join(BASE_DIR, "proofs", "age_public.json")
#         proof_file = os.path.join(BASE_DIR, "proofs", "age_proof.json")

#     elif proof_type == "address":
#         verification_key = os.path.join(BASE_DIR, "address_verification_key.json")
#         public_file = os.path.join(BASE_DIR, "proofs", "address_public.json")
#         proof_file = os.path.join(BASE_DIR, "proofs", "address_proof.json")

#     elif proof_type == "both":
#         verification_key = os.path.join(BASE_DIR, "verification_key.json")
#         public_file = os.path.join(BASE_DIR, "proofs", "kyc_public.json")
#         proof_file = os.path.join(BASE_DIR, "proofs", "kyc_proof.json")

#     else:
#         return {"status": "error", "message": "Invalid proof type"}

#     command = f'npx snarkjs groth16 verify "{verification_key}" "{public_file}" "{proof_file}"'

#     result = run_command(command)

#     print("DEBUG OUTPUT:", result.stdout)  # Temporary debug

#     if "OK!" in result.stdout:
#         return {"status": "valid", "message": "Proof verified successfully"}

#     return {"status": "invalid", "message": "Proof verification failed"}
"""
VERIFIER SIDE MODULE

Responsibilities:
1. Load verification key
2. Load proof.json
3. Load public.json
4. Verify using snarkjs
5. Return verification result
"""

import subprocess
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def run_command(command):
    result = subprocess.run(
        command,
        shell=True,       # Required for Windows (npx)
        capture_output=True,
        text=True
    )
    return result


# ==========================================================
# AGE VERIFICATION
# ==========================================================

def verify_age_proof():

    verification_key = os.path.join(BASE_DIR, "age_verification_key.json")
    proof_file = os.path.join(BASE_DIR, "proofs", "age_proof.json")
    public_file = os.path.join(BASE_DIR, "proofs", "age_public.json")

    command = f'npx snarkjs groth16 verify "{verification_key}" "{public_file}" "{proof_file}"'

    result = run_command(command)

    if "OK!" in result.stdout:
        return {"status": "valid", "message": "Proof verified successfully"}

    return {"status": "invalid", "message": "Proof verification failed"}


# ==========================================================
# ADDRESS VERIFICATION
# ==========================================================

def verify_address_proof():

    verification_key = os.path.join(BASE_DIR, "address_verification_key.json")
    proof_file = os.path.join(BASE_DIR, "proofs", "address_proof.json")
    public_file = os.path.join(BASE_DIR, "proofs", "address_public.json")

    command = f'npx snarkjs groth16 verify "{verification_key}" "{public_file}" "{proof_file}"'

    result = run_command(command)

    if "OK!" in result.stdout:
        return {"status": "valid", "message": "Proof verified successfully"}

    return {"status": "invalid", "message": "Proof verification failed"}


# ==========================================================
# COMBINED KYC VERIFICATION
# ==========================================================

def verify_kyc_proof():

    verification_key = os.path.join(BASE_DIR, "kyc_verification_key.json")
    proof_file = os.path.join(BASE_DIR, "proofs", "kyc_proof.json")
    public_file = os.path.join(BASE_DIR, "proofs", "kyc_public.json")

    command = f'npx snarkjs groth16 verify "{verification_key}" "{public_file}" "{proof_file}"'

    result = run_command(command)

    if "OK!" in result.stdout:
        return {"status": "valid", "message": "Proof verified successfully"}

    return {"status": "invalid", "message": "Proof verification failed"}
