// Pegando referências para elementos da página
var contador = document.getElementById('contador');
var emoji = document.getElementById('emoji');
var janelaLoja = document.getElementById('janelaLoja');
var sairLoja = document.getElementById('sairLoja');  // Referência para o botão "Sair"
var aumentarNivel = document.getElementById('aumentarNivel');  // Referência para o botão "Aumentar Nível"

// Armazenando o estado do jogo
var emojisComprados = {'🍎': 1};
var emojiAtivo = '🍎';
var multiplicadores = {'🍎': 1, '🍌': 1.5, '🍇': 2, '🍓': 2.5, '🍒': 3, '🍑': 3.5, '🍍': 4, '🥥': 4.5, '🥝': 5};

// Função para atualizar a loja com base no estado do jogo
function atualizarLoja() {
    var emojis = document.getElementsByClassName('emoji-item');
    for (var i = 0; i < emojis.length; i++) {
        var preco = parseInt(emojis[i].getAttribute('data-price'));
        var emojiTexto = emojis[i].innerText.split('\n')[0];
        var nivel = emojisComprados[emojiTexto] || 0;
        if (nivel > 0) {
            emojis[i].classList.add('comprado');
            if (emojiTexto === emojiAtivo) {
                emojis[i].innerHTML = emojiTexto + "<span>Usando (Nível " + nivel + ")</span>";
                emojis[i].classList.add('ativo');
            } else {
                emojis[i].innerHTML = emojiTexto + "<span>Usar (Nível " + nivel + ")</span>";
                emojis[i].classList.remove('ativo');
            }
        } else {
            emojis[i].classList.remove('comprado');
            emojis[i].innerHTML = emojiTexto + "<span>" + preco + " clicks</span>";
            emojis[i].classList.remove('ativo');
        }
    }
}

// Função para salvar o estado do jogo no localStorage
function salvarEstado() {
    localStorage.setItem('contador', contador.innerText);
    localStorage.setItem('emojisComprados', JSON.stringify(emojisComprados));
    localStorage.setItem('emojiAtivo', emojiAtivo);
}

// Função para carregar o estado do jogo do localStorage
function carregarEstado() {
    if (localStorage.getItem('contador')) {
        contador.innerText = localStorage.getItem('contador');
    }
    if (localStorage.getItem('emojisComprados')) {
        emojisComprados = JSON.parse(localStorage.getItem('emojisComprados'));
    }
    if (localStorage.getItem('emojiAtivo')) {
        emojiAtivo = localStorage.getItem('emojiAtivo');
        emoji.innerText = emojiAtivo;
    }
}

// Carregar o estado do jogo ao iniciar
window.onload = function() {
    carregarEstado();
    atualizarLoja();
};

// Adicionando um ouvinte de eventos ao botão da loja
document.getElementById('loja').addEventListener('click', function() {
    if (janelaLoja.classList.contains('ativo')) {
        janelaLoja.classList.remove('ativo');
    } else {
        janelaLoja.classList.add('ativo');
        atualizarLoja();
    }
});

// Adicionando um ouvinte de eventos ao botão "Sair" da loja
sairLoja.addEventListener('click', function() {
    janelaLoja.classList.remove('ativo');
});

// Adicionando um ouvinte de eventos ao emoji
emoji.addEventListener('click', function() {
    var nivel = emojisComprados[emojiAtivo];
    var multiplicador = multiplicadores[emojiAtivo];
    contador.innerText = parseInt(contador.innerText) + (1 * multiplicador * nivel);
    salvarEstado();
});

// Adicionando ouvintes de eventos aos itens da loja
var emojis = document.getElementsByClassName('emoji-item');
for (var i = 0; i < emojis.length; i++) {
    emojis[i].addEventListener('click', function(e) {
        var target = e.currentTarget;  // Corrigido para pegar o elemento correto
        var preco = parseInt(target.getAttribute('data-price'));
        var emojiTexto = target.innerText.split('\n')[0];
        if (parseInt(contador.innerText) >= preco && !(emojiTexto in emojisComprados)) {
            contador.innerText = parseInt(contador.innerText) - preco;
            emojisComprados[emojiTexto] = 1;
            salvarEstado();
            atualizarLoja();
        } else if (emojiTexto in emojisComprados) {
            emojiAtivo = emojiTexto;
            emoji.innerText = emojiAtivo;
            salvarEstado();
            atualizarLoja();
        }
    });
}

// Adicionando ouvinte de eventos ao botão "Aumentar Nível"
aumentarNivel.addEventListener('click', function() {
    if (emojiAtivo in emojisComprados && emojisComprados[emojiAtivo] < 10) {
        var custo = 10 * emojisComprados[emojiAtivo];  // Custo para aumentar o nível
        if (parseInt(contador.innerText) >= custo) {
            contador.innerText = parseInt(contador.innerText) - custo;
            emojisComprados[emojiAtivo]++;
            salvarEstado();
            atualizarLoja();
        } else {
            alert("Clicks insuficientes para aumentar o nível!");
        }
    } else {
        alert("Este emoji já está no nível máximo!");
    }
});
