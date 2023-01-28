var NasaImages = ( () => {
    let currDate = new Date();
    let lastImgSrc = " ";
    let publicData = {};
// Set a limit for how many items to display at once
    const displayLimit = 3;
    let userName = " ";
// Set a flag to keep track of whether there are more items to load
    let hasMore = true;
   // setInterval(function() {
        // Send a request to the server to check the session
     //   fetch('/checkSession')
          //  .then(function(data) {
                // Handle the response from the server
             ///   if (!data.loggedIn.valueOf()) {
             //     window.location.replace('/');
            // }
      //      });
  //  }, 30*1000);
    publicData.Comment = class Comment {
        constructor(image, email, userName, comment) {
            this.image = image;
            this.email = email;
            this.userName = userName;
            this.comment = comment;
        }
    }
// Set a counter for the current item index
    let currentIndex = 0;
    publicData.noImages = function () {

    }
    publicData.fetchImage = async function (newFeed) {
        const feedContainer = document.getElementById('feed');

        if (!hasMore) 
            return;
        
        if (newFeed)
            feedContainer.innerHTML = '<div class="loading"><img src="/images/loading.gif" alt="loading"></div>';
        else if(!feedContainer.innerHTML.endsWith('alt="loading"></div>'))
            feedContainer.innerHTML += '<div class="loading"><img src="/images/loading.gif" alt="loading"></div>';

        // Load the next batch of items
        for (let i = 0; i < displayLimit; i++) {

            currDate.setDate(currDate.getDate() - i);

            await fetch(`https://api.nasa.gov/planetary/apod?api_key=FcViT1WU2Rw1xBHN6d77P3dPJDKxo9F2K5bv53gF&date=${currDate.toISOString().split('T')[0]}`)
                .then(response => response.json())
                .then(html => {
                    if (html.url === lastImgSrc)
                        return;
                    else
                        lastImgSrc = html.url;
                    publicData.displayImages(html);
                }).catch(error => {
                    console.log(error);
                });
        }

        // Remove the loading indicator
        const loadingIndicator = document.querySelector('.loading');
        try {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        } catch(err){
            console.log(err);
        }
        // Update the current index and the hasMore flag
        currentIndex += displayLimit;
        hasMore = true;
    }

    publicData.validateName = function (name) {
        if (name.length >= 24) //
            return "username must be at most 24 letters long";

        if (!(name.match(/^[A-Za-z0-9]*$/)))
            return "username can only contain letters and characters";
        userName = name;
        return " ";

    }

    publicData.setUserName = function (name) {
        userName = name;
    }

    publicData.getUserName = function () {
        return userName;
    }

    publicData.getComments = async function (imgUrl, date) {
        let div = '';
        
        let arr = await publicData.showComments(imgUrl).then((data) => {
            return data;
        }).catch((error) => {
            console.log(error);
            return [];
        })
        for (let comment = 0; comment < arr.length; comment++){
            div += `<div class="card"><div class="row g-0">` +
                `<div class="col-11"><span>` + arr[comment].userName + `</span>: <span>` +
                arr[comment].comment + `</span></div>`;
            if (document.getElementById("email").innerText.trim() === arr[comment].email)
                div += `<div class="col-1"><button type="button" id="deleteComment" class="btn-danger">X</button>`;
            div += `</div></div></div>`
        }
        document.getElementById(date).innerHTML = div;
        publicData.addPostListener();
    }

    publicData.displayImages = function (html) {
        let div = `<div class="card mt-3" style="width: 100%">` +
                        `<div class="row g-0">` +
                        `<div class="col-md-4">` +
                        `<img src=${html.url} alt='img' width = "100%" height="350"></div>` +
                        `<div class="col-md-8">` +
                        `<div class="card-body">` +
                        `<h5 class="card-title">${html.title}</h5>` +
                        `<p class="card-text">${html.explanation}</p>` +
                        `<p class="card-text"><small class="text-muted">${html.date}</small></p>` +
            `<div id="${html.date}">`;
        
        let identifier = { date: new Date(), name: userName };
        identifier.date = html.date;
        div += `</div><div class="row"><div class="col-9"><form id ="commentForm">` +
                            `<textarea class="form-control" id="commentEntry" name="comment" data = ${identifier}></textarea></div>` +
                            `<div class="col-3 mt-3"><button id="commentButton" class="btn btn-outline-dark">Post</button></form></div>` +
                        `</div></div></div></div></div>`;
        document.getElementById("feed").innerHTML += div;
        publicData.getComments(html.url, html.date);
    }

    publicData.showComments = function (image) {
        let img = { img: image };

        return fetch('./api/feed/getCommets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(img),
        }).then(function (response) {
            if(response.status === 300) {
                console.log("1111111111111");
                window.location.replace('/');
            }
            else
                return response.json();
        }).catch((err)=>{
            console.log(err);
        });
    }

    publicData.commentOnImg = function (event) {
        let curComment = new publicData.Comment(
            event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].src,
            document.getElementById("email").innerText.trim(),
            document.getElementById("userName").innerText,
            event.target.parentElement.parentElement.children[0].children[0].children[0].value
        );
        fetch('./api/feed/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(curComment),
        }).then((response) => {
            if(response.status === 300) {
                console.log("2222222222222222222");
                window.location.replace('/');
            }
        }).catch((err)=>{
            console.log(err);
        });
        publicData.getComments(curComment.image, event.target.parentElement.parentElement.parentElement.children[2].children[0].innerText);
        event.target.parentElement.parentElement.children[0].children[0].children[0].value = '';
    }

    publicData.deleteComment = async function (event) {
        let comment = event.target.parentElement.parentElement.children[0].children[1].innerText;
        let img = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].src;
        let date = event.target.parentElement.parentElement.parentElement.parentElement.id;
        
        let curComment = new publicData.Comment(
            img,
            document.getElementById("email").innerText.trim(),
            document.getElementById("userName").innerText.trim(),
            comment
        );
        
        fetch('./api/feed/deleteComment', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(curComment),
        }).then((response) => {
            if(response.status === 200)
                publicData.getComments(img, date);
            if(response.status === 300) {
                console.log("3333333333");
                window.location.replace('/');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    publicData.addPostListener = function () {
        document.querySelectorAll("#commentButton").forEach(comment => {
            comment.addEventListener('click', NasaImages.commentOnImg);
        });
        document.querySelectorAll("#deleteComment").forEach(comment => {
            comment.addEventListener('click', NasaImages.deleteComment)
        })
    }
    return publicData;
})();

document.addEventListener("DOMContentLoaded", () => {
    NasaImages.fetchImage(false);
    window.addEventListener('scroll', async (event) => {
        // Get the feed container element
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            NasaImages.fetchImage(false);
        }
    });
    const form = document.querySelector("form");
    const inputElement = form.querySelector("input[type='date']");
    inputElement.addEventListener("change", async (event) => {
        const selectedDateString = event.target.value;
        NasaImages.currDate = new Date(selectedDateString);

        await NasaImages.fetchImage(true);

    });
});
