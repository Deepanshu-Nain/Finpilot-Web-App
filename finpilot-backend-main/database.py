import firebase_admin
from firebase_admin import credentials, firestore
from config import CREDENTIALS_PATH
import os
import sys

# Check if credentials file exists
if not os.path.exists(CREDENTIALS_PATH):
    print("\n" + "="*70)
    print("❌ FIREBASE CREDENTIALS NOT FOUND!")
    print("="*70)
    print(f"\n📁 Expected file: {CREDENTIALS_PATH}")
    print("\n🔧 How to fix this:")
    print("   1. Go to https://console.firebase.google.com/")
    print("   2. Select your project (or create a new one)")
    print("   3. Enable Firestore Database")
    print("   4. Go to Project Settings → Service Accounts")
    print("   5. Click 'Generate new private key'")
    print("   6. Save the JSON file as 'serviceAccountKey.json'")
    print(f"   7. Place it in: {os.path.dirname(os.path.abspath(__file__))}")
    print("\n💡 Tip: Run 'python setup_helper.py' for guided setup")
    print("="*70 + "\n")
    sys.exit(1)

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    
    # Export the Firestore client
    db = firestore.client()
    print("✅ Firebase connected successfully!")
    
except Exception as e:
    print("\n" + "="*70)
    print("❌ FIREBASE INITIALIZATION FAILED!")
    print("="*70)
    print(f"\nError: {str(e)}")
    print("\n🔧 Possible issues:")
    print("   - Invalid service account key file")
    print("   - Firestore not enabled in Firebase Console")
    print("   - Network connectivity issues")
    print("\n💡 Tip: Check your Firebase project settings")
    print("="*70 + "\n")
    sys.exit(1)