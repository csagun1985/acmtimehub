declare module "date-holidays" {
  interface Holiday {
    date: string;
    name: string;
    type: string;
  }

  export default class Holidays {
    constructor(country?: string, opts?: object);
    getHolidays(year: number): Holiday[];
  }
}
