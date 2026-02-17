# """
# UIDAI SIMULATOR (ISSUER)

# This simulates Aadhaar issuing authority.

# Responsibilities:
# 1. Generate RSA key pair
# 2. Create Aadhaar JSON data
# 3. Digitally sign Aadhaar data
# 4. Export public key for verification
# """

# import json
# import os
# from cryptography.hazmat.primitives.asymmetric import rsa, padding
# from cryptography.hazmat.primitives import serialization, hashes
# from cryptography.hazmat.backends import default_backend
# from cryptography.exceptions import InvalidSignature


# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


# # ==========================================================
# # STEP 1 — Generate RSA Key Pair (Run Once)
# # ==========================================================

# def generate_keys():

#     private_key = rsa.generate_private_key(
#         public_exponent=65537,
#         key_size=2048,
#         backend=default_backend()
#     )

#     public_key = private_key.public_key()

#     # Save private key (Issuer keeps this secret)
#     with open(os.path.join(BASE_DIR, "keys", "private_key.pem"), "wb") as f:
#         f.write(
#             private_key.private_bytes(
#                 encoding=serialization.Encoding.PEM,
#                 format=serialization.PrivateFormat.TraditionalOpenSSL,
#                 encryption_algorithm=serialization.NoEncryption()
#             )
#         )

#     # Save public key (Shared with prover)
#     with open(os.path.join(BASE_DIR, "keys", "public_key.pem"), "wb") as f:
#         f.write(
#             public_key.public_bytes(
#                 encoding=serialization.Encoding.PEM,
#                 format=serialization.PublicFormat.SubjectPublicKeyInfo
#             )
#         )

#     print("RSA Keys Generated Successfully")


# # ==========================================================
# # STEP 2 — Create Aadhaar JSON
# # ==========================================================

# def create_aadhaar_data():

#     aadhaar_data = {
#         "name": "Amlan",
#         "dob_year": 2002,
#         "country_code": 1,
#         "state_code": 10
#     }

#     aadhaar_path = os.path.join(BASE_DIR, "data", "aadhaar.json")

#     with open(aadhaar_path, "w") as f:
#         json.dump(aadhaar_data, f, indent=4)

#     print("Aadhaar JSON Created")


# # ==========================================================
# # STEP 3 — Sign Aadhaar Data
# # ==========================================================

# def sign_aadhaar():

#     # Load private key
#     with open(os.path.join(BASE_DIR, "keys", "private_key.pem"), "rb") as f:
#         private_key = serialization.load_pem_private_key(
#             f.read(),
#             password=None,
#             backend=default_backend()
#         )

#     # Load Aadhaar JSON
#     with open(os.path.join(BASE_DIR, "data", "aadhaar.json"), "r") as f:
#         aadhaar_data = json.load(f)

#     # Convert to bytes
#     message = json.dumps(aadhaar_data).encode()

#     # Sign the data
#     signature = private_key.sign(
#         message,
#         padding.PSS(
#             mgf=padding.MGF1(hashes.SHA256()),
#             salt_length=padding.PSS.MAX_LENGTH
#         ),
#         hashes.SHA256()
#     )

#     # Save signature
#     with open(os.path.join(BASE_DIR, "data", "aadhaar_signature.sig"), "wb") as f:
#         f.write(signature)

#     print("Aadhaar Data Signed Successfully")


# # ==========================================================
# # MAIN EXECUTION
# # ==========================================================

# if __name__ == "__main__":

#     # Create required folders if not exist
#     os.makedirs(os.path.join(BASE_DIR, "keys"), exist_ok=True)
#     os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)

#     generate_keys()
#     create_aadhaar_data()
#     sign_aadhaar()

"""
UIDAI SIMULATOR (ISSUER)

This simulates Aadhaar issuing authority.

Responsibilities:
1. Generate RSA key pair
2. Create Aadhaar JSON data
3. Digitally sign Aadhaar data
4. Generate simulated QR payload (Base64 encoded)
"""

import json
import os
import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


# ==========================================================
# STEP 1 — Generate RSA Key Pair (Run Once)
# ==========================================================

def generate_keys():

    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    public_key = private_key.public_key()

    # Save private key (Issuer keeps this secret)
    with open(os.path.join(BASE_DIR, "keys", "private_key.pem"), "wb") as f:
        f.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.TraditionalOpenSSL,
                encryption_algorithm=serialization.NoEncryption()
            )
        )

    # Save public key (Shared with prover)
    with open(os.path.join(BASE_DIR, "keys", "public_key.pem"), "wb") as f:
        f.write(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
        )

    print("RSA Keys Generated Successfully")


# ==========================================================
# STEP 2 — Create Aadhaar JSON
# ==========================================================

def create_aadhaar_data():

    aadhaar_data = {
        "name": "Amlan",
        "dob_year": 2002,
        "country_code": 1,
        "state_code": 10
    }

    aadhaar_path = os.path.join(BASE_DIR, "data", "aadhaar.json")

    with open(aadhaar_path, "w") as f:
        json.dump(aadhaar_data, f, indent=4)

    print("Aadhaar JSON Created")


# ==========================================================
# STEP 3 — Sign Aadhaar Data
# ==========================================================

def sign_aadhaar():

    # Load private key
    with open(os.path.join(BASE_DIR, "keys", "private_key.pem"), "rb") as f:
        private_key = serialization.load_pem_private_key(
            f.read(),
            password=None,
            backend=default_backend()
        )

    # Load Aadhaar JSON
    with open(os.path.join(BASE_DIR, "data", "aadhaar.json"), "r") as f:
        aadhaar_data = json.load(f)

    # Convert Aadhaar data to bytes
    message = json.dumps(aadhaar_data).encode()

    # Sign the data
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )

    # Save signature
    with open(os.path.join(BASE_DIR, "data", "aadhaar_signature.sig"), "wb") as f:
        f.write(signature)

    print("Aadhaar Data Signed Successfully")


# ==========================================================
# STEP 4 — Generate Simulated QR Payload
# ==========================================================

def generate_qr_payload():
    """
    Simulates Aadhaar QR by encoding:
    {
        "aadhaar_data": {...},
        "signature": base64_signature
    }
    Then encodes entire payload as Base64 string (QR simulation).
    """

    # Load Aadhaar JSON
    with open(os.path.join(BASE_DIR, "data", "aadhaar.json"), "r") as f:
        aadhaar_data = json.load(f)

    # Load signature
    with open(os.path.join(BASE_DIR, "data", "aadhaar_signature.sig"), "rb") as f:
        signature = f.read()

    payload = {
        "aadhaar_data": aadhaar_data,
        "signature": base64.b64encode(signature).decode()
    }

    # Encode entire payload as Base64 (simulate QR encoded string)
    qr_string = base64.b64encode(json.dumps(payload).encode()).decode()

    # Save QR string
    with open(os.path.join(BASE_DIR, "data", "aadhaar_qr.txt"), "w") as f:
        f.write(qr_string)

    print("QR Payload Generated Successfully")


# ==========================================================
# MAIN EXECUTION
# ==========================================================

if __name__ == "__main__":

    # Create required folders if not exist
    os.makedirs(os.path.join(BASE_DIR, "keys"), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)

    generate_keys()
    create_aadhaar_data()
    sign_aadhaar()
    generate_qr_payload()   # 🔹 NEW STEP ADDED
