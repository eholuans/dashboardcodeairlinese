const express = require('express');
const router = express.Router();
const Voo = require('../models/Voo');

// Rota para a página principal do dashboard
router.get('/', async (req, res) => {
  try {
    // Obter estatísticas para o dashboard
    const estatisticas = await Voo.getEstatisticas();
    
    // Obter alguns voos recentes para exibir no dashboard
    const voosRecentes = await Voo.findAll({ limit: 4 });
    
    res.render('dashboard', {
      title: 'Dashboard',
      estatisticas,
      voosRecentes,
      activeMenu: 'dashboard'
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar dashboard',
      error
    });
  }
});

module.exports = router;
