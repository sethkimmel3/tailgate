function initGentags(key=''){
    // get all elements with data attribute data-gentag
    // for (const element of document.querySelectorAll('[data-gentag]')) {
    //     if (element.tagName == "P") {
    //         processGenTag(element, "text");
    //     }
    //     else if (element.tagName == "IMG") {
    //         processGenTag(element, "image");
    //     }
    // }
    test_gentags_api();
}

async function test_gentags_api(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText);
    }
    url = "https://sethkimmel3--gentags-api-f.modal.run"
    // add body to request
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"query": "test!"}));
}

function processGenTag(elem, type){
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
    if (type == "text") {
        url = "https://sethkimmel3--gentags-api-generate-text.modal.run?prompt=" + encodeURIComponent(prompt);
    }
    else if (type == "image") {
        url = "https://sethkimmel3--gentags-api-generate-image.modal.run?prompt=" + encodeURIComponent(prompt);
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}