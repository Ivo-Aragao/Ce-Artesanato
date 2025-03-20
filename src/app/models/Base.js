const db = require('../../config/db');

function find(filters, table) {
  let query = `SELECT * FROM ${table}`;

  if (filters) {
    Object.keys(filters).forEach(key => {
      query += ` ${key}`;
      Object.keys(filters[key]).forEach(field => {
        query += ` ${field} = '${filters[key][field]}' `;
      });
    });
  }

  return db.query(query);
}

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid Params!');
    this.table = table;
    return this;
  },

  async find(id) {
    try {
      const results = await find({ where: { id } }, this.table);
      return this._formatPaths(results.rows[0]);
    } catch (err) {
      console.error(err);
    }
  },

  async findOne(filters) {
    const results = await find(filters, this.table);
    return this._formatPaths(results.rows[0]);
  },

  async findAll(filters) {
    const results = await find(filters, this.table);
    return results.rows.map(this._formatPaths);
  },

  async findOneWithDeleted(filters) {
    const results = await find(filters, `${this.table}_with_deleted`);
    return this._formatPaths(results.rows[0]);
  },

  async create(fields) {
    try {
      let keys = [], values = [];

      Object.keys(fields).forEach(key => {
        let value = fields[key];

        // Corrige caminhos de arquivos antes de salvar no banco
        if (typeof value === 'string' && value.includes('\\')) {
          value = value.replace(/\\/g, '/');
        }

        keys.push(key);
        values.push(`'${value}'`);
      });

      const query = `
        INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id
      `;

      const results = await db.query(query);
      return results.rows[0].id;
    } catch (err) {
      console.error(err);
    }
  },

  update(id, fields) {
    try {
      let update = [];

      Object.keys(fields).forEach(key => {
        let value = fields[key];

        // Corrige caminhos de arquivos antes de atualizar no banco
        if (typeof value === 'string' && value.includes('\\')) {
          value = value.replace(/\\/g, '/');
        }

        update.push(`${key} = '${value}'`);
      });

      const query = `
        UPDATE ${this.table} SET
        ${update.join(',')}
        WHERE id = ${id}
      `;

      return db.query(query);
    } catch (err) {
      console.error(err);
    }
  },

  delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  },

  _formatPaths(item) {
    if (!item) return null;

    // Corrige caminhos de arquivos ao recuperar dados do banco
    if (item.path && typeof item.path === 'string') {
      item.path = item.path.replace(/\\/g, '/');
    }

    return item;
  }
};

module.exports = Base;
