 window.onload= function(){
    var addBtn = document.getElementById("addingredient");
    addBtn.onclick = addingredient;
    var ingredient = document.getElementById("ingredient");
    ingredient.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) addBtn.click();
    });
}

// scroll to top functionality starts
let mybutton = document.getElementById("scroll-top-btn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    mybutton.style.display = "flex";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    document.body.scrollTop= 0; // For Safari
}
// scroll to top functionality ends

// Snackbar function 
function enableSnackbar(snackbarStatus, text) {
    let snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = text;
    snackbar.classList.add("show", snackbarStatus);

    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}
// Snackbar function ends

var myApiKey = config.My_api_key;

//array that stores the ingredients
var holderList=[]; 


//addingredient function
function addingredient(){
    var ingredient = document.getElementById("ingredient").value;
    console.log(holderList);
    if(ingredient.trim()==""){
        enableSnackbar("snackbar-danger", "Please enter an ingredient!!");
    } else {

        //li element to display the list
        var list = document.createElement("li"); 
        var ingredientList = document.getElementById("ingredient-list");  
        list.classList.add("list-group-item", "btn", "btn-light");

        //adding ingredient to the list to display
        list.textContent = ingredient; 

        //on clicking the ingredient, it should be removed out of the list
        list.onclick = function(){
            this.parentNode.removeChild(this);
            holderList.pop(this);
        }

        if(ingredientList.childElementCount == 0){
            ingredientList.appendChild(list);
        }else{
            ingredientList.insertBefore(list, ingredientList.firstChild);
        }
        
        //adding the ingredients to  the array
        holderList.push(ingredient);
    } 
}

function react(e) {
    var icon = e.querySelector('ion-icon');
    if (icon.name == 'heart-circle') icon.setAttribute('name', 'heart-circle-outline')
    else icon.setAttribute('name', 'heart-circle');
}

var popurl = `https://api.spoonacular.com/recipes/random?apiKey=${myApiKey}&number=8`;

async function getPopular(url){
const res = await fetch(url);
    var data = await res.json();
    console.log(res.status);
    console.log(data.recipes);
    if(res.status == 200){
        data.recipes.map(response => {           
            var summary = response.summary;
            var info = summary.slice(0,40);
            console.log(info);
            

            var content = `
            <div class="card">
                <div class="head">
                    <div class="icon">
                        <on-button onclick="react(this)">
                            <ion-icon name="heart-circle-outline" class="heart"></ion-icon>
                        </on-button>
                    </div>
                </div>
                <div class="text">
                    <h1 class="food" title="${response.title}">${response.title.slice(0,26)+"..."}</h1>
                    <div class="stars">
                        <li>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star-half-outline"></ion-icon>
                        </li>
                    </div>
                    <p class="info">${info}...</p>
                </div>
                <a href="${response.spoonacularSourceUrl}" class="btn">Let's Cook!</a>
            </div>`;
            console.log(response.readyInMinutes);
            var pop = document.querySelector(".popular");
            pop.innerHTML += content;
            var last = Array.from(
                document.querySelectorAll('.head')
              ).pop();
            last.style.backgroundImage = "url("+response.image+")";
            last.style.backgroundSize = "350px 350px";
            last.style.backgroundRepeat = "no-repeat";
            last.style.backgroundPosition = "center";
        })
    }
};

getPopular(popurl);

const submit = document.getElementById("submit-final");
submit.onclick = refresh;

function refresh(){
    var requrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${myApiKey}&ingredients=`;
    var reqstr = holderList.join(",+");
    requrl = requrl + reqstr + "&number=4";
    console.log(requrl);

    var pop = document.querySelector(".foodbyingre");
    pop.innerHTML = "";

    if(holderList.length > 0){
        const foodby = document.querySelector(".foodby");
        console.log(foodby);
        foodby.innerHTML = `<span class="foodbytitle">You can cook </span>`;

        async function getSearchResult(url){
            const res = await fetch(url);
            var data = await res.json();
            console.log(res.status);
            console.log(data);
            if(res.status==200){
                data.map(response => {

                    var content = `
                    <div class="card">
                        <div class="tail">
                            <div class="icon">
                                <on-button onclick="react(this)">
                                    <ion-icon name="heart-circle-outline" class="heart"></ion-icon>
                                </on-button>
                            </div>
                        </div>
                        <div class="text">
                            <h1 class="food" title="${response.title}">${response.title.slice(0,26)+"..."}</h1>
                            <div class="stars">
                                <li>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star-half-outline"></ion-icon>
                                </li>
                            </div>
                        </div>
                        <a href="${response.spoonacularSourceUrl || ('https://spoonacular.com/recipes/' + response.title.replace(' ', '-') + '-' + response.id)}" class="btn">Let's Cook!</a>
                    </div>`;
                    pop.innerHTML += content;
                    var last = Array.from(
                        document.querySelectorAll('.tail')
                    ).pop();
                    last.style.backgroundImage = "url("+response.image+")";
                    last.style.backgroundSize = "350px 350px";
                    last.style.backgroundRepeat = "no-repeat";
                    last.style.backgroundPosition = "center";
                    console.log(response.spoonacularSourceUrl);
                }
                )
            }
        }

        getSearchResult(requrl);
    }
    else{
        enableSnackbar("snackbar-danger", "Please enter the ingredients frist!!!");
    }
}




document.body.style="background-color: var(--bs-dark);transition: 0.5s;"
const sun = "https://www.uplooder.net/img/image/55/7aa9993fc291bc170abea048589896cf/sun.svg";
const moon = "https://www.uplooder.net/img/image/2/addf703a24a12d030968858e0879b11e/moon.svg"

var theme = "dark";
  const root = document.querySelector(":root");
  const container = document.getElementsByClassName("theme-container")[0];
  const themeIcon = document.getElementById("theme-icon");
  container.addEventListener("click", setTheme);
  function setTheme() {
    switch (theme) {
      case "dark":
        setLight();
        theme = "light";
        break;
      case "light":
        setDark();
        theme = "dark";
        break;
    }
  }
  function setLight() {
    root.style.setProperty(
      "--bs-dark",
      "linear-gradient(318.32deg, #c3d1e4 0%, #dde7f3 55%, #d4e0ed 100%)"
    );
    container.classList.remove("shadow-dark");
    setTimeout(() => {
      container.classList.add("shadow-light");
      themeIcon.classList.remove("change");
    }, 300);
    themeIcon.classList.add("change");
    themeIcon.src = sun;
  }
  function setDark() {
    root.style.setProperty("--bs-dark", "#212529");
    container.classList.remove("shadow-light");
    setTimeout(() => {
      container.classList.add("shadow-dark");
      themeIcon.classList.remove("change");
    }, 300);
    themeIcon.classList.add("change");
    themeIcon.src = moon;
  }


