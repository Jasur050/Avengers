var men = [
    "Iron Man",
    "Captain America",
    "Thor",
    "Hulk",
    "Hawkeye",
    "Black Panther",
    "Spider-Man"
];

var women = [
    "Black Widow",
    "Scarlet Witch",
    "Gamora",
    "Captain Marvel",
    "Wasp",
    "Valkyrie",
    "Nebula"
];

var menSelectElement = document.getElementById("menSelect");
var womenSelectElement = document.getElementById("womenSelect");
var calculateBtn = document.getElementById("calculateBtn");
var resultElement = document.getElementById("result");


for (var i = 0; i < men.length; i++) {
    var option = document.createElement("option");
    option.value = men[i];
    option.textContent = men[i];
    menSelectElement.appendChild(option);
}

for (var j = 0; j < women.length; j++) {
    var option = document.createElement("option");
    option.value = women[j];
    option.textContent = women[j];
    womenSelectElement.appendChild(option);
}

function calculateCompatibility() {
    var man = menSelectElement.value;
    var woman = womenSelectElement.value;

    if (man && woman) {
        var compatibility = Math.floor(Math.random() * 101);
        resultElement.textContent = "Compatibility between " + man + " and " + woman + " is " + compatibility + "%.";
    } else {
        resultElement.textContent = "Please select a man and a woman.";
    }
}

calculateBtn.addEventListener("click", calculateCompatibility);