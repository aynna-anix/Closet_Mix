-- =========================================================
-- CLOSET MIX - BANCO DE DADOS MYSQL
-- Projeto academico: brecho virtual
-- Script para executar no MySQL Workbench
--
-- IMPORTANTE:
-- Este script estrutura o banco e registra pedidos/pagamentos.
-- O pagamento e demonstrativo: nao processa dinheiro real.
-- Nao armazene numero completo do cartao, CVV ou senha.
-- Para pagamentos reais, utilize um gateway/provedor seguro.
-- =========================================================

CREATE DATABASE IF NOT EXISTS closet_mix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE closet_mix;

-- Para reapresentar o script do zero, descomente as linhas abaixo
-- (ATENCAO: apaga os dados existentes).
-- DROP DATABASE closet_mix;
-- CREATE DATABASE closet_mix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE closet_mix;

-- =========================================================
-- 1. USUARIOS
-- =========================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- 2. ENDERECOS
-- =========================================================
CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    cep VARCHAR(10),
    rua VARCHAR(150),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 3. CATEGORIAS
-- =========================================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    descricao TEXT
) ENGINE=InnoDB;

-- =========================================================
-- 4. PRODUTOS
-- =========================================================
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    tamanho VARCHAR(30),
    marca VARCHAR(100),
    condicao ENUM('novo', 'seminovo', 'usado') NOT NULL DEFAULT 'usado',
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    imagem VARCHAR(255),
    status ENUM('disponivel', 'reservado', 'vendido', 'inativo')
        NOT NULL DEFAULT 'disponivel',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_produto_preco CHECK (preco >= 0),
    CONSTRAINT chk_produto_quantidade CHECK (quantidade >= 0),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 5. CARRINHOS
-- =========================================================
CREATE TABLE IF NOT EXISTS carrinhos (
    id_carrinho INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 6. ITENS DO CARRINHO
-- =========================================================
CREATE TABLE IF NOT EXISTS itens_carrinho (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_carrinho INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    UNIQUE KEY uk_carrinho_produto (id_carrinho, id_produto),
    CONSTRAINT chk_item_carrinho_quantidade CHECK (quantidade > 0),
    FOREIGN KEY (id_carrinho) REFERENCES carrinhos(id_carrinho)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 7. PEDIDOS
-- =========================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_endereco INT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    valor_frete DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    desconto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(10,2) NOT NULL,
    status ENUM(
        'aguardando_pagamento',
        'pago',
        'em_separacao',
        'enviado',
        'entregue',
        'cancelado'
    ) NOT NULL DEFAULT 'aguardando_pagamento',
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES enderecos(id_endereco)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_pedido_valores CHECK (
        subtotal >= 0 AND valor_frete >= 0 AND desconto >= 0 AND valor_total >= 0
    )
) ENGINE=InnoDB;

-- =========================================================
-- 8. ITENS DO PEDIDO
-- Guarda nome e preco da compra para manter o historico,
-- mesmo se o produto for alterado depois.
-- =========================================================
CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NULL,
    nome_produto VARCHAR(150) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    total_item DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_item_pedido_quantidade CHECK (quantidade > 0),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- 9. PAGAMENTOS
-- Nao guardar dados completos de cartao ou codigo de seguranca.
-- referencia_transacao pode guardar o identificador retornado
-- por um provedor de pagamento quando houver integracao real.
-- =========================================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    metodo ENUM(
        'pix',
        'cartao_credito',
        'cartao_debito',
        'boleto'
    ) NOT NULL,
    status ENUM(
        'pendente',
        'aprovado',
        'recusado',
        'estornado'
    ) NOT NULL DEFAULT 'pendente',
    valor DECIMAL(10,2) NOT NULL,
    referencia_transacao VARCHAR(150) NULL,
    data_pagamento TIMESTAMP NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_pagamento_valor CHECK (valor >= 0)
) ENGINE=InnoDB;

-- =========================================================
-- 10. FAVORITOS
-- =========================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_produto INT NOT NULL,
    data_adicao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_favorito_usuario_produto (id_usuario, id_produto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- DADOS INICIAIS DE CATEGORIAS
-- =========================================================
INSERT IGNORE INTO categorias (nome, descricao) VALUES
('Blusas', 'Blusas, camisetas e croppeds'),
('Calcas', 'Calcas e jeans'),
('Vestidos', 'Vestidos de diferentes estilos'),
('Saias', 'Saias de diferentes modelos'),
('Casacos', 'Jaquetas, casacos e moletons'),
('Acessorios', 'Bolsas, cintos e acessorios'),
('Calcados', 'Tenis, botas e sapatos');

-- =========================================================
-- CONSULTAS PARA CONFERIR O BANCO
-- =========================================================
SHOW TABLES;

SELECT * FROM categorias;
SELECT * FROM usuarios;
SELECT * FROM produtos;
SELECT * FROM pedidos;
SELECT * FROM pagamentos;

-- =========================================================
-- FLUXO DE FINALIZACAO DA COMPRA (MODELO)
-- =========================================================
-- O backend deve executar este fluxo usando uma transacao:
--
-- 1. Conferir se o usuario esta autenticado.
-- 2. Buscar os itens do carrinho daquele usuario.
-- 3. Conferir disponibilidade e quantidade de cada produto.
-- 4. Calcular subtotal, frete, desconto e total no servidor.
-- 5. Criar um registro em pedidos com status
--    'aguardando_pagamento'.
-- 6. Copiar os itens para itens_pedido com o preco vigente.
-- 7. Criar pagamentos com metodo escolhido e status 'pendente'.
-- 8. Enviar a solicitacao ao provedor de pagamento (quando real).
-- 9. Somente apos confirmacao confiavel do provedor:
--    atualizar pagamentos para 'aprovado',
--    pedidos para 'pago' e baixar o estoque.
-- 10. Limpar os itens do carrinho.
--
-- Para uma demonstracao escolar sem gateway, pode-se registrar
-- pagamento pendente ou simulado, deixando claro que nao houve
-- cobranca real. Nunca marcar como pago apenas porque o usuario
-- clicou no botao.
-- =========================================================
