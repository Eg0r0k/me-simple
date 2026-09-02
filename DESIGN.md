# DESIGN.md — «No borders in mind»

Дизайн-система персонального портфолио. Этот документ — спецификация для адаптации
готовых компонентов **shadcn-vue** под систему: токены, геометрия, правила и покомпонентные
таблицы значений.

Источник истины: `tokens/*.css` (цвет, типографика, радиусы, спейсинг, движение) и
11 референсных компонентов (React) в `components/`. Ниже они переведены в требования.

---

## 0. Как этим пользоваться

1. Скопировать блок токенов из §2 в глобальный CSS проекта (заменить дефолтные переменные shadcn).
2. Пройти по §3 (жёсткие правила) — они ломают дефолтные привычки shadcn, начинать надо с них.
3. Для каждого компонента shadcn-vue открыть его раздел в §5 и переписать `cva`-варианты
   и классы по таблицам.
4. Компоненты, которых в системе нет (Input, Select, Switch, Table…), выводить по §6.
5. Проверить по чеклисту §8.

---

## 1. Суть системы в пяти пунктах

- **Ни одного бордера.** Разделение делают пустое пространство и тон: `bg → surface → sunk → fill`.
- **Светлая и тёмная темы равноправны.** Тёмная — не «инверсия», у неё свои значения.
  Переключение — атрибут `data-theme="dark"` на корне.
- **Одна анимация — нажатие.** `scale(.96)` за 100ms. Hover только на десктопе.
- **Три шрифта с разными обязанностями.** Archivo — весь текст, включая мету; Geist Mono —
  только по-настоящему машинное содержимое; Shantell Sans — «рука», 1–2 раза на экран,
  только несодержательное. Мету от текста отличают размер и цвет, а не гарнитура.
- **Акценты маркируют, а не украшают.** Максимум 2–3 акцента на экран.

---

## 2. Токены

Светлая тема в `:root`, тёмная — в `[data-theme="dark"]`. Значения в oklch — не переводить в hsl.

