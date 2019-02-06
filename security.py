import bcrypt
import string


def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    if hashed_password:
        hashed_bytes_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)
    else:
        return False


def check_text_validity(text, max_length=32):
    allowed = set(string.ascii_lowercase + string.digits + '_')
    return set(text.lower()) <= allowed and text and len(text) <= max_length


def check_password_validity(password):
    allowed = set(string.ascii_lowercase + string.digits + string.punctuation)
    return set(password.lower()) <= allowed and password
