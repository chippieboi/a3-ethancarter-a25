// FRONT-END (CLIENT) JAVASCRIPT HERE

const token = localStorage.getItem("token");

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  //going with the car example i guess
  const model = document.querySelector( "#model" ).value;
  const year = parseInt(document.querySelector( "#year" ).value);
  const mpg = parseInt(document.querySelector( "#mpg" ).value);
  const fuel = document.querySelector('input[name="fuel"]:checked').value;
  const color = document.querySelector("#color").value;

  const body = JSON.stringify({ model, year, mpg, fuel, color})

  // const input = document.querySelector( "#yourname" ),
  //       json = { yourname: input.value },
  //       body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    headers: {"Content-type":"application/json", "Authorization": "Bearer " + token},
    body 
  })

  if(!response.ok){
    const page = await fetch("/home", {method:"GET"});
    window.location.href = page.url;
  }

  const table = await response.json()
  displayData(table)

  document.querySelector("#model").value = ""
  document.querySelector("#year").value = ""
  document.querySelector("#mpg").value = ""
  document.querySelector("#gas").checked = true;
  document.querySelector("#color").selectedIndex = 0;

  //console.log( "text:", table )
}

const loadData = async function( event ){
  event.preventDefault()
  //console.log("data asked for");
  const response = await fetch("/data", {
    method:"GET",
    headers: {"Authorization": "Bearer " + token}
  });

  if(!response.ok){
    const page = await fetch("/home", {method:"GET"});
    //console.log(page);
    window.location.href = page.url;
  }
  const data = await response.json()
  displayData(data)
}

const editRow = async function(id, event) {
  event.preventDefault()

  const newModel = prompt("Enter new model:")
  const newYear = prompt("Enter new year:")
  const newMPG = prompt("Enter new MPG:")
  const newFuel = prompt("Enter fuel type (gas/electric):");
  const newColor = prompt("Enter color (red, blue, etc.):");
  
  const updatedEntry = {model: newModel, year: Number(newYear), mpg: Number(newMPG), fuel: newFuel, color: newColor}

  const response = await fetch("/modify", {
    method:"POST",
    headers: {"Content-type":"application/json", "Authorization": "Bearer " + token},
    body: JSON.stringify({id, updatedEntry})
  })

  if(!response.ok){
    const page = await fetch("/home", {method:"GET"});
    window.location.href = page.url;
    return;
  }

  const data = await response.json()
  displayData(data)
}

const deleteRow = async function(id, event) {
  event.preventDefault();

  const confirmDelete = confirm("Are you sure you want to delete this row?")
  if(!confirmDelete){
    return;
  }

  const response = await fetch("/delete", {
    method:"POST",
    headers: {"Content-type":"application/json", "Authorization": "Bearer " + token},
    body: JSON.stringify({id})
  })

  if(!response.ok){

    if(token === null){
      const page = await fetch("/home", {method:"GET"});
      window.location.href = page.url;
      return;
    }

    const error = await response.text();
    alert("Delete didn't work:" + error);
    return;
  }

  const data = await response.json();
  displayData(data);
}

function displayData(data){
  const table = document.querySelector( "#dataTable" )
  table.innerHTML = "<tr><th>Model</th><th>Year</th><th>MPG</th><th>Fuel Type</th><th>Color</th><th>Derived Price</th><th>Buttons</th></tr>"

  data.forEach((row, index) => {
    //const id = row._id.$oid ? row._id.$oid : row._id;
    
    table.innerHTML += `<tr>
    <td>${row.model}</td>
    <td>${row.year}</td>
    <td>${row.mpg}</td>
    <td>${row.fuel}</td>
    <td>${row.color}</td>
    <td>$${row.derivedPrice}</td>
    <td>
    <button onclick="editRow('${row._id}', event)">Edit Row</button>
    <button onclick="deleteRow('${row._id}', event)">Delete Row</button>
    </td>
    </tr>`
  })
}

function logout(event) {
  event.preventDefault();

  localStorage.removeItem("token");

  window.location.href = "/login.html";
}

window.onload = function() {
  const button = document.querySelector("#submit");
  button.onclick = submit;

  const viewData = document.querySelector("#viewData");
  viewData.onclick = loadData;

  const log_out = this.document.querySelector("#logout");
  log_out.onclick = logout;
}