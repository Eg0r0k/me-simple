# Полировка B: кроссфейд кадров, обводка ручкой, злая кнопка «me»

Дата: 2026-09-03. Три правки по обратной связи после полировки A. Ветка `feat/polish-b`
от `master` после слияния A.

## 1. Кроссфейд кадра при смене языка

Сейчас при смене `src` в `ProjectShot` старый кадр гаснет до подложки и новый проявляется
заново: между ними мелькает серый фон. Нужно, чтобы старый кадр оставался, пока новый не
загрузится, и новый проявлялся поверх него.

- `ProjectShot` держит стопку слоёв `layers: { src: string; loaded: boolean }[]`,
  не больше двух. При первом `src` создаётся один слой. При смене `src` сверху
  добавляется новый слой с `loaded: false`; когда его `img` загрузился, слой получает
  `loaded: true`, и через `--dur-reveal` все слои ниже удаляются.
- Каждый слой: `img` с теми же атрибутами, что сейчас (`alt=""`, `decoding="async"`,
  `fetchpriority="low"`, `draggable="false"`, `object-cover object-left-top`), абсолютно
  позиционированный на весь кадр, `opacity` 0 → 1 по `loaded`, переход
  `opacity var(--dur-reveal) var(--ease-standard)`, `motion-reduce:transition-none`.
- Картинка из кэша: если на монтировании слоя `img.complete && naturalWidth > 0`,
  слой сразу `loaded`.
- Если новый `src` совпадает с верхним слоем, ничего не происходит.
- Плашка с командой (`kind: 'command'`) не меняется.
- Подложка `--sunk` остаётся под стопкой, видна только до первой загрузки.

Тесты (`ProjectShot.spec.ts`): после смены `locale` в DOM два `img`, старый со
`opacity-100`, новый с `opacity-0`; после `load` у нового он `opacity-100`; после таймера
(`vi.useFakeTimers`, `--dur-reveal` = 300 мс) остаётся один `img` с новым `src`. Прежние
тесты про первую загрузку сохраняются.

## 2. Обводка ручкой вместо маркера

Маркер-подложка убирается. Вместо него слово «дня» / «a day» обводится штрихом, как
ручкой: неровная петля вокруг слова, которая рисуется при первом появлении в кадре.

- Компонент `src/components/ui/pen-stroke/PenStroke.vue` (+ `index.ts`). Корень
  `span.pen-stroke` с `position: relative; white-space: nowrap; display: inline-block`,
  внутри слот с текстом и `svg.pen-stroke-ink` (`aria-hidden="true"`), абсолютно
  позиционированный с выступом `inset: -0.35em -0.4em`, `overflow: visible`,
  `pointer-events: none`, `preserveAspectRatio="none"`, `viewBox="0 0 100 40"`.
- Путь: одна незамкнутая петля, начинается слева по центру, идёт по верху направо,
  огибает правый край, возвращается по низу и заканчивается с небольшим заходом на
  вторую линию, как рука, которая не остановилась ровно:
  `M 6 22 C 10 6, 58 2, 90 8 C 104 14, 98 34, 60 37 C 26 39, 0 33, 4 20 C 7 12, 30 9, 52 9`.
  Атрибуты: `fill="none"`, `stroke="var(--primary)"`, `stroke-width="1.75"`,
  `vector-effect="non-scaling-stroke"`, `stroke-linecap="round"`,
  `stroke-linejoin="round"`, `pathLength="1"`.
- Прорисовка: `stroke-dasharray: 1; stroke-dashoffset: 1` в покое; при классе
  `pen-stroke-drawn` `stroke-dashoffset: 0` с переходом
  `stroke-dashoffset 0.6s var(--ease-standard) 0.25s`. Под `prefers-reduced-motion:
  reduce` штрих показан сразу без перехода. Без `IntersectionObserver` показан сразу.
  Наблюдение за собой через `useElementVisibility`, один раз, как было у маркера.
- Стили в `src/style.css` в `@layer components` (`.pen-stroke`, `.pen-stroke-ink`,
  `.pen-stroke-drawn`), классы `.marker*` удаляются вместе с компонентом `Marker`,
  его `index.ts` и тестом.
- `HomePage.vue`: `<Marker>` → `<PenStroke>`, локали не меняются.
- Цвет чернил `--primary`: это единственный `primary` на экране, кнопка «Написать»
  рядом тоже `primary`. Так как правило системы «ровно один primary на экран» касается
  кнопок, а штрих не кнопка, принимается.

Тест (`PenStroke.spec.ts`): рендерит `span.pen-stroke` с текстом слота и `svg` с
`path`; без `IntersectionObserver` класс `pen-stroke-drawn` стоит сразу.

## 3. Злая кнопка «me»

Чем чаще нажимают «me» в шапке, тем злее она становится: краснеет и трясётся сильнее.
Без нажатий за несколько секунд отпускает.

- Композабл `src/composables/useAnger.ts`:
  - `level: Ref<number>` от 0 до 1. `poke()` добавляет `0.2` (не выше 1) и запускает
    остывание: каждые 100 мс `level` уменьшается на `0.005` (полное остывание с 1 за
    ~20 с, с одного клика за ~4 с). При `level === 0` таймер останавливается.
  - `shakeKey: Ref<number>` увеличивается на каждый `poke()`, чтобы перезапускать
    тряску.
  - Таймер чистится в `onScopeDispose`.
- `AppHeader.vue`: ссылка `me` получает `@click="poke"`, стиль
  `--anger: level`, класс `is-shaking` на время анимации (ставится по `shakeKey`,
  снимается по `animationend`; повторный клик во время тряски перезапускает её через
  снятие и постановку класса на следующем кадре).
- Стили в `@layer components`:
  - `.brand-anger { color: color-mix(in oklch, var(--fg), var(--danger) calc(var(--anger, 0) * 100%)); transition: color var(--dur-hover) ease; }`
  - `.brand-anger.is-shaking { animation: brand-shake 0.35s var(--ease-standard); }`
  - `@keyframes brand-shake` сдвигает по x на `calc(-2px - 6px * var(--anger))` и
    обратно, четыре качания, плюс поворот `calc(-1deg - 3deg * var(--anger))`.
    Единственный transform на элементе, поэтому `press-scale` у ссылки заменяется на
    этот же transform-цикл; без класса тряски `transform: none`.
  - Под `prefers-reduced-motion: reduce` анимации нет, остаётся только цвет.
- Клик по-прежнему ведёт на главную. На главной это дублированная навигация, память
  прокрутки её игнорирует (сделано в A).
- Звук: `cue('tick')` на каждый клик, как у переключателей в шапке.

Тесты (`useAnger.spec.ts`, fake timers): один `poke` даёт `0.2`; шесть — `1`;
через 4 с после одного `poke` уровень `0`; `shakeKey` растёт на каждый `poke`.

## Playwright (контроллер)

- Смена языка при наведённой карточке: между сменой и загрузкой нового кадра в стопке
  два `img`, серая подложка не видна (старый кадр `opacity: 1`), затем остаётся один.
- В секции «Связь» вокруг «дня» есть `svg path`, после появления в кадре
  `stroke-dashoffset` уходит в 0; на английском обведено «a day».
- Пять быстрых кликов по «me»: цвет ссылки уходит от `--fg` к `--danger`, элемент
  получает класс `is-shaking`; через 6 с цвет возвращается к `--fg`.

## Ограничения дизайн-системы

Бордеров нет; переходы по `opacity`, `color`, `transform`, `stroke-dashoffset`
(последнее только для штриха); всё выключается под reduced motion; иконки не
добавляются; акцент штриха один на экран.
