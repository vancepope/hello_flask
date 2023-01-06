from flask import Flask, render_template, request
from dotenv import load_dotenv
import os
import psycopg2
from datetime import datetime, timezone

load_dotenv()

app = Flask(__name__)

db_url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(db_url)

CREATE_ROOMS_TABLE = (
    "CREATE TABLE IF NOT EXISTS rooms (id SERIAL PRIMARY KEY, name TEXT);"
)

CREATE_TEMPS_TABLE = (
    "CREATE TABLE IF NOT EXISTS temperatures (room_id INTEGER, temperature REAL, date TIMESTAMP, FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE);"
)

INSERT_ROOM_RETURN_ID = "INSERT INTO rooms (name) VALUES (%s) RETURNING id;"
INSERT_TEMP = (
    "INSERT INTO temperatures (room_id, temperature, date) VALUES (%s, %s, %s);"
)

SELECT_ROOM_BY_ID = "SELECT * from rooms where id = %s;"

GLOBAL_NUMBER_OF_DAYS = (
    "SELECT COUNT(DISTINCT DATE(date)) AS days FROM temperatures;"
)

GLOBAL_AVG = "SELECT AVG(temperature) as average FROM temperatures;"

@app.get("/")
def hello_monty():
    return "Hello Monty!"

@app.post("/api/room")
def create_room():
    data = request.get_json()
    name = data["name"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_ROOMS_TABLE)
            cursor.execute(INSERT_ROOM_RETURN_ID, (name,))
            room_id = cursor.fetchone()[0]
    return {"id": room_id, "name": f"Room {name} created."}, 201

@app.post("/api/temperature")
def add_temp():
    data = request.get_json()
    temperature = data["temperature"]
    room_id = data["room"]
    try:
        # Python strftime cheatsheet: https://strftime.org
        date = datetime.strptime(data["data"], "%m-%d-%Y %H:%M:%S")
    except KeyError:
        date = datetime.now(timezone.utc)
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TEMPS_TABLE)
            cursor.execute(INSERT_TEMP, (room_id, temperature, date))
    return {"message": "Temperature added."}, 201

@app.get("/api/room/<int:room_id>")
def show_room(room_id):
    with connection:
       with connection.cursor() as cursor:
            cursor.execute(SELECT_ROOM_BY_ID, (room_id, ))
            room = cursor.fetchall()
            print(room, flush=True)
            return room, 200

@app.get("/api/avg_temp")
def get_average():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GLOBAL_AVG)
            average = cursor.fetchone()[0]
            return {"average" : average}, 200

@app.get("/api/day_count")
def get_day_count():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GLOBAL_NUMBER_OF_DAYS)
            days = cursor.fetchone()[0]
            return {"days" : days}, 200

@app.route("/new")
def hello_new():
    return "Hello NEW route!"

@app.route("/math")
def handle_math():
    equation = 15 * 25 + 150 - 23 / 18
    return str(equation)

@app.route("/tictactoe")
def tictactoe():
    return render_template("grid.html")