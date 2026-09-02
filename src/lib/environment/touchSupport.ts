const IS_TOUCH_SUPPORTED =
  'ontouchstart' in window ||
  // @ts-expect-error DocumentTouch не типизирован и жив только в старых движках
  (window.DocumentTouch && document instanceof DocumentTouch)

export default IS_TOUCH_SUPPORTED
