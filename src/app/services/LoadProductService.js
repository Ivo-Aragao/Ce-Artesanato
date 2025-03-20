const Product = require('../models/Product');
const { formatPrice, date } = require('../../lib/utils');

async function getImages(productId) {

  const productIdNum = Number(productId);
  if (isNaN(productIdNum) || productIdNum <= 0) {
    console.error("🚨 ERRO: ID do produto inválido:", productId);
    return [];
  }

  let files = await Product.files(productIdNum);

  if (!files || files.length === 0) {
    console.warn("⚠️ Nenhuma imagem encontrada para o produto:", productIdNum);
    return [];
  }

  return files
    .filter(file => file?.path)  // Mais simples e seguro
    .map(file => ({
      ...file,
      src: file.path.replace(/\\/g, '/').replace('public', '')
    }));
}

async function format(product) {
  if (!product || !product.id || isNaN(product.id)) {
    console.error("🚨 Produto inválido ou sem ID:", product);
    return null;
  }

  const files = await getImages(product.id);

  product.img = files.length > 0 ? files[0].src : null;
  product.files = files;

  // Formatação de preços
  product.formatedOldPrice = formatPrice(product.old_price || 0);
  product.formatedPrice = formatPrice(product.price || 0);

  // Data de atualização (published)
  const { minutes, hour, day, month } = date(product.updated_at);
  product.published = {
    day: `${day}/${month}`,
    hour: `${hour}h${minutes}`
  };

  // Nova formatação para data de criação (created_at)
  const { 
    minutes: createdMinutes, 
    hour: createdHour, 
    day: createdDay, 
    month: createdMonth 
  } = date(product.created_at);
  
  product.formatedCreatedAt = `${createdDay}/${createdMonth} às ${createdHour}h${createdMinutes}`;

  return product;
}

const LoadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async product() {
    try {
      const product = await Product.findOne(this.filter);
      return product ? format(product) : { error: "Produto não encontrado" }; // Tratamento de erro
    } catch (err) {
      console.error("❌ Erro ao carregar produto:", err);
      return null;
    }
  },
  async products() {
    try {
      const products = await Product.findAll(this.filter);
      return Promise.all(products.map(format));
    } catch (err) {
      console.error("❌ Erro ao carregar produtos:", err);
      return [];
    }
  },
  async productWithDeleted() {
    try {
      const product = await Product.findOneWithDeleted(this.filter);
      return product ? format(product) : { error: "Produto excluído não encontrado" }; // Tratamento de erro
    } catch (err) {
      console.error("❌ Erro ao carregar produto excluído:", err);
      return null;
    }
  },
  format
};

module.exports = LoadService;
