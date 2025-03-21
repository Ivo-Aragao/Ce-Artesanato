const express = require('express');
const router = express.Router();
const ProductController = require('../app/controllers/ProductController.js');

// Rota genérica: redireciona "/checkout" para "/checkout/credit-card"
router.get('/checkout', (req, res) => {
  res.redirect('/checkout/credit-card');
});

// Rota para exibir o checkout com Cartão de Crédito
router.get('/checkout/credit-card', ProductController.checkoutCreditCard);

// Rota para exibir o checkout com PIX
router.get('/checkout/pix', ProductController.checkoutPix);

// Rota para processar pagamento (simulado)
router.post('/payment/process', (req, res) => {
  // Aqui você integraria com o gateway de pagamento real
  const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  // Limpar carrinho
  req.session.cart = { items: [], total: 0 };
  
  res.redirect(`/payment/success/${orderId}`);
});

// Rota de sucesso
router.get('/payment/success/:orderId', (req, res) => {
  res.render('templates/payment/success', {
    orderId: req.params.orderId
  });
});

module.exports = router;