```css
:root,
[data-theme="light"] {
  /* neutrals */
  --bg: oklch(1 0 0);
  --surface: oklch(0.980 0 0);
  --sunk: oklch(0.945 0 0);
  --fill: oklch(0.910 0 0);
  --fill-hover: oklch(0.875 0 0);
  --raised: oklch(1 0 0);
  --raised-shadow: none;
  --fg: oklch(0.205 0 0);
  --muted: oklch(0.505 0 0);
  --faint: oklch(0.625 0 0);

  /* action */
  --primary: oklch(0.555 0.205 259);
  --on-primary: oklch(1 0 0);
  --btn-surface: oklch(0.235 0 0);
  --btn-surface-hover: oklch(0.295 0 0);
  --on-btn-surface: oklch(0.975 0 0);
  --on-accent: oklch(0.205 0 0);

  /* accents: solid */
  --sky: oklch(0.775 0.095 232);
  --peri: oklch(0.740 0.115 292);
  --amber: oklch(0.835 0.150 88);
  --mint: oklch(0.830 0.095 168);
  --clay: oklch(0.765 0.085 38);
  --danger: oklch(0.665 0.155 22);

  /* accents: soft fill */
  --sky-soft: oklch(0.945 0.030 232);
  --peri-soft: oklch(0.942 0.035 292);
  --amber-soft: oklch(0.955 0.055 88);
  --mint-soft: oklch(0.950 0.032 168);
  --clay-soft: oklch(0.950 0.030 38);
  --danger-soft: oklch(0.945 0.040 22);

  /* accents: ink (текст на soft) */
  --sky-ink: oklch(0.500 0.130 232);
  --peri-ink: oklch(0.470 0.160 292);
  --amber-ink: oklch(0.500 0.110 78);
  --mint-ink: oklch(0.470 0.100 168);
  --clay-ink: oklch(0.490 0.115 38);
  --danger-ink: oklch(0.475 0.170 22);

  --shadow-2: 0 8px 28px oklch(0.235 0.028 258 / 0.08);
}

[data-theme="dark"] {
  --bg: oklch(0.145 0 0);
  --surface: oklch(0.186 0 0);
  --sunk: oklch(0.122 0 0);
  --fill: oklch(0.268 0 0);
  --fill-hover: oklch(0.315 0 0);
  --raised: oklch(0.325 0 0);
  --raised-shadow: 0 1px 2px oklch(0 0 0 / 0.25);
  --fg: oklch(0.975 0 0);
  --muted: oklch(0.715 0 0);
  --faint: oklch(0.625 0 0);

  --primary: oklch(0.595 0.200 259);
  --on-primary: oklch(1 0 0);
  --btn-surface: oklch(0.235 0 0);
  --btn-surface-hover: oklch(0.295 0 0);
  --on-btn-surface: oklch(0.975 0 0);
  --on-accent: oklch(0.165 0 0);

  --sky: oklch(0.800 0.095 232);
  --peri: oklch(0.775 0.110 292);
  --amber: oklch(0.855 0.145 88);
  --mint: oklch(0.855 0.090 168);
  --clay: oklch(0.790 0.085 38);
  --danger: oklch(0.700 0.160 22);

  --sky-soft: oklch(0.320 0.045 232);
  --peri-soft: oklch(0.330 0.050 292);
  --amber-soft: oklch(0.345 0.060 88);
  --mint-soft: oklch(0.330 0.045 168);
  --clay-soft: oklch(0.330 0.045 38);
  --danger-soft: oklch(0.330 0.060 22);

  --sky-ink: oklch(0.880 0.070 232);
  --peri-ink: oklch(0.880 0.080 292);
  --amber-ink: oklch(0.900 0.090 88);
  --mint-ink: oklch(0.890 0.070 168);
  --clay-ink: oklch(0.880 0.070 38);
  --danger-ink: oklch(0.865 0.090 22);

  --shadow-2: 0 10px 30px oklch(0 0 0 / 0.55);
}

:root {
  /* radius — концентрика: внутренний = внешний − паддинг */
  --radius-xs: 6px;    /* badge sm */
  --radius-sm: 7px;    /* badge md */
  --radius-1: 8px;     /* button xs, tab pill */
  --radius-2: 10px;    /* button sm */
  --radius-3: 12px;    /* button md, icon tile, tab tray */
  --radius-4: 14px;    /* button lg, image in card, row hover */
  --radius-5: 16px;    /* button xl */
  --radius-card: 18px;
  --radius-panel: 20px;
  --radius-dialog: 24px;
  --radius-full: 999px;
  --border: 0;

  /* spacing — 4pt */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-6: 24px;  --space-8: 32px;  --space-12: 48px; --space-20: 80px;
  --space-35: 140px;
  --row: 16px;      /* высота строки списка */
  --block: 80px;    /* ритм блоков */

  /* type */
  --font-sans: Archivo, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
  --font-hand: "Shantell Sans", cursive;
  --text-display: 58px;    --text-display-lh: 1.05;  --text-display-ls: -0.035em;
  --text-title: 40px;      --text-title-lh: 1.08;    --text-title-ls: -0.028em;
  --text-heading: 30px;    --text-heading-lh: 1.15;  --text-heading-ls: -0.024em;
  --text-subheading: 20px; --text-subheading-lh: 1.3;--text-subheading-ls: -0.012em;
  --text-body: 16px;       --text-body-lh: 1.6;
  --text-small: 13.5px;    --text-small-lh: 1.55;
  --text-label: 12px;      --text-label-lh: 1.4;
  --text-tech: 15px;       --text-tech-lh: 1.55;
  --text-action: 14px;
  --text-hand: 34px;
  --weight-regular: 400;   --weight-medium: 500;     --weight-semibold: 600;

  /* motion */
  --ease-standard: cubic-bezier(0.2, 0, 0.2, 1);
  --dur-press: 100ms;
  --dur-hover: 140ms;
  --dur-surface: 180ms;
  --dur-loading: 1.6s;
  --press-scale: 0.96;
}

```

