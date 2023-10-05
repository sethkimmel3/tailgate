DOCUMENTS_DIR = './documents' # if you want to load documents from a different directory, change this
EMBEDDINGS_DIR = './embeddings' # Not recommended to change this
OPENAI_MODEL = 'gpt-3.5-turbo' # Change this to the model you want to use. For example, you can use GPT-4 by changing this to 'gpt-4'
MAX_TOKENS = 250 # Change this to the maximum number of tokens you want to generate for each generation request
TEMPERATURE = 0.5 # Change this to the temperature you want to use for each generation request. Lower temperature means more conservative generations, higher temperature means more creative generations
IMAGE_SIZE = '256x256' # Change this to the size of the image you want to generate. For example, you can generate 512x512 images by changing this to '512x512'

# Change this to create public keys for your own domains. 'localhost' is not recommended for production use, but may be helpful in prototyping and testing.
DOMAIN_WHITELIST = { 
    'example-public-key': ['localhost', 'sethkim.me', 'tailgate-5c9.pages.dev'],
}