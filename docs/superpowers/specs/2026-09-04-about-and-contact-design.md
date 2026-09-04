# Описание и контакты на главной

Дата: 2026-09-04. Выбор автора по мокапам: описание в варианте D с достижениями строками
из варианта E, контакты в варианте H. Секция «Опыт» не меняется. Ветка `feat/about-contact`
от `master`.

## 1. Верхний блок (описание)

### Стек у роли

- Справа от «Frontend-разработчик» в той же строке (на узком экране переносится под неё)
  три чипа: Vue, Nuxt, TypeScript. Чип: логотип 15px + подпись 13px `--muted`, паддинг
  2px 6px, радиус `--radius-xs`, по наведению фон `--sunk` и текст `--fg`, переход по
  `background-color`/`color` за `--dur-hover`. Чип — ссылка на vuejs.org, nuxt.com,
  typescriptlang.org (`target="_blank"`, `rel="noopener noreferrer"`), с `press-scale`.
- Логотипы из набора `@iconify-json/logos` через `unplugin-icons`: `~icons/logos/vue`,
  `~icons/logos/nuxt-icon`, `~icons/logos/typescript-icon`. Это единственное исключение
  из правила «только Material Symbols»: бренды рисуются своими знаками. Набор ставится в
  `devDependencies`.
- Данные в `src/data/stack.ts`: `{ id, label, url, icon }`.

### Всплывающие карточки в тексте

