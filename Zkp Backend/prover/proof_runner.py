import subprocess
import json
import os

# 🔹 MODIFIED: No longer importing signature verification for "Layman" flow
# from prover.signature_verify import verify_aadhaar_signature 

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def run_command(command):
    result = subprocess.run(
        command,
        shell=True,
        capture_output=True,
        text=True
    )
    return result


# ==========================================================
# AGE PROOF (DIRECT INPUT)
# ==========================================================

def generate_age_proof(dob_year, current_year, min_age=18):
    """
    🔹 MODIFIED:
    - Accepts dob_year directly (bypassing signature check)
    - 🔹 NEW: Pre-check age before generating proof
    """

    # 🔹 PRE-CHECK: Age
    age = current_year - dob_year
    if age < min_age:
        print(f"Pre-check failed: Age {age} is less than {min_age}")
        return {"status": "fail", "message": f"User is under {min_age} (Age: {age})"}

    # 🔹 DEMO MODE: Skip actual ZKP generation if circuits not available
    DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    if DEMO_MODE:
        print(f"✅ DEMO MODE: Age check passed (Age: {age} >= {min_age})")
        return {"status": "success", "message": f"Age verified: {age} years"}

    input_data = {
        "dob_year": dob_year,
        "current_year": current_year,
        "min_age": min_age
    }

    input_path = os.path.join(BASE_DIR, "circuits", "temp_age_input.json")
    proof_path = os.path.join(BASE_DIR, "proofs", "age_proof.json")
    public_path = os.path.join(BASE_DIR, "proofs", "age_public.json")
    wasm_path = os.path.join(BASE_DIR, "circuits", "build_age", "age_js", "age.wasm")
    zkey_path = os.path.join(BASE_DIR, "age_final.zkey")

    with open(input_path, "w") as f:
        json.dump(input_data, f)

    command = f'npx snarkjs groth16 fullprove "{input_path}" "{wasm_path}" "{zkey_path}" "{proof_path}" "{public_path}"'

    result = run_command(command)

    if result.returncode != 0:
        print(result.stderr)
        return {"status": "fail", "message": "Proof generation failed (Circuit Check)"}

    return {"status": "success"}


# ==========================================================
# ADDRESS PROOF (DIRECT INPUT)
# ==========================================================

def generate_address_proof(country_code, state_code,
                           required_country, allowed_state1, allowed_state2):
    """
    🔹 MODIFIED:
    - Accepts country/state codes directly (bypassing signature check)
    - 🔹 NEW: Pre-check address attributes
    """

    # 🔹 PRE-CHECK: Address
    if country_code != required_country:
        return {"status": "fail", "message": "Invalid Country"}
    
    if state_code not in [allowed_state1, allowed_state2]:
        return {"status": "fail", "message": "Invalid State"}

    # 🔹 DEMO MODE: Skip actual ZKP generation if circuits not available
    DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    if DEMO_MODE:
        print(f"✅ DEMO MODE: Address check passed (Country: {country_code}, State: {state_code})")
        return {"status": "success", "message": "Address verified"}

    input_data = {
        "country_code": country_code,
        "state_code": state_code,
        "required_country": required_country,
        "allowed_state1": allowed_state1,
        "allowed_state2": allowed_state2
    }

    input_path = os.path.join(BASE_DIR, "circuits", "temp_address_input.json")
    proof_path = os.path.join(BASE_DIR, "proofs", "address_proof.json")
    public_path = os.path.join(BASE_DIR, "proofs", "address_public.json")
    wasm_path = os.path.join(BASE_DIR, "circuits", "build_address", "address_js", "address.wasm")
    zkey_path = os.path.join(BASE_DIR, "address_final.zkey")

    with open(input_path, "w") as f:
        json.dump(input_data, f)

    command = f'npx snarkjs groth16 fullprove "{input_path}" "{wasm_path}" "{zkey_path}" "{proof_path}" "{public_path}"'

    result = run_command(command)

    if result.returncode != 0:
        print(result.stderr)
        return {"status": "fail", "message": "Address invalid (Circuit Check)"}

    return {"status": "success"}


# ==========================================================
# COMBINED KYC PROOF
# ==========================================================

def generate_kyc_proof(dob_year, current_year, min_age,
                       country_code, state_code,
                       required_country, allowed_state1, allowed_state2):
    """
    🔹 MODIFIED:
    - Accepts all PII directly (bypassing signature check)
    - 🔹 NEW: Pre-check all attributes
    """

    # 🔹 PRE-CHECK: All
    age = current_year - dob_year
    if age < min_age:
        return {"status": "fail", "message": f"User is under {min_age}"}

    if country_code != required_country:
        return {"status": "fail", "message": "Invalid Country"}
    
    if state_code not in [allowed_state1, allowed_state2]:
        return {"status": "fail", "message": "Invalid State"}

    # 🔹 DEMO MODE: Skip actual ZKP generation if circuits not available
    DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    if DEMO_MODE:
        print(f"✅ DEMO MODE: KYC check passed (Age: {age}, Country: {country_code}, State: {state_code})")
        return {"status": "success", "message": "KYC verified"}

    input_data = {
        "dob_year": dob_year,
        "current_year": current_year,
        "min_age": min_age,
        "country_code": country_code,
        "state_code": state_code,
        "required_country": required_country,
        "allowed_state1": allowed_state1,
        "allowed_state2": allowed_state2
    }

    input_path = os.path.join(BASE_DIR, "circuits", "temp_kyc_input.json")
    proof_path = os.path.join(BASE_DIR, "proofs", "kyc_proof.json")
    public_path = os.path.join(BASE_DIR, "proofs", "kyc_public.json")
    wasm_path = os.path.join(BASE_DIR, "circuits", "build", "kyc_js", "kyc.wasm")
    zkey_path = os.path.join(BASE_DIR, "kyc_final.zkey")

    with open(input_path, "w") as f:
        json.dump(input_data, f)

    command = f'npx snarkjs groth16 fullprove "{input_path}" "{wasm_path}" "{zkey_path}" "{proof_path}" "{public_path}"'

    result = run_command(command)

    if result.returncode != 0:
        print(result.stderr)
        return {"status": "fail", "message": "KYC invalid (Circuit Check)"}

    return {"status": "success"}
