let userName = " "
const currDate = new Date();
function fetchImage(){
    let x = (currDate.getDate());

    fetch('https://api.nasa.gov/planetary/apod?api_key=FcViT1WU2Rw1xBHN6d77P3dPJDKxo9F2K5bv53gF&date='+ currDate.toISOString().split('T')[0])
        .then(response => response.json())
        .then(html => {
            document.getElementById('feed').innerHTML += `<div class="card">`+
                `<img src=${html.url} alt='img'>`+
                `<div class="card-description">`+
                `<p>${html.explanation}</p>`+
                `</div>`+  // Closing div for "card-description"
                `</div>`;  // Closing div for "card"
        }).catch(error=>{
        console.log("error: " + error.toString())});
    currDate.setDate(currDate.getDate() - 1);
}

function validateName(name){
    if (name.length !== 24) //
        return "username must be 24 letters long";

    if(!(name.match(/^[A-Za-z0-9]*$/)))
        return "username can only contain letters and characters";

    return " ";
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#feed').addEventListener('scroll', () => {
        // Get the feed container element
        const feed = document.querySelector('#feed');
        if (feed.scrollHeight - feed.scrollTop === feed.clientHeight) {
            console.log("scrololololol");
            fetchImage();
        }});
    document.getElementById("username").addEventListener('submit', (event) => {

         // we build the new product object from the form input:

        let name = document.getElementById("user").value;
        if (validateName(name) === " ") {
            userName = name;
            document.getElementById("formDiv").style.display = "none";
            document.getElementById("feed").style.display = "block";
            fetchImage();
        } else {
            // if the product is not valid, we display the errors:
            document.getElementById("errorAlert").innerHTML = validateName(name);
            console.log(validateName((name)));
        }
    });
    // the sort button handler:
});

