import React, { useState } from 'react';

// Recebemos 'pet' como prop para saber qual animal está sendo adotado
function FormularioAdocao({ goToPerfil, pet }) {
  const [formData, setFormData] = useState({
    localAdequado: '',
    outrosAnimais: '',
    jaTeveAnimais: '',
    motivo: '',
    nomeAnimal: pet ? pet.nome : 'Não especificado' // Pega o nome do pet automaticamente
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ATENÇÃO: Mudamos para localhost para rodar no seu computador
      const response = await fetch('http://localhost:3001/api/adocao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Solicitação para adotar o(a) ${formData.nomeAnimal} enviada com sucesso!`);
        goToPerfil(); 
      } else {
        alert('Houve um erro no envio. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor (Verifique se o backend está rodando).');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Adotar {pet ? pet.nome : 'Pet'} 🐾
      </h2>
      <p style={{ textAlign: 'center', color: '#000000ff', marginBottom: '30px' }}>
        Responda com sinceridade para encontrarmos o par perfeito.
      </p>

      <form onSubmit={handleSubmit}>

        <label style={{ display: 'block', marginBottom: '10px', color: '#000000ff' }}>
          Sua casa possui espaço adequado e seguro?
        </label>
        <select
          name="localAdequado"
          value={formData.localAdequado}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Selecione...</option>
          <option value="sim">Sim, é telada/murada</option>
          <option value="nao">Não, é aberta</option>
          <option value="apto">Moro em apartamento telado</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px', color: '#000000ff' }}>
          Possui outros animais?
        </label>
        <select
          name="outrosAnimais"
          value={formData.outrosAnimais}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Selecione...</option>
          <option value="nao">Não</option>
          <option value="sim_gatos">Sim, gatos</option>
          <option value="sim_caes">Sim, cães</option>
          <option value="sim_roedores">Sim, roedores</option>
          <option value="sim_aves">Sim, aves</option>
          <option value="sim_outros">Sim, outros</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px', color: '#000000ff' }}>
          Já teve outros animais antes?
        </label>
        <select
          name="jaTeveAnimais"
          value={formData.jaTeveAnimais}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Selecione...</option>
          <option value="sim">Sim</option>
          <option value="nao">Não, é o primeiro</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px', color: '#000000ff' }}>
          Por que você quer adotar?
        </label>
        <textarea
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          className="input-field"
          placeholder="Conte um pouco sobre sua rotina..."
          rows="3"
        />

        <button type="submit" className="btn-primary">
          Enviar Solicitação
        </button>

        <p className="link-text" onClick={goToPerfil} style={{cursor: 'pointer', textAlign: 'center', marginTop: '10px'}}>
          Cancelar e Voltar
        </p>

      </form>
    </div>
  );
}

export default FormularioAdocao;