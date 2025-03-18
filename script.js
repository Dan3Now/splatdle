//const response = await fetch("../assets/character/0_character.json");
//var json_data = await response.json();
//json_data = json_data["fr"];
//console.log(json_data);

class Game {
    constructor(list) {
        this.list = list;

        this.game_input = document.getElementById("game_input");
        this.guess_header = document.getElementById("guess_header");
        this.guess_lines = document.getElementById("guess_lines");
    }

    async begin() {
        const response = await fetch(this.list);
        var json_data = await response.json();
        this.characterList = json_data["fr"];
        
        //complete guess header
        for (let i=0; i<Object.keys(this.characterList[0]).length; i++) {
            let columnName = Object.keys(this.characterList[0])[i];

            let newDiv = document.createElement("div");
            let newContent = document.createTextNode(columnName);
            newDiv.appendChild(newContent);
            this.guess_header.append(newDiv);
        }

        //complete select options
        for (let i=0; i<this.characterList.length; i++) {
            let opt = document.createElement("option");

            opt.value = i;
            opt.text = this.characterList[i]["name"];
        }

        console.log(this.characterList);
    }
}

var instence = new Game("./assets/character/0_character.json");
instence.begin();