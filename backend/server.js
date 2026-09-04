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

// Teste de conexão com o banco
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
      `INSERT INTO usuario (nome, email, senha, tipo_usuario)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nome, email, tipo_usuario`,
      [name, email, password, "morador"]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao cadastrar usuário"
    })
  }
})

// Cadastrar item
app.post("/items", async (req, res) => {
  try {
    const { name, description, categoryId, userId } = req.body

    if (!name || !categoryId || !userId) {
      return res.status(400).json({
        error: "Nome, categoria e usuário são obrigatórios"
      })
    }

    const result = await pool.query(
      `INSERT INTO item
       (nome, descricao, id_categoria, id_usuario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, categoryId, userId]
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
        categoria.nome AS categoria,
        usuario.nome AS proprietario
       FROM item
       JOIN categoria
         ON item.id_categoria = categoria.id_categoria
       JOIN usuario
         ON item.id_usuario = usuario.id_usuario`
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao listar itens"
    })
  }
})

// Solicitar empréstimo
app.post("/reservations", async (req, res) => {
  try {
    const { itemId, userId, startDate, returnDate } = req.body

    if (!itemId || !userId || !startDate || !returnDate) {
      return res.status(400).json({
        error: "Item, usuário, data de início e data de devolução são obrigatórios"
      })
    }

    const result = await pool.query(
      `INSERT INTO emprestimo
       (id_item, id_usuario, data_inicio, data_devolucao)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [itemId, userId, startDate, returnDate]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao solicitar empréstimo"
    })
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando")
})
