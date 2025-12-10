// src/pages/PainelAdmin.jsx
import React, { useState, useEffect } from 'react';

// Componente auxiliar para exibir e interagir com uma linha de adoção
const SolicitacaoAdocao = ({ adocao, onUpdateStatus }) => {
    const isPendente = adocao.status === 'Pendente';
    const petNome = adocao.Pet ? adocao.Pet.nome : 'Desconhecido';
    const usuarioNome = adocao.Usuario ? adocao.Usuario.nome : 'Desconhecido';
    const usuarioEmail = adocao.Usuario ? adocao.Usuario.email : 'Desconhecido';

    let bgColor;
    if (adocao.status === 'Aprovada') {
        bgColor = '#d4edda'; // Verde claro
    } else if (adocao.status === 'Rejeitada') {
        bgColor = '#f8d7da'; // Vermelho claro
    } else {
        bgColor = '#fff3cd'; // Amarelo claro (Pendente)
    }

    return (
        <div style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            marginBottom: '10px', 
            borderRadius: '5px',
            backgroundColor: bgColor,
            color: '#333'
        }}>
            <p style={{ margin: '0 0 5px 0' }}>
                <strong>PET:</strong> {petNome} ({adocao.Pet.tipo})
            </p>
            <p style={{ margin: '0 0 5px 0' }}>
                <strong>SOLICITANTE:</strong> {usuarioNome} | Email: {usuarioEmail}
            </p>
            <p style={{ margin: '0 0 5px 0' }}>
                <strong>MOTIVO:</strong> {adocao.motivo}
            </p>
            <p style={{ margin: '5px 0 10px 0', fontWeight: 'bold' }}>
                STATUS ATUAL: {adocao.status}
            </p>
            
            {isPendente && (
                <div style={{ marginTop: '10px' }}>
                    <button 
                        onClick={() => onUpdateStatus(adocao.id, adocao.petId, 'Aprovada')}
                        style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 15px', marginRight: '10px', cursor: 'pointer', borderRadius: '3px' }}
                    >
                        ✅ Aprovar
                    </button>
                    <button 
                        onClick={() => onUpdateStatus(adocao.id, adocao.petId, 'Rejeitada')}
                        style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '3px' }}
                    >
                        ❌ Rejeitar
                    </button>
                </div>
            )}
        </div>
    );
};


function PainelAdmin({ goToCadastroPet, goToHome, fetchPets }) {
    const [adocoes, setAdocoes] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Função unificada de busca (Adoptions e Pets)
    const fetchAdminData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Busca Solicitações de Adoção
            const adocoesResponse = await fetch('http://localhost:3001/api/adocoes');
            if (!adocoesResponse.ok) throw new Error('Falha ao buscar solicitações');
            const adocoesData = await adocoesResponse.json();
            setAdocoes(adocoesData);

            // 2. Busca Todos os Pets (necessário para a lista de exclusão)
            const petsResponse = await fetch('http://localhost:3001/api/pets'); 
            if (!petsResponse.ok) throw new Error('Falha ao buscar pets');
            const petsData = await petsResponse.json();
            setPets(petsData);

        } catch (err) {
            setError('Erro ao carregar dados do Painel de Administração.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAdminData();
    }, []);

    // Função para deletar Pet (CHAMADA API: DELETE /api/pets/:id)
    const handleDeletePet = async (petId, petNome) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR o pet ${petNome}? Esta ação é irreversível e excluirá todas as solicitações relacionadas!`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/pets/${petId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                alert(`Pet ${petNome} excluído com sucesso!`);
                fetchAdminData(); // Atualiza as duas listas do admin
                fetchPets(); // Atualiza a lista da Home
            } else {
                alert('Erro ao excluir pet. Verifique se existem adoções ativas para ele.');
            }

        } catch (error) {
            console.error('Erro ao deletar pet:', error);
            alert('Erro de conexão ao deletar pet.');
        }
    };
    
    // Função para atualizar o status da Adoção (CHAMADA API: PUT /api/adocoes/:id)
    const handleUpdateAdocaoStatus = async (adocaoId, petId, novoStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/adocoes/${adocaoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus, petId: petId })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                fetchAdminData(); // Atualiza as duas listas do admin
                fetchPets(); // Atualiza a lista da Home
            } else {
                alert(`Erro: ${data.message}`);
            }

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro de conexão ao atualizar status da adoção.');
        }
    };

    if (loading) {
        return <p style={{ color: '#718FC8', textAlign: 'center' }}>Carregando Painel...</p>;
    }
    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }

    // Filtra as adoções pendentes para dar destaque no topo
    const adocoesPendentes = adocoes.filter(a => a.status === 'Pendente');
    const adocoesProcessadas = adocoes.filter(a => a.status !== 'Pendente');

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ color: '#718FC8', borderBottom: '2px solid #718FC8', paddingBottom: '10px', marginBottom: '20px' }}>
                Painel de Administração
            </h2>
            
            <button 
                onClick={goToHome} 
                style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#777', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
            >
                ⬅ Voltar para a Home
            </button>


            {/* ---------------------------------------------------- */}
            {/* Seção 1: Adicionar Pet */}
            {/* ---------------------------------------------------- */}
             <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#e9ecef' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>
                    Cadastro de Pets
                </h3>
                
                <button 
                    onClick={goToCadastroPet} 
                    style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
                >
                    + Adicionar Novo Pet
                </button>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Seção 2: Gerenciamento de Solicitações de Adoção PENDENTES */}
            {/* ---------------------------------------------------- */}
            <div style={{ marginBottom: '40px', padding: '20px', border: '2px solid #FFC107', borderRadius: '5px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#FFC107' }}>
                    🚨 Solicitações PENDENTES ({adocoesPendentes.length})
                </h3>
                
                {adocoesPendentes.length > 0 ? (
                    adocoesPendentes.map(adocao => (
                        <SolicitacaoAdocao 
                            key={adocao.id} 
                            adocao={adocao} 
                            onUpdateStatus={handleUpdateAdocaoStatus} 
                        />
                    ))
                ) : (
                    <p>Nenhuma solicitação de adoção pendente. 🎉</p>
                )}
            </div>
            
            {/* ---------------------------------------------------- */}
            {/* Seção 3: Lista Completa de Pets (Excluir) */}
            {/* ---------------------------------------------------- */}
            <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
                    Excluir Pets Cadastrados ({pets.length} no total)
                </h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#718FC8', color: 'white' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Nome</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map(pet => (
                            <tr key={pet.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{pet.id}</td>
                                <td style={{ padding: '10px' }}>{pet.nome}</td>
                                <td style={{ padding: '10px', color: pet.statusAdocao === 'Adotado' ? '#F44336' : (pet.statusAdocao === 'Disponível' ? '#4CAF50' : '#FFC107') }}>
                                    {pet.statusAdocao}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => handleDeletePet(pet.id, pet.nome)}
                                        style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Seção 4: Solicitações Processadas */}
            {/* ---------------------------------------------------- */}
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
                    Solicitações Processadas ({adocoesProcessadas.length})
                </h3>
                
                {adocoesProcessadas.length > 0 ? (
                    adocoesProcessadas.map(adocao => (
                        <SolicitacaoAdocao 
                            key={adocao.id} 
                            adocao={adocao} 
                            onUpdateStatus={handleUpdateAdocaoStatus} 
                        />
                    ))
                ) : (
                    <p>Nenhuma solicitação processada ainda.</p>
                )}
            </div>

        </div>
    );
}

export default PainelAdmin;