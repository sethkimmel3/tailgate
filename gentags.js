class GenTags {
    constructor(api_key, hydrate_on_load=true) {
        this.api_key = api_key;
        this.base_url = "https://sethkimmel3--gentags-api-app.modal.run";
        if (hydrate_on_load) {
            this.hydrate_gentags();
        }
        // this.test_gentags_api();
    }        

    hydrate_gentags(elems=null) {
        if (elems == null) {
            elems = document.querySelectorAll('[data-gentag]');
        }
        else {
            elems = document.querySelectorAll(elems);
        }
        for (const element of elems) {
            if (element.tagName == "P") {
                this.hydrate_gentag(element, "text");
            }
            else if (element.tagName == "IMG") {
                this.hydrate_gentag(element, "image");
            }
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

    hydrate_gentag(elem, type){
        prompt = elem.attributes['data-prompt'].value;
        // send prompt to gentags api
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            let response = this.responseText;
            // strip quotes from beginning and end of response
            if (response[0] == '"') {
                response = response.substring(1, response.length - 1);
            }
            if (response[response.length - 1] == '"') {
                response = response.substring(0, response.length - 2);
            }
            if (type == "text") {
                elem.innerHTML = response;
            }
            else if (type == "image") {
                elem.src = response;
            }  
        }
        let url = "";
        if (type == "text") {
            url = this.base_url + "/generate-text";
        }
        else if (type == "image") {
            url = this.base_url + "/generate-image";
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader('x-api-key', this.api_key);
        xhttp.send(JSON.stringify({"prompt": prompt}));
    }
}

