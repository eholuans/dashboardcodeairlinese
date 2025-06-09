const { pool } = require("../config/database");

class Voo {
  /**
   * Busca um voo pelo ID
   * @param {number} id - ID do voo
   * @returns {Promise<Object|null>} - Dados do voo ou null se não encontrado
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT v.*, 
               o.nome AS origem_nome, 
               d.nome AS destino_nome,
               c.nome AS companhia_nome,
               c.código_IATA AS companhia_codigo_iata
        FROM voo v
        LEFT JOIN aeroporto o ON v.idAeroportoOrigem = o.idAeroporto
        LEFT JOIN aeroporto d ON v.idAeroportoDestino = d.idAeroporto
        LEFT JOIN aeronave a ON v.idAeronave = a.idAeronave
        LEFT JOIN companhiaaerea c ON a.idCompanhia = c.idCompanhia
        WHERE v.idVoo = ?
      `, [id]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar voo por ID:", error);
      throw error;
    }
  }

  /**
   * Lista todos os voos com detalhes
   * @param {Object} filtros - Filtros para a busca
   * @returns {Promise<Array>} - Lista de voos
   */
  static async findAll(filtros = {}) {
    try {
      let query = `
        SELECT v.*, 
               o.nome AS origem_nome, o.código_IATA AS origem_codigo_iata,
               d.nome AS destino_nome, d.código_IATA AS destino_codigo_iata,
               c.nome AS companhia_nome, c.código_IATA AS companhia_codigo_iata
        FROM voo v
        LEFT JOIN aeroporto o ON v.idAeroportoOrigem = o.idAeroporto
        LEFT JOIN aeroporto d ON v.idAeroportoDestino = d.idAeroporto
        LEFT JOIN aeronave a ON v.idAeronave = a.idAeronave
        LEFT JOIN companhiaaerea c ON a.idCompanhia = c.idCompanhia
        WHERE 1=1
      `;
      
      const params = [];
      
      // Aplicar filtros se fornecidos
      if (filtros.origem) {
        query += ' AND o.código_IATA = ?';
        params.push(filtros.origem);
      }
      
      if (filtros.destino) {
        query += ' AND d.código_IATA = ?';
        params.push(filtros.destino);
      }
      
      if (filtros.companhia) {
        query += ' AND c.código_IATA = ?';
        params.push(filtros.companhia);
      }
      
      if (filtros.status) {
        query += ' AND v.status = ?';
        params.push(filtros.status);
      }
      
      if (filtros.data) {
        query += ' AND DATE(v.data_hora_partida) = ?';
        params.push(filtros.data);
      }
      
      // Ordenação
      query += ' ORDER BY v.data_hora_partida ASC';
      
      // Limite e offset para paginação
      if (filtros.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filtros.limit));
        
        if (filtros.offset) {
          query += ' OFFSET ?';
          params.push(parseInt(filtros.offset));
        }
      }
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erro ao listar voos:', error);
      throw error;
    }
  }

  /**
   * Cria um novo voo
   * @param {Object} voo - Dados do voo
   * @returns {Promise<Object>} - Voo criado com ID
   */
  static async create(voo) {
    try {
      const {
        idAeroportoOrigem,
        idAeroportoDestino,
        idAeronave,
        data_hora_partida,
        data_hora_chegada,
        status
      } = voo;
      
      console.log("Parâmetros para criação de voo:", [idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status]);

      const [result] = await pool.execute(
        `INSERT INTO voo 
         (idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status]
      );
      
      return { idVoo: result.insertId, ...voo };
    } catch (error) {
      console.error('Erro ao criar voo:', error);
      throw error;
    }
  }

  /**
   * Atualiza um voo existente
   * @param {number} id - ID do voo
   * @param {Object} voo - Dados atualizados do voo
   * @returns {Promise<Object>} - Voo atualizado
   */
  static async update(id, voo) {
    try {
      const {
        idAeroportoOrigem,
        idAeroportoDestino,
        idAeronave,
        data_hora_partida,
        data_hora_chegada,
        status
      } = voo;
      
      console.log("Parâmetros para atualização de voo:", [idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status, id]);

      await pool.execute(
        `UPDATE voo SET 
         idAeroportoOrigem = ?, 
         idAeroportoDestino = ?, 
         idAeronave = ?, 
         data_hora_partida = ?, 
         data_hora_chegada = ?, 
         status = ? 
         WHERE idVoo = ?`,
        [idAeroportoOrigem, idAeroportoDestino, idAeronave, data_hora_partida, data_hora_chegada, status, id]
      );
      
      return { idVoo: id, ...voo };
    } catch (error) {
      console.error('Erro ao atualizar voo:', error);
      throw error;
    }
  }

  /**
   * Remove um voo
   * @param {number} id - ID do voo
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Excluir registros dependentes em bagagem
      await connection.execute('DELETE FROM bagagem WHERE idVoo = ?', [id]);
      // Excluir registros dependentes em bilhete
      await connection.execute('DELETE FROM bilhete WHERE idVoo = ?', [id]);
      // Excluir registros dependentes em checkinembarque
      await connection.execute('DELETE FROM checkinembarque WHERE idVoo = ?', [id]);
      // Excluir registros dependentes em escala_tripulacao
      await connection.execute('DELETE FROM escala_tripulacao WHERE idVoo = ?', [id]);
      // Excluir registros dependentes em historicoatrasos
      await connection.execute('DELETE FROM historicoatrasos WHERE idVoo = ?', [id]);

      // Agora, excluir o voo
      const [result] = await connection.execute('DELETE FROM voo WHERE idVoo = ?', [id]);
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Erro ao remover voo:', error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * Obtém estatísticas de voos
   * @returns {Promise<Object>} - Estatísticas de voos
   */
  static async getEstatisticas() {
    try {
      // Total de voos
      const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM voo');
      
      // Voos por status
      const [statusRows] = await pool.execute(`
        SELECT status, COUNT(*) as total 
        FROM voo 
        GROUP BY status
      `);
      
      // Voos por companhia
      const [companhiaRows] = await pool.execute(`
        SELECT c.nome, COUNT(*) as total 
        FROM voo v
        JOIN aeronave a ON v.idAeronave = a.idAeronave
        JOIN companhiaaerea c ON a.idCompanhia = c.idCompanhia
        GROUP BY c.idCompanhia
      `);
      
      // Voos por período do dia (manhã, tarde, noite)
      const [periodoRows] = await pool.execute(`
        SELECT 
          CASE 
            WHEN HOUR(data_hora_partida) BETWEEN 6 AND 11 THEN 'Manhã'
            WHEN HOUR(data_hora_partida) BETWEEN 12 AND 17 THEN 'Tarde'
            ELSE 'Noite'
          END as periodo,
          COUNT(*) as total
        FROM voo
        GROUP BY periodo
      `);
      
      return {
        total: totalRows[0].total,
        porStatus: statusRows,
        porCompanhia: companhiaRows,
        porPeriodo: periodoRows
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de voos:', error);
      throw error;
    }
  }
}

module.exports = Voo;


