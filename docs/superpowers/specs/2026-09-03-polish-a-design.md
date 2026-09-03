# Полировка A: шапка, прокрутка, подгрузка, маркер, ховер карточек

Дата: 2026-09-03. Пять независимых улучшений, собранных в один спек, потому что каждое
небольшое и не требует обсуждения. Ветка `feat/polish-a` от `master` после слияния
превью проектов.

## 1. Шапка отдельным компонентом, «me» ведёт на главную

- Новый `src/components/AppHeader.vue`. В него переезжает вся разметка `<header>` из
  `App.vue` вместе с логикой: часы (`updateTime`, интервал), выбор языка, `SoundToggle`,
  переключение темы, `HEADER_ACTION`. В `App.vue` остаётся `MotionConfig`, корневая
  раскладка и `initLocale()` в `onMounted`.
- Бренд `me` становится `RouterLink` на `routeLocation.home()`: класс `t-subheading`
  сохраняется, плюс `press-scale`, `no-underline`, `rounded-2`. На главной у ссылки
  `aria-current="page"`. Никакого ховер-эффекта: это и так текст цвета `--fg`.
- Внешний вид шапки не меняется: высота 72px, колонка `--column`, паддинги `--space-6`.

## 2. Тело страницы в `Scrollable`, память прокрутки

- Корень `App.vue`: `div.flex.h-dvh.flex-col.bg-background`. Внутри `AppHeader`
  (`shrink-0`), затем `Scrollable` (`min-h-0 flex-1`), внутри него `main` с `RouterView`
  и прежним `pb-[var(--space-20)]`. Шапка всегда видна, прокручивается только тело.
  Ползунок `Scrollable` остаётся как есть: 4px, `--fill`, виден при наведении.
- Композабл `src/composables/useScrollMemory.ts`:
  - `createScrollMemory()` возвращает `{ save(path, position), restore(path): number }`
    поверх `Map<string, number>`, неизвестный путь даёт `0`.
  - `useScrollMemory(router, host)` где `host: () => { get(): number; set(position): void } | null`.
    В `router.beforeEach` сохраняет `host().get()` для `from.fullPath` (если `from`
    вообще был страницей, `from.matched.length > 0`). В `router.afterEach` после
    `nextTick` вызывает `host().set(memory.restore(to.fullPath))`.
  - `App.vue` передаёт хост поверх `scrollable.container` (открытый `containerRef`):
    `get` читает `scrollTop`, `set` пишет `scrollTop`.
- `scrollBehavior` из `src/router/index.ts` убирается: окно больше не прокручивается,
  за позицию отвечает композабл.
- Что не меняется: `whileInView` у секций (IntersectionObserver по умолчанию смотрит
  на viewport, контейнер внутри него), карточка у курсора (`clientX/Y` и `position: fixed`
  не зависят от контейнера), переход темы по клику.
- Известный компромисс: на телефоне адресная строка браузера перестаёт прятаться при
  прокрутке, потому что прокручивается не документ. Принимается.

## 3. Плавная подгрузка картинок в `ProjectShot`

- `img` стартует с `opacity: 0` и получает `opacity: 1` по событию `load`, переход
  `opacity 300ms ease`. Под картинкой по-прежнему фон `--sunk`, он и виден, пока грузится.
- Если картинка уже в кэше (`img.complete && img.naturalWidth > 0` на `onMounted`),
  она показывается сразу, без затемнения.
- При смене `src` (смена языка) состояние сбрасывается и новый кадр снова проявляется.
- Работает в обоих местах: карточка у курсора и страница `/projects`, компонент один.

## 4. Маркер «от руки» на слове «дня» / «a day»

- Компонент `src/components/ui/marker/Marker.vue` (+ `index.ts`): тег `mark`, слот с
  текстом, `color: inherit`, свой фон прозрачный. Подложка в `::before`: фон
  `--amber-soft`, выступает за края слова на 0.1–0.15em, скругления неравные
  (`0.55em 0.35em 0.5em 0.4em / 0.4em 0.55em 0.35em 0.6em`), без поворота. Классы
  `.marker`, `.marker-drawn` живут в `src/style.css` в `@layer components`.
- «Прорисовка»: пока элемент не побывал в кадре, подложка `scaleX(0)` с
  `transform-origin: left center`. Компонент следит за собой через
  `useElementVisibility` из `@vueuse/core`; при первом попадании в кадр ставит класс
  `marker-drawn`, и подложка растягивается до `scaleX(1)` за 0.5s `--ease-standard`.
  Один раз, обратно не сворачивается. Под `prefers-reduced-motion: reduce` подложка
  показана сразу без анимации. Если `IntersectionObserver` недоступен, подложка
  показана сразу.
- Локали: `contact.lead` получает плейсхолдер `{day}`, новое `contact.day`:
  ru «Пишите по любому из адресов, отвечаю в течение {day}.» / «дня»,
  en «Reach me at any of these, I answer within {day}.» / «a day».
- `HomePage.vue`: абзац контакта рендерится через `I18nT` из `vue-i18n`
  (`keypath="contact.lead"`, `tag="p"`, те же классы), слот `#day` содержит
  `<Marker>{{ t('contact.day') }}</Marker>`.

## 5. Ховер карточек на `/projects`

- Карточка получает класс `group`. Скриншот внутри обрезанной рамки:
  `transition: transform 300ms var(--ease-standard)`, на ховере `scale(1.02)`.
  Стрелка `arrow_outward`: `transition: transform var(--dur-hover) var(--ease-standard)`,
  на ховере сдвиг `translate(2px, -2px)`.
- Только под `hover: hover` (Tailwind `hover:` так и работает). Под
  `prefers-reduced-motion: reduce` ховер-трансформы отключены (`motion-reduce:`).
- Появлений при открытии страницы по-прежнему нет.

## Тесты

- `src/composables/useScrollMemory.spec.ts`: `createScrollMemory` (сохранить и вернуть,
  неизвестный путь → 0, перезапись); `useScrollMemory` с настоящим `createRouter` на
  `createMemoryHistory` и фейковым хостом: после `push('/projects')` хост получил `set(0)`,
  после возврата на `/` получил сохранённую позицию.
- `src/components/project-list/ProjectShot.spec.ts`: до `load` у `img` класс
  `opacity-0`, после `trigger('load')` класс `opacity-100`.
- `src/components/ui/marker/Marker.spec.ts`: рендерит `mark.marker` с текстом слота.
- Playwright (контроллер): `me` ведёт на главную с `/projects`; прокрутка главной
  восстанавливается после «Проекты → На главную»; `/projects` открывается сверху; шапка
  остаётся на месте при прокрутке; ховер карточки меняет transform у картинки; картинка
  в карточке у курсора проявляется, а не появляется скачком.

## Ограничения дизайн-системы

Бордеров нет; переходы только по `opacity`, `transform`, `color`, `background-color`;
`press-scale` у ссылки `me`; иконки только Material Symbols rounded; акцент маркера
один на экран; появления один раз на элемент; всё выключается под reduced motion.
