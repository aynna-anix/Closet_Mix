
// ==========================================
// CLOSET MIX
// SISTEMA DE CONFIGURAÇÕES
// ==========================================


// ==========================================
// CONFIGURAÇÕES PADRÃO
// ==========================================

const CHAVE_CONFIGURACOES = "closetMixConfiguracoes";

const configuracoesPadrao = {
    tema: "claro",
    tamanhoTexto: "normal",
    altoContraste: false,
    reduzirMovimento: false
};


// ==========================================
// CARREGAR CONFIGURAÇÕES SALVAS
// ==========================================

function carregarConfiguracoes() {

    try {

        const dados = JSON.parse(
            localStorage.getItem(CHAVE_CONFIGURACOES)
        );

        if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
            return { ...configuracoesPadrao };
        }

        return {
            tema: ["claro", "escuro"].includes(dados.tema)
                ? dados.tema
                : configuracoesPadrao.tema,

            tamanhoTexto: ["normal", "grande"].includes(dados.tamanhoTexto)
                ? dados.tamanhoTexto
                : configuracoesPadrao.tamanhoTexto,

            altoContraste: dados.altoContraste === true,

            reduzirMovimento: dados.reduzirMovimento === true
        };

    } catch (erro) {

        return { ...configuracoesPadrao };

    }

}


// Guarda as preferências atuais
let configuracoes = carregarConfiguracoes();


// ==========================================
// SALVAR CONFIGURAÇÕES
// ==========================================

function salvarConfiguracoes() {

    try {

        localStorage.setItem(
            CHAVE_CONFIGURACOES,
            JSON.stringify(configuracoes)
        );

        return true;

    } catch (erro) {

        return false;

    }

}


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const botaoAbrir = document.getElementById("abrirConfiguracoes");

const botaoFechar = document.getElementById("fecharConfiguracoes");

const painel = document.getElementById("painelConfiguracoes");

const fundo = document.getElementById("fundoConfiguracoes");

const seletorTema = document.getElementById("temaSite");

const seletorTexto = document.getElementById("tamanhoTexto");

const opcaoContraste = document.getElementById("altoContraste");

const opcaoMovimento = document.getElementById("reduzirMovimento");

const botaoRestaurar = document.getElementById("restaurarConfiguracoes");

const statusConfiguracoes = document.getElementById("statusConfiguracoes");


// ==========================================
// APLICAR CONFIGURAÇÕES AO SITE
// ==========================================

function aplicarConfiguracoes() {

    const raiz = document.documentElement;

    // Aplica o tema claro ou escuro
    raiz.dataset.tema = configuracoes.tema;

    // Aplica o tamanho do texto
    raiz.dataset.texto = configuracoes.tamanhoTexto;

    // Aplica o contraste
    raiz.dataset.contraste =
        configuracoes.altoContraste ? "alto" : "normal";

    // Aplica a redução de animações
    raiz.dataset.movimento =
        configuracoes.reduzirMovimento ? "reduzido" : "normal";


    // Atualiza os controles do menu
    if (seletorTema) {
        seletorTema.value = configuracoes.tema;
    }

    if (seletorTexto) {
        seletorTexto.value = configuracoes.tamanhoTexto;
    }

    if (opcaoContraste) {
        opcaoContraste.checked = configuracoes.altoContraste;
    }

    if (opcaoMovimento) {
        opcaoMovimento.checked = configuracoes.reduzirMovimento;
    }

}


// ==========================================
// ATUALIZAR E SALVAR PREFERÊNCIAS
// ==========================================

function atualizarConfiguracoes() {

    aplicarConfiguracoes();

    const salvou = salvarConfiguracoes();

    if (statusConfiguracoes) {

        statusConfiguracoes.textContent = salvou
            ? "Configurações salvas neste navegador."
            : "Não foi possível salvar as configurações.";

    }

}


// ==========================================
// ABRIR MENU
// ==========================================

function abrirPainel() {

    if (!painel || !fundo) return;

    painel.classList.add("aberto");
    fundo.classList.add("ativo");

    painel.setAttribute("aria-hidden", "false");

    if (botaoAbrir) {
        botaoAbrir.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("configuracoes-abertas");

    if (botaoFechar) {
        botaoFechar.focus();
    }

}


// ==========================================
// FECHAR MENU
// ==========================================

function fecharPainel() {

    if (!painel || !fundo) return;

    painel.classList.remove("aberto");
    fundo.classList.remove("ativo");

    painel.setAttribute("aria-hidden", "true");

    if (botaoAbrir) {

        botaoAbrir.setAttribute("aria-expanded", "false");

        botaoAbrir.focus();

    }

    document.body.classList.remove("configuracoes-abertas");

}


// ==========================================
// EVENTOS DE ABERTURA E FECHAMENTO
// ==========================================

if (botaoAbrir) {

    botaoAbrir.addEventListener("click", abrirPainel);

}

if (botaoFechar) {

    botaoFechar.addEventListener("click", fecharPainel);

}

if (fundo) {

    fundo.addEventListener("click", fecharPainel);

}


// Fecha o painel ao pressionar ESC
document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape" && painel?.classList.contains("aberto")) {

        fecharPainel();

    }

});


// ==========================================
// ALTERAR TEMA
// ==========================================

if (seletorTema) {

    seletorTema.addEventListener("change", () => {

        configuracoes.tema = seletorTema.value;

        atualizarConfiguracoes();

    });

}


// ==========================================
// ALTERAR TAMANHO DO TEXTO
// ==========================================

if (seletorTexto) {

    seletorTexto.addEventListener("change", () => {

        configuracoes.tamanhoTexto = seletorTexto.value;

        atualizarConfiguracoes();

    });

}


// ==========================================
// ATIVAR ALTO CONTRASTE
// ==========================================

if (opcaoContraste) {

    opcaoContraste.addEventListener("change", () => {

        configuracoes.altoContraste = opcaoContraste.checked;

        atualizarConfiguracoes();

    });

}


// ==========================================
// REDUZIR ANIMAÇÕES
// ==========================================

if (opcaoMovimento) {

    opcaoMovimento.addEventListener("change", () => {

        configuracoes.reduzirMovimento = opcaoMovimento.checked;

        atualizarConfiguracoes();

    });

}


// ==========================================
// RESTAURAR CONFIGURAÇÕES PADRÃO
// ==========================================

if (botaoRestaurar) {

    botaoRestaurar.addEventListener("click", () => {

        configuracoes = { ...configuracoesPadrao };

        atualizarConfiguracoes();

        if (statusConfiguracoes) {

            statusConfiguracoes.textContent =
                "Configurações padrão restauradas.";

        }

    });

}


// ==========================================
// INICIALIZAR CONFIGURAÇÕES
// ==========================================

// Aplica as preferências assim que a página abre
aplicarConfiguracoes();
