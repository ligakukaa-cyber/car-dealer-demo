/* ТРАССА — каталог с фильтрами, карточка авто, кредитный калькулятор, заявка. */
(() => {
  const CARS = window.CARS, CREDIT = window.CREDIT;
  const rub = (n) => Math.round(n).toLocaleString("ru-RU") + " ₽";
  const km = (n) => n.toLocaleString("ru-RU") + " км";

  /* аннуитетный платеж: L·r / (1 − (1 + r)^−n), r — месячная ставка */
  const payment = (loan, ratePct, months) => {
    if (loan <= 0) return 0;
    const r = ratePct / 12 / 100;
    return r === 0 ? loan / months : loan * r / (1 - Math.pow(1 + r, -months));
  };
  window.TRASSA_PAYMENT = payment;
  const monthlyFor = (price) =>
    payment(price * (1 - CREDIT.down_default / 100), CREDIT.rate, CREDIT.term_default);

  /* ---------- шапка и появление ---------- */
  const nav = document.getElementById("nav");
  const fab = document.querySelector(".call-fab");
  const formSec = document.getElementById("form");
  const onScroll = () => {
    nav.classList.toggle("stuck", window.scrollY > 40);
    if (fab && formSec) {
      fab.classList.toggle("hide", window.scrollY < 500 || formSec.getBoundingClientRect().top < window.innerHeight);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((items) => {
    items.forEach((it) => { if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); } });
  }, { threshold: 0.1 });
  const watch = (root) => root.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
  watch(document);

  /* ---------- каталог ---------- */
  const carsEl = document.getElementById("cars");
  const found = document.getElementById("found");
  const empty = document.getElementById("empty");
  const f = {
    brand: document.getElementById("fBrand"), price: document.getElementById("fPrice"),
    year: document.getElementById("fYear"), gear: document.getElementById("fGear"),
    sort: document.getElementById("sort"),
  };
  let body = "";

  [...new Set(CARS.map((c) => c.brand))].sort().forEach((b) => f.brand.add(new Option(b, b)));
  document.getElementById("carsCount").textContent = CARS.length;

  const plural = (n) => (n % 10 === 1 && n % 100 !== 11 ? "автомобиль"
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "автомобиля" : "автомобилей");

  const SORTS = {
    "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price,
    "year-desc": (a, b) => b.year - a.year || a.km - b.km, "km-asc": (a, b) => a.km - b.km,
  };

  // чистая функция отбора — ее же проверяет тест
  const select = (opts) => CARS
    .filter((c) => !opts.brand || c.brand === opts.brand)
    .filter((c) => !opts.price || c.price <= opts.price)
    .filter((c) => !opts.year || c.year >= opts.year)
    .filter((c) => !opts.gear || c.gear === opts.gear)
    .filter((c) => !opts.body || c.body === opts.body)
    .sort(SORTS[opts.sort || "price-asc"]);
  window.TRASSA_SELECT = select;

  const render = () => {
    const list = select({
      brand: f.brand.value, price: Number(f.price.value) || 0, year: Number(f.year.value) || 0,
      gear: f.gear.value, body, sort: f.sort.value,
    });
    found.textContent = `Найдено: ${list.length} ${plural(list.length)}`;
    empty.hidden = list.length > 0;
    carsEl.innerHTML = list.map((c) => `
      <article class="car reveal" data-id="${c.id}" tabindex="0" role="button" aria-label="${c.brand} ${c.model}, подробнее">
        <div class="car-img"><img src="assets/car_${c.id}.jpg" alt="${c.brand} ${c.model} ${c.year}, ${c.color}" loading="lazy">
          <span class="car-year">${c.year}</span></div>
        <div class="car-in">
          <h3>${c.brand} ${c.model}</h3>
          <p class="car-meta">${km(c.km)} · ${c.gear === "AT" ? "автомат" : "механика"} · ${c.engine.split(",")[0]}</p>
          <div class="car-foot">
            <b>${rub(c.price)}</b>
            <span>от ${rub(monthlyFor(c.price))}/мес</span>
          </div>
        </div>
      </article>`).join("");
    watch(carsEl);
  };

  Object.values(f).forEach((el) => el.addEventListener("change", render));
  document.getElementById("fBody").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    body = b.dataset.body;
    document.querySelectorAll("#fBody button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  });
  document.getElementById("reset").addEventListener("click", () => {
    document.getElementById("filters").reset();
    body = "";
    document.querySelectorAll("#fBody button").forEach((x, i) => x.classList.toggle("on", i === 0));
    render();
  });
  render();

  /* ---------- карточка авто ---------- */
  const modal = document.getElementById("modal");
  let current = null;
  const openCar = (id) => {
    const c = CARS.find((x) => x.id === id);
    if (!c) return;
    current = c;
    const img = document.getElementById("mImg");
    img.src = `assets/car_${c.id}.jpg`;
    img.alt = `${c.brand} ${c.model}`;
    document.getElementById("mTitle").textContent = `${c.brand} ${c.model}, ${c.year}`;
    document.getElementById("mPrice").textContent = rub(c.price);
    document.getElementById("mMonth").textContent =
      `в кредит от ${rub(monthlyFor(c.price))}/мес при взносе ${CREDIT.down_default}% на ${CREDIT.term_default / 12} лет`;
    const specs = [["Пробег", km(c.km)], ["Двигатель", c.engine], ["Коробка", c.gear === "AT" ? "автомат" : "механика"],
      ["Кузов", c.body.toLowerCase()], ["Цвет", c.color], ["Владельцев по ПТС", c.owners]];
    document.getElementById("mSpecs").innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    modal.showModal();
  };
  carsEl.addEventListener("click", (e) => { const card = e.target.closest(".car"); if (card) openCar(card.dataset.id); });
  carsEl.addEventListener("keydown", (e) => {
    const card = e.target.closest(".car");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCar(card.dataset.id); }
  });
  document.getElementById("mClose").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  const setGoal = (goal, text) => {
    document.querySelector(`#goal input[value="${goal}"]`).checked = true;
    document.getElementById("note").value = text;
  };
  document.getElementById("mDrive").addEventListener("click", () => {
    modal.close();
    setGoal("drive", `Тест-драйв: ${current.brand} ${current.model} ${current.year}, ${rub(current.price)}`);
  });
  document.getElementById("mCredit").addEventListener("click", () => {
    modal.close();
    cPrice.value = current.price;
    updateCredit();
  });
  document.getElementById("toTradein").addEventListener("click", () => setGoal("tradein", "Хочу оценить свой автомобиль: марка, год, пробег —"));

  /* ---------- кредит ---------- */
  const cPrice = document.getElementById("cPrice");
  const cDown = document.getElementById("cDown");
  const termsEl = document.getElementById("cTerms");
  let term = CREDIT.term_default;
  CREDIT.terms.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t % 12 === 0 ? `${t / 12} ${t === 12 ? "год" : t < 60 ? "года" : "лет"}` : `${t} мес`;
    b.classList.toggle("on", t === term);
    b.addEventListener("click", () => {
      term = t;
      termsEl.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      updateCredit();
    });
    termsEl.appendChild(b);
  });
  cDown.value = CREDIT.down_default;

  function updateCredit() {
    const price = Number(cPrice.value), down = Number(cDown.value);
    const loan = price * (1 - down / 100);
    document.getElementById("cPriceOut").textContent = rub(price);
    document.getElementById("cDownOut").textContent = `${down}% · ${rub(price * down / 100)}`;
    document.getElementById("cMonth").textContent = rub(payment(loan, CREDIT.rate, term));
    document.getElementById("cLoan").textContent = rub(loan);
    document.getElementById("cRate").textContent = `от ${String(CREDIT.rate).replace(".", ",")}%`;
  }
  [cPrice, cDown].forEach((el) => el.addEventListener("input", updateCredit));
  updateCredit();
  document.getElementById("cToForm").addEventListener("click", () => setGoal("credit",
    `Кредит: авто за ${document.getElementById("cPriceOut").textContent}, взнос ${cDown.value}%, ` +
    `срок ${term} мес, платеж ~${document.getElementById("cMonth").textContent}`));

  /* ---------- заявка ---------- */
  const form = document.getElementById("leadForm");
  const ok = document.getElementById("ok");
  const bad = (input, text) => {
    const field = input.closest(".field, .check");
    field.classList.add("bad");
    if (text && !field.querySelector(".err")) {
      const p = document.createElement("p");
      p.className = "err";
      p.textContent = text;
      field.appendChild(p);
    }
  };
  const clean = (input) => {
    const field = input.closest(".field, .check");
    field.classList.remove("bad");
    field.querySelector(".err")?.remove();
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name"), phone = document.getElementById("phone"),
      agree = document.getElementById("agree");
    [name, phone, agree].forEach(clean);
    let valid = true;
    if (name.value.trim().length < 2) { bad(name, "Как к вам обращаться?"); valid = false; }
    if (phone.value.replace(/\D/g, "").length < 10) { bad(phone, "Проверьте номер"); valid = false; }
    if (!agree.checked) { bad(agree); valid = false; }
    if (!valid) return;
    const goal = { drive: "тест-драйва", tradein: "оценки автомобиля", credit: "кредита" }[
      form.querySelector('input[name="goal"]:checked').value];
    ok.textContent = `Заявка принята. Менеджер перезвонит за 10 минут, чтобы согласовать время ${goal}.`;
    ok.hidden = false;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    setTimeout(() => { form.reset(); ok.hidden = true; btn.disabled = false; }, 7000);
  });
  document.getElementById("phone").addEventListener("input", (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (!d) { e.target.value = ""; return; }
    const b = d.length === 11 ? d.slice(1) : d;
    const parts = [b.slice(0, 3), b.slice(3, 6), b.slice(6, 8), b.slice(8, 10)];
    e.target.value = "+7 " + parts[0] + (parts[1] ? " " + parts[1] : "") +
      (parts[2] ? "-" + parts[2] : "") + (parts[3] ? "-" + parts[3] : "");
  });
})();