Шрифты и класс иконок:

```css
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Shantell+Sans:ital,wght@0,400;0,600;1,500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0&display=swap");

.ms {
  font-family: "Material Symbols Rounded";
  font-weight: 400; font-style: normal; line-height: 1;
  letter-spacing: normal; text-transform: none;
  display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr;
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
}

.press-scale { transition: transform var(--dur-press) var(--ease-standard); transform: scale(1); }
.press-scale:active { transform: scale(var(--press-scale)); }
/* Класс ставится на <html> из useSetupRootClasses по UA-детекту. */
.is-mobile .press-scale { transform: var(--transform-extra, none) scale3d(1, 1, 1); }
.is-mobile .press-scale:active {
  transform: var(--transform-extra, none) scale3d(var(--press-scale), var(--press-scale), 1);
}
@media (prefers-reduced-motion: reduce) {
  .press-scale, .press-scale:active { transition: none; transform: none; }
}
```

### Маппинг токенов shadcn-vue → система

Дефолтные переменные shadcn перекрываются так. `--border` и `--input` обнуляются — на их
месте работает тон.

| shadcn | система | комментарий |
|---|---|---|
| `--background` | `--bg` | |
| `--foreground` | `--fg` | |
| `--card` | `--surface` | карточка на полтона светлее фона |
| `--card-foreground` | `--fg` | |
| `--popover` | `--bg` | поповер поднимается тенью `--shadow-2`, не бордером |
| `--muted` | `--sunk` | как фон |
| `--muted-foreground` | `--muted` | внимание: у shadcn `muted` — фон, у нас — текст |
| `--accent` | `--fill` | hover-заливка → `--fill-hover` |
| `--accent-foreground` | `--fg` | |
| `--primary` | `--primary` | |
| `--primary-foreground` | `--on-primary` | |
| `--secondary` | `--fill` | |
| `--secondary-foreground` | `--fg` | |
| `--destructive` | `--danger-soft` | **не** сплошной красный |
| `--destructive-foreground` | `--danger-ink` | |
| `--border` | `transparent` / удалить | бордеров нет |
| `--input` | `--sunk` | поле = утопленная заливка |
| `--ring` | `--primary` | только focus-visible |
| `--radius` | `12px` (`--radius-3`) | базовый; см. шкалу выше |

---

## 3. Жёсткие правила (нарушают дефолты shadcn)

1. **Удалить все `border`, `border-input`, `divide-*`, `border-b` из компонентов.**
   Замена: смена тона фона (`bg-[var(--surface)]` вместо `border`), пустое место, или тень
   `--raised-shadow` для приподнятого элемента.
2. **`--destructive` никогда не сплошной.** Заливная красная кнопка в системе не существует:
   всегда `--danger-soft` + `--danger-ink`.
3. **Ровно один `primary` на экран.** Вторичное действие — `secondary` (`--fill`) или
   `surface` (тёмная плашка `--btn-surface`, одинаковая в обеих темах).
4. **Никаких пилюль у кнопок.** `rounded-full` только для точек, аватаров и статус-дотов.
5. **Никаких спиннеров.** Загрузка — Skeleton со световой волной 1.6s.
6. **Тени только две:** `--raised-shadow` (приподнятый таб/чип) и `--shadow-2` (диалог, поповер).
   Больше нет.
7. **Каждый нажимаемый элемент получает класс `press-scale`.** Hover — `@media (hover: hover)`.
8. **`transition` только по `background`, `color`, `filter`, `transform`, `opacity`.**
   Никаких `transition-all`.
