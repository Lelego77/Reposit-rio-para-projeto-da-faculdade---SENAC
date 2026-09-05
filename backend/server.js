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


// Listar itens disponíveis
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
// RESERVAS EXISTENTES
// ==========================================

app.get("/reservations", async (req, res) => {
  try {
    const { itemId } = req.query

    let query = `
      SELECT
        emprestimo.id_emprestimo,
        emprestimo.id_item,
        emprestimo.id_usuario,
        emprestimo.data_inicio,
        emprestimo.data_devolucao,
        emprestimo.status,
        usuario.nome AS solicitante
      FROM emprestimo
      JOIN usuario
        ON emprestimo.id_usuario = usuario.id_usuario
      WHERE emprestimo.status = 'pendente'
    `

    const params = []

    if (itemId) {
      query += ` AND emprestimo.id_item = $1`
      params.push(itemId)
    }

    query += `
      ORDER BY emprestimo.data_inicio
    `

    const result = await pool.query(query, params)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao listar reservas"
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

    // Data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0]

    // Não permitir datas anteriores a hoje
    if (startDate < today) {
      return res.status(400).json({
        error:
          "A data de início não pode ser anterior à data de hoje."
      })
    }

    // A devolução não pode ser anterior ao início
    if (returnDate < startDate) {
      return res.status(400).json({
        error:
          "A data de devolução não pode ser anterior à data de início."
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


    // ==========================================
    // VERIFICAR CONFLITO DE DATAS
    // ==========================================

    const conflictResult = await pool.query(
      `SELECT
        id_emprestimo,
        data_inicio,
        data_devolucao
       FROM emprestimo
       WHERE id_item = $1
       AND status = 'pendente'
       AND data_inicio <= $3
       AND data_devolucao >= $2`,
      [
        itemId,
        startDate,
        returnDate
      ]
    )

    if (conflictResult.rows.length > 0) {
      return res.status(400).json({
        error:
          "Este item já está reservado para parte ou todo o período informado."
      })
    }


    // ==========================================
    // CRIAR EMPRÉSTIMO
    // ==========================================

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


    // ==========================================
    // CRIAR NOTIFICAÇÃO
    // ==========================================

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
