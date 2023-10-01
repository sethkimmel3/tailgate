import modal
import openai
from fastapi import FastAPI, Request
from pydantic import BaseModel
from urllib.parse import urlparse

image = (
    modal.Image.debian_slim()
    .pip_install_from_requirements("requirements.txt")
)

stub = modal.Stub("gentags-api", image=image)
web_app = FastAPI()

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

@stub.function()
@modal.web_endpoint(method="POST")
def f(request: Request):
    if not check_key_origin(request):
        return {"error": "Invalid origin"}

    return {"Hello": "World"}

@stub.function(secret=modal.Secret.from_name("openai-secret"))
@modal.web_endpoint()
def generate_text(request: Request, prompt, max_tokens=250, temperature=0.5):
    if not check_key_origin(request):
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

@stub.function(secret=modal.Secret.from_name("openai-secret"))
@modal.web_endpoint()
def generate_image(request: Request, prompt, max_tokens=250, temperature=0.5):
    if not check_key_origin(request):
        return {"error": "Invalid origin"}

    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="256x256"
    )

    image_url = response['data'][0]['url']
    return image_url

if __name__ == "__main__":
    stub.serve()