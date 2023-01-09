let userName = " "
const currDate = new Date();


// Set a limit for how many items to display at once
const displayLimit = 10;

// Set a flag to keep track of whether there are more items to load
let hasMore = true;

// Set a counter for the current item index
let currentIndex = 0;
async function fetchImage(){
    const feedContainer = document.getElementById('feed');
try{

        // Check if there are more items to load
        if (!hasMore) {
            return;
        }

    feedContainer.innerHTML += '<div class="loading">Loading...</div>';

        // Load the next batch of items
        for (let i = 0; i < displayLimit; i++) {
            currDate.setDate(currDate.getDate() - i);
            await fetch(`https://api.nasa.gov/planetary/apod?api_key=FcViT1WU2Rw1xBHN6d77P3dPJDKxo9F2K5bv53gF&date=${currDate.toISOString().split('T')[0]}`)
                .then(response => response.json())
                .then(html => {
                    let itemElement = document.createElement('div');
                    itemElement.className = 'card';
                    itemElement.innerHTML += `<img src=${html.url} alt='img'>` +
                        `<div class="card-description">` +
                        `<p>${html.explanation}</p>` +
                        `</div>`;
                    feedContainer.appendChild(itemElement);
                }).catch(error => {
                    console.log("error:we got it " + error.toString())
                });

        }

        // Remove the loading indicator
        const loadingIndicator = document.querySelector('.loading');
        loadingIndicator.parentNode.removeChild(loadingIndicator);

        // Update the current index and the hasMore flag
        currentIndex += displayLimit;
        hasMore = true;
} catch (error) {
    console.error(error);
}

}

function validateName(name){
    if (name.length !== 24) //
        return "username must be 24 letters long";

    if(!(name.match(/^[A-Za-z0-9]*$/)))
        return "username can only contain letters and characters";

    return " ";
}
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('scroll', async () => {
        // Get the feed container element
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
           await fetchImage();
        }});
    document.getElementById("username").addEventListener('submit', async(event) => {

         // we build the new product object from the form input:

        let name = document.getElementById("user").value;
        if (validateName(name) === " ") {
            userName = name;
            document.getElementById("formDiv").style.display = "none";
            document.getElementById("feed").style.display = "block";
            await fetchImage();
        } else {
            // if the product is not valid, we display the errors:
            document.getElementById("errorAlert").innerHTML = validateName(name);
            console.log(validateName((name)));
        }
    });
    // the sort button handler:
});

