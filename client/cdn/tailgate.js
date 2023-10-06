class tailgate {
    constructor(api_key, hydrate_on_load=true) {
        this.api_key = api_key;
        this.base_url = "https://sethkimmel3--tailgate-api-app.modal.run";
        if (hydrate_on_load) {
            this.hydrate_gentags();
        }
        // this.test_gentags_api();
    }        

    hydrate_gentags(elems=null) {
        if (elems == null) {
            elems = document.querySelectorAll('[data-gentag]');
        }
        for (const element of elems) {
            this.hydrate_gentag(element);
        }
    }

    test_gentags_api(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            console.log(this.responseText);
        }
        xhttp.open("POST", this.base_url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader('x-api-key', this.api_key);
        xhttp.send(JSON.stringify({"query": "test!"}));
    }

    get_gentag_type(elem) {
        if (elem.tagName == "P") {
            return "text";
        }
        else if (elem.tagName == "IMG") {
            return "image";
        }  
    }

    generate_text(prompt, callback, strip_quotes=true, replace_newlines=true) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = this.responseText;
                // strip quotes from beginning and end of response
                if (strip_quotes) {
                    if (response[0] == '"') {
                        response = response.substring(1, response.length - 1);
                    }
                    if (response[response.length - 1] == '"') {
                        response = response.substring(0, response.length - 2);
                    }
                }
                if (replace_newlines) {
                    response = response.replace(/\\n/g, "<br>");
                }

                callback(response);
            }
        }
        xhttp.open("POST", this.base_url + "/generate-text", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader('x-api-key', this.api_key);
        xhttp.send(JSON.stringify({"prompt": prompt}));
    }

    generate_image(prompt, callback, strip_quotes=true) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = this.responseText;
                // strip quotes from beginning and end of response
                if (strip_quotes) {
                    if (response[0] == '"') {
                        response = response.substring(1, response.length - 1);
                    }
                    if (response[response.length - 1] == '"') {
                        response = response.substring(0, response.length - 2);
                    }
                }

                callback(response);
            }
        }
        xhttp.open("POST", this.base_url + "/generate-image", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader('x-api-key', this.api_key);
        xhttp.send(JSON.stringify({"prompt": prompt}));
    }

    ask_docs(prompt, callback, strip_quotes=true, replace_newlines=true) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)['response'];
                // strip quotes from beginning and end of response
                if (strip_quotes) {
                    if (response[0] == '"') {
                        response = response.substring(1, response.length - 1);
                    }
                    if (response[response.length - 1] == '"') {
                        response = response.substring(0, response.length - 2);
                    }
                }
                if (replace_newlines) {
                    response = response.replace(/\\n/g, "<br>");
                }

                callback(response);
            }
        }
        xhttp.open("POST", this.base_url + "/ask-docs", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader('x-api-key', this.api_key);
        xhttp.send(JSON.stringify({"prompt": prompt}));
    }

    hydrate_gentag(elem, prompt=null){
        if (prompt == null) {
            prompt = elem.attributes['data-prompt'].value;
        }
        let type = this.get_gentag_type(elem);
        if (type == "text") {
            if (elem.attributes['data-loading-message'] != null) {
                elem.innerHTML = elem.attributes['data-loading-message'].value;
            }
            this.generate_text(prompt, function(response) {
                elem.innerHTML = response;
            });
        }
        else if (type == "image") {
            this.generate_image(prompt, function(response) {
                elem.src = response;
            });
        }
    }
}

