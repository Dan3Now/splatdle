//coding by Dan3_Now
//coding in UTF-8

class Game {
    constructor(list) {
        this.list = list;
        this.imgDir = "";

        this.characterList = [];
        this.notGuessChr = [];
        this.columnName = [];
        this.theChr = {};

        this.isFinish = false;

        this.guess_input = document.getElementById("guess_input");
        this.guess_submit = document.getElementById("guess_submit")
        this.guess_select = document.getElementById("guess_select");
        this.guess_header = document.getElementById("guess_header");
        this.guess_lines = document.getElementById("guess_lines");
    }

    change_bg_attribute(chr, attr, div) {
        if (_.isEqual(chr[attr], this.theChr[attr])) {
            div.classList.add("guess-right");
        } else if (typeof chr[attr] === "object") {
            for (let i=0; i<chr[attr].length; i++) {
                if (this.theChr[attr].includes(chr[attr][i])) {
                    div.classList.add("guess-nearly");
                    return;
                }
            }
            div.classList.add("guess-false");
        } else {
            div.classList.add("guess-false");
        }
    }

    wining () {
        this.guess_input.disabled = true;
        this.guess_submit.disabled = true;
        this.guess_select.replaceChildren();
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
            let p = document.createElement("p");

            p.innerHTML = column;
            p.classList.add("center-margin");

            newDiv.appendChild(p);
            this.guess_header.append(newDiv);
            this.columnName.push(column);
        }

        //adapt characterList
        this.characterList.shift();
        this.characterList.sort((a,b) => {
            return a["name"].localeCompare(b["name"]);
        });
        console.log(this.characterList);

        this.notGuessChr = structuredClone(this.characterList);

        //choose the character to find
        let date = new Date();
        let date_seed = date.getDate().toString();
        date_seed += (date.getMonth()+1).toString();
        date_seed += date.getFullYear();
        date_seed = parseInt(date_seed);
        this.theChr = this.characterList[date_seed % this.characterList.length];
        console.log("The character to find :", this.theChr);

        //add event
        //event for guess input
        this.guess_input.addEventListener("change", e => {

            let possible_chr = this.notGuessChr.filter(chr => {
                return chr["name"].toLowerCase().includes(e.target.value);
            });

            this.guess_select.replaceChildren();

            for (let i=0; i<possible_chr.length; i++) {
                let ppr = document.createElement("div");
                let div_img = document.createElement("div");
                let image = document.createElement("img");
                let text = document.createElement("p");

                image.src = this.imgDir + possible_chr[i]["image"];
                image.classList.add("center-margin");
                div_img.appendChild(image);
                div_img.classList.add("div-search-img");
                text.innerHTML = possible_chr[i]["name"];
                ppr.append(div_img, text);
                ppr.classList.add("search-line");

                this.guess_select.append(ppr);

                ppr.addEventListener("click", e => {
                    let line = document.createElement("div");
                    line.classList.add("guess-line");

                    for (let j=0; j<this.columnName.length; j++) {
                        let div = document.createElement("div");

                        if (this.columnName[j] == "image") {
                            var elt = document.createElement("img");

                            elt.classList.add("center-margin");
                            elt.src = this.imgDir + possible_chr[i]["image"];

                            div.classList.add("div-guess-img");
                        } else {
                            var elt = document.createElement("p");
                            let text = possible_chr[i][this.columnName[j]];

                            if (typeof text !== "string") {
                                text = text.join(",</br>");
                            }
                            if (text.length > 42) elt.classList.add("size-08r");

                            elt.innerHTML = text;

                            elt.classList.add("center-margin");
                            this.change_bg_attribute(
                                possible_chr[i],
                                this.columnName[j],
                                div
                            );
                        }
                        
                        div.appendChild(elt);
                        line.appendChild(div);
                    }

                    //remove from selection
                    this.notGuessChr.splice(
                        this.notGuessChr.indexOf(possible_chr[i]), 
                        1
                    );
                    this.guess_select.removeChild(ppr);
                    
                    //console.log(line);
                    this.guess_lines.prepend(line);
                })
            }
        });
    }
}

var instence = new Game("./assets/character/0_character.json");
instence.begin();

