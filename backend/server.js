const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let users = []
let items = []
let reservations = []

// cadastrar usuário
app.post("/users", (req,res)=>{

const user = {
id: Date.now(),
name:req.body.name,
email:req.body.email
}

users.push(user)

res.json(user)

})

// cadastrar item
app.post("/items",(req,res)=>{

const item = {
id: Date.now(),
name:req.body.name
}

items.push(item)

res.json(item)

})

// listar itens
app.get("/items",(req,res)=>{
res.json(items)
})

// reservar item
app.post("/reservations",(req,res)=>{

const reservation = {
id: Date.now(),
itemId:req.body.itemId,
userId:req.body.userId,
date:req.body.date
}

reservations.push(reservation)

res.json(reservation)

})

app.listen(3000,()=>{
console.log("Servidor rodando na porta 3000")
})