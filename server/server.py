import modal
import openai
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import urlparse
import os

image = (
    modal.Image.debian_slim()
    .pip_install_from_requirements("requirements.txt")
)

stub = modal.Stub("gentags-api", image=image)
web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

domain_whitelist = {
    'example-public-key': ['localhost', 'sethkim.me'],
}

def check_key_origin(request):
    key = request.headers.get("x-api-key")
    domain = urlparse(request.headers.get("origin")).hostname.replace('www.', '')
    if key not in domain_whitelist:
        return False
    if domain not in domain_whitelist[key]:
        return False
    return True

@web_app.post("/")
def f(req: Request):
    if not check_key_origin(req):
        return {"error": "Invalid origin"}

    return {"Hello": "World"}

class GenerateTextRequest(BaseModel):
    prompt: str
    max_tokens: int = 250
    temperature: float = 0.5

@web_app.post("/generate-text")
def generate_text(request: GenerateTextRequest, req: Request):
    prompt, max_tokens, temperature = request.prompt, request.max_tokens, request.temperature
    if not check_key_origin(req):
        return {"error": "Invalid origin"}

    messages = [
        {"role": "user", "content": prompt}
    ]
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
    )
    
    return response['choices'][0].message['content'].replace('\n', '<br>')

class GenerateImageRequest(BaseModel):
    prompt: str

@web_app.post("/generate-image")
def generate_image(request: GenerateImageRequest, req: Request):
    prompt = request.prompt
    if not check_key_origin(req):
        return {"error": "Invalid origin"}

    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="256x256"
    )

    image_url = response['data'][0]['url']
    return image_url

@stub.function(secret=modal.Secret.from_name("openai-secret"))
@modal.asgi_app()
def app():
    return web_app

if __name__ == "__main__":
    stub.serve()