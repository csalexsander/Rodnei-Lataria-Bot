export const labels: { [key: string]: any } = {
    role : {
        nome : "Informe o nome do role",
        local : "Informe o local que ocorrerá o role, para auxiliar as pessoas que vão a encontrar o local, informe tambem o endereço e demais informações referente a localização.",
        data : "Informe a data do role no formato: DD/MM/AAAA ex 31/12/2024",
        dataErro : "Data inserida no formato inválido.\nInforme a data do role no formato: DD/MM/AAAA ex 31/12/2024.",
        hora : "Informe a hora que começará o role, ou a hora de encontro",
        descricao : "Informe uma descrição para que todos possam saber sobre o que se trata, forneça informações importantes sobre o lugar e/ou atividades a serem realizadas",
        resumo : `-----*ROLE*-----\n*$role.nome*\n\n*Local*: $role.local\n\n*Data*: $role.data *Hora:* $role.hora\n\n$role.descricao\n\n*CONFIRMADOS ($role.participantes)*\n\n---------------------------$participantes\n\n---------------------------\n\nPara *confirmar* digite */confirmar $role_sequencial*\n\nPara *desconfirmar* basta digite */miar $role.sequencial*`,
        opcoes : `Para editar o role, escolha uma das opções abaixo: \n\n$opcoes`
    },
    perfil : {
        nome : "Informe o seu nome:",
        relacionamento : "Informe o seu estado de relacionamento (Solteiro/Namorando/Casado):",
        flerte : "PV Aberto para flerte?",
        nascimento : "Informe sua data de nascimento (ex: 01/01/2021): ",
        orientacao : "Informe sua orientação: ",
        roles : "Quais os seus roles favoritos? ",
        melhorlugar : "Para você, qual o melhor lugar de São paulo?",
        insta : "Para você, qual o melhor lugar de São paulo?"
    },
    erroMetodo : "Metodo chamado indevidamente",
}