9. **Мета-текст (даты, годы, версии, номера, счётчики, подписи, лейблы полей) — Archivo 12px,
   цвет `--faint`, без uppercase и без разрядки.** Мету отличают размер и цвет, а не гарнитура.
   **Geist Mono — только для по-настоящему машинного содержимого:** код, хеш коммита,
   координаты, суммы в таблице. Моно в подписи читается как техническая пометка там, где её нет.
   Частный случай, который ловится чаще всего: стек и теги нельзя выводить строкой через `·`
   в моно (`Vue · TypeScript · WebGL`). Технологии — нормальной фразой Archivo 15px / lh 1.55 /
   `--muted` («Звук в браузере: Web Audio API, десятиполосный эквалайзер, HLS») либо, если
   перечень действительно нужен, 2–3 бейджами (§5.4).
   Ссылка-действие рядом с заголовком («открыть на github ↗») — Archivo 14px в цвете акцента,
   без моно и без капса.
10. **Shantell Sans** — только номера разделов, год у проекта, короткие ремарки («soon!»).
    Всегда в цвете палитры и **всегда без наклона**: `transform: none`, `rotate(0)`,
    `font-style: normal`. Наклонённая или курсивная «рука» читается как стикер-декор,
    а рукописность и так видна по гарнитуре. Никогда не заголовок, кнопка, лейбл, текст.
11. **Иконки — только Material Symbols Rounded, filled** (`.ms`, имя иконки текстом внутри).
    Никаких lucide/иных наборов, никаких рисованных SVG. Замена в shadcn-vue: все
    `lucide-vue-next` импорты → `<span class="ms">имя_иконки</span>`.
12. **Мин. тап-таргет на мобильном — 44px.**
13. **Изображения — только 21:9 / 16:9 / 4:3 / 1:1.** Подпись под кадром, в моно, не поверх.

---

## 4. Шкалы

**Кнопки:** высота 26 / 32 / 38 / 44 / 52 → радиус 8 / 10 / 12 / 14 / 16.
**Бейджи:** высота 20 / 24 → радиус 6 / 7.
**Иконки:** 15 / 18 / 20 / 24 / 32 (xs…xl).
**Плитки иконок:** 36 (в карточке/строке), 38 (строка списка), 40 (диалог), 132 (плита карточки).

**Концентрика.** Внутренний радиус = внешний − паддинг:
трей табов 12 при паддинге 4 → пилюля 8; карточка 18–20 при паддинге 10 → кадр 14.

---

## 5. Компоненты

### 5.1 Button → `ui/button`

Отношения: `size` задаёт высоту, паддинг, кегль, радиус и размер иконки одновременно.

| size | height | padding-x | radius | font-size | icon |
|---|---|---|---|---|---|
| xs | 26 | 10 | 8 | 12.5 | 15 |
| sm | 32 | 12 | 10 | 13 | 16 |
| md | 38 | 15 | 12 | 14 | 18 |
| lg | 44 | 18 | 14 | 15 | 20 |
| xl | 52 | 22 | 16 | 16 | 22 |

Со стороны, где стоит иконка, паддинг уменьшается на 3px. Внутренний `gap: 7px`.

| variant | background | color |
|---|---|---|
| primary | `--primary` | `--on-primary` |
| secondary | `--fill` | `--fg` |
| surface | `--btn-surface` | `--on-btn-surface` |
| ghost | `transparent` | `--muted` |
| destructive | `--danger-soft` | `--danger-ink` |
| link | `transparent`, padding 0, height 26 | `--fg`, underline 2px цветом `--peri`, offset 4 |

Общее: `font-family: var(--font-sans)`, `font-weight: var(--weight-medium)`, `border: 0`,
`display: inline-flex`, центрирование по обеим осям.
`disabled` → `background: var(--sunk)`, `color: var(--faint)`, `cursor: not-allowed`.
Hover: `secondary` → `--fill-hover`, `surface` → `--btn-surface-hover`, `ghost` → `--fill`,
`primary` → `filter: brightness(1.08)`.
Переход: `transform var(--dur-press) var(--ease-standard), background var(--dur-hover) ease, filter var(--dur-hover) ease, color var(--dur-hover) ease`.

Что убрать из дефолта shadcn: `rounded-md` на все размеры, `border`, `shadow-sm`,
`size="icon"` (это отдельный IconButton), сплошной destructive, `focus:ring-offset`.

