const LoadProductsService = require('../services/LoadProductService');

module.exports = {
  async index(req, res) {
    try {
      const allProducts = await LoadProductsService.load('products');

      // Obtém a página atual a partir da query string (ex: ?page=2)
      let { page } = req.query;
      page = page ? Number(page) : 1; // Se não informado, assume a página 1

      const limit = 9; // Exibir 9 produtos por página
      const offset = (page - 1) * limit; // Calcula o início dos produtos

      // Filtra os produtos para a página atual
      const products = allProducts.slice(offset, offset + limit);

      // Calcula o total de páginas
      const totalPages = Math.ceil(allProducts.length / limit);

      return res.render('templates/home/index', {
        products,
        totalPages,
        currentPage: page
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Erro ao carregar produtos.");
    }
  }
};
