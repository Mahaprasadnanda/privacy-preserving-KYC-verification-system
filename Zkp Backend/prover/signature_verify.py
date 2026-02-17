# """
# PROVER SIDE — SIGNATURE VERIFICATION

# Responsibilities:
# 1. Load Aadhaar JSON
# 2. Load UIDAI signature
# 3. Load UIDAI public key
# 4. Verify authenticity
# 5. Return verified Aadhaar data
# """

# import json
# import os
# from cryptography.hazmat.primitives.asymmetric import padding
# from cryptography.hazmat.primitives import serialization, hashes
# from cryptography.exceptions import InvalidSignature


# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


# def verify_aadhaar_signature():

#     # Load public key
#     with open(os.path.join(BASE_DIR, "keys", "public_key.pem"), "rb") as f:
#         public_key = serialization.load_pem_public_key(f.read())

#     # Load Aadhaar JSON
#     with open(os.path.join(BASE_DIR, "data", "aadhaar.json"), "r") as f:
#         aadhaar_data = json.load(f)

#     # Load signature
#     with open(os.path.join(BASE_DIR, "data", "aadhaar_signature.sig"), "rb") as f:
#         signature = f.read()

#     message = json.dumps(aadhaar_data).encode()

#     try:
#         # Verify signature
#         public_key.verify(
#             signature,
#             message,
#             padding.PSS(
#                 mgf=padding.MGF1(hashes.SHA256()),
#                 salt_length=padding.PSS.MAX_LENGTH
#             ),
#             hashes.SHA256()
#         )

#         print("Signature Verified Successfully")

#         return {
#             "status": "valid",
#             "aadhaar_data": aadhaar_data
#         }

#     except InvalidSignature:
#         print("Signature Verification Failed")

#         return {
#             "status": "invalid",
#             "message": "Aadhaar data is tampered"
#         }

"""
PROVER SIDE — QR DECODING + SIGNATURE VERIFICATION

Responsibilities:
1. Load QR string
2. Decode Base64 payload
3. Extract Aadhaar data + signature
4. Verify using public key
"""

import json
import os
import base64
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.exceptions import InvalidSignature


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def verify_aadhaar_signature():

    # 🔹 STEP 1: Load QR string
    with open(os.path.join(BASE_DIR, "data", "aadhaar_qr.txt"), "r") as f:
        qr_string = f.read()

    # 🔹 STEP 2: Decode QR payload
    decoded_payload = base64.b64decode(qr_string)
    payload = json.loads(decoded_payload)

    aadhaar_data = payload["aadhaar_data"]
    signature = base64.b64decode(payload["signature"])

    # 🔹 STEP 3: Load public key
    with open(os.path.join(BASE_DIR, "keys", "public_key.pem"), "rb") as f:
        public_key = serialization.load_pem_public_key(f.read())

    message = json.dumps(aadhaar_data).encode()

    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )

        print("QR Decoded & Signature Verified Successfully")

        return {
            "status": "valid",
            "aadhaar_data": aadhaar_data
        }

    except InvalidSignature:
        print("Signature Verification Failed")

        return {
            "status": "invalid",
            "message": "Invalid Aadhaar QR"
        }
