/**
 * Moment ships its locale files as plain JavaScript with no declarations, so
 * TypeScript 6 — which enables `noUncheckedSideEffectImports` by default —
 * rejects `import 'moment/locale/id'`.
 *
 * The import is load-bearing: it registers the Indonesian locale that
 * `moment.locale('id')` in @/lib/format then selects, which is what renders
 * dates as `12 Maret 2025` rather than `12 March 2025`.
 */
declare module 'moment/locale/*'
