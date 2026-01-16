let tamanhoTabuleiro = 10;
let quadradosTabuleiro = [];

iniciarTabuleiro();

function iniciarTabuleiro() {
    let tabuleiroDoc = document.getElementById("tabuleiro");
    let novoTabuleiroHTML = "";
    for (let i = 0; i < tamanhoTabuleiro; i++) {
        novoTabuleiroHTML += "\n<tr class='linha'>"
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            novoTabuleiroHTML += "\n<td class='quadrado'></td>"
            let novoQuadrado = {
                posX : j,
                posY : i
            }
            quadradosTabuleiro.push(novoQuadrado);
        }
        novoTabuleiroHTML += "\n</tr>"
    }
    tabuleiroDoc.innerHTML += novoTabuleiroHTML;
}

let robo = {
    posX: 0,
    posY: 0,
    angulo: 270
};

function moveFrente(){
    novaPosX = Math.round(Math.cos(robo.angulo * Math.PI/180));
    novaPosY = Math.round(-Math.sin(robo.angulo*Math.PI /180));
    if(robo.posX + novaPosX < tamanhoTabuleiro && robo.posX + novaPosX > 0) {
        robo.posX += novaPosX;
    }
    if(robo.posY + novaPosY < tamanhoTabuleiro && robo.posY + novaPosY > 0) {
        robo.posY += novaPosY;
    }
}

function viraHorario(){
    robo.angulo -= 90;
}

function viraAntiHorario(){
    robo.angulo += 90;
}