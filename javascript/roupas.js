
  <script>
    const produtos = [
      {
        id: 1,
        nome: "Jaqueta Jeans Vintage",
        categoria: "casacos",
        tamanho: "M",
        condicao: "Seminova",
        preco: 79.90,
        imagem: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 2,
        nome: "Suéter Tricô Listrado",
        categoria: "blusas",
        tamanho: "G",
        condicao: "Excelente",
        preco: 55.00,
        imagem: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 3,
        nome: "Vestido Floral Retrô",
        categoria: "blusas",
        tamanho: "P",
        condicao: "Novo com etiqueta",
        preco: 68.00,
        imagem: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 4,
        nome: "Jaqueta Couro Ecológico",
        categoria: "casacos",
        tamanho: "G",
        condicao: "Seminova",
        preco: 110.00,
        imagem: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 5,
        nome: "Bolsa Estruturada Preta",
        categoria: "acessorios",
        tamanho: "Único",
        condicao: "Excelente",
        preco: 65.00,
        imagem: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 6,
        nome: "Tênis Casual Branco",
        categoria: "calcados",
        tamanho: "38",
        condicao: "Bom estado",
        preco: 85.00,
        imagem: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 7,
        nome: "Óculos de Sol Gatinho",
        categoria: "acessorios",
        tamanho: "Único",
        condicao: "Seminovo",
        preco: 35.00,
        imagem: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 8,
        nome: "Bota Coturno Tratorada",
        categoria: "calcados",
        tamanho: "37",
        condicao: "Excelente",
        preco: 95.00,
        imagem: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=500&q=80"
      }
    ];

    let sacola = [];
    let categoriaAtual = "todos";
    let termoBusca = "";

    const vitrineEl = document.getElementById("vitrine");
    const campoBuscaEl = document.getElementById("campo-busca");
    const botoesFiltro = document.querySelectorAll(".filtro-btn");
    const contadorCarrinhoEl = document.getElementById("contador-carrinho");
    const modalCarrinhoEl = document.getElementById("modal-carrinho");
    const listaCarrinhoEl = document.getElementById("lista-carrinho");
    const valorTotalEl = document.getElementById("valor-total");

    function formatarMoeda(valor) {
      return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function renderizarVitrine() {
      vitrineEl.innerHTML = "";

      const filtrados = produtos.filter((produto) => {
        const bateCategoria = categoriaAtual === "todos" || produto.categoria === categoriaAtual;
        const bateBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase());
        return bateCategoria && bateBusca;
      });

      if (filtrados.length === 0) {
        vitrineEl.innerHTML = "<p>Nenhuma peça encontrada com esse filtro.</p>";
        return;
      }

      filtrados.forEach((produto) => {
        const jaNaSacola = sacola.some((item) => item.id === produto.id);

        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="card-img-wrapper">
            <span class="tag-condicao">${produto.condicao}</span>
            <img src="${produto.imagem}" alt="${produto.nome}">
          </div>
          <div class="card-info">
            <h3>${produto.nome}</h3>
            <p class="detalhes">Tamanho: <strong>${produto.tamanho}</strong> • Peça única</p>
            <p class="preco">${formatarMoeda(produto.preco)}</p>
            <button
              class="btn-adicionar"
              onclick="adicionarNaSacola(${produto.id})"
              ${jaNaSacola ? "disabled" : ""}
            >
              ${jaNaSacola ? "Reservado na sacola" : "Adicionar à sacola"}
            </button>
          </div>
        `;
        vitrineEl.appendChild(card);
      });
    }

    function adicionarNaSacola(id) {
      const produto = produtos.find((p) => p.id === id);
      if (produto && !sacola.some((item) => item.id === id)) {
        sacola.push(produto);
        atualizarSacola();
        renderizarVitrine();
      }
    }

    function removerDaSacola(id) {
      sacola = sacola.filter((item) => item.id !== id);
      atualizarSacola();
      renderizarVitrine();
    }

    function atualizarSacola() {
      contadorCarrinhoEl.textContent = sacola.length;
      listaCarrinhoEl.innerHTML = "";

      let total = 0;

      sacola.forEach((item) => {
        total += item.preco;
        const li = document.createElement("li");
        li.className = "item-carrinho";
        li.innerHTML = `
          <div>
            <strong>${item.nome}</strong><br>
            <small>Tam: ${item.tamanho} — ${formatarMoeda(item.preco)}</small>
          </div>
          <button class="btn-remover" onclick="removerDaSacola(${item.id})">Remover</button>
        `;
        listaCarrinhoEl.appendChild(li);
      });

      valorTotalEl.textContent = formatarMoeda(total);
    }

    botoesFiltro.forEach((btn) => {
      btn.addEventListener("click", () => {
        botoesFiltro.forEach((b) => b.classList.remove("ativo"));
        btn.classList.add("ativo");
        categoriaAtual = btn.dataset.categoria;
        renderizarVitrine();
      });
    });

    campoBuscaEl.addEventListener("input", (e) => {
      termoBusca = e.target.value;
      renderizarVitrine();
    });

    document.getElementById("btn-carrinho").addEventListener("click", () => {
      modalCarrinhoEl.classList.remove("oculto");
    });

    document.getElementById("fechar-carrinho").addEventListener("click", () => {
      modalCarrinhoEl.classList.add("oculto");
    });

    document.getElementById("finalizar-pedido").addEventListener("click", () => {
      if (sacola.length === 0) {
        alert("Sua sacola está vazia!");
        return;
      }
      alert(`Reserva realizada com sucesso! Total: ${valorTotalEl.textContent}`);
      sacola = [];
      atualizarSacola();
      renderizarVitrine();
      modalCarrinhoEl.classList.add("oculto");
    });

    renderizarVitrine();
  </script>