### 5.2 IconButton → `ui/button` с `size="icon"`

Квадрат: те же высоты и радиусы, что у Button, `width == height`, паддинг 0, одна глиф-иконка.
Варианты те же (по умолчанию `surface`). Обязателен `aria-label`. Не меньше 26px,
и не меньше 44px, если это единственный тап-таргет на телефоне.

### 5.3 Icon

Не компонент shadcn, но нужен всем: `<span class="ms" style="font-size:{size}px; color:{color}">name</span>`.
Размеры xs 15 / sm 18 / md 20 / lg 24 / xl 32 или число. Цвет из палитры, по умолчанию
`currentColor`. Внутри текста — `vertical-align: middle` на обёртке.

### 5.4 Badge → `ui/badge`

Статичный лейбл. **Не кликабельный, не фильтр-чип** — фильтр это Button.

| size | height | radius | font-size | padding | gap |
|---|---|---|---|---|---|
| sm | 20 | 6 | 11.5 | `0 7px` (с иконкой/дотом `0 7px 0 5px`) | 4 |
| md | 24 | 7 | 12.5 | `0 8px` (с иконкой/дотом `0 8px 0 6px`) | 5 |

Тон = фон + текст: `primary` (`--primary`/`--on-primary`), `secondary` (`--fill`/`--fg`),
`surface` (`--surface`/`--fg`), `ghost` (`transparent`/`--muted`),
`destructive` (`--danger-soft`/`--danger-ink`), и пять акцентов — `--{tone}-soft` фон,
`--{tone}-ink` текст (sky, peri, amber, mint, clay).
`dot` — точка 6×6, `border-radius: var(--radius-full)`, цвет = цвет текста; игнорируется,
если задана иконка. Иконка: 13 (sm) / 15 (md). `white-space: nowrap`, вес medium.

Один-два бейджа в строке; третий означает, что строке нужен второй ряд.

### 5.5 Tabs → `ui/tabs`

**variant `default`** — пилюля в утопленном трее (концентрика):

| size | tray radius | tray padding | pill height | pill radius | pill padding-x | font-size |
|---|---|---|---|---|---|---|
| sm | 11 | 3 | 26 | 8 | 10 | 11.5 |
| md | 12 | 4 | 32 | 8 | 14 | 13.5 |

Трей: `display: inline-flex`, `gap: 2`, `background: var(--sunk)`.
Активная пилюля: `background: var(--raised)`, `box-shadow: var(--raised-shadow)`,
`color: var(--fg)`. Неактивная: `transparent` / `--muted`.
Только иконка без лейбла → пилюля квадратная (26 или 32).

**variant `line`** — `display: flex`, `gap: var(--space-6)`, без контейнера и разделителей.
Лейбл 14.5px: активный semibold `--fg`, неактивный medium `--muted`. Под лейблом полоса
`height: 2px`, `border-radius: 2px`, активная — `--primary`, неактивная — `transparent`.
Отступ лейбл→полоса 10px. Иконка активного — `--primary`.

Убрать из дефолта: `border-b` под списком табов, `data-[state=active]:border-b-2`,
`bg-muted` в неверном значении (см. маппинг).

### 5.6 Card → `ui/card` (референс ProjectCard)

Плита-вариант (сетка избранного): `background: var(--surface)`,
`border-radius: var(--radius-card)` (18), `padding: 10`.
Внутри плита `height: 132`, `border-radius: var(--radius-3)`, фон `--{tone}-soft`,
глиф 40px цветом `--{tone}`, центрирован.
Карточка — колонка с `gap: 12` между плитой и текстовым блоком. Без этого зазора
заголовок встаёт вплотную к плите: одного паддинга текстового блока не хватает.
Текстовый блок под плитой: `padding: 2px 8px 10px`, `gap: 6`.
Заголовок 15.5px semibold `line-height: 1.3` `letter-spacing: -0.01em`; год — Archivo 12px
`--faint`, справа
(`margin-left: auto`); подпись одна строка `--text-small` / lh 1.5 / `--muted`.

