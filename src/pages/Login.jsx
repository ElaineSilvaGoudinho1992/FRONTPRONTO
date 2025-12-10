// Login.jsx - CÓDIGO COMPLETO E AJUSTADO PARA SER GENÉRICO

import React, { useState } from 'react';

// Recebe onLoginSuccess, goToCadastro e NOVOS props: title, showBack, goToBack
function Login({ goToCadastro, onLoginSuccess, title, showBack, goToBack }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://backpronto.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (data.success) {
        // Sucesso: Passa os dados do usuário (incluindo isAdmin) para o App.jsx
        console.log("Usuário logado:", data.user);
        onLoginSuccess(data.user); 
      } else {
        // Erro
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = (e) => {
    e.preventDefault();
    alert('Função de recuperar senha será implementada em breve.');
  };

  return (
    <div className="form-container">
        
      {showBack && goToBack && (
          <button
              onClick={goToBack}
              style={{
                  position: 'absolute', top: 20, left: 20, background: 'transparent',
                  border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', zIndex: 10
              }}
          >
              ⬅
          </button>
      )}

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isRecovering ? 'Recuperar Senha' : (title || 'Bem-vindo de volta!')}
      </h2>

      {isRecovering ? (
        // ... (Recuperação de Senha) ...
        <form onSubmit={handleRecover}>
          <input
            type="email"
            placeholder="Digite seu email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn-primary">Enviar Link</button>
          <p className="link-text" onClick={() => setIsRecovering(false)}>
            Voltar ao Login
          </p>
        </form>
      ) : (
        // ... (Formulário de Login) ...
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Seu email cadastrado"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Sua senha"
            className="input-field"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

                 <p className="link-text" onClick={goToCadastro}>
                Não tem conta? Cadastre-se
              </p>
              <p className="link-text" onClick={() => setIsRecovering(true)}>
                Esqueceu a senha?
              </p>
        </form>
      )}
    </div>
  );
}

export default Login;
