
// ==========================================
// ELEMENTOS DOS FORMULÁRIOS
// ==========================================

const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");

const loginForm = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");

const erroLogin = document.getElementById("erroLogin");
const erroEmail = document.getElementById("erroEmail");


// ==========================================
// ALTERNAR ENTRE LOGIN E CADASTRO
// ==========================================

document.getElementById("abrirCadastro").addEventListener("click", (evento) => {
    evento.preventDefault();

    formLogin.hidden = true;
    formCadastro.hidden = false;

    erroEmail.textContent = "";
});

document.getElementById("voltarLogin").addEventListener("click", (evento) => {
    evento.preventDefault();

    formCadastro.hidden = true;
    formLogin.hidden = false;

    erroLogin.textContent = "";
});


// ==========================================
// CADASTRO DE USUÁRIO
// ==========================================

cadastroForm.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim().toLowerCase();
    const senha = document.getElementById("senhaCadastro").value;

    // Limpa o aviso anterior
    erroEmail.textContent = "";

    // Recupera os usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o e-mail já está cadastrado
    const existe = usuarios.some(usuario =>
        usuario.email.trim().toLowerCase() === email
    );

    // Exibe o aviso se o e-mail já existir
    if (existe) {
        erroEmail.textContent = "Este e-mail já está cadastrado.";
        return;
    }

    // Salva o novo usuário
    usuarios.push({
        nome: nome,
        email: email,
        senha: senha
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Limpa o formulário
    cadastroForm.reset();

    // Volta para o login
    formCadastro.hidden = true;
    formLogin.hidden = false;
});


// ==========================================
// LIMPAR AVISO DO CADASTRO
// ==========================================

document.getElementById("emailCadastro").addEventListener("input", () => {
    erroEmail.textContent = "";
});


// ==========================================
// LOGIN DE USUÁRIO
// ==========================================

loginForm.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;

    // Recupera os usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Procura o usuário cadastrado
    const usuario = usuarios.find(item =>
        item.email.trim().toLowerCase() === email &&
        item.senha === senha
    );

    // Verifica se os dados estão corretos
    if (!usuario) {
        erroLogin.textContent = "E-mail ou senha incorretos.";
        return;
    }

    // Limpa o aviso
    erroLogin.textContent = "";

    // Salva o usuário conectado
    localStorage.setItem("usuarioLogado", usuario.nome);

    // Redireciona para a página inicial
    window.location.href = "inicio.html";
});


// ==========================================
// LIMPAR AVISOS DO LOGIN AO DIGITAR
// ==========================================

document.getElementById("email").addEventListener("input", () => {
    erroLogin.textContent = "";
});

document.getElementById("senha").addEventListener("input", () => {
    erroLogin.textContent = "";
});
