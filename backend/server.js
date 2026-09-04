const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})


// ==========================================
// TESTE DO BACKEND + BANCO
// ==========================================

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")

    res.json({
      message: "Backend funcionando!",
      database: "Conectado",
      time: result.rows[0].now
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao conectar com o banco"
    })
  }
})


// ==========================================
// USUÁRIOS
// ==========================================

// Listar usuários
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id_usuario,
        nome,
        email,
        tipo_usuario
       FROM usuario
       ORDER BY nome`
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao listar usuários"
    })
  }
})


// Cadastrar usuário
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Nome, email e senha são obrigatórios"
      })
    }

    const result = await pool.query(
      `INSERT INTO usuario
       (nome, email, senha, tipo_usuario)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nome, email, tipo_usuario`,
      [name, email, password, "morador"]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)

    if (error.code === "23505") {
      return res.status(400).json({
        error: "Este e-mail já está cadastrado."
      })
    }

    res.status(500).json({
      error: "Erro ao cadastrar usuário"
    })
  }
})


// ==========================================
// CATEGORIAS
// ==========================================

app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id_categoria,
        nome
       FROM categoria
       ORDER BY nome`
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao listar categorias"
    })
  }
})


// ==========================================
// ITENS
// ==========================================

// Cadastrar item
app.post("/items", async (req, res) => {
  try {
    const {
      name,
      description,
      categoryId,
      userId
    } = req.body

    if (!name || !categoryId || !userId) {
      return res.status(400).json({
        error: "Nome, categoria e usuário são obrigatórios"
      })
    }

    const result = await pool.query(
      `INSERT INTO item
       (
         nome,
         descricao,
         id_categoria,
         id_usuario
       )
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name,
        description || null,
        categoryId,
        userId
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao cadastrar item"
    })
  }
})


// Listar itens
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        item.id_item,
        item.nome,
        item.descricao,
        item.foto,
        item.disponivel,
        categoria.id_categoria,
        categoria.nome AS categoria,
        usuario.id_usuario,
        usuario.nome AS proprietario
       FROM item
       JOIN categoria
         ON item.id_categoria = categoria.id_categoria
       JOIN usuario
         ON item.id_usuario = usuario.id_usuario
       WHERE item.disponivel = TRUE
       ORDER BY item.id_item DESC`
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao listar itens"
    })
  }
})


// ==========================================
// EMPRÉSTIMOS
// ==========================================

app.post("/reservations", async (req, res) => {
  try {
    const {
      itemId,
      userId,
      startDate,
      returnDate
    } = req.body

    if (!itemId || !userId || !startDate || !returnDate) {
      return res.status(400).json({
        error:
          "Item, usuário, data de início e data de devolução são obrigatórios"
      })
    }

    if (returnDate < startDate) {
      return res.status(400).json({
        error:
          "A data de devolução deve ser posterior à data de início."
      })
    }

    // Verificar se o item existe e está disponível
    const itemResult = await pool.query(
      `SELECT
        id_item,
        nome,
        id_usuario
       FROM item
       WHERE id_item = $1
       AND disponivel = TRUE`,
      [itemId]
    )

    if (itemResult.rows.length === 0) {
      return res.status(400).json({
        error: "Este item não está disponível."
      })
    }

    const item = itemResult.rows[0]

    // Criar empréstimo
    const loanResult = await pool.query(
      `INSERT INTO emprestimo
       (
         id_item,
         id_usuario,
         data_inicio,
         data_devolucao,
         status
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        itemId,
        userId,
        startDate,
        returnDate,
        "pendente"
      ]
    )

    // Criar notificação para o proprietário
    await pool.query(
      `INSERT INTO notificacao
       (
         id_usuario,
         mensagem
       )
       VALUES ($1, $2)`,
      [
        item.id_usuario,
        `Nova solicitação de empréstimo para o item "${item.nome}".`
      ]
    )

    res.status(201).json({
      message: "Solicitação de empréstimo enviada!",
      reservation: loanResult.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao solicitar empréstimo"
    })
  }
})


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando")
})
