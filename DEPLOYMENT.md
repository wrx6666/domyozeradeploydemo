# Деплой проекта

Проект собирается как статический Astro-сайт. Сервер, VPS, база данных и nginx для текущей версии не нужны.

## Рекомендуемая схема

GitHub repo -> Cloudflare Pages -> временный домен Cloudflare -> custom domain

Домен можно подключить последним пунктом. До покупки домена сайт будет доступен на временном адресе вида:

```text
https://project-name.pages.dev
```

## Настройки Cloudflare Pages

При создании проекта в Cloudflare Pages:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Node.js version: 22.12.0 или новее
```

Environment variables:

```text
SITE_URL=https://project-name.pages.dev
PUBLIC_EVENTS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
```

Когда будет куплен и подключен домен, заменить `SITE_URL` на реальный адрес:

```text
SITE_URL=https://your-domain.ru
```

После изменения переменных окружения нужно запустить новый deploy.

## Проверка перед показом заказчику

Проверить на временном домене:

- главная страница открывается по `/`;
- страницы `/menu/`, `/events/`, `/history/`, `/press/`, `/services/` открываются без 404;
- изображения не битые;
- HTTPS включен;
- блок событий подтягивает данные из Google Sheets или показывает fallback;
- мобильная версия выглядит нормально.

## Подключение домена

После покупки домена:

1. Добавить домен в Cloudflare.
2. Поменять NS-серверы у регистратора на NS Cloudflare.
3. В Cloudflare Pages открыть проект -> Custom domains.
4. Добавить основной домен, например `your-domain.ru`.
5. Добавить `www.your-domain.ru`, если нужен www-вариант.
6. Обновить `SITE_URL` на реальный домен.
7. Запустить redeploy.
8. Проверить HTTPS и редирект между `www` и корневым доменом.
