from google.cloud import firestore
from database import db
from schemas.auth import UserRegister, UserLogin
import bcrypt  # <--- Using bcrypt directly now

def get_password_hash(password: str) -> str:
    # Convert string to bytes, hash it, then convert back to string for storage
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Convert both to bytes to compare
    pwd_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hash_bytes)

def register_user(user: UserRegister):
    # 1. Check if user already exists
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", user.email).stream()
    
    for _ in query:
        raise ValueError("User with this email already exists")

    # 2. Hash the password
    hashed_pwd = get_password_hash(user.password)

    # 3. Create User Document
    new_user_ref = users_ref.document()
    user_data = {
        "email": user.email,
        "name": user.name,
        "password_hash": hashed_pwd,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    new_user_ref.set(user_data)

    return {
        "user_id": new_user_ref.id,
        "email": user.email,
        "name": user.name,
        "message": "User registered successfully"
    }

def login_user(creds: UserLogin):
    # 1. Find user by email
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", creds.email).limit(1).stream()
    
    user_doc = None
    for doc in query:
        user_doc = doc
    
    if not user_doc:
        raise ValueError("Invalid email or password")
    
    user_data = user_doc.to_dict()

    # 2. Verify Password
    if not verify_password(creds.password, user_data["password_hash"]):
        raise ValueError("Invalid email or password")

    return {
        "user_id": user_doc.id,
        "email": user_data["email"],
        "name": user_data["name"],
        "message": "Login successful"
    }