- Второй абзац `home.tech` получает три плейсхолдера: ru «Живу в {city}, работаю
  {remote}, {open}.», en «Based in {city}, working {remote}, {open}.». Слова:
  `home.city` «Москве» / «Moscow», `home.remote` «удалённо» / «remotely`,
  `home.open` «открыт к предложениям» / «open to offers». Рендер через `I18nT`
  (`keypath="home.tech"`, `tag="p"`, `scope="global"`) с тремя слотами.
- Каждое слово оборачивается в `HoverNote`: триггер `span` (для `open` — ссылка `a` на
  `MAILTO`) с точечным подчёркиванием `1.5px dotted var(--faint)`; для ссылки цвет
  `--primary` и подчёркивание `1.5px solid color-mix(in oklch, var(--primary) 35%,
  transparent)`, на наведении сплошное `--primary`.
- Карточка на reka-ui `HoverCardRoot/Trigger/Portal/Content` (открывается по наведению
  и по фокусу с клавиатуры; `openDelay` 120, `closeDelay` 80, `side="top"`,
  `sideOffset` 8): фон `--raised`, тень `--shadow-2`, радиус `--radius-3`, паддинг 10px
  12px, ширина не больше `min(320px, 100vw - 32px)`, заголовок в одну строку, подпись
  переносится, появление `opacity` 0→1 + сдвиг 4px за `--dur-surface`
  через классы `tw-animate-css`, как у выпадающего меню (`animate-in fade-in-0
  slide-in-from-bottom-1`). Заголовок 15.5px semibold, подпись `t-small`.
- Содержимое:
  - Москва: заголовок — текущее московское время `HH:MM` (обновляется раз в минуту),
    подпись `home.notes.city` «GMT+3, Европа/Москва» / «GMT+3, Europe/Moscow».
  - Удалённо: заголовок `home.notes.remote.title` «Из дома, по Москве» / «From home, on
    Moscow time», подпись `home.notes.remote.text` «созвоны 10:00–19:00, готов к
    командировкам» / «calls 10:00–19:00, open to business trips».
  - Открыт к предложениям: заголовок с дышащей мятной точкой (`ds-breathe`, уже есть в
    системе) `home.notes.open.title` «Ищу full-time» / «Looking for full-time», подпись
    `EMAIL` + `home.notes.open.text` «отвечаю в течение дня» / «I answer within a day».
- Часы: композабл `src/composables/useMoscowTime.ts` (`{ time: Ref<string> }`,
  интервал 1000 мс, формат `ru-RU` `HH:MM` в `Europe/Moscow`, чистится в
  `onScopeDispose`), общий на всех потребителей через `createSharedComposable`.
  `AppHeader` переводится на него, своя копия логики удаляется.

### Третий абзац

`home.more`: ru «Люблю задачи, где звук и графика встречаются с вебом: плеер на Tauri,
библиотека для Web Audio, тюнер по микрофону. Всё это в открытом коде.», en «I like work
where sound and graphics meet the web: a Tauri player, a Web Audio library, a microphone
tuner. All of it open source.». Тот же `t-body text-muted-foreground`, появление
`rise` с задержкой после второго абзаца (`DELAY_MORE = 0.2`).

### Конкурсы (достижения)

- Отдельная секция после «Опыта» и перед «Связью», в том же стиле, что соседние:
  заголовок `awards.title` «Конкурсы» / «Competitions» 13.5px semibold `--muted`,
  появление `reveal()` при попадании в кадр (решение автора: сначала список стоял в
  верхнем блоке без заголовка, как в мокапе E). Строки как в мокапе E: год классом `t-hand` 20px цвета `--primary` шириной 56px слева, затем
  название 15.5px semibold и подпись `t-small` в одной строке (на узком экране подпись
  переносится). Строка по геометрии как `ListRow` по соседству: паддинг `--row` 12px,
  `mx-[-12px]`, радиус `--radius-4`, зазор 16px, по наведению `--sunk`. Список
  семантический: `ul > li`. Если у достижения есть `url`, строка — ссылка наружу со стрелкой
  `arrow_outward` как у проектов; иначе `article`.
- Данные `src/data/awards.ts`: `{ id: 'procifru', year: 2025 }`,
  `{ id: 'yandexCup', year: 2024 }`, `{ id: 'hackathons', year: 2024 }`; `url`
  опционален и пока ни у кого не задан.
- Локали `awards.json`: `items.procifru` «PROЦИФРУ» / «победитель»; `items.yandexCup`
  «Yandex Cup, Frontend» / «полуфиналист»; `items.hackathons` «Хакатоны Газпрома и
  Моспрома» / «финалист». en: «PROTSIFRU» / «winner»; «Yandex Cup, Frontend» /
  «semi-finalist»; «Gazprom and Mosprom hackathons» / «finalist».
- Появление: как у остальных секций, `reveal()` один раз.

### Что остаётся

Лицо, имя с галочкой, первый абзац, порядок секций. Верхний блок целиком остаётся
внутри `HomePage.vue`; новые компоненты только `HoverNote` и `TechChip`.

## 2. Контакты (вариант H)

- Заголовок «Связь» и абзац с обводкой «дня» без изменений. Чипа статуса нет.
- Под абзацем адрес почты крупно: `button` с текстом `EMAIL`, 24px semibold
  `tracking-[-0.024em]` цвета `--fg`, без фона, `press-scale`, справа иконка
  `content_copy_rounded` 18px `--faint` как подсказка, что клик копирует;
  `aria-label` «адрес, Скопировать» (`contact.copy`). Снизу под текстом линия 3px
  `--primary` радиусом 2px, в покое `scaleX(0)` от левого края, на наведении и фокусе
  `scaleX(1)` за 0.35s `--ease-standard`. Клик копирует адрес в буфер
  (`navigator.clipboard.writeText`, при отсутствии API — ничего не ломается) и на 1.4 с
  показывает подпись `contact.copied` «Скопировано» / «Copied» рядом справа (`t-small`,
  `--primary`, появление по `opacity`), `aria-live="polite"`.
- Ниже строка действий с отступом `--space-4`: кнопка `Button` primary «Написать»
  (`mailto`, как сейчас) и два квадратных `Button` `variant="secondary"` `size="icon-lg"`
  (44px, радиус `--radius-4`, фон `--fill`, на наведении `--fill-hover`) с иконками
  Telegram (`send_rounded`) и GitHub (`code_rounded`), `aria-label` из
  `contact.items.*`, ссылки наружу.
- Подсказка у иконок: reka-ui `TooltipProvider/Root/Trigger/Portal/Content`
  (`delayDuration` 150, `side="bottom"`, `sideOffset` 8): фон `--raised`, тень
  `--shadow-2`, радиус `--radius-2`, паддинг 6px 10px, текст `t-code` 13px `--fg`,
  содержимое — хэндл (`@EG0RK13`, `Eg0r0k`) из `links[].handle`. Появление как у
  карточек. На таче подсказки не нужны: ссылки и так подписаны `aria-label`.
- Прежние ссылки-кнопки `variant="link"` в этой секции удаляются.

## 3. Компоненты

- `src/components/ui/hover-card/`: `HoverCard.vue` (Root), `HoverCardTrigger.vue`,
  `HoverCardContent.vue` (Portal + Content со стилями выше), `index.ts` — по образцу
  `dropdown-menu`.
- `src/components/ui/tooltip/`: `TooltipProvider.vue`, `Tooltip.vue` (Root),
  `TooltipTrigger.vue`, `TooltipContent.vue`, `index.ts`.
- `src/components/home/HoverNote.vue`: пропсы `{ title: string; text?: string; href?: string; dot?: boolean }`,
  слот — слово-триггер. Собирает `HoverCard` с оформлением карточки; при `href` триггер
  `a`, иначе `span` с `tabindex="0"`.
- `src/components/home/TechChip.vue`: пропсы `{ label, url, icon }`.
- `src/components/home/AwardRow.vue`: пропсы `{ year, title, subtitle, url? }`.
- `src/components/home/CopyEmail.vue`: пропс `{ email }`, копирование и подпись.

## 4. Тесты

- `useMoscowTime.spec.ts`: с фейковым `Date` и таймерами даёт `HH:MM` по Москве и
  обновляется через минуту; интервал снимается при остановке scope.
- `CopyEmail.spec.ts`: клик вызывает `navigator.clipboard.writeText` (застабленный
  через `vi.stubGlobal`) с адресом, подпись появляется и исчезает через 1.4 с (fake
  timers); без `clipboard` в `navigator` клик не бросает исключение.
- `AwardRow.spec.ts`: с `url` рендерит `a` со стрелкой, без — `article` без стрелки.
- `awards.ts`/`stack.ts`: проверка, что для каждого `id` есть ключи в обеих локалях
  (тест читает JSON локалей).
- Playwright (контроллер): чипы стека ведут на внешние сайты; наведение на «Москве»
  открывает карточку с временем в формате `HH:MM`; на «открыт к предложениям» —
  карточку с точкой и адресом; клик по адресу показывает «Скопировано»; наведение на
  иконку Telegram показывает `@EG0RK13`; достижения на месте на обоих языках; секция
  «Опыт» без изменений.

## 5. Ограничения дизайн-системы

Бордеров нет; тени только `--shadow-2` у карточек и подсказок; `press-scale` у всего
нажимаемого; переходы по `opacity`, `transform`, `color`, `background-color`; один
primary-кнопка на экран («Написать»); рукопись только для годов; логотипы стека —
осознанное исключение из правила про Material Symbols; всё появление только на главной
и по одному разу; под reduced motion карточки и подсказки появляются без сдвига (только по opacity).
