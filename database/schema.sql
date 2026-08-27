CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE item (
    id_item SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    foto VARCHAR(255),
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    id_categoria INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,

    CONSTRAINT fk_item_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria),

    CONSTRAINT fk_item_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE emprestimo (
    id_emprestimo SERIAL PRIMARY KEY,
    id_item INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    data_solicitacao DATE NOT NULL DEFAULT CURRENT_DATE,
    data_inicio DATE,
    data_devolucao DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',

    CONSTRAINT fk_emprestimo_item
        FOREIGN KEY (id_item)
        REFERENCES item(id_item),

    CONSTRAINT fk_emprestimo_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE notificacao (
    id_notificacao SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_notificacao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);
