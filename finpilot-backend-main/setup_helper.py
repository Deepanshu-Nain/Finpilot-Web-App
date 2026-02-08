"""
FinPilot Backend - Setup Helper
This script helps you set up the backend quickly
"""
import os
import sys
import subprocess
import platform

def print_header(text):
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70 + "\n")

def print_step(number, text):
    print(f"📍 Step {number}: {text}")

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_info(text):
    print(f"💡 {text}")

def check_python():
    """Check Python version"""
    print_step(1, "Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_success(f"Python {version.major}.{version.minor}.{version.micro} ✓")
        return True
    else:
        print_error(f"Python {version.major}.{version.minor} is too old")
        print_info("Please install Python 3.8 or higher")
        return False

def check_venv():
    """Check if virtual environment exists"""
    print_step(2, "Checking virtual environment...")
    venv_path = "venv"
    
    if os.path.exists(venv_path):
        print_success("Virtual environment found ✓")
        return True
    else:
        print_info("Virtual environment not found. Creating one...")
        try:
            subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
            print_success("Virtual environment created ✓")
            return True
        except Exception as e:
            print_error(f"Failed to create virtual environment: {e}")
            return False

def get_venv_python():
    """Get the path to Python in virtual environment"""
    if platform.system() == "Windows":
        return os.path.join("venv", "Scripts", "python.exe")
    else:
        return os.path.join("venv", "bin", "python")

def install_dependencies():
    """Install Python dependencies"""
    print_step(3, "Installing dependencies...")
    
    python_path = get_venv_python()
    
    if not os.path.exists(python_path):
        print_error("Virtual environment Python not found")
        print_info("Please activate virtual environment manually")
        return False
    
    try:
        print("   Installing packages (this may take a minute)...")
        subprocess.run([python_path, "-m", "pip", "install", "--upgrade", "pip"], 
                      check=True, capture_output=True)
        subprocess.run([python_path, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        print_success("All dependencies installed ✓")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install dependencies")
        print(f"   Error: {e}")
        return False

def check_firebase_credentials():
    """Check if Firebase credentials exist"""
    print_step(4, "Checking Firebase credentials...")
    
    if os.path.exists("serviceAccountKey.json"):
        print_success("Firebase credentials found ✓")
        return True
    else:
        print_error("Firebase credentials NOT found")
        print("\n" + "-"*70)
        print("🔥 FIREBASE SETUP REQUIRED")
        print("-"*70)
        print("\nYou need to set up Firebase to use FinPilot backend.")
        print("\n📋 Follow these steps:")
        print("\n1. Go to: https://console.firebase.google.com/")
        print("2. Create a new project (or select existing one)")
        print("3. Click on 'Build' → 'Firestore Database' → 'Create database'")
        print("4. Choose 'Start in test mode' (for development)")
        print("5. Go to Project Settings (⚙️ icon) → 'Service Accounts' tab")
        print("6. Click 'Generate new private key' button")
        print("7. Download the JSON file")
        print("8. Rename it to 'serviceAccountKey.json'")
        print("9. Place it in this directory:")
        print(f"   {os.path.abspath('.')}")
        print("\n" + "-"*70)
        
        input("\n⏸️  Press Enter after you've added the file...")
        
        if os.path.exists("serviceAccountKey.json"):
            print_success("Credentials file found! ✓")
            return True
        else:
            print_error("File still not found. Please add it and run this script again.")
            return False

def check_port():
    """Check if port 8000 is available"""
    print_step(5, "Checking if port 8000 is available...")
    
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', 8000))
    sock.close()
    
    if result == 0:
        print_error("Port 8000 is already in use!")
        print_info("Please stop the other process or change the port in main.py")
        return False
    else:
        print_success("Port 8000 is available ✓")
        return True

def main():
    """Main setup function"""
    print_header("🚀 FinPilot Backend - Setup Helper 🚀")
    
    print("This script will help you set up the backend in 5 easy steps.\n")
    
    # Step 1: Check Python
    if not check_python():
        return
    
    # Step 2: Check/Create virtual environment
    if not check_venv():
        return
    
    # Step 3: Install dependencies
    if not install_dependencies():
        return
    
    # Step 4: Check Firebase credentials
    if not check_firebase_credentials():
        return
    
    # Step 5: Check port availability
    check_port()
    
    # All done!
    print_header("✅ SETUP COMPLETE!")
    
    print("🎉 Everything is ready to go!\n")
    print("📝 To start the backend:\n")
    
    if platform.system() == "Windows":
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    
    print("   python main.py")
    
    print("\n🌐 Backend will run on: http://localhost:8000")
    print("📚 API Docs will be at: http://localhost:8000/docs")
    
    print("\n" + "="*70 + "\n")
    
    # Ask if they want to start now
    response = input("Would you like to start the backend now? (y/n): ").lower()
    if response == 'y':
        print("\n🚀 Starting backend...\n")
        python_path = get_venv_python()
        try:
            subprocess.run([python_path, "main.py"])
        except KeyboardInterrupt:
            print("\n\n👋 Backend stopped. Goodbye!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Setup cancelled. Run this script again when ready!")
        sys.exit(0)
