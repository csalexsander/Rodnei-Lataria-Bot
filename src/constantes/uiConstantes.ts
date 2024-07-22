export const labels: { [key: string]: any } = {
    role : {
        nome : "Informe o nome do rolê",
        local : "Informe o local que ocorrerá o rolê incluindo endereço, pontos de referência e nome (se houver).",
        data : "Informe a data do rolê no formato: DD/MM/AAAA ex 31/12/2024",
        hora : "Informe o horário de início do rolê e/ou o horário de encontro",
        descricao : "Insira uma descrição para o rolê explicando do que se trata, descrevendo o espaço e convencendo todos a comparecerem. Capriche!",
        opcoes : `Para editar o rolê, escolha uma das opções abaixo: \n\n$opcoes`
    },
    perfil : {
        nome : "Nome",
        relacionamento : "*[Responda à essa mensagem]*\nStatus de Relacionamento (Solteire/Casade/Namorando/etc)",
        flerte : "*[Responda à essa mensagem]*\nPV Aberto para flerte?",
        nascimento : "*[Responda à essa mensagem]*\nData de Nascimento em formato DD/MM/AAAA (ex: 18/06/1989)",
        orientacao : "*[Responda à essa mensagem]*\nOrientação Sexual e Pronomes",
        roles : "*[Responda à essa mensagem]*\nTipos Preferidos de Rolê",
        melhorlugar : "*[Responda à essa mensagem]*\nMelhor Rolê de São Paulo",
        insta : "*[Responda à essa mensagem]*\nPerfil do Instagram"
    },
    perfis : {
        idPessoa : "Escolha o ID de uma pessoa para visualizar o perfil, e responda essa mensagem com o ID desejado\n\n"
    },
    erro : {
        metodo : "Método chamado indevidamente",
        apenasPrivado : "⚠ Este comando somente funciona no *privado do bot* ⚠",
        apenasGrupo : "⚠ Este comando apenas funciona em *grupos* ⚠"
    }
}