Компакт-вариант: `padding: 20`, `gap: 12`, вместо плиты плитка 36×36 радиус
`--radius-3` с фоном `--{tone}-soft` и иконкой md цветом `--{tone}`.

`empty` (пустой слот): фон `--sunk`, плитка `--bg`, весь текст и глиф — `--faint`.

Никаких тумбнейлов-картинок, рядов тегов и двойной меты в карточке. Тинт — то, чем
проекты отличаются друг от друга. `CardHeader/CardContent/CardFooter` из shadcn
сворачиваются в эти два блока; убрать `border-b` в `CardHeader`.

### 5.7 List row → референс ProjectRow (нет прямого аналога в shadcn; база для Table/Command/Select-итемов)

`display: flex`, `align-items: center`, `gap: 16`, `padding: var(--row) 12px`,
`margin: 0 -12px` (заливка выходит за текст, не сдвигая его),
`border-radius: var(--radius-4)`.
Фон: `transparent` → hover `--sunk` → `selected` липкий `--sunk`.
Переход `background var(--dur-surface) ease`. **Разделителей нет — hover-заливка и есть разделитель.**

Слева плитка 38×38 радиус `--radius-3` фон `--{tone}-soft`, иконка md цветом `--{tone}`;
либо вариант с рукописным индексом: Shantell Sans 20px цветом `--clay`, без наклона, без плитки.
Заголовок 15.5px semibold `-0.012em` с `text-overflow: ellipsis`; подпись `--text-small`
`--muted`, скрывается на узких экранах. Справа: год Archivo 12px `--faint`, затем
`arrow_outward` sm `--faint`. Внутренние `gap`: 8 у заголовка, 12 у правой группы.

Списки длиннее шести элементов используют строку, не карточку.

### 5.8 Dialog → `ui/dialog`, `ui/alert-dialog`, `ui/sheet`

Панель: `background: var(--bg)`, `border-radius: var(--radius-panel)` (20),
`padding: var(--space-6)` (24), `gap: var(--space-4)` (16), `box-shadow: var(--shadow-2)`,
`max-width: 380px` по умолчанию. Оверлей — скрим цветом `--sunk` (с прозрачностью), панель по центру.

Шапка: `display: flex`, `align-items: flex-start`, `gap: 12`. Плитка 40×40 радиус
`--radius-3` фон `--{tone}-soft`, глиф 22px цветом `--{tone}` (для `danger` — `--danger-ink`).
Заголовок 17px semibold `-0.015em`; описание `--text-small` / lh 1.55 / `--muted`; `gap: 4`.
Кнопка закрытия — IconButton ghost, `margin: -4px -4px 0 0`, `margin-left: auto`.

Действия: `display: flex`, `justify-content: flex-end`, `gap: 8`. Отмена — `ghost`,
подтверждение — `primary` или `destructive` (soft).

Вариант с медиа (кадр над заголовком): `padding: 10px 10px 20px`, `gap: 14`,
внутренние блоки получают `padding: 0 10px`, шапка выравнивается по центру, `gap: 8`.

Убрать: `border` на панели, `rounded-lg`, `sm:rounded-lg`, крестик как отдельный `absolute` без размера.

### 5.9 Skeleton → `ui/skeleton`

Форма повторяет геометрию того, что заменяет: те же высоты, радиусы и гэпы.

| shape | height | radius | width |
|---|---|---|---|
| line | 11 | 5 | 100% |
| title | 14 | 6 | 60% |
| tile | 36 | 11 | 36 |
| avatar | 36 | full | 36 |
| plate | 132 | 12 | 100% |

База `background: var(--sunk)`, поверх — бегущая волна
`linear-gradient(90deg, transparent, var(--surface), transparent)`, анимация `ds-sweep`
`--dur-loading` (1.6s) линейно, бесконечно; `overflow: hidden`.
Сложенные строки сдвигать по фазе на 0.15s (`animation-delay`). Альтернатива — `ds-breathe`
(opacity 1 → .55). Спиннеров нет.

