//************* variables *************

//html elements
const dogBarDiv = document.querySelector("#dog-bar")
const dogInfoDiv = document.querySelector("#dog-info")
const goodDogFilter = document.querySelector("#good-dog-filter")

//************* functions *************

//initial render
function addDogSpans(dogs) {
    dogs.forEach(dog => {
        const dogSpan = document.createElement("span")
        dogSpan.textContent = dog.name
        dogSpan.dataset.id = dog.id
        dogSpan.dataset.goodStatus = dog.isGoodDog
        dogBarDiv.append(dogSpan)
    })
}

//fetch requests
function getAllDogs() {
    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(data => addDogSpans(data))
}

//event handlers
function handleDogInfoRender(e) {
    if (e.target.matches("span")) {
        dogInfoDiv.dataset.id = e.target.dataset.id
        fetch(`http://localhost:3000/pups/${e.target.dataset.id}`)
        .then(response => response.json())
        .then(dog => {
            const goodStatusTable = {
                true: "Good Dog!",
                false: "Bad Dog!"
            }
            dogInfoDiv.innerHTML = `
            <img src=${dog.image}>
            <h2>${dog.name}</h2>
            <button>${goodStatusTable[dog.isGoodDog]}</button>
            `
        })
    }
}

function handleUpdateGoodStatus(e) {
    if (e.target.matches("button")) {
        const dogSpan = dogBarDiv.querySelector(`[data-id="${e.target.parentElement.dataset.id}"]`)
        const goodBadToggleTable = {
            "Good Dog!": "Bad Dog!",
            "Bad Dog!": "Good Dog!"
        }
        const updatedStatusTable = {
            "Good Dog!": true,
            "Bad Dog!": false
        }
        e.target.innerHTML = goodBadToggleTable[e.target.innerHTML]
        let updatedStatus = {isGoodDog: updatedStatusTable[e.target.innerHTML]}
        dogSpan.dataset.goodStatus = updatedStatus["isGoodDog"]

        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedStatus)
        };

        fetch(`http://localhost:3000/pups/${e.target.parentElement.dataset.id}`, configObj)
        .then(response => response.json())
        .then(dog => console.log("Success", dog))
    }
}

//************* event listeners *************
dogBarDiv.addEventListener('click', handleDogInfoRender)
dogInfoDiv.addEventListener('click', handleUpdateGoodStatus)
goodDogFilter.addEventListener('click', function(e) {
    const filterTable = {
        "Filter good dogs: OFF": "Filter good dogs: ON",
        "Filter good dogs: ON": "Filter good dogs: OFF"
    }
    e.target.innerHTML = filterTable[e.target.innerHTML]
    if (e.target.innerHTML === "Filter good dogs: ON") {
        Array.from(dogBarDiv.children).forEach(child => {
            if (child.dataset.goodStatus === "false") {
                child.style.display = "none"
            } else {
                child.style.display = ""
            }
        })
    } else {
        Array.from(dogBarDiv.children).forEach(child => {
            child.style.display = "flex"
        })
    }
})



//************* invocations *************
getAllDogs()


