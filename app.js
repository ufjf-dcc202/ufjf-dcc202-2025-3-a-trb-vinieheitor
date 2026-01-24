let tamanhoTabuleiro = 10;
let quadradosTabuleiro = [];

let nivel = 1;

let loopPrincipal = {
    comandos : [],
    repeticoes : 1,
    loopSuperior : {}
};
let loopAtual = loopPrincipal;

let luzesFaltamAcender = 0;

const comandos = {
    MOVE_FRENTE : 0,
    VIRA_HORARIO : 1,
    VIRA_ANTI_HORARIO : 2,
    ACENDE_LUZ : 3,
    PULA : 4,
    ABRE_LOOP : 5,
    FECHA_LOOP : 6
};

let robo = {
    posX: 0,
    posY: 0,
    angulo: 270,
    quadrado: null,
    setQuadrado : function () {
        this.quadrado = document.getElementById(robo.posY + "," + robo.posX);
    }
};

const moveFrenteBtn = document.getElementById("moveFrenteBtn");
moveFrenteBtn.addEventListener("click", function() {adicionarComando(comandos.MOVE_FRENTE)});

const viraHorarioBtn = document.getElementById("viraHorarioBtn");
viraHorarioBtn.addEventListener("click", function() {adicionarComando(comandos.VIRA_HORARIO)});

const viraAntiHorarioBtn = document.getElementById("viraAntiHorarioBtn");
viraAntiHorarioBtn.addEventListener("click", function() {adicionarComando(comandos.VIRA_ANTI_HORARIO)});

const acendeLuzBtn = document.getElementById("acendeLuzBtn");
acendeLuzBtn.addEventListener("click", function() {adicionarComando(comandos.ACENDE_LUZ)});

const pulaBtn = document.getElementById("pulaBtn");
pulaBtn.addEventListener("click", function() {adicionarComando(comandos.PULA)});

const abreLoopBtn = document.getElementById("abreLoopBtn");
const repeticoesLoop = document.getElementById("repeticoesLoop");
repeticoesLoop.value = 1;
abreLoopBtn.addEventListener("click", function() {adicionarComando(comandos.ABRE_LOOP, repeticoesLoop.value)});

const fechaLoopBtn = document.getElementById("fechaLoopBtn");
fechaLoopBtn.addEventListener("click", function() {adicionarComando(comandos.FECHA_LOOP)});

const lista = document.getElementById("lista");
const tabuleiroDoc = document.getElementById("tabuleiro");

carregarNivel("nivel1.txt");

function iniciarTabuleiro(nivel) {
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
                case "3":
                    classes += " plano";
                    robo.posX = i;
                    robo.posY = j;
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
    fetch(arquivo)
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

function moveFrente(pula = false){
    novaPosX = Math.round(Math.cos(robo.angulo * Math.PI/180));
    novaPosY = Math.round(-Math.sin(robo.angulo*Math.PI /180));
    let novoQuadrado = {
        posX : robo.posX + novaPosX,
        posY : robo.posY + novaPosY,
    };
    let quadradoHTML = document.getElementById(novoQuadrado.posY + "," + novoQuadrado.posX);

    if(quadradoHTML == null || (quadradoHTML.classList.contains("parede")) && !pula) {
        novoQuadrado.posX = robo.posX;
        novoQuadrado.posY = robo.posY;
    }

    removerImagemDoRobo();

    robo.posX = novoQuadrado.posX;
    robo.posY = novoQuadrado.posY;

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

function acendeLuz() {
    let quadradoClass = robo.quadrado.classList;
    if (quadradoClass.contains("luz")) {
        luzesFaltamAcender--;
        robo.quadrado.classList.remove("luz");
        robo.quadrado.classList.add("apagado");
    }
}


function adicionarComando(idDoComando, repeticoesLoop = 1) {
    let novoComando;
    let adicionarNovoLoop = false;
    let novoLoop = {};
    switch (idDoComando) {
        case comandos.MOVE_FRENTE:
            lista.innerHTML += "<p>Mover para frente</p>\n";
            novoComando = {
                executar : function() {
                    moveFrente()
                } 
            };
            break;

        case comandos.VIRA_HORARIO:
            lista.innerHTML += "<p>Virar 90 graus no sentido horário</p>\n";
            novoComando = {
                executar : function() {
                    viraHorario()
                }
            };
            break;
        case comandos.VIRA_ANTI_HORARIO:
            lista.innerHTML += "<p>Virar 90 graus no sentido anti-horário</p>\n";
            novoComando = {
                executar : function() {
                    viraAntiHorario()
                }
            };
            break;
        case comandos.ACENDE_LUZ:
            lista.innerHTML += "<p>Acender luz</p>\n";
            novoComando = {
                executar : function() {
                    acendeLuz()
                }
            };
            break;
        case comandos.PULA:
            lista.innerHTML += "<p>Pula</p>\n";
            novoComando = {
                executar : function() {
                    moveFrente(true)
                } 
            };
            break;
        case comandos.ABRE_LOOP:
            lista.innerHTML += "<p>Abrir loop (" + repeticoesLoop + ")</p>\n";
            adicionarNovoLoop = true;
            novoComando = {
                novoLoop : {
                    comandos : [],
                    repeticoes : repeticoesLoop,
                    loopSuperior : loopAtual
                },
                executar : function() {
                    executarLoop(this.novoLoop)
                }
            }
            novoLoop = novoComando.novoLoop;
            break;
        case comandos.FECHA_LOOP:
            lista.innerHTML += "<p>Fecha loop</p>\n";
            adicionarNovoLoop = true;
            novoLoop = loopAtual.loopSuperior;
            novoComando = {
                nome : "Fechar loop",
                executar : function () {

                }
            }; 
            break;
    }

    if (novoComando != {}) {
        loopAtual.comandos.push(novoComando);
    }

    if (adicionarNovoLoop) {
        loopAtual = novoLoop;
    }
}

function executarLoop(loop) {
    console.log(loop);
    for (let i = 0; i < loop.repeticoes; i++) {
        for (let j = 0; j < loop.comandos.length; j++) {
            loop.comandos[j].executar();
        }
    }
    if (luzesFaltamAcender <= 0) {
        alert("Você venceu a fase!");
        if (nivel == 3) {
            alert("Parabéns! Você ganhou o jogo!")
            return;
        }
    }
    else {
        alert("Você perdeu a fase!");
        if (nivel == 3) {
            return;
        }
    }
    if (confirm("Ir para a próxima fase?")) {
        proximaFase();
    }
}

function proximaFase() {
    if (nivel < 3) {
        limparFase();
        nivel++;
        carregarNivel("nivel" + nivel + ".txt");
    }
}

function faseAnterior() {
    if (nivel > 1) {
        limparFase();
        nivel--;
        carregarNivel("nivel" + nivel + ".txt");
    }
}

function reiniciarFase() {
    limparFase(); 
    carregarNivel("nivel" + nivel + ".txt");
}

function limparFase() {
    limparComandos();
    tabuleiroDoc.innerHTML = "";
}

function limparComandos() {
    loopPrincipal = {
        comandos : [],
        repeticoes : 1,
        loopSuperior : {}
    };
    loopAtual = loopPrincipal;
    lista.innerHTML = "";
}