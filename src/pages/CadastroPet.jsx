// CadastroPet.jsx - CÓDIGO COMPLETO E AJUSTADO

import React, { useState } from 'react';

// Recebe a função para salvar no backend (aoSalvar) e a função para cancelar (aoCancelar)
function CadastroPet({ aoSalvar, aoCancelar }) {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    tipo: 'Cachorro', // Valor padrão
    descricao: '',
    imagemUrl: '',
    // --- NOVOS CAMPOS ADICIONADOS ---
    raca: '',
    porte: 'Médio',
    vacinas: false, // Inicia como Não Vacinado
    localizacao: 'Abrigo'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Lida com checkboxes para o campo 'vacinas'
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verifica se a imagemUrl não é nula, senão o Pet não será visível
    if (!formData.imagemUrl) {
      alert("Por favor, insira a URL da foto do pet.");
      return;
    }
    // Envia os dados completos para o App.jsx
    aoSalvar(formData); 
  };

  return (
    <div className="form-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Cadastrar Novo Pet</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Nome */}
        <input
          type="text"
          name="nome"
          placeholder="Nome do Pet"
          value={formData.nome}
          onChange={handleChange}
          required
          className="input-field"
        />

        {/* Idade */}
        <input
          type="text"
          name="idade"
          placeholder="Idade (ex: 2 anos)"
          value={formData.idade}
          onChange={handleChange}
          required
          className="input-field"
        />

        {/* Raça (NOVO) */}
        <input
          type="text"
          name="raca"
          placeholder="Raça (ex: Poodle, SRD)"
          value={formData.raca}
          onChange={handleChange}
          className="input-field"
        />

        {/* Tipo */}
        <select name="tipo" value={formData.tipo} onChange={handleChange} className="input-field">
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Outro">Outro</option>
        </select>
        
        {/* Porte (NOVO) */}
        <select name="porte" value={formData.porte} onChange={handleChange} className="input-field">
          <option value="Pequeno">Pequeno</option>
          <option value="Médio">Médio</option>
          <option value="Grande">Grande</option>
        </select>

        {/* Localização (NOVO) */}
        <input
          type="text"
          name="localizacao"
          placeholder="Localização (ex: Abrigo, Casa de Lar Temporário)"
          value={formData.localizacao}
          onChange={handleChange}
          className="input-field"
        />


        {/* Checkbox Vacinado (NOVO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
                type="checkbox"
                name="vacinas"
                id="vacinas"
                checked={formData.vacinas}
                onChange={handleChange}
            />
            <label htmlFor="vacinas" style={{ color: '#ffffff' }}>Vacinado?</label>
        </div>


        {/* Descrição */}
        <textarea
          name="descricao"
          placeholder="Descrição breve sobre o pet..."
          value={formData.descricao}
          onChange={handleChange}
          rows="4"
          className="input-field"
        />

        {/* URL da Imagem */}
        <input
          type="text"
          name="imagemUrl"
          placeholder="URL da foto (http://...)"
          value={formData.imagemUrl}
          onChange={handleChange}
          required
          className="input-field"
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            Salvar Pet
          </button>
          <button type="button" onClick={aoCancelar} className="btn-secondary" style={{ flex: 1 }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroPet;