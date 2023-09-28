import modal
import openai
from fastapi import FastAPI
from pydantic import BaseModel

image = (
    modal.Image.debian_slim()
    .pip_install_from_requirements("requirements.txt")
)

stub = modal.Stub("gentags-api", image=image)
web_app = FastAPI()

class Query(BaseModel):
    query: str

@stub.function()
@modal.web_endpoint(method="POST")
def f(request: Query):
    return {"Hello": "World"}

@stub.function(secret=modal.Secret.from_name("openai-secret"))
@modal.web_endpoint()
def generate_text(prompt, max_tokens=300, temperature=0.5):
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
def generate_image(prompt, max_tokens=250, temperature=0.5):
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="256x256"
    )

    image_url = response['data'][0]['url']
    return image_url

if __name__ == "__main__":
    stub.serve()