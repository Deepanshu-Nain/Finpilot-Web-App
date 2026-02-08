import firebase_admin
from firebase_admin import credentials, firestore
import os

# 1. Setup Credentials
# We manually point to the key to avoid any import issues with config.py for this test
CREDENTIALS_PATH = "serviceAccountKey.json"

if not os.path.exists(CREDENTIALS_PATH):
    print(f"❌ ERROR: Could not find {CREDENTIALS_PATH}")
    print("   Make sure the file is in the 'backend/' folder and named correctly.")
    exit(1)

try:
    # Check if app is already initialized to avoid "App already exists" error
    if not firebase_admin._apps:
        cred = credentials.Certificate(CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    print("[OK] Firebase Admin SDK Initialized!")

except Exception as e:
    print(f"[ERROR] Failed to initialize Firebase: {e}")
    exit(1)

# 2. Test Write
try:
    print("Attempting to write to Firestore...")
    doc_ref = db.collection("test_collection").document("test_doc")
    doc_ref.set({
        "message": "Hello from Python!",
        "timestamp": firestore.SERVER_TIMESTAMP
    })
    print("[OK] Write Successful! Created 'test_collection/test_doc'")
except Exception as e:
    print(f"[ERROR] Write Failed: {e}")
    exit(1)

# 3. Test Read
try:
    print("Attempting to read from Firestore...")
    doc = doc_ref.get()
    if doc.exists:
        print(f"[OK] Read Successful! Data: {doc.to_dict()}")
    else:
        print("[ERROR] Read Failed: Document not found.")
        exit(1)
except Exception as e:
    print(f"[ERROR] Read Failed: {e}")
    exit(1)

# 4. Clean Up (Optional)
try:
    print("Cleaning up...")
    doc_ref.delete()
    print("[OK] Test document deleted.")
    print("\nCONGRATULATIONS! Your backend is connected to Firestore.")
except Exception as e:
    print(f"[ERROR] Cleanup failed (not a big deal): {e}")