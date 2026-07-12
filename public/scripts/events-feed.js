const fieldNames = {
  active: ["активно", "active", "показывать", "show"],
  title: ["название", "title", "заголовок"],
  date: ["дата", "date"],
  time: ["время", "time"],
  type: ["тип", "категория", "type", "category"],
  text: ["описание", "текст", "description", "text"],
  image: ["фото", "картинка", "image", "photo"],
  url: ["ссылка", "url", "link", "билеты"],
};

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const normalizeKey = (value) => String(value || "").trim().toLowerCase();

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getByAliases = (row, aliases) => {
  for (const alias of aliases) {
    const value = row[alias];
    if (value !== undefined && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
};

const parseCsv = (csv) => {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (quoted && char === '"' && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && char === ",") {
      row.push(value);
      value = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) {
    rows.push(row);
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeKey);

  return rows.slice(1).map((cells) => {
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = cells[index] || "";
    });
    return rowObject;
  });
};

const parseDate = (value) => {
  const raw = String(value || "").trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const ru = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);

  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }

  if (ru) {
    return new Date(Number(ru[3]), Number(ru[2]) - 1, Number(ru[1]));
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateParts = (dateValue) => {
  const date = parseDate(dateValue);

  if (!date) {
    return { day: "", month: "" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: monthNames[date.getMonth()] || "",
  };
};

const normalizeEvent = (row, index) => {
  const normalized = {};

  for (const [field, aliases] of Object.entries(fieldNames)) {
    normalized[field] = getByAliases(row, aliases);
  }

  const title = normalized.title || "Событие";
  const activeValue = normalizeKey(normalized.active || "да");
  const active = !["нет", "no", "false", "0", "скрыть"].includes(activeValue);

  return {
    id: normalizeKey(title)
      .replace(/[^a-zа-яё0-9]+/gi, "-")
      .replace(/^-|-$/g, "") || `event-${index + 1}`,
    date: normalized.date,
    time: normalized.time,
    title,
    text: normalized.text,
    image: normalized.image,
    type: normalized.type || "Событие",
    url: normalized.url,
    active,
  };
};

const getUpcomingEvents = (events) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeEvents = events.filter((event) => event.active !== false);
  const futureEvents = activeEvents.filter((event) => {
    const date = parseDate(event.date);
    return date && date >= today;
  });

  return (futureEvents.length ? futureEvents : activeEvents).sort((left, right) => {
    const leftDate = parseDate(left.date)?.getTime() || 0;
    const rightDate = parseDate(right.date)?.getTime() || 0;
    return leftDate - rightDate;
  });
};

const resolveImage = (image, assetBase) => {
  if (!image) {
    return `${assetBase}images/gallery/gallery-01.jpg`;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${assetBase}${image.replace(/^\//, "")}`;
};

const getEventUrl = (event, assetBase) => {
  if (event.url) {
    return event.url;
  }

  return `${assetBase}events#${event.id}`;
};

const renderHomeCard = (event, assetBase) => {
  const dateParts = formatDateParts(event.date);
  const article = document.createElement("article");
  article.className = "event-card";
  const url = getEventUrl(event, assetBase);

  article.innerHTML = `
    <div class="event-image" style="background-image: url('${escapeHtml(resolveImage(event.image, assetBase))}')">
      <time datetime="${escapeHtml(event.date)}"><b>${escapeHtml(dateParts.day)}</b><span>${escapeHtml(dateParts.month)}</span></time>
    </div>
    <div class="event-body">
      <h3>${escapeHtml(event.title)}</h3>
      <p>${escapeHtml(event.text)}</p>
      <div class="event-time"><span aria-hidden="true"></span>${escapeHtml(event.time || "Время уточняется")}</div>
      <a href="${escapeHtml(url)}"${event.url ? ' target="_blank" rel="noreferrer"' : ""}>Подробнее <span aria-hidden="true">→</span></a>
    </div>
  `;

  return article;
};

const renderPageCard = (event, assetBase, index = 0) => {
  const dateParts = formatDateParts(event.date);
  const article = document.createElement("article");
  article.className = index === 0 ? "events-schedule-card events-schedule-card--featured" : "events-schedule-card";
  article.id = event.id;
  const url = getEventUrl(event, assetBase);

  article.innerHTML = `
    <div class="events-schedule-card__image" style="background-image: url('${escapeHtml(resolveImage(event.image, assetBase))}')">
      <time datetime="${escapeHtml(event.date)}"><b>${escapeHtml(dateParts.day)}</b><span>${escapeHtml(dateParts.month)}</span></time>
    </div>
    <div class="events-schedule-card__body">
      <span class="tag">${escapeHtml(event.type || "Событие")}</span>
      <h3>${escapeHtml(event.title)}</h3>
      <p>${escapeHtml(event.text)}</p>
      <div class="event-time"><span aria-hidden="true"></span>${escapeHtml(event.time || "Время уточняется")}</div>
      <a href="${escapeHtml(url)}"${event.url ? ' target="_blank" rel="noreferrer"' : ""}>Подробнее <span aria-hidden="true">→</span></a>
    </div>
  `;

  return article;
};

const renderEmpty = (container) => {
  const empty = document.createElement("div");
  empty.className = "events-empty";
  empty.innerHTML = `
    <h3>Актуальная афиша скоро появится</h3>
    <p>Мы обновляем расписание событий. Загляните чуть позже или свяжитесь с нами, чтобы уточнить ближайшие мероприятия.</p>
  `;
  container.replaceChildren(empty);
};

const loadEvents = async (sourceUrl, fallbackEvents) => {
  if (!sourceUrl) {
    return fallbackEvents;
  }

  try {
    const response = await fetch(sourceUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Events feed failed: ${response.status}`);
    }

    const rows = parseCsv(await response.text());
    const events = rows.map(normalizeEvent).filter((event) => event.title);

    return events.length ? events : fallbackEvents;
  } catch (error) {
    console.warn(error);
    return fallbackEvents;
  }
};

const initEventsFeed = async (root) => {
  const mode = root.dataset.eventsFeed;
  const sourceUrl = root.dataset.eventsUrl || "";
  const assetBase = root.dataset.assetBase || "/";
  const fallbackId = root.dataset.eventsFallback;
  const fallbackNode = fallbackId ? document.getElementById(fallbackId) : null;
  const fallbackEvents = fallbackNode ? JSON.parse(fallbackNode.textContent || "[]") : [];
  const events = getUpcomingEvents(await loadEvents(sourceUrl, fallbackEvents));
  const limit = Number(root.dataset.eventsLimit || 0);
  const visibleEvents = limit > 0 ? events.slice(0, limit) : events;

  if (!visibleEvents.length) {
    renderEmpty(root);
    return;
  }

  const renderer = mode === "home" ? renderHomeCard : renderPageCard;
  root.replaceChildren(...visibleEvents.map((event, index) => renderer(event, assetBase, index)));
};

document.querySelectorAll("[data-events-feed]").forEach((root) => {
  initEventsFeed(root);
});
