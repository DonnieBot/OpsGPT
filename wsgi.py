import os
from dotenv import load_dotenv
from flask import send_from_directory

load_dotenv()

from app import create_app

app = create_app('production')

# Serve frontend in production
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend/dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    # Check if it's a frontend asset
    frontend_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist', path)
    if os.path.exists(frontend_path):
        return send_from_directory('../frontend/dist', path)
    # Otherwise serve API
    return send_from_directory('../frontend/dist', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)