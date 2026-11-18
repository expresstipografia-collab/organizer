# Органайзер

Личный органайзер: работа и дом, задачи, идеи, дни рождения, врачи. Работает без интернета (service worker + офлайн-кэш Firestore), синхронизируется через Firebase (вход через Google).

- `index.html` — приложение целиком; без `firebase-config.js` работает как локальный файл (localStorage).
- `firebase.js` — собранный Firebase SDK (app, auth, firestore).
- `inbox.json` — зашифрованные (AES-GCM) записи, которые добавляет Claude; приложение импортирует их при открытии. Ключ вводится один раз ссылкой `#key-…` и хранится в Firestore пользователя.
- `tools/add.mjs` — добавить записи в inbox.
