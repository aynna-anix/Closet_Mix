
// ==========================================
// MENU SANDUÍCHE
// ==========================================

// Elementos do menu

const menuBotao = document.getElementById("menuBotao");
const menuLateral = document.getElementById("menuLateral");
const fundoMenu = document.getElementById("fundoMenu");

// Abrir e fechar o menu

function alternarMenu() {

    menuLateral.classList.toggle("ativo");
    fundoMenu.classList.toggle("ativo");

    const aberto = menuLateral.classList.contains("ativo");

    menuBotao.setAttribute("aria-expanded", aberto);
    menuBotao.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
    );

    menuBotao.textContent = aberto ? "✕" : "☰";
}

// Clique no botão

menuBotao.addEventListener("click", alternarMenu);

// Fechar ao clicar no fundo

fundoMenu.addEventListener("click", alternarMenu);

// Fechar ao escolher uma opção

menuLateral.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        menuLateral.classList.remove("ativo");
        fundoMenu.classList.remove("ativo");

        menuBotao.textContent = "☰";
        menuBotao.setAttribute("aria-expanded", "false");
        menuBotao.setAttribute("aria-label", "Abrir menu");

    });

});

// Fechar usando a tecla ESC

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") {

        menuLateral.classList.remove("ativo");
        fundoMenu.classList.remove("ativo");

        menuBotao.textContent = "☰";
        menuBotao.setAttribute("aria-expanded", "false");
        menuBotao.setAttribute("aria-label", "Abrir menu");

    }

});
