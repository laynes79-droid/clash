document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para Navegação Ativa ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    // ------------------------------------

    const page = window.location.pathname.split('/').pop();

    if (page === 'index.html' || page === '') {
        loadClanInfo();
    } else if (page === 'war.html') {
        loadWarLog();
    } else if (page === 'ranking.html') {
        loadRanking();
    }
});

// A tag do clã não é um segredo, então pode ficar aqui.
const CLAN_TAG = "QGYYYPLY";

// --- Chamada para o nosso Servidor Local ---
async function fetchFromAPI(endpoint) {
    // A URL agora aponta para o nosso servidor Express rodando localmente na porta 3000
    const response = await fetch(`http://localhost:3000/api?endpoint=${endpoint}`);

    if (!response.ok) {
        console.error("Erro ao chamar o servidor local:", response.status, response.statusText);
        const errorBody = await response.json().catch(() => ({ message: "Não foi possível ler o corpo do erro." }));
        console.error("Detalhes do erro:", errorBody);
        return null;
    }
    return await response.json();
}

// --- Funções para Carregar Dados em Cada Página ---

async function loadClanInfo() {
    const clanInfoDiv = document.getElementById('clan-info');
    const topDonorsDiv = document.getElementById('top-donors');
    const inactiveMembersDiv = document.getElementById('inactive-members');
    if (!clanInfoDiv || !topDonorsDiv || !inactiveMembersDiv) return;

    clanInfoDiv.innerHTML = `<p>Carregando...</p>`;
    topDonorsDiv.innerHTML = `<p>Carregando...</p>`;
    inactiveMembersDiv.innerHTML = `<p>Carregando...</p>`;

    try {
        const encodedClanTag = encodeURIComponent(`#${CLAN_TAG}`);
        const clanData = await fetchFromAPI(`/clans/${encodedClanTag}`);

        if (clanData && clanData.name) {
            // Renderiza as informações principais do clã
            clanInfoDiv.innerHTML = `
                <h3>${clanData.name} (${clanData.tag})</h3>
                <p><strong>Descrição:</strong> ${clanData.description}</p>
                <p><strong>Membros:</strong> ${clanData.members} / 50</p>
                <p><strong>Troféus do Clã:</strong> ${clanData.clanScore}</p>
                <p><strong>Troféus de Guerra:</strong> ${clanData.clanWarTrophies}</p>
                <p><strong>Troféus Necessários:</strong> ${clanData.requiredTrophies}</p>
                <p><strong>Doações por semana:</strong> ${clanData.donationsPerWeek}</p>
            `;

            // Processa e renderiza o Top 5 Doadores
            const topDonors = [...clanData.memberList].sort((a, b) => b.donations - a.donations).slice(0, 5);
            let topDonorsHtml = '<ul>';
            topDonors.forEach(member => {
                topDonorsHtml += `<li>${member.name} - <strong>${member.donations} doações</strong></li>`;
            });
            topDonorsHtml += '</ul>';
            topDonorsDiv.innerHTML = topDonorsHtml;

            // Processa e renderiza os Membros Inativos
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const inactiveMembers = clanData.memberList.filter(member => {
                const ts = member.lastSeen;
                const isoTimestamp = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}T${ts.slice(9, 11)}:${ts.slice(11, 13)}:${ts.slice(13, 15)}Z`;
                const lastSeen = new Date(isoTimestamp);
                return lastSeen < sevenDaysAgo;
            });

            let inactiveMembersHtml = '<ul>';
            if (inactiveMembers.length > 0) {
                inactiveMembers.forEach(member => {
                    const lastSeenDate = new Date(member.lastSeen.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\..*/, '$1-$2-$3T$4:$5:$6Z')).toLocaleDateString('pt-BR');
                    inactiveMembersHtml += `<li class="inactive-member">${member.name} - <strong>Visto por último: ${lastSeenDate}</strong></li>`;
                });
            } else {
                inactiveMembersHtml = '<p>Nenhum membro inativo há mais de 7 dias.</p>';
            }
            inactiveMembersHtml += '</ul>';
            inactiveMembersDiv.innerHTML = inactiveMembersHtml;

        } else {
            const errorMessage = `<p>Não foi possível carregar os dados do clã.</p>`;
            clanInfoDiv.innerHTML = errorMessage;
            topDonorsDiv.innerHTML = errorMessage;
            inactiveMembersDiv.innerHTML = errorMessage;
        }
    } catch (error) {
        console.error("Erro ao carregar informações do clã:", error);
        const errorMessage = `<p>Ocorreu um erro de rede.</p>`;
        clanInfoDiv.innerHTML = errorMessage;
        topDonorsDiv.innerHTML = errorMessage;
        inactiveMembersDiv.innerHTML = errorMessage;
    }
}

async function loadWarLog() {
    const analysisDiv = document.getElementById('war-analysis');
    const tableBody = document.querySelector('#war-table tbody');
    if (!tableBody || !analysisDiv) return;

    tableBody.innerHTML = `<tr><td colspan="5">Carregando dados da guerra...</td></tr>`;
    analysisDiv.innerHTML = '';

    try {
        const encodedClanTag = encodeURIComponent(`#${CLAN_TAG}`);

        const [warLogData, clanData] = await Promise.all([
            fetchFromAPI(`/clans/${encodedClanTag}/warlog`),
            fetchFromAPI(`/clans/${encodedClanTag}`)
        ]);

        if (!warLogData || !warLogData.items || warLogData.items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">Nenhum dado de guerra encontrado.</td></tr>`;
            return;
        }

        const lastWar = warLogData.items[0];
        const allClanMembers = clanData.memberList;
        const warParticipants = lastWar.participants;

        const warStats = allClanMembers.map(member => {
            const participantData = warParticipants.find(p => p.tag === member.tag);
            if (participantData) {
                return {
                    name: participantData.name,
                    tag: participantData.tag,
                    battlesPlayed: participantData.battlesPlayed,
                    wins: participantData.wins,
                    fame: participantData.fame,
                    participated: true
                };
            } else {
                return {
                    name: member.name,
                    tag: member.tag,
                    battlesPlayed: 0,
                    wins: 0,
                    fame: 0,
                    participated: false
                };
            }
        });

        warStats.sort((a, b) => {
            if (a.participated !== b.participated) return a.participated ? 1 : -1;
            return a.battlesPlayed - b.battlesPlayed;
        });

        let tableHtml = '';
        let nonParticipantsCount = 0;
        warStats.forEach(player => {
            let status = 'Participou';
            let rowClass = 'participant';
            if (!player.participated) {
                status = 'Não participou';
                rowClass = 'non-participant';
                nonParticipantsCount++;
            } else if (player.battlesPlayed < 4) {
                status = 'Participação incompleta';
                rowClass = 'incomplete-participant';
            }

            tableHtml += `
                <tr class="${rowClass}">
                    <td>${player.name} <span class="player-tag">${player.tag}</span></td>
                    <td>${player.battlesPlayed}</td>
                    <td>${player.wins}</td>
                    <td>${player.fame}</td>
                    <td>${status}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = tableHtml;

        const createdDate = new Date(lastWar.createdDate).toLocaleString('pt-BR');
        analysisDiv.innerHTML = `
            <p>Análise da guerra concluída em: <strong>${createdDate}</strong></p>
            <p>Jogadores que não participaram: <strong>${nonParticipantsCount}</strong></p>
        `;

    } catch (error) {
        console.error("Erro ao carregar análise de guerra:", error);
        tableBody.innerHTML = `<tr><td colspan="5">Ocorreu um erro de rede.</td></tr>`;
    }
}

async function loadRanking() {
    const rankingTableBody = document.querySelector('#ranking-table tbody');
    if (!rankingTableBody) return;

    rankingTableBody.innerHTML = `<tr><td colspan="4">Carregando ranking do clã...</td></tr>`;

    try {
        const encodedClanTag = encodeURIComponent(`#${CLAN_TAG}`);
        const clanData = await fetchFromAPI(`/clans/${encodedClanTag}`);

        if (clanData && clanData.memberList) {
            let html = '';
            clanData.memberList.sort((a, b) => a.clanRank - b.clanRank);

            clanData.memberList.forEach(member => {
                html += `
                    <tr>
                        <td>${member.clanRank}</td>
                        <td>${member.name} <span class="player-tag">${member.tag}</span></td>
                        <td>${member.trophies}</td>
                        <td>${member.donations}</td>
                    </tr>
                `;
            });
            rankingTableBody.innerHTML = html;
        } else {
            rankingTableBody.innerHTML = `<tr><td colspan="4">Não foi possível carregar o ranking.</td></tr>`;
        }
    } catch (error) {
        console.error("Erro ao carregar ranking do clã:", error);
        rankingTableBody.innerHTML = `<tr><td colspan="4">Ocorreu um erro de rede.</td></tr>`;
    }
}
