const express = require("express");
const router = express.Router();
const Voo = require("../models/Voo");

router.get("/", async (req, res) => {
  try {
    const filtros = {
      origem: req.query.origem,
      destino: req.query.destino,
      companhia: req.query.companhia,
      status: req.query.status,
      data: req.query.data
    };
    
    const voos = await Voo.findAll(filtros);
    
    res.render("voos/index", {
      title: "Gestão de Voos",
      voos,
      filtros,
      activeMenu: "voos"
    });
  } catch (error) {
    console.error("Erro ao listar voos:", error);
    res.status(500).render("error", {
      message: "Erro ao listar voos",
      error
    });
  }
});

router.get("/novo", async (req, res) => {
  try {
    res.render("voos/form", {
      title: "Novo Voo",
      voo: {},
      activeMenu: "voos"
    });
  }
  catch (error) {
    console.error("Erro ao exibir formulário de novo voo:", error);
    res.status(500).render("error", {
      message: "Erro ao exibir formulário",
      error
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const voo = {
      idAeroportoOrigem: parseInt(req.body.idAeroportoOrigem) || null,
      idAeroportoDestino: parseInt(req.body.idAeroportoDestino) || null,
      idAeronave: parseInt(req.body.idAeronave) || null,
      data_hora_partida: req.body.data_hora_partida || null,
      data_hora_chegada: req.body.data_hora_chegada || null,
      status: req.body.status || "Ativo"
    };
    console.log("Dados do voo para criação:", voo);
    
    await Voo.create(voo);
    
    res.redirect("/voos");
  } catch (error) {
    console.error("Erro ao criar voo:", error);
    res.status(500).render("error", {
      message: "Erro ao criar voo",
      error
    });
  }
});

router.get("/:id/editar", async (req, res) => {
  try {
    const voo = await Voo.findById(req.params.id);
    
    if (!voo) {
      return res.status(404).render("error", {
        message: "Voo não encontrado"
      });
    }
    
    res.render("voos/form", {
      title: "Editar Voo",
      voo,
      activeMenu: "voos"
    });
  } catch (error) {
    console.error("Erro ao exibir formulário de edição:", error);
    res.status(500).render("error", {
      message: "Erro ao exibir formulário",
      error
    });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const voo = {
      idAeroportoOrigem: parseInt(req.body.idAeroportoOrigem) || null,
      idAeroportoDestino: parseInt(req.body.idAeroportoDestino) || null,
      idAeronave: parseInt(req.body.idAeronave) || null,
      data_hora_partida: req.body.data_hora_partida || null,
      data_hora_chegada: req.body.data_hora_chegada || null,
      status: req.body.status
    };
    console.log("Dados do voo para atualização:", voo);
    
    await Voo.update(req.params.id, voo);
    
    res.redirect("/voos");
  } catch (error) {
    console.error("Erro ao atualizar voo:", error);
    res.status(500).render("error", {
      message: "Erro ao atualizar voo",
      error
    });
  }
});

router.post("/:id/excluir", async (req, res) => {
  try {
    await Voo.delete(req.params.id);
    res.redirect("/voos");
  } catch (error) {
    console.error("Erro ao excluir voo:", error);
    res.status(500).render("error", {
      message: "Erro ao excluir voo",
      error
    });
  }
});

// API para obter dados de voos em formato JSON (para gráficos)
router.get("/api/estatisticas", async (req, res) => {
  try {
    const estatisticas = await Voo.getEstatisticas();
    res.json(estatisticas);
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
});

module.exports = router;


