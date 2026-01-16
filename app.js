let tamanhoTabuleiro = 10;
let quadradosTabuleiro = [];

carregarNivel("nivel1.txt");

function iniciarTabuleiro(nivel) {
    //console.log(nivel);
    let tabuleiroDoc = document.getElementById("tabuleiro");
    let novoTabuleiroHTML = "";
    for (let i = 0; i < tamanhoTabuleiro; i++) {
        novoTabuleiroHTML += "\n<tr class='linha'>"
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            let index = (i * 10 + j);
            let id = i + "," + j;
            let tile = nivel[index];
            let classes = "quadrado";
            switch (tile) {
                case "0":
                    classes += " plano";
                    break;
                case "1":
                    classes += " parede";
                    break;
            }
            novoTabuleiroHTML += "\n<td class='" + classes + "' id='" + id + "'></td>";
            let novoQuadrado = {
                posX : j,
                posY : i
            };
            quadradosTabuleiro.push(novoQuadrado);
        }
        novoTabuleiroHTML += "\n</tr>"
    }
    tabuleiroDoc.innerHTML += novoTabuleiroHTML;
}

function carregarNivel(arquivo) {
    fetch("nivel1.txt")
     .then((res) => res.text())
     .then((text) => {
        let trimmed_text = text.replace(/\s/g, '');
        iniciarTabuleiro(trimmed_text.split(''));
    })
     .catch((e) => console.error(e));
}

let robo = {
    posX: 0,
    posY: 0,
    angulo: 270
};

function moveFrente(){
    novaPosX = Math.round(Math.cos(robo.angulo * Math.PI/180));
    novaPosY = Math.round(-Math.sin(robo.angulo*Math.PI /180));
    if(robo.posX + novaPosX > tamanhoTabuleiro || robo.posX + novaPosX < 0) {
        novaPosX = 0;
    }
    if(robo.posY + novaPosY > tamanhoTabuleiro || robo.posY + novaPosY < 0) {
        novaPosY = 0;
    }

    let antigoQuadrado = document.getElementById(robo.posY + "," + robo.posX);
    antigoQuadrado.innerHTML = "";

    robo.posX += novaPosX;
    robo.posY += novaPosY;
    
    let novoQuadrado = document.getElementById(robo.posY + "," + robo.posX);
    novoQuadrado.innerHTML += "<img src='robot_3Dblue.png'>";
}

function viraHorario(){
    robo.angulo -= 90;
}

function viraAntiHorario(){
    robo.angulo += 90;
}
