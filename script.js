"use strict";
document.addEventListener("DOMContentLoaded", start);

const temp = document.querySelector("template");
const endPoint = "https://frontendspring20-f2e0.restdb.io/rest/cards";
const todoContainer = document.querySelector("#todo .cards");
const progressContainer = document.querySelector("#progress .cards");
const doneContainer = document.querySelector("#done .cards");
const APIKey = "5e957b2e436377171a0c2346";

function start() {
    console.log("start");
    get();
}

window.addEventListener("load", () => {
    document.querySelector(".add-new").addEventListener("click", () => {
        const data = {
            title: document.querySelector("#inp-title").value,
            description: document.querySelector("#inp-desc").value,
            creator: document.querySelector("#inp-creator").value,
            estimate: document.querySelector("#inp-estimate").value,
            deadline: document.querySelector("#inp-deadline").value,
            priority: document.querySelector("#inp-priority").value,
            dest: "todo"
        };
        post(data);
    })
})

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
    clone.querySelector(".estimate span").textContent = " " + e.estimate + "h";
    clone.querySelector(".deadline span").textContent = " " + formatDate(e);
    clone.querySelector(".priority span").textContent = " " + e.priority;


    // clone.querySelector("button.update-this").addEventListener("click", () => {
    //     put(e._id);
    // })

    clone.querySelector("button.delete-this").addEventListener("click", () => {
        deleteIt(e._id);
    })

    document.querySelector(`#${dest} .cards`).appendChild(clone);
}

function formatDate(e) {
    console.log(e);
    let fullDate = e.deadline;
    console.log(fullDate);
    let day = fullDate.substring(8, 10);
    let month = fullDate.substring(5, 7);

    return day + "/" + month;

}