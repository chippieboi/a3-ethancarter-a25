window.onload = function() {
  const button = document.querySelector("#login");
  button.onclick = login;
}

const login = async function(event) {
    event.preventDefault();

    const username = document.querySelector( "#username" ).value;
    const password = document.querySelector( "#password" ).value;

    if(username === "" || password === "") {
        alert("Type something in the username and password box dummy");
        return;
    }

    const body = JSON.stringify({username: username, password: password});

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body
        });

        if (!response.ok) {
            const error = await response.text();
            alert("Login failed" + error);
            return;
        }

        const {token} = await response.json();

        localStorage.setItem("token", token);

        window.location.href = "/index";

    } catch (err) {
        //console.log(err);
        alert("Bad login, try again");
    } finally {
        document.querySelector("#password").value = ""
    }
    
}