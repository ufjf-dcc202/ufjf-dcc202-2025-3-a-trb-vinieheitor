let tamanhoTabuleiro = 10;
let quadradosTabuleiro = [];

let loopPrincipal = {
    comandos : [],
    repeticoes : 1
};
let loopAtual = loopPrincipal;

let luzesFaltamAcender = 0;

let robo = {
    posX: 0,
    posY: 0,
    angulo: 270,
    quadrado: null,
    setQuadrado : function () {
        this.quadrado = document.getElementById(robo.posY + "," + robo.posX);
    }
};

carregarNivel("nivel1.txt");

function iniciarTabuleiro(nivel) {
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
                case "2":
                    classes += " luz";
                    luzesFaltamAcender++;
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

    robo.setQuadrado();
    adicionarImagemDoRobo();
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



function removerImagemDoRobo() {
    robo.quadrado.innerHTML = "";
}

function adicionarImagemDoRobo() {
    robo.quadrado.innerHTML += "<img src='robot_3Dblue.png' id='imagemRobo'>";
    rotacionarImagemDoRobo();
}

function rotacionarImagemDoRobo() {
    let imagemRobo = document.getElementById("imagemRobo");
    imagemRobo.style.transform = "rotate(" + -robo.angulo + "deg)";
}

function moveFrente(){
    novaPosX = Math.round(Math.cos(robo.angulo * Math.PI/180));
    novaPosY = Math.round(-Math.sin(robo.angulo*Math.PI /180));
    if(robo.posX + novaPosX >= tamanhoTabuleiro || robo.posX + novaPosX < 0) {
        novaPosX = 0;
    }
    if(robo.posY + novaPosY >= tamanhoTabuleiro || robo.posY + novaPosY < 0) {
        novaPosY = 0;
    }

    removerImagemDoRobo();

    robo.posX += novaPosX;
    robo.posY += novaPosY;

    robo.setQuadrado();
    adicionarImagemDoRobo();
    
    }

function viraHorario(){
    robo.angulo -= 90;
    rotacionarImagemDoRobo();
}

function viraAntiHorario(){
    robo.angulo += 90;
    rotacionarImagemDoRobo();
}

function acenderLuz() {
    let quadradoClass = robo.quadrado.classList;
    if (quadradoClass.contains("luz")) {
        luzesFaltamAcender--;
        robo.quadrado.classList.remove("luz");
        robo.quadrado.classList.add("apagado");
        if (luzesFaltamAcender == 0) {
            alert("VOCÊ GANHOU!!!!");
        }
    }
}

function adicionarComando(idDoComando, adicionais) {
    let novoComando;
    switch (idDoComando) {
        case "moveFrente":
            novoComando = {
                nome : "Mover para frente",
                executar : function() {
                    moveFrente()
                } 
            };
            break;

        case "viraHorario":
            novoComando = {
                nome : "Girar no sentido horário",
                executar : viraHorario()
            };
            break;
        case "viraAntiHorario":
            novoComando = {
                nome : "Girar no sentido antihorário",
                executar : viraAntiHorario()
            };
            break;
    }
    loopAtual.comandos.push(novoComando);
}

function executarLoop(loop) {
    for (let i = 0; i < loop.repeticoes; i++) {
        for (let j = 0; j < loop.comandos.length; j++) {
            loop.comandos[j].executar()
        }
    }
}