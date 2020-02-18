const express = require("express");
const server = express();

// TEMPLATE ENGINE
const nonjucks = require("nunjucks");
nonjucks.configure("./", {
  express: server,
  noCache: true
});

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

// CONFIGURANDO CONEXÃO COM BD
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "doe"
});

// ROTAS
server.get("/", (req, res) => {
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de banco de dados");

    const donors = result.rows;
    return res.render("index.html", { donors });
  });
});

server.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatorios");
  }

  const query = `
  INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`;
  const values = [name, email, blood];

  db.query(query, values, function(err) {
    if (err) return res.send("Erro no banco de dados");

    return res.redirect("/");
  });
});

//INICIANDO O SERVIDOR
server.listen(3000, () => {
  console.log("servidor rodando");
});
