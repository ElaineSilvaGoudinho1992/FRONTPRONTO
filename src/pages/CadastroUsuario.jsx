// CadastroUsuario.jsx - CÓDIGO COMPLETO E AJUSTADO

import React, { useState } from 'react';

function CadastroUsuario({ goToLogin }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', telefone: '', endereco: '', cpf: '', rendaMensal: '',
    tipoUsuario: 'Adotante' // <--- NOVO CAMPO COM VALOR PADRÃO
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3001/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
            alert('Cadastro realizado! Faça login.');
            goToLogin();
        } else {
            alert('Erro: ' + data.message);
        }
    } catch (error) {
        console.error("Erro:", error);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome Completo" className="input-field" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="input-field" onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" className="input-field" onChange={handleChange} required />
        <input type="tel" name="telefone" placeholder="Telefone" className="input-field" onChange={handleChange} required />
        <input type="text" name="endereco" placeholder="Endereço" className="input-field" onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" className="input-field" onChange={handleChange} required />
        
        {/* NOVO CAMPO: Tipo de Usuário */}
        {/* <label style={{ display: 'block', marginBottom: '5px', color: '#000000ff', fontSize: '0.9em' }}>
            Tipo de Conta:
        </label>
        <select 
            name="tipoUsuario" 
            value={formData.tipoUsuario} 
            onChange={handleChange} 
            className="input-field"
            required
        >
            <option value="Adotante">Adotante (Busca um pet)</option>
            <option value="Admin">Administrador (Abrigo/ONG)</option>
        </select> */}
        {/* FIM NOVO CAMPO */}
        
        <button type="submit" className="btn-primary">Cadastrar</button>
        
        <p className="link-text" onClick={goToLogin}>
          Já tem conta? Entrar
        </p>
      </form>
    </div>
  );
}

export default CadastroUsuario;