```css
@keyframes ds-sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes ds-breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
```

### 5.10 EmptyState (нет в shadcn — собрать)

`layout="center"` — полная панель: композиция из плиток, заголовок, описание, кнопки
(максимум одна primary). `fan` — три плитки, развёрнутые веером (каждая со своим
`tone` + `icon`), самый громкий вариант. `layout="row"` — инлайн-ошибка внутри списка.
`layout="silent"` — бесцветный слот, который просто ждёт.
`note` — рукописная ремарка у плитки («soon!»), Shantell Sans, без наклона.
Копирайт: не извиняться, а говорить, что делать дальше.

### 5.11 Frame (нет в shadcn — база для `ui/avatar`, `ui/aspect-ratio`, любых картинок)

`<figure>` с `margin: 0`, `gap: 10`, подпись **под** кадром.
Соотношения: `wide 21/9`, `screen 16/9`, `crop 4/3`, `square 1`. Других нет
(21:9 — один раз на кейс).
Радиус: 14 внутри карточки, 20 отдельно, 0 в полный край.
Пустой кадр: фон `--{tone}-soft` и глиф 26px цветом `--{tone}` — тинтованный кадр лучше
серого, если картинка принадлежит известному проекту; иначе `--sunk` + `--faint`.
`placeholder` — полосатая заливка «drop a shot here».
Подпись: Archivo `--text-label` (12px), `--faint`. `note` — рукописная ремарка 16px `--clay`,
без наклона, приколотая в правом нижнем углу кадра.
Картинка: `width/height: 100%`, `object-fit: cover`.

---

## 6. Компоненты shadcn-vue, которых в системе нет

Выводить по этим правилам, не изобретая новых сущностей.

**Input / Textarea.** Утопленное поле: `background: var(--sunk)`, `border: 0`,
`border-radius: var(--radius-2)` (10) при height 38 (как button md → но поля выше: 40),
`padding: 0 12px`, `font-size: 14px`, `color: var(--fg)`,
placeholder `--faint`. Focus: `box-shadow: 0 0 0 2px var(--primary)` внутрь либо смена фона
на `--fill` — никаких бордеров и ring-offset. Ошибка: `background: var(--danger-soft)`,
текст ошибки `--danger-ink` `--text-small`. Лейбл над полем — Archivo `--text-label` (12px) `--faint`.

**Select / Combobox / DropdownMenu / Popover / Command.** Триггер = Input (утопленный) с
глифом `expand_more` 18px `--faint` справа. Меню: `background: var(--bg)`,
`border-radius: var(--radius-3)`, `padding: 4`, `box-shadow: var(--shadow-2)`, без бордера.
Итем = List row в компактной версии: height 34, `padding: 0 10px`,
`border-radius: var(--radius-1)`, hover `--fill`, выбранный `--sunk` + глиф `check` 16px
`--primary`. Разделитель групп — не линия, а заголовок группы Archivo `--text-label` (12px)
`--faint` с `padding: 8px 10px 4px`.

**Checkbox / Radio / Switch.** Невыбранное — `--fill`, выбранное — `--primary` с
`--on-primary` глифом. Checkbox 18×18 радиус `--radius-xs`, radio 18×18 `--radius-full`,
switch 36×22 трек `--radius-full` (`--fill` → `--primary`), ручка 18 белая.
Переход `background var(--dur-hover) ease`.

**Tooltip.** `background: var(--btn-surface)`, `color: var(--on-btn-surface)`,
`font-size: 12.5`, `padding: 6px 9px`, `border-radius: var(--radius-1)`, без стрелки,
без бордера, тень `--shadow-2`.

**Table.** Никаких `border-b` у строк. Шапка — Archivo `--text-label` (12px) `--faint`,
`padding-bottom: 10`. Числовые ячейки — единственное место в таблице, где уместен Geist Mono. Строки — List row (§5.7) с hover `--sunk` и отрицательными маргинами.
Зебру не использовать.

