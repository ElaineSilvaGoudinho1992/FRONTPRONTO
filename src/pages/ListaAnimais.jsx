// ListaAnimais.jsx - CÓDIGO COMPLETO E AJUSTADO

import React from 'react';

function ListaAnimais({ pets, onSelectPet }) {
  
  // Função para determinar a cor, texto e se está adotado
  const getStatusDisplay = (status, adotante) => {
    switch (status) {
      case 'Disponível':
        return {
          text: 'Disponível',
          color: '#4CAF50' // VERDE
        };
      case 'Em Análise':
        return {
          text: 'Em Análise',
          color: '#FFC107' // AMARELO
        };
      case 'Adotado': {
        const adotanteNome = adotante && adotante.nome ? adotante.nome : '—';
        return {
          text: `Adotado por ${adotanteNome}`,
          color: '#F44336' // VERMELHO
        };
      }
      default:
        return {
          text: 'Status Desconhecido',
          color: '#9E9E9E'
        };
    }
  };


  if (!pets || pets.length === 0) {
    return <p style={{ color: 'white', textAlign: 'center' }}>Nenhum pet encontrado.</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>(Ache sua felicidade)</h2>

      <div className="pet-grid">
        {pets.map((pet) => {
          
          // O objeto Adotante é retornado pelo backend se houver um adotanteId
          const statusInfo = getStatusDisplay(pet.statusAdocao, pet.Adotante);
          
          return (
            <div
              key={pet.id}
              className="pet-card"
              // Dica: Adicionados estilos para pets adotados ficarem mais apagados
              style={{ opacity: pet.statusAdocao === 'Adotado' ? 0.6 : 1, cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault(); 
                onSelectPet(pet);
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${pet.imagemUrl || pet.foto || 'https://via.placeholder.com/300'})`,
                  height: '200px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{pet.nome}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#b3b3b3' }}>
                  {pet.raca} • {pet.localizacao}
                </p>

                {/* BADGE DE STATUS COM CORES */}
                <span 
                    style={{ 
                        display: 'inline-block',
                        padding: '5px 10px',
                        marginTop: '10px',
                        borderRadius: '5px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        backgroundColor: statusInfo.color,
                        color: statusInfo.color === '#FFC107' ? '#333' : 'white'
                    }}
                >
                    {statusInfo.text}
                </span>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListaAnimais;
