const express = require('express');
const router = express.Router();
const Voo = require('../models/Voo');

router.get('/', async (req, res) => {
  try {
    const estatisticas = await Voo.getEstatisticas();
    
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
