import React, { useState, useEffect } from 'react';
import './App.css';

// Certifique-se que estes arquivos existem na pasta pages
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import PerfilAnimal from './pages/PerfilAnimal';
import FormularioAdocao from './pages/FormularioAdocao';
import ListaAnimais from './pages/ListaAnimais';
import CadastroPet from './pages/CadastroPet';
import PainelAdmin from './pages/PainelAdmin';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [listaPets, setListaPets] = useState([]);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Se estiver na home, tenta carregar os pets.
    if (currentPage === 'home') {
      fetchPets();
    }
  }, [currentPage]);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/pets');
      if (!response.ok) throw new Error('Falha ao conectar com o servidor');
      const data = await response.json();
      setListaPets(data);
    } catch (err) {
      console.error("Erro ao buscar pets:", err);
      setError("Não foi possível carregar os animais.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO PARA SALVAR O PET ---
  const handleCreatePet = async (novoPet) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPet)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Pet cadastrado com sucesso!');
        await fetchPets();
        setCurrentPage('home');
      } else {
        const errorMessage = data.message || 'Erro ao cadastrar pet.';
        alert('Erro ao cadastrar pet: ' + errorMessage);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão ao salvar (Verifique o servidor).');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPet = (pet) => {
    setPetSelecionado(pet);
    setCurrentPage('perfilAnimal');
  };

  const renderPage = () => {
    switch (currentPage) {

      case 'login': // LOGIN PRINCIPAL (USUÁRIO COMUM)
        return (
          <Login
            goToCadastro={() => setCurrentPage('cadastro')}
            onLoginSuccess={(userData) => {
              setUser(userData);
              fetchPets();
              setCurrentPage('home');
            }}
            title="Acesso de Usuário"
          />
        );

      case 'cadastro':
        return <CadastroUsuario goToLogin={() => setCurrentPage('login')} />;

      case 'adminLogin': // TELA DE LOGIN EXCLUSIVA PARA ADMIN
        return (
          <Login
            goToCadastro={() => setCurrentPage('cadastro')}
            onLoginSuccess={(userData) => {
              if (userData && userData.isAdmin) {
                setUser(userData);
                setCurrentPage('admin');
              } else {
                alert('Acesso negado. Apenas administradores podem acessar.');
                setCurrentPage('login'); // Corrigido para ir para login, não 'log'
              }
            }}
            title="Acesso de Administrador"
            showBack={true}
            goToBack={() => setCurrentPage('login')}
          />
        );

      case 'admin': // <-- PAINEL ADMIN
        // Verifica se está logado e tem permissão (segurança extra)
        if (!user || !user.isAdmin) {
          alert('Acesso negado. Redirecionando para a home.');
          setCurrentPage('home');
          return null;
        }
        return (
          <PainelAdmin
            goToHome={() => setCurrentPage('home')}
            goToCadastroPet={() => setCurrentPage('cadastroPet')}
          />
          
        );

      case 'cadastroPet':
        return (
          <CadastroPet
            aoSalvar={handleCreatePet}
            aoCancelar={() => setCurrentPage('home')}
          />
        );

      case 'home':
        return (
          <div>
            <div style={{ textAlign: 'center', margin: '20px' }}>

              {/* Botão de Cadastro de Pet (SÓ ADMIN) */}
              {user && user.isAdmin && (
                <button className="btn-primary"
                  onClick={() => setCurrentPage('cadastroPet')}
                  style={{ marginRight: '10px' }}
                >
                  + Adicionar Pet
                </button>
              )}

              {/* Botão Painel Admin (SÓ ADMIN) */}
              {user && user.isAdmin && (
                <button className="btn-primary"
                  onClick={() => setCurrentPage('admin')}
                  style={{ backgroundColor: '#ff69b4', marginRight: '10px' }}
                >
                  Painel Admin
                </button>
              )}

              {/* O BOTÃO SAIR FOI REMOVIDO DAQUI E MOVIDO PARA O CABEÇALHO */}
            </div>

            {/* ... (Avisos de carregamento e erro) ... */}
            {loading && <div className="loading" style={{ textAlign: 'center' }}>Carregando fofuras... 🐶</div>}

            {error && (
              <div className="error" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                {error} <br />
                <small>Verifique se o backend está rodando.</small>
              </div>
            )}

            {!loading && !error && (
              <ListaAnimais pets={listaPets} onSelectPet={handleSelectPet} />
            )}
          </div>
        );

      case 'perfilAnimal':
        if (!petSelecionado) {
          setCurrentPage('home');
          return null;
        }
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrentPage('home')}
              style={{
                position: 'absolute', top: 0, left: 10, background: 'transparent',
                border: 'none', color: '#333', fontSize: '2rem', cursor: 'pointer', zIndex: 10
              }}
            >
              ⬅
            </button>
            <PerfilAnimal pet={petSelecionado} goToForm={() => setCurrentPage('adocao')} />
          </div>
        );

      case 'adocao':
        return <FormularioAdocao goToPerfil={() => setCurrentPage('perfilAnimal')} pet={petSelecionado} user={user} />;

      default:
        return <Login goToCadastro={() => setCurrentPage('cadastro')} onLoginSuccess={(userData) => { setUser(userData); setCurrentPage('home'); }} />;
    }
  };

  return (
    <div className="app-container">

      {/* CABEÇALHO CORRIGIDO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>


        <h1 >
          Final Feliz
        </h1>

        {/* Canto Superior Direito: LÓGICA DE LOGIN/ADMINISTRADOR E SAIR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> {/* Adicionado display:flex e gap */}
          {user ? (
            // Se estiver logado, mostra o nome/tipo E O BOTÃO SAIR
            <>
              <span
                onClick={() => {
                  if (user.isAdmin) {
                    setCurrentPage('admin');
                  } else {
                    setCurrentPage('home');
                  }
                }}
                style={{ cursor: 'pointer', color: '#ff69b4', fontWeight: 'bold' }}
              >
                Olá, {user.nome.split(' ')[0]} ({user.tipoUsuario || 'Usuário'})
              </span>

              {/* BOTÃO SAIR NOVO E PEQUENO */}
              <button
                className="btn-primary"
                onClick={() => {
                  setUser(null);
                  setCurrentPage('login');
                }}
                style={{
                  padding: '4px 8px', // Tamanho menor
                  fontSize: '0.8rem', // Fonte menor
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sair
              </button>
            </>
          ) : (
            // Se NÃO estiver logado, mostra o botão "Admin"
            <button
              className="btn-primary"
              onClick={() => setCurrentPage('adminLogin')}
              style={{ padding: '8px 15px', fontSize: '0.9rem' }}>
              Admin
            </button>
          )}
        </div>
      </div>

      {renderPage()}
    </div>
  );
}

export default App;