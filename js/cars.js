/* Каталог ТРАССА. Машины правятся здесь — верстку трогать не нужно.
   gear: "AT" автомат (включая робот и вариатор), "MT" механика. */
window.CARS = [
  { id: "camry",    brand: "Toyota",     model: "Camry",      year: 2021, km: 48000,  engine: "2.5 л, 200 л.с.", gear: "AT", body: "Седан",     price: 2890000, owners: 1, color: "белый" },
  { id: "rio",      brand: "Kia",        model: "Rio",        year: 2020, km: 61000,  engine: "1.6 л, 123 л.с.", gear: "AT", body: "Седан",     price: 1390000, owners: 1, color: "серебристый" },
  { id: "creta",    brand: "Hyundai",    model: "Creta",      year: 2021, km: 39000,  engine: "1.6 л, 123 л.с.", gear: "AT", body: "Кроссовер", price: 1990000, owners: 1, color: "синий" },
  { id: "polo",     brand: "Volkswagen", model: "Polo",       year: 2019, km: 87000,  engine: "1.6 л, 110 л.с.", gear: "MT", body: "Лифтбек",   price: 1090000, owners: 2, color: "серый" },
  { id: "octavia",  brand: "Skoda",      model: "Octavia",    year: 2020, km: 72000,  engine: "1.4 л, 150 л.с.", gear: "AT", body: "Лифтбек",   price: 1790000, owners: 1, color: "белый" },
  { id: "sportage", brand: "Kia",        model: "Sportage",   year: 2022, km: 28000,  engine: "2.0 л, 150 л.с.", gear: "AT", body: "Кроссовер", price: 3150000, owners: 1, color: "черный" },
  { id: "cx5",      brand: "Mazda",      model: "CX-5",       year: 2019, km: 94000,  engine: "2.0 л, 150 л.с.", gear: "AT", body: "Кроссовер", price: 2390000, owners: 2, color: "красный" },
  { id: "bmw3",     brand: "BMW",        model: "320i",       year: 2019, km: 81000,  engine: "2.0 л, 184 л.с.", gear: "AT", body: "Седан",     price: 2990000, owners: 2, color: "темно-серый" },
  { id: "vesta",    brand: "Lada",       model: "Vesta",      year: 2022, km: 34000,  engine: "1.6 л, 106 л.с.", gear: "MT", body: "Седан",     price: 1090000, owners: 1, color: "оранжевый" },
  { id: "jolion",   brand: "Haval",      model: "Jolion",     year: 2023, km: 19000,  engine: "1.5 л, 143 л.с.", gear: "AT", body: "Кроссовер", price: 2090000, owners: 1, color: "фисташковый" },
  { id: "eclass",   brand: "Mercedes-Benz", model: "E 200",   year: 2018, km: 112000, engine: "2.0 л, 197 л.с.", gear: "AT", body: "Седан",     price: 3490000, owners: 3, color: "черный" },
  { id: "duster",   brand: "Renault",    model: "Duster",     year: 2020, km: 76000,  engine: "1.6 л, 114 л.с.", gear: "MT", body: "Кроссовер", price: 1290000, owners: 1, color: "коричневый" },
];

/* Условия кредита для расчета (демо, не оферта). rate — годовых. */
window.CREDIT = { rate: 15.9, down_default: 20, term_default: 60, terms: [12, 24, 36, 48, 60, 72, 84] };
