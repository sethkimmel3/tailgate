# tailgate

Tailgate simplifies adding generative AI components to a static website or client-side of a web app. You can use it to create highly custom, engaging AI features for your users.

### Basic Usage

Import the javascript library from a CDN:

```
<script src="../tailgate.js"></script>
```

Decorate HTML tags with the `data-gentag` and `data-prompt` tags. For example:

```
<img id="img" data-gentag data-prompt="A delicious goulash.">
<p id="recipe" data-gentag data-prompt="Craft a recipe for goulash using exactly five ingredients. Return the ingredients to make it, and the steps to do so, and nothing else."></p>
```

and instantiate the library:

```
<script>new tailgate('example-public-key');</script>
```

et violà! Your components will hydrate with AI-generated content:

![goulash](img/goulash.png)

### Setup

For now, tailgate is self-hosted, experimental project. **If you want help setting it up or would like to use a cloud-hosted version, email [seth.kimmel3@gmail.com](seth.kimmel3@gmail.com)**. 

Tailgate uses [Modal](https://modal.com/) on the backend and [OpenAI](https://openai.com/) for inference. You'll need to set up accounts with both of them. Use Modal's built-in secrets manager to safely store your OpenAI key.

Once you've done so, create an arbitrary public API key and whitelist the domains where you'll be using tailgate. 

For example: 

`'example-public-key': ['localhost', 'sethkim.me']`

At this point, you can deploy the server to Modal using `modal deploy server.py`. It will respond with a public URL route that you'll use to replace the default URL route in `tailgate.js`, like so: 

`this.base_url = "https://[my-name]--tailgate-api-app.modal.run";`

You should now be able to hit your own self-hosted API endpoints using tailgate.

### Advanced Usage

`tailgate.js` exposes a client API, allowing you to do far more powerful things than just static generation. There are currently methods that allow for generation of text and images, as well as answering questions over custom data.

