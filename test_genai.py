import os
from django.conf import settings
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pathfind.settings")
django.setup()

from google import genai

client = genai.Client(api_key=settings.GEMINI_API_KEY)
print("Client initialized")
try:
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents="Hello"
    )
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
