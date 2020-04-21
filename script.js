"use strict";

import moment from "moment";

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

function formInteractive() {
    HTML.form.setAttribute("novalidate", true);

    document.querySelector("#inp-deadline").setAttribute("min", moment().format("YYYY-MM-DD"));
    document.querySelector(".clear-form").addEventListener("click", clearForm);

    document.querySelectorAll("select").forEach(select => {
        if (select.value === "*") {
            select.classList.add("placeholder");
        }

        select.addEventListener("change", () => {
            select.classList.remove("placeholder");
            select.classList.add("valid");
        })
    })

    if (elements.deadline.validity.valueMissing) {
        elements.deadline.classList.remove("valid");
        document.querySelector(".deadline-err").style.display = "none";
    }

    elements.deadline.addEventListener("change", () => {
        elements.deadline.classList.remove("placeholder");
        elements.deadline.classList.add("valid");
    })

    elements.deadline.addEventListener("keyup", () => {
        if (moment(elements.deadline.value).isBefore(moment())) {
            elements.deadline.classList.add("invalid");
        } else {
            elements.deadline.classList.remove("invalid");
            elements.deadline.classList.remove("placeholder");
            elements.deadline.classList.add("valid");
        }
    })

    elements.color.addEventListener("change", () => {
        if (elements.color.value === "custom") {
            console.log("ja")
            document.querySelector("#custom-color").style.display = "block";
        }
    })


    elements.estimate.addEventListener("keyup", (e) => {
        if (!elements.estimate.value != "") {
            document.querySelector(".estimate-err").textContent = "Please give a time estimate of the task."
        }
        if (elements.estimate.validity.rangeOverflow) {
            document.querySelector(".estimate-err").textContent = "Estimate should be under 8 hours."
        } else if (elements.estimate.validity.rangeUnderflow) {
            console.log("under 0");
            document.querySelector(".estimate-err").textContent = "Estimate should be at least 1 hour."
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
                dest: "todo",
                color: (elements.color.value === "custom") ? elements.customColor.value : elements.color.value
            };

            clearForm();
            post(data);
        } else {
            console.log("Not valid form");
        }
    })
}

function clearForm() {
    elements.title.value = "";
    elements.description.value = "";
    elements.creator.value = "*";
    elements.estimate.value = "";
    elements.deadline.value = "";
    elements.priority.value = "*";
    elements.color.value = "*";

    document.querySelectorAll("select").forEach(select => {
        select.classList.add("placeholder");
        select.classList.remove("valid");
    })

    document.querySelector("#custom-color").style.display = "none";

    elements.deadline.classList.add("placeholder");
    elements.deadline.classList.remove("valid");


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
    console.log("DELETING ID: " + id);
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
    clone.querySelector(".card").style.borderBottom = `5px solid ${e.color}`;

    // clone.querySelector(".desc").textContent = e.description;
    // clone.querySelector(".creator").textContent += e.creator;
    // clone.querySelector(".estimate span+span").textContent = " " + e.estimate + "h";
    // clone.querySelector(".deadline span+span").textContent = " " + formatDate(e);
    // clone.querySelector(".priority span+span").textContent = " " + e.priority;


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

    clone.querySelector(".title").addEventListener("click", () => {
        openPopup(e);
    })

    document.querySelector(`#${dest} .cards`).appendChild(clone);
}

function openPopup(e) {
    console.log(e);

    let dateFormatted = formatDate(e);
    console.log(dateFormatted);

    document.querySelector(".popup").classList.add("open_popup");

    document.querySelector(".popup").style.setProperty('--card-color', e.color);
    document.querySelector(".top h2").textContent = e.title;
    document.querySelector(".top p").textContent = e.description;
    document.querySelector(".top p+p").textContent = "Added by: " + e.creator;

    document.querySelector(".popup-deadline p+p span+span").textContent = moment().to(dateFormatted);
    document.querySelector(".popup-estimate p+p span+span").textContent = e.estimate + "hr";
    document.querySelector(".popup-priority p+p span+span").textContent = e.priority;

    document.querySelector(".bottom").style.color = getCorrectTextColor(e.color);

    document.querySelector(".popup-close").addEventListener("click", () => {
        document.querySelector(".popup").classList.remove("open_popup");
    })

    document.querySelector(".popup-delete").addEventListener("click", () => {
        document.querySelector(".popup").classList.remove("open_popup");
        deleteIt(e._id);
    })
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

//Stolen from https://codepen.io/davidhalford/pen/ywEva?editors=0010
//Calculates whether the text should be black or white, based on the constrast
function getCorrectTextColor(hex) {
    let threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    let hRed = hexToR(hex);
    let hGreen = hexToG(hex);
    let hBlue = hexToB(hex);


    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16)
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16)
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16)
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }

    let cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "#000000";
    } else {
        return "#ffffff";
    }
}

function formatDate(e) {
    console.log("formatting");
    return moment(e.deadline).format("L");
}