from locust import HttpUser, task, between
import random
import string

class DormUser(HttpUser):
    wait_time = between(1, 3)
    token = None
    room_ids = []

    def on_start(self):
        """Runs when a simulated user starts"""
        # Random email for each simulated user
        self.email = f"testuser_{''.join(random.choices(string.ascii_lowercase, k=5))}@example.com"
        self.password = "testpassword123"

        # Register
        self.client.post("/users/register", json={
            "email": self.email,
            "password": self.password
        })

        # Login
        res = self.client.post("/users/login", json={
            "email": self.email,
            "password": self.password
        })
        if res.status_code == 200:
            self.token = res.json()["access_token"]

    def auth_headers(self):
        """Helper to return Authorization header"""
        if self.token:
            return {"Authorization": f"Bearer {self.token}"}
        return {}

    @task
    def get_root(self):
        self.client.get("/")

    @task
    def db_status(self):
        self.client.get("/db-status")

    @task
    def list_rooms(self):
        res = self.client.get("/rooms")
        if res.status_code == 200:
            rooms = res.json()
            self.room_ids = [room["id"] for room in rooms]

    @task
    def create_room(self):
        # Only create if logged in
        if not self.token:
            return
        res = self.client.post("/rooms", json={
            "title": "Locust Test Room",
            "description": "Room created by load test",
            "address": "123 Test St",
            "price_per_month": 500.0,
            "postcode": "E1 4NS"
        }, headers=self.auth_headers())
        if res.status_code == 201:
            self.room_ids.append(res.json()["id"])

    @task
    def get_room_by_id(self):
        if self.room_ids:
            room_id = random.choice(self.room_ids)
            self.client.get(f"/rooms/{room_id}")

    @task
    def update_room(self):
        if self.room_ids and self.token:
            room_id = random.choice(self.room_ids)
            self.client.put(f"/rooms/{room_id}", json={
                "price_per_month": random.randint(400, 1000)
            }, headers=self.auth_headers())

    @task
    def delete_room(self):
        if self.room_ids and self.token:
            room_id = self.room_ids.pop()
            self.client.delete(f"/rooms/{room_id}", headers=self.auth_headers())

    @task
    def geocode_postcode(self):
        self.client.get("/external/geocode?postcode=E1 4NS")

    @task
    def room_distance(self):
        if self.room_ids:
            room_id = random.choice(self.room_ids)
            self.client.get(f"/external/room-distance?room_id={room_id}")

    @task
    def apply_for_room(self):
        if self.room_ids and self.token:
            room_id = random.choice(self.room_ids)
            self.client.post("/applications", json={
                "room_id": room_id
            }, headers=self.auth_headers())

    @task
    def list_applications(self):
        if self.token:
            self.client.get("/applications", headers=self.auth_headers())
