from locust import HttpUser, task, between

class DormUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def get_root(self):
        self.client.get("/")

    @task
    def get_rooms(self):
        self.client.get("/rooms")

    @task
    def test_geocode(self):
        self.client.get("/external/geocode?postcode=E1 4NS")
