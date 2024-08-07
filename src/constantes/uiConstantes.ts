export const labels: { [key: string]: { [key: string]: any } } = {
    role: {
        nome: "Informe o nome do rolê",
        local: "Informe o local que ocorrerá o rolê incluindo endereço, pontos de referência e nome (se houver).",
        data: "Informe a data do rolê no formato: DD/MM/AAAA ex 31/12/2024",
        hora: "Informe o horário de início do rolê e/ou o horário de encontro",
        descricao: "Insira uma descrição para o rolê explicando do que se trata, descrevendo o espaço e convencendo todos a comparecerem. Capriche!",
        opcoes: `Para editar o rolê, escolha uma das opções abaixo: \n\n$opcoes`
    },
    perfil: {
        nome: "Nome",
        relacionamento: "Status de Relacionamento (Solteire/Casade/Namorando/etc)",
        flerte: "PV Aberto para flerte?",
        nascimento: "Data de Nascimento em formato DD/MM/AAAA (ex: 18/06/1989)",
        orientacao: "Orientação Sexual e Pronomes",
        roles: "Tipos Preferidos de Rolê",
        melhorlugar: "Melhor Rolê de São Paulo",
        insta: "Perfil do Instagram"
    },
    perfis: {
        idPessoa: "Escolha o ID de uma pessoa para visualizar o perfil, e responda essa mensagem com o ID desejado\n\n"
    },
    erro: {
        metodo: "Método chamado indevidamente",
        apenasPrivado: "⚠ Este comando somente funciona no *privado do bot* ⚠",
        apenasGrupo: "⚠ Este comando apenas funciona em *grupos* ⚠",
        perfilNaoCriado: "⚠ O uso do bot é permitido apenas para membros com perfil criado. Chame este bot no PV, digite */perfil*, e siga as instruções."
    },
    ranking: {
        nenhumDado: (mes : string) => `⚠ Nenhum dado de Ranking Encontrado para o mes de ${mes} ⚠`,
        naoFazParte: "⚠ Você não faz parte do grupo que deseja extrair as estatisticas. ⚠",
        botNaoFazParte: "⚠ O BOT não faz parte do grupo que deseja extrair as estatisticas. ⚠",
        naoEhAdminDoGrupo : "⚠ Você não é administrador do grupo que deseja extrair as estatisticas. ⚠"
    }
}