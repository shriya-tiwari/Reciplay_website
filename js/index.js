window.onload= function(){
    var addBtn = document.getElementById("addingredient");
    addBtn.onclick =addingredient;
}


// scroll to top functionality starts
let mybutton = document.getElementById("myBtn");

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
    document.body.scrollTop = 0; // For Safari
}

// scroll to top functionality ends

var myApiKey = config.My_api_key;

//array that stores the ingredients
var holderList=[]; 


//addingredient function
function addingredient(){
    var ingredient = document.getElementById("ingredient").value;
    console.log(holderList);
    if(ingredient==""){
        alert("Please enter an ingredient!!"); //alerting if no ingredient entered
    }else{

        //li element to display the list
        var list = document.createElement("li"); 
        var ingredientList = document.getElementById("ingredient-list");  
        list.classList.add("list-group-item");

        //adding ingredient to the list to display
        list.innerHTML = ingredient; 

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
                        <ion-icon name="heart-circle-outline" class="heart"></ion-icon>
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
                                <ion-icon name="heart-circle-outline" class="heart"></ion-icon>
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
                        <a href="${response.spoonacularSourceUrl}" class="btn">Let's Cook!</a>
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
        alert("Please enter the ingredients frist!!!");
    }
}

