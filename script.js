//coding by Dan3_Now
//coding in UTF-8

class Game {
    constructor(list) {
        this.list = list;

        this.characterList = [];
        this.columnName = [];
        this.imgDir = "";

        this.guess_input = document.getElementById("guess_input");
        this.guess_select = document.getElementById("guess_select");
        this.guess_header = document.getElementById("guess_header");
        this.guess_lines = document.getElementById("guess_lines");
    }

    async begin() {
        const response = await fetch(this.list);
        var json_data = await response.json();
        this.characterList = json_data["fr"];
        this.imgDir = "assets/character/";
        
        //complete guess header
        for (let i=0; i<Object.keys(this.characterList[0]).length; i++) {
            let column = Object.keys(this.characterList[0])[i];
            let newDiv = document.createElement("div");
            let newContent = document.createTextNode(column);
            newDiv.appendChild(newContent);
            this.guess_header.append(newDiv);
            this.columnName.push(column)
        }

        //adapt characterList
        this.characterList.shift();
        this.characterList.sort((a,b) => {
            return a["name"].localeCompare(b["name"]);
        });

        //add event
        //event for guess input
        this.guess_input.addEventListener("change", e => {
            let possible_chr = this.characterList.filter(chr => {
                return chr["name"].toLowerCase().includes(e.target.value);
            });

            this.guess_select.replaceChildren();

            for (let i=0; i<possible_chr.length; i++) {
                let ppr = document.createElement("div");
                let div_img = document.createElement("div");
                let image = document.createElement("img");
                let text = document.createElement("p");

                image.src = this.imgDir + possible_chr[i]["image"];
                image.classList.add("guess-img", "center-margin");
                div_img.appendChild(image);
                div_img.classList.add("div-img");
                text.innerHTML = possible_chr[i]["name"];
                ppr.append(div_img, text);
                ppr.classList.add("search-line");

                this.guess_select.append(ppr);

                ppr.addEventListener("click", e => {
                    let line = document.createElement("div");
                    line.classList.add("guess-line")

                    for (let j=0; j<this.columnName.length; j++) {
                        if (this.columnName[j] == "image") {
                            var elt = document.createElement("img");
                            elt.src = this.imgDir + possible_chr[i]["image"];
                        } else {
                            var elt = document.createElement("p");
                            elt.innerHTML = possible_chr[i][this.columnName[j]];
                            //console.log(possible_chr[i]["image"]);
                        }
                        
                        let div = document.createElement("div");
                        div.appendChild(elt);
                        line.appendChild(div);
                    }
                    
                    console.log(line);
                    this.guess_lines.appendChild(line);
                })
            }
        });

        console.log(this.characterList);
    }
}

var instence = new Game("./assets/character/0_character.json");
instence.begin();

