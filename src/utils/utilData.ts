export default class UtilData {
    static obterDataComSemana(data: string): string {
        const semanaDias = [
          "Domingo", "Segunda", "Terça", "Quarta",
          "Quinta", "Sexta", "Sábado"
        ];

        const [day, month, year] = data.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        return isNaN(date.getTime())
          ? data
          : `${data} - ${semanaDias[date.getDay()]}`;
    }
}
