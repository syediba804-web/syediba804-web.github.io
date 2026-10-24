IBRAHEEM'S PYTHON PORTFOLIO — RUN IN VISUAL STUDIO CODE

FILES
- app.py: Python/Flask routes and Python Lab logic
- templates/index.html: main portfolio
- templates/python_lab.html: interactive Python tools
- static/style.css: responsive website design
- requirements.txt: required Python package

RUN ON WINDOWS
1. Install Python 3.11 or newer and Visual Studio Code.
2. Open VS Code, choose File > Open Folder, and open this folder.
3. Open Terminal > New Terminal.
4. Run these commands:

   py -m venv .venv
   .venv\Scripts\activate
   python -m pip install -r requirements.txt
   python app.py

5. Open http://127.0.0.1:5000 in your browser.

If PowerShell blocks activation, use Command Prompt terminal or run:
   .venv\Scripts\python.exe -m pip install -r requirements.txt
   .venv\Scripts\python.exe app.py

NOTES
- This is a Flask website, so Python handles page routes and form logic.
- HTML builds page structure and CSS styles it; a normal browser needs HTML/CSS to display a website.
- The contact form is a demo: it validates fields but does not send/store emails.
- Do not publish Flask's debug server as a public production server.
- Before publishing, update the profile and contact details in templates/index.html and app.py.
- Your existing GitHub Pages site is static; a Flask app needs a Python-capable hosting service to run online.
