
// ==========================================
// CLOSET MIX - SCRIPT DO CATÁLOGO
// ==========================================


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const campoBusca = document.getElementById("CampoBusca");
const botoesFiltro = document.querySelectorAll(".filtro");
const produtos = document.querySelectorAll(".produto");
const mensagemVazia = document.getElementById("semProdutos");
const quantidadeCarrinho = document.getElementById("quantidadeCarrinho");
const botoesAdicionar = document.querySelectorAll(".adicionar");


// ==========================================
// CARRINHO
// ==========================================

// Recupera os produtos salvos no navegador
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// Salva as alterações no navegador
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


// Atualiza a quantidade de produtos no cabeçalho
function atualizarQuantidade() {

    const quantidade = carrinho.reduce((total, produto) => {
        return total + produto.quantidade;
    }, 0);

    if (quantidadeCarrinho) {
        quantidadeCarrinho.textContent = quantidade;
    }
}


// ==========================================
// ADICIONAR PRODUTOS AO CARRINHO
// ==========================================

botoesAdicionar.forEach(botao => {

    botao.addEventListener("click", () => {

        const id = botao.dataset.id;
        const nome = botao.dataset.nome;
        const preco = Number(botao.dataset.preco);
        const imagem = botao.dataset.imagem;

        // Verifica se o produto já está no carrinho
        const produtoExistente = carrinho.find(produto => {
            return produto.id === id;
        });

        if (produtoExistente) {

            // Aumenta a quantidade do produto
            produtoExistente.quantidade++;

        } else {

            // Adiciona um novo produto
            carrinho.push({
                id: id,
                nome: nome,
                preco: preco,
                imagem: imagem,
                quantidade: 1
            });

        }

        salvarCarrinho();
        atualizarQuantidade();

    });

});


// ==========================================
// FILTROS POR CATEGORIA
// ==========================================

let categoriaAtual = "todos";


function filtrarProdutos() {

    const textoBusca = campoBusca.value.toLowerCase().trim();

    let encontrados = 0;

    produtos.forEach(produto => {

        const categoria = produto.dataset.categoria;
        const nome = produto.dataset.nome.toLowerCase();

        // Verifica a categoria selecionada
        const correspondeCategoria =
            categoriaAtual === "todos" ||
            categoria === categoriaAtual;

        // Verifica o texto digitado
        const correspondeBusca =
            nome.includes(textoBusca);

        // Mostra somente os produtos correspondentes
        if (correspondeCategoria && correspondeBusca) {

            produto.style.display = "flex";
            encontrados++;

        } else {

            produto.style.display = "none";

        }

    });

    // Exibe mensagem quando não encontra produtos
    if (mensagemVazia) {
        mensagemVazia.hidden = encontrados > 0;
    }

}


// ==========================================
// CLIQUE NOS BOTÕES DE FILTRO
// ==========================================

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        // Atualiza a categoria selecionada
        categoriaAtual = botao.dataset.categoria;

        // Remove a seleção dos outros botões
        botoesFiltro.forEach(filtro => {
            filtro.classList.remove("ativo");
        });

        // Destaca o botão selecionado
        botao.classList.add("ativo");

        // Aplica o filtro
        filtrarProdutos();

    });

});


// ==========================================
// CAMPO DE BUSCA
// ==========================================

if (campoBusca) {

    campoBusca.addEventListener("input", () => {

        filtrarProdutos();

    });

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Atualiza a quantidade ao abrir a página
atualizarQuantidade();

// Exibe todos os produtos inicialmente
filtrarProdutos();
