"use strict";
document.addEventListener("DOMContentLoaded", start);

const HTML = {};
const endPoint = "https://frontendspring20-f2e0.restdb.io/rest/cards";
const APIKey = "5e957b2e436377171a0c2346";
let elements;

function start() {
    console.log("start");

    HTML.temp = document.querySelector("template");
    HTML.todoContainer = document.querySelector("#todo .cards");
    HTML.form = document.querySelector("form");
    elements = HTML.form.elements;

    formInteractive();
    get();
}


function todayDate() {
    const currentDateTime = new Date();

    let month = (currentDateTime.getMonth() + 1);
    let day = currentDateTime.getDate();

    if (day.toString().length === 1) {
        day = "0" + day;
    }

    if (month.toString().length === 1) {
        month = "0" + month;
    }

    return currentDateTime.getFullYear() + "-" + month + "-" + day;
}

function formInteractive() {
    HTML.form.setAttribute("novalidate", true);

    document.querySelector("#inp-deadline").setAttribute("min", todayDate());


    elements.title.addEventListener("keyup", (e) => {
        if (e.keyCode === 9 || e.keyCode === 16) {

        } else {
            if (HTML.form.checkValidity()) {
                document.querySelector(".add-new").disabled = false;
            } else {
                document.querySelector(".add-new").disabled = true;
            }

            if (elements.title.value != "") {
                document.querySelector(".title-err").style.display = "none";
                elements.title.classList.add("valid");
                elements.title.classList.remove("invalid");
            } else {
                document.querySelector(".title-err").style.display = "block";
                elements.title.classList.remove("valid");
                elements.title.classList.add("invalid");
            }
        }
    })

    elements.description.addEventListener("keyup", (e) => {
        if (e.keyCode === 9 || e.keyCode === 16) {

        } else {
            if (HTML.form.checkValidity()) {
                document.querySelector(".add-new").disabled = false;
            } else {
                document.querySelector(".add-new").disabled = true;
            }

            if (elements.description.checkValidity()) {
                document.querySelector(".desc-err").style.display = "none";
                elements.description.classList.add("valid");
                elements.description.classList.remove("invalid");
            } else {
                if (elements.description.validity.tooShort) {
                    document.querySelector(".desc-err").textContent = "Please describe the task with more than 1 character.";
                } else {
                    document.querySelector(".desc-err").textContent = "Please describe the task.";
                }

                document.querySelector(".desc-err").style.display = "block";
                elements.description.classList.remove("valid");
                elements.description.classList.add("invalid");
            }
        }
    })

    elements.creator.addEventListener("change", () => {
        if (HTML.form.checkValidity()) {
            document.querySelector(".add-new").disabled = false;
        } else {
            document.querySelector(".add-new").disabled = true;
        }

        if (elements.creator.value != "") {
            document.querySelector(".creator-err").style.display = "none";
            elements.creator.classList.add("valid");
            elements.creator.classList.remove("invalid");
        } else {
            document.querySelector(".creator-err").style.display = "block";
            elements.creator.classList.remove("valid");
            elements.creator.classList.add("invalid");
        }
    })

    elements.estimate.addEventListener("keyup", (e) => {
        if (e.keyCode === 9 || e.keyCode === 16) {

        } else {
            if (HTML.form.checkValidity()) {
                document.querySelector(".add-new").disabled = false;
            } else {
                document.querySelector(".add-new").disabled = true;
            }

            if (elements.estimate.value != "") {
                document.querySelector(".estimate-err").style.display = "none";
                elements.estimate.classList.add("valid");
                elements.estimate.classList.remove("invalid");
            } else {
                document.querySelector(".estimate-err").textContent = "Please give a time estimate of the task."
                document.querySelector(".estimate-err").style.display = "block";
                elements.estimate.classList.remove("valid");
                elements.estimate.classList.add("invalid");
            }

            if (elements.estimate.validity.rangeOverflow) {
                document.querySelector(".estimate-err").textContent = "Estimate should be under 8 hours."
                document.querySelector(".estimate-err").style.display = "block";
                elements.estimate.classList.remove("valid");
                elements.estimate.classList.add("invalid");
            } else if (elements.estimate.validity.rangeUnderflow) {
                console.log("under 0");
                document.querySelector(".estimate-err").textContent = "Estimate should be at least 1 hour."
                document.querySelector(".estimate-err").style.display = "block";
                elements.estimate.classList.remove("valid");
                elements.estimate.classList.add("invalid");
            }
        }
    })

    elements.deadline.addEventListener("change", () => {
        if (HTML.form.checkValidity()) {
            document.querySelector(".add-new").disabled = false;
        } else {
            document.querySelector(".add-new").disabled = true;
        }

        if (elements.deadline.value != "") {
            document.querySelector(".deadline-err").style.display = "none";
            elements.deadline.classList.add("valid");
            elements.deadline.classList.remove("invalid");
        } else {
            document.querySelector(".deadline-err").style.display = "block";
            elements.deadline.classList.remove("valid");
            elements.deadline.classList.add("invalid");
        }
    })

    elements.priority.addEventListener("change", () => {
        if (HTML.form.checkValidity()) {
            document.querySelector(".add-new").disabled = false;
        } else {
            document.querySelector(".add-new").disabled = true;
        }

        if (elements.priority.value != "") {
            document.querySelector(".priority-err").style.display = "none";
            elements.priority.classList.add("valid");
            elements.priority.classList.remove("invalid");
        } else {
            document.querySelector(".priority-err").style.display = "block";
            elements.priority.classList.remove("valid");
            elements.priority.classList.add("invalid");
        }
    })


    HTML.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formValidity = HTML.form.checkValidity();

        if (formValidity) {
            const data = {
                title: elements.title.value,
                description: elements.description.value,
                creator: elements.creator.value,
                estimate: elements.estimate.value,
                deadline: elements.deadline.value,
                priority: elements.priority.value,
                dest: "todo"
            };

            clearForm();
            post(data);
        } else {
            console.log("Not valid form");
            // if (!elements.title.checkValidity()) {
            //     document.querySelector(".title-err").style.display = "block";
            // }

            // if (!elements.description.checkValidity()) {
            //     document.querySelector(".desc-err").style.display = "block";
            // }

            // if (!elements.creator.checkValidity()) {
            //     document.querySelector(".creator-err").style.display = "block";
            // }

            // if (!elements.estimate.checkValidity()) {
            //     document.querySelector(".estimate-err").style.display = "block";
            // }

            // if (!elements.deadline.checkValidity()) {
            //     document.querySelector(".deadline-err").style.display = "block";
            // }

            // if (!elements.priority.checkValidity()) {
            //     document.querySelector(".priority-err").style.display = "block";
            // }
        }
    })
}

