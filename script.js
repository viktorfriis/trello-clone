"use strict";
document.addEventListener("DOMContentLoaded", start);

const temp = document.querySelector("template");
const endPoint = "https://frontendspring20-f2e0.restdb.io/rest/cards";
const todoContainer = document.querySelector("#todo .cards");
const progressContainer = document.querySelector("#progress .cards");
const doneContainer = document.querySelector("#done .cards");
const APIKey = "5e957b2e436377171a0c2346";
const form = document.querySelector("form");
const elements = form.elements;

function start() {
    console.log("start");
    get();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            title: elements.title.value,
            description: elements.description.value,
            creator: elements.creator.value,
            estimate: elements.estimate.value,
            deadline: elements.deadline.value,
            priority: elements.priority.value,
            dest: "todo"
        };

        post(data);
    })
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

function post(data) {
    // document.querySelectorAll(`label`).forEach(label => label.classList.remove("move-label"));

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
        .then(e => showCard(e));
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

    todoContainer.innerHTML = "";

    data.forEach(e => showCard(e));
}

function showCard(e) {
    let dest = e.dest;

    let clone = temp.cloneNode(true).content;

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

    put(id, data);
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
        .then(e => showCard(e));
}

function formatDate(e) {
    console.log(e);
    let fullDate = e.deadline;
    console.log(fullDate);
    let day = fullDate.substring(8, 10);
    let month = fullDate.substring(5, 7);

    return day + "/" + month;

}