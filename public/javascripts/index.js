function validateName(name){
    if (name === null) // checks if the String is null {
        return "reference cannot be empty";

    if(!(name.match(/^[A-Za-z0-9]*$/)))
        return "reference can only contain letters and characters";

    return " ";
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("playerForm").addEventListener('submit', (event) => {

        // we build the new product object from the form input:

        let name = document.getElementById("playerName").value;
        if (validateName(name) === " ") {
            playerName = name;
        } else

            // if the product is not valid, we display the errors:
            document.getElementById("errorAlert").innerHTML = validateName(name);
        startGame();
        event.preventDefault();
    });

    // the sort button handler:

});

window.onload = function () {
    goHome();
    setInterval(function() {
        timer++;}, 1000);

    intervalId = setInterval(changeToDefault, time*1000);

};