function clearForm() {
    elements.title.value = "";
    elements.description.value = "";
    elements.creator.value = "";
    elements.estimate.value = "";
    elements.deadline.value = "";
    elements.priority.value = "";

    elements.title.classList.remove("valid");
    elements.description.classList.remove("valid");
    elements.creator.classList.remove("valid");
    elements.estimate.classList.remove("valid");
    elements.deadline.classList.remove("valid");
    elements.priority.classList.remove("valid");

    document.querySelector(".add-new").disabled = true;
}

//GET
function get() {
    fetch(endPoint + "?max=100", {
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(e => showData(e));
}

//POST
function post(data) {
    showCard(data);

    const postData = JSON.stringify(data);
    fetch(endPoint + "?max=100", {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(e => e.json())
        .then(e => console.log(e));
}

//PUT 
function put(id, data) {
    const postData = JSON.stringify(data);

    fetch(endPoint + "/" + id, {
            method: "put",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(e => e.json())
        .then(e => console.log(e));
}

//DELETE
function deleteIt(id) {
    //Removes it immediately
    document.querySelector(`article[data-id="${id}"]`).remove();

    //Removes it from the database
    fetch(endPoint + "/" + id, {
            method: "delete",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(e => console.log(e));
}

function showData(data) {
    console.log(data);

    HTML.todoContainer.innerHTML = "";

    data.forEach(e => showCard(e));
}

function showCard(e) {
    let dest = e.dest;

    let clone = HTML.temp.cloneNode(true).content;

    clone.querySelector(".card").dataset.id = e._id;
    clone.querySelector(".title").textContent = e.title;
    clone.querySelector(".desc").textContent = e.description;
    clone.querySelector(".creator").textContent += e.creator;
    clone.querySelector(".estimate span+span").textContent = " " + e.estimate + "h";
    clone.querySelector(".deadline span+span").textContent = " " + formatDate(e);
    clone.querySelector(".priority span+span").textContent = " " + e.priority;


    // clone.querySelector("button.update-this").addEventListener("click", () => {
    //     put(e._id);
    // })

    if (dest === "done") {
        clone.querySelector(".move-left").classList.add("visible");
        clone.querySelector(".move-left").classList.remove("hidden");
        clone.querySelector(".move-right").classList.add("hidden");
        clone.querySelector(".move-right").classList.remove("visible");

        clone.querySelector(".move-left").addEventListener("click", () => {
            updateDest(e, "left");
        });
    } else if (dest === "progress") {
        clone.querySelector(".move-left").classList.add("visible");
        clone.querySelector(".move-left").classList.remove("hidden");
        clone.querySelector(".move-right").classList.add("visible");
        clone.querySelector(".move-right").classList.remove("hidden");


        clone.querySelector(".move-left").addEventListener("click", () => {
            updateDest(e, "left");
        });

        clone.querySelector(".move-right").addEventListener("click", () => {
            updateDest(e, "right");
        });
    } else if (dest === "todo") {
        clone.querySelector(".move-left").classList.add("hidden");
        clone.querySelector(".move-left").classList.remove("visible");
        clone.querySelector(".move-right").classList.add("visible");
        clone.querySelector(".move-right").classList.remove("hidden");

        clone.querySelector(".move-right").addEventListener("click", () => {
            updateDest(e, "right");
        });
    }

    clone.querySelector("button.delete-this").addEventListener("click", () => {
        deleteIt(e._id);
    })

    document.querySelector(`#${dest} .cards`).appendChild(clone);
}

function updateDest(e, dir) {
    let currentDest = e.dest;
    let newDest;
    let id = e._id;

    if (currentDest === "todo" && dir === "right" || currentDest === "done" && dir === "left") {
        newDest = "progress";
    } else if (currentDest === "progress" && dir === "left") {
        newDest = "todo";
    } else if (currentDest === "progress" && dir === "right") {
        newDest = "done";
    }

    const data = {
        dest: newDest
    };

    document.querySelector(`article[data-id="${id}"]`).remove();

    e.dest = newDest;
    showCard(e);

    put(id, data);
}

function formatDate(e) {
    let fullDate = e.deadline;
    let day = fullDate.substring(8, 10);
    let month = fullDate.substring(5, 7);

    return day + "/" + month;

}