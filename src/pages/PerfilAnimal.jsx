import React from 'react';

// Função auxiliar para determinar a cor do status
const getStatusColor = (status) => {
    switch (status) {
        case 'Adotado':
            return "red"; // Vermelho
        case 'Em Análise':
            return '#FFD700'; // Amarelo Dourado
        case 'Disponível':
        default:
            return 'lightgreen'; // Verde
    }
};

function PerfilAnimal({ pet, goToForm }) {
  // 1. Define o status atual (usa 'Disponível' se for nulo)
  const statusAtual = pet.status || 'Disponível';
  
  // 2. Verifica se o pet está disponível para adoção (apenas se for 'Disponível')
  const isAvailable = statusAtual === 'Disponível';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Área Hero do Pet */}
      <div className="pet-hero">
        <h1 className="pet-title">{pet.nome}</h1>
        <p className="pet-details">
          {pet.idade} • {pet.raca} • {pet.localizacao}
        </p>
        <div style={{ marginTop: '15px' }}>
          <span className="tag-badge">{pet.porte}</span>
          <span className="tag-badge">{pet.vacinas ? 'Vacinado' : ''}</span>
          <span className="tag-badge">{pet.compatibilidade}</span>
        </div>

        {/* Exibir o status grande no perfil com cor dinâmica */}
        <h2 
            style={{ 
                marginTop: '20px', 
                color: getStatusColor(statusAtual) // Aplica a cor
            }}
        >
            Status: {statusAtual}
        </h2>
      </div>

      <div style={{ padding: '20px' }}>
        <h3>História</h3>
        <p style={{ color: 'bla', lineHeight: '1.6' }}>{pet.descricao}</p>

        <hr style={{ borderColor: '#718FC8', margin: '20px 0' }} />

        <h3>Saúde e Cuidados</h3>
        <ul style={{ color: '#ffffffff' }}>
            <li>Vacinas: {pet.vacinas ? 'Em dia' : 'Pendentes'}</li>
            <li>Vermífugo: {pet.desvermifugado ? 'Sim' : 'Não'}</li>
        </ul>

        {/* BOTÃO ADOTAR/MENSAGEM DE STATUS - CONDICIONAL */}
        {isAvailable ? (
            // Se estiver DISPONÍVEL, mostra o botão Adotar
            <button className="btn-primary" onClick={goToForm} style={{ width: '100%', marginTop: '30px' }}>
                Quero Adotar!
            </button>
        ) : (
             // Se não estiver DISPONÍVEL, mostra a mensagem de status
             <p 
                style={{ 
                    textAlign: 'center', 
                    padding: '15px', 
                    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Fundo claro
                    color: getStatusColor(statusAtual), // Cor da fonte
                    borderRadius: '5px',
                    marginTop: '30px',
                    fontWeight: 'bold'
                }}
            >
                {statusAtual === 'Em Análise' 
                    ? 'Este pet está em processo de adoção e não pode receber novas solicitações no momento.'
                    : 'Parabéns! Este pet já encontrou um final feliz. Não aceitamos mais solicitações.'
                }
            </p>
        )}
      </div>
    </div>
  );
}

export default PerfilAnimal;