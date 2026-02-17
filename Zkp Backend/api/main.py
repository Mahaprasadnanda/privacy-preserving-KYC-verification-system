"""
FASTAPI LAYER

This exposes endpoints for:

1. Age Verification
2. Address Verification
3. Combined KYC Verification

This acts as the bridge between frontend and ZKP engine.
"""

from fastapi import FastAPI
from pydantic import BaseModel

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


app = FastAPI(title="Privacy Preserving KYC API")


# ==========================================================
# REQUEST MODELS
# ==========================================================

class AgeRequest(BaseModel):
    dob_year: int
    current_year: int
    min_age: int = 18


class AddressRequest(BaseModel):
    country_code: int
    state_code: int
    required_country: int
    allowed_state1: int
    allowed_state2: int


class KYCRequest(BaseModel):
    dob_year: int
    current_year: int
    min_age: int
    country_code: int
    state_code: int
    required_country: int
    allowed_state1: int
    allowed_state2: int


# ==========================================================
# AGE ENDPOINT
# ==========================================================

@app.post("/verify-age")
def verify_age(request: AgeRequest):

    prover_result = generate_age_proof(
        dob_year=request.dob_year,
        current_year=request.current_year,
        min_age=request.min_age
    )

    if prover_result["status"] != "success":
        return {"eligible": False, "reason": prover_result.get("message")}

    verifier_result = verify_age_proof()

    if verifier_result["status"] == "valid":
        return {"eligible": True, "message": "Age requirement satisfied"}

    return {"eligible": False, "reason": "Proof verification failed"}


# ==========================================================
# ADDRESS ENDPOINT
# ==========================================================

@app.post("/verify-address")
def verify_address(request: AddressRequest):

    prover_result = generate_address_proof(
        country_code=request.country_code,
        state_code=request.state_code,
        required_country=request.required_country,
        allowed_state1=request.allowed_state1,
        allowed_state2=request.allowed_state2
    )

    if prover_result["status"] != "success":
        return {"eligible": False, "reason": prover_result.get("message")}

    verifier_result = verify_address_proof()

    if verifier_result["status"] == "valid":
        return {"eligible": True, "message": "Address policy satisfied"}

    return {"eligible": False, "reason": "Proof verification failed"}


# ==========================================================
# COMBINED KYC ENDPOINT
# ==========================================================

@app.post("/verify-both")
def verify_both(request: KYCRequest):

    prover_result = generate_kyc_proof(
        dob_year=request.dob_year,
        current_year=request.current_year,
        min_age=request.min_age,
        country_code=request.country_code,
        state_code=request.state_code,
        required_country=request.required_country,
        allowed_state1=request.allowed_state1,
        allowed_state2=request.allowed_state2
    )

    if prover_result["status"] != "success":
        return {"eligible": False, "reason": prover_result.get("message")}

    verifier_result = verify_kyc_proof()

    if verifier_result["status"] == "valid":
        return {"eligible": True, "message": "KYC requirements satisfied"}

    return {"eligible": False, "reason": "Proof verification failed"}
