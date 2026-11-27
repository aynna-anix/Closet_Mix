
/* ========================================
   CLOSET MIX - CARRINHO DE COMPRAS
======================================== */

// Chave usada para salvar os produtos
const chaveCarrinho = "carrinhoClosetMix";

// Recupera os produtos salvos
let carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];


/* ========================================
   SALVAR CARRINHO
======================================== */

function salvarCarrinho() {
    localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
}


/* ========================================
   FORMATAR PREÇOS
======================================== */

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* ========================================
   ATUALIZAR QUANTIDADE NO CABEÇALHO
======================================== */

function atualizarQuantidadeCarrinho() {
    const quantidade = document.getElementById("quantidadeCarrinho");

    if (quantidade) {
        const totalItens = carrinho.reduce(
            (total, produto) => total + produto.quantidade,
            0
        );

        quantidade.textContent = totalItens;
    }
}


/* ========================================
   ADICIONAR PRODUTO AO CARRINHO
======================================== */

function adicionarAoCarrinho(produto) {
    const produtoExistente = carrinho.find(
        item => item.id === produto.id
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarQuantidadeCarrinho();

    mostrarMensagem("Produto adicionado ao carrinho!");
}


/* ========================================
   MENSAGEM DE CONFIRMAÇÃO
======================================== */

function mostrarMensagem(texto) {
    let mensagem = document.getElementById("mensagemCarrinho");

    if (!mensagem) {
        mensagem = document.createElement("p");
        mensagem.id = "mensagemCarrinho";
        mensagem.style.textAlign = "center";
        mensagem.style.margin = "15px";
        mensagem.style.color = "#607D86";

        const topo = document.querySelector(".topo");

        if (topo) {
            topo.insertAdjacentElement("afterend", mensagem);
        }
    }

    mensagem.textContent = texto;
}


/* ========================================
   EXIBIR PRODUTOS DO CARRINHO
======================================== */

function mostrarCarrinho() {
    const lista = document.getElementById("listaCarrinho");
    const carrinhoVazio = document.getElementById("carrinhoVazio");
    const resumo = document.getElementById("resumoCarrinho");

    if (!lista) return;

    lista.innerHTML = "";

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {
        if (carrinhoVazio) {
            carrinhoVazio.hidden = false;
        }

        if (resumo) {
            resumo.hidden = true;
        }

        atualizarValores();
        return;
    }

    if (carrinhoVazio) {
        carrinhoVazio.hidden = true;
    }

    if (resumo) {
        resumo.hidden = false;
    }

    // Cria cada produto na tela
    carrinho.forEach(produto => {
        const item = document.createElement("article");

        item.className = "item-carrinho";

        item.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">

            <div class="info-produto">
                <h3>${produto.nome}</h3>

                <p class="preco-produto">
                    ${formatarPreco(produto.preco)}
                </p>

                <div class="quantidade">
                    <button type="button"
                        onclick="alterarQuantidade('${produto.id}', -1)">
                        -
                    </button>

                    <span>${produto.quantidade}</span>

                    <button type="button"
                        onclick="alterarQuantidade('${produto.id}', 1)">
                        +
                    </button>
                </div>

                <button type="button"
                    class="remover-produto"
                    onclick="removerProduto('${produto.id}')">
                    Remover
                </button>
            </div>
        `;

        lista.appendChild(item);
    });

    atualizarValores();
}


/* ========================================
   ALTERAR QUANTIDADE
======================================== */

function alterarQuantidade(id, valor) {
    const produto = carrinho.find(
        item => String(item.id) === String(id)
    );

    if (!produto) return;

    produto.quantidade += valor;

    // Remove se a quantidade chegar a zero
    if (produto.quantidade <= 0) {
        removerProduto(id);
        return;
    }

    salvarCarrinho();
    mostrarCarrinho();
    atualizarQuantidadeCarrinho();
}


/* ========================================
   REMOVER PRODUTO
======================================== */

function removerProduto(id) {
    carrinho = carrinho.filter(
        produto => String(produto.id) !== String(id)
    );

    salvarCarrinho();
    mostrarCarrinho();
    atualizarQuantidadeCarrinho();
}


/* ========================================
   CALCULAR SUBTOTAL E TOTAL
======================================== */

function atualizarValores() {
    const subtotal = carrinho.reduce(
        (total, produto) =>
            total + produto.preco * produto.quantidade,
        0
    );

    const subtotalElemento =
        document.getElementById("subtotalCarrinho");

    const totalElemento =
        document.getElementById("totalCarrinho");

    if (subtotalElemento) {
        subtotalElemento.textContent = formatarPreco(subtotal);
    }

    if (totalElemento) {
        totalElemento.textContent = formatarPreco(subtotal);
    }
}


/* ========================================
   FINALIZAR COMPRA
======================================== */

function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarMensagem("Adicione produtos antes de finalizar.");
        return;
    }

    mostrarMensagem(
        "Compra preparada! O pagamento ainda precisa ser integrado."
    );
}


/* ========================================
   CONECTAR BOTÕES DO CATÁLOGO
======================================== */

function configurarBotoesCatalogo() {
    const botoes = document.querySelectorAll(".adicionar");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const produto = {
                id: botao.dataset.id,
                nome: botao.dataset.nome,
                preco: Number(botao.dataset.preco),
                imagem: botao.dataset.imagem
            };

            adicionarAoCarrinho(produto);
        });
    });
}


/* ========================================
   INICIAR O CARRINHO
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    configurarBotoesCatalogo();
    mostrarCarrinho();
    atualizarQuantidadeCarrinho();

    const botaoFinalizar =
        document.getElementById("finalizarCompra");

    if (botaoFinalizar) {
        botaoFinalizar.addEventListener(
            "click",
            finalizarCompra
        );
    }
});
