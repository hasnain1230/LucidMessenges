# app/util/encryption.py

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.fernet import Fernet

# TODO: Hasnain, review it

def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()
    return private_key, public_key


def encrypt_message(public_key, message):
    symmetric_key = Fernet.generate_key()
    f = Fernet(symmetric_key)
    encrypted_message = f.encrypt(message.encode())
    encrypted_symmetric_key = public_key.encrypt(
        symmetric_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_symmetric_key, encrypted_message


def decrypt_message(private_key, encrypted_symmetric_key, encrypted_message):
    symmetric_key = private_key.decrypt(
        encrypted_symmetric_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    f = Fernet(symmetric_key)
    decrypted_message = f.decrypt(encrypted_message).decode()
    return decrypted_message
