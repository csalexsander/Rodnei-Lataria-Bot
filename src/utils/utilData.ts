import moment from "moment";

export default class UtilData {
  static obterDataComSemana(data: string | null): string | null {
    if(!data || !data.length)
      return data;

      const semanaDias = [
        "Domingo", "Segunda", "Terça", "Quarta",
        "Quinta", "Sexta", "Sábado"
      ];

      const dataMoment = moment(data, "DD/MM/YYYY");

      if(!dataMoment.isValid())
        return data;

      const date = new Date(dataMoment.format("LLLL"));

      const weekDay = semanaDias[date.getDay()];

      return `${weekDay} - ${data}`;
  }
}