from flask import Flask, render_template, request, flash, redirect, url_for
from datetime import datetime

app = Flask(__name__)
app.secret_key = "change-this-to-a-random-secret-key"

SKILLS = [
    {"icon": "🐍", "name": "Python", "level": "Intermediate"},
    {"icon": "🧠", "name": "Algorithms", "level": "Learning"},
    {"icon": "🗃️", "name": "Data Structures", "level": "Learning"},
    {"icon": "🌐", "name": "HTML / CSS", "level": "Beginner"},
    {"icon": "🐧", "name": "Linux / CLI", "level": "Beginner"},
    {"icon": "➗", "name": "Mathematics", "level": "Strong"},
]

PROJECTS = [
    {"icon": "🧮", "name": "Python Calculator", "description": "A simple calculator for addition, subtraction, multiplication, and division.", "tag": "Python"},
    {"icon": "🎯", "name": "Number Guessing Game", "description": "A small game that uses loops, conditions, and random numbers.", "tag": "Python"},
    {"icon": "🍔", "name": "Restaurant Billing System", "description": "A menu-based program that calculates item quantities and the total bill.", "tag": "Python"},
    {"icon": "🏦", "name": "Banking Practice App", "description": "A learning project for deposits, withdrawals, and checking a balance.", "tag": "Python"},
    {"icon": "❎", "name": "Tic-Tac-Toe", "description": "A two-player console game made with lists and functions.", "tag": "Python"},
    {"icon": "📊", "name": "Excel Salary & Overtime", "description": "Practice calculating salary, overtime hours, and overtime pay.", "tag": "Python / Excel"},
]

@app.route("/")
def home():
    return render_template("index.html", skills=SKILLS, projects=PROJECTS, year=datetime.now().year)

@app.route("/python-lab", methods=["GET", "POST"])
def python_lab():
    result = None
    error = None
    if request.method == "POST":
        tool = request.form.get("tool", "")
        try:
            if tool == "calculator":
                a = float(request.form.get("a", ""))
                b = float(request.form.get("b", ""))
                op = request.form.get("op", "+")
                if op == "+": result = a + b
                elif op == "-": result = a - b
                elif op == "*": result = a * b
                elif op == "/":
                    if b == 0:
                        raise ValueError("You cannot divide by zero.")
                    result = a / b
                else:
                    raise ValueError("Choose a valid operation.")
            elif tool == "greeting":
                name = request.form.get("name", "").strip()
                if not name:
                    raise ValueError("Please enter your name.")
                result = f"Hello, {name}! Keep learning Python."
            else:
                raise ValueError("Please choose a tool.")
        except ValueError as exc:
            error = str(exc) or "Please enter valid values."
    return render_template("python_lab.html", result=result, error=error)

@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()
    if not name or not email or not message:
        flash("Please complete every field.", "error")
    else:
        # This demo validates the form but does not send or store messages.
        flash("Thanks! The demo form is working, but email delivery is not configured yet.", "success")
    return redirect(url_for("home") + "#contact")

if __name__ == "__main__":
    app.run(debug=True)
