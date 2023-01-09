var NasaImages = ( () => {
    let comments = []
let currDate = new Date();
let lastImgSrc = " ";
let publicData ={};
// Set a limit for how many items to display at once
const displayLimit = 3;
let userName = " ";
// Set a flag to keep track of whether there are more items to load
let hasMore = true;

// Set a counter for the current item index
let currentIndex = 0;
publicData.noImages = function(){

}
publicData.fetchImage = async function (newFeed){
    const feedContainer = document.getElementById('feed');


        if (!hasMore) {
            return;
        }
        if(newFeed)
            feedContainer.innerHTML = '<div class="loading">Loading...</div>';
        else
            feedContainer.innerHTML += '<div class="loading">Loading...</div>';


        // Load the next batch of items
        for (let i = 0; i < displayLimit; i++) {
            console.log("date before sub=" + currDate.toISOString());
            currDate.setDate(currDate.getDate() - i);
            console.log("date after sub=" + currDate.toISOString());
            let identifier = {date:new Date(),name:userName};
            await fetch(`https://api.nasa.gov/planetary/apod?api_key=FcViT1WU2Rw1xBHN6d77P3dPJDKxo9F2K5bv53gF&date=${currDate.toISOString().split('T')[0]}`)
                .then(response => response.json())
                .then(html => {
                    identifier.date = html.date;
                    if(html.url === lastImgSrc)
                       return;
                   else
                        lastImgSrc = html.url;
                    if(html.msg!==undefined) {
                        console.log(html.url);
                    }
                    //let itemElement = document.createElement('div');
                    //itemElement.className = 'card mb-3';
                    document.getElementById("feed").innerHTML +=  `<div class="card mt-3" style="width: 100%">
                                                            <div class="row g-0"> <div class="col-md-4">` +
                        `<img src=${html.url} alt='img' width = "100%" height="350"></div>`+
                        `<div class="col-md-8">
      <div class="card-body">`+
                        `<h5 class="card-title">${html.title}</h5>`+
                        `<p class="card-text">${html.explanation}</p>` +
                        `<p class="card-text"><small class="text-muted">${html.date}</small></p>` +
                        `<ul id="comment list">`;
                        for(let i = 0 ; i<comments.length ;i++)
                            document.getElementById("feed").innerHTML +=`<li>${comments[identifier.date].comment}</li>`;
                        document.getElementById("feed").innerHTML +=`</ul>`+
                       `<form id ="commentForm">`+
                            `<textarea id="commentEntry" name="comment" data = ${identifier} form="usrform" ></textarea>`+
                        `<button id = "commentButton" class="btn btn-outline-dark"  >Post</button></form>`+
                            `</div></div></div></div>`;
                    //feedContainer.appendChild(itemElement);
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


}

    publicData.validateName =function(name){
    if (name.length !== 24) //
        return "username must be 24 letters long";

    if(!(name.match(/^[A-Za-z0-9]*$/)))
        return "username can only contain letters and characters";
    userName = name;
    return " ";

    }
publicData.setUserName = function(name){
    userName = name;
}
publicData.getUserName = function(){
    return userName;
}
publicData.addComment = function(newComment){
    comments.push({
        user: newComment.name,
        pictureId: newComment.date,
        comment: newComment.comment
    })
    }

   publicData.newListener = function (){
       document.getElementById("commentButton").addEventListener('click', function(event) {
           console.log("before we create comment");
           event.preventDefault();
           console.log(event.target.parentElement.parentElement.children[2].value/toString());
           let comment = {
               userID: event.target.parentElement.children[0].data,
               pictureId: event.target.parentElement.parentElement.children[2],
               comment: event.target.parentElement.children[0].value
           };
           console.log("after we create comment");
           NasaImages.addComment(comment);
       });
   }
return publicData;
})();

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('scroll', async () => {
        // Get the feed container element
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
           await NasaImages.fetchImage(false);
        }});

    document.getElementById("username").addEventListener('submit', async(event) => {

         // we build the new product object from the form input:
        let name = document.getElementById("user").value;
        if (NasaImages.validateName(name) === " ") {
            let userName = name;
            document.getElementById("formDiv").style.display = "none";
            document.getElementById("feed").style.display = "block";
            document.getElementById("date").style.display = "block";

            await NasaImages.fetchImage(false);
            NasaImages.newListener();
        } else {
            // if the product is not valid, we display the errors:
            document.getElementById("errorAlert").innerHTML = NasaImages.validateName(name);
            console.log(NasaImages.validateName((name)));
        }

    });

    const form = document.querySelector("form");
    const inputElement = form.querySelector("input[type='date']");
    inputElement.addEventListener("change", async(event) => {
        const selectedDateString = event.target.value;
        currDate = new Date(selectedDateString);

        await NasaImages.fetchImage(true);
        console.log(selectedDateString);
        console.log(`Selected date664: ${currDate.toISOString()}`);
    });
    // the sort button handler:
});