**Accordion / Collapsible.** Триггер — строка без бордера, глиф `expand_more` 18px `--faint`
с `transform: rotate(180deg)` в открытом состоянии, переход `--dur-surface`. Разделение
между секциями — `gap: var(--space-3)` и фон `--surface` у открытой секции, не линия.

**Alert.** Всегда soft: фон `--{tone}-soft`, текст `--{tone}-ink`, глиф `--{tone}-ink`,
`border-radius: var(--radius-3)`, `padding: 14px 16px`, `gap: 10`.
**Никаких цветных левых бордеров.**

**Toast / Sonner.** Как Dialog в миниатюре: `--bg`, радиус `--radius-3`, `padding: 14`,
тень `--shadow-2`, плитка 32×32 с тоном по типу события.

**Progress.** Трек `--sunk` height 6 радиус `--radius-full`, заполнение `--primary`.
Индетерминированное состояние — не спиннер, а `ds-sweep` по треку.

**Avatar.** Frame `square` с `--radius-full`; фолбэк — инициалы Archivo semibold на
`--{tone}-soft` цветом `--{tone}-ink`.

**Separator.** Компонент существует, но по умолчанию **не использовать**. Если без него
никак — не линия, а полоса пустого места `var(--space-6)`; в крайнем случае
`background: var(--sunk)`, `height: 1px`, только внутри плотных панелей.

---

## 7. Типографика в разметке

| роль | шрифт | размер / lh / ls | вес | цвет |
|---|---|---|---|---|
| display | Archivo | 58 / 1.05 / −0.035em | 600 | `--fg` |
| title | Archivo | 40 / 1.08 / −0.028em | 600 | `--fg` |
| heading | Archivo | 30 / 1.15 / −0.024em | 600 | `--fg` |
| subheading | Archivo | 20 / 1.3 / −0.012em | 500–600 | `--fg` |
| body | Archivo | 16 / 1.6 | 400 | `--fg` |
| small | Archivo | 13.5 / 1.55 | 400 | `--muted` |
| label (мета) | Archivo | 12 / 1.4 | 400–500 | `--faint` |
| tech (стек фразой) | Archivo | 15 / 1.55 | 400 | `--muted` |
| action (ссылка у заголовка) | Archivo | 14 | 500 | акцент палитры |
| code (машинное) | Geist Mono | по контексту | 400–500 | `--muted` |
| hand | Shantell Sans | 34, без наклона | 600 | акцент палитры |

Крупные кегли задавать через `clamp()` (например `clamp(32px, 7.5vw, 58px)`), сохраняя
`line-height` и `letter-spacing` из таблицы. Всем абзацам — `text-wrap: pretty`.

---

## 8. Чеклист приёмки компонента

- [ ] Ни одного `border`, `divide`, `ring-offset`, `border-input` в классах.
- [ ] Все цвета — из токенов; ни одного хардкода hex/rgb и ни одной палитры Tailwind
      (`slate-*`, `zinc-*`, `blue-*`).
- [ ] Компонент корректен и в светлой, и в тёмной теме (проверять `data-theme="dark"`).
- [ ] Высота и радиус взяты из шкалы §4, вложенные радиусы концентричны.
- [ ] Нажимаемые элементы имеют `press-scale`; hover под `@media (hover: hover)`.
- [ ] `transition` перечисляет свойства, `transition-all` отсутствует.
- [ ] Иконки — `.ms` (Material Symbols Rounded filled), lucide удалён.
- [ ] Мета-текст в Archivo 12px `--faint`, без капса и разрядки; Geist Mono только на
      машинном содержимом; стек не выведен строкой через `·` в моно.
- [ ] Shantell Sans не попал в UI-текст и нигде не наклонён.
- [ ] Destructive — soft, не сплошной; primary на экране один.
- [ ] Загрузочные состояния — Skeleton, не спиннер.
- [ ] Тап-таргеты на мобильном ≥ 44px.
- [ ] `prefers-reduced-motion` отключает press-scale и волну skeleton.
