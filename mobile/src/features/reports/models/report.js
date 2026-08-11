/**
 * Creates a normalized Report model object.
 */
export function createReport({
  id,
  type,
  title,
  period = { start: null, end: null },
  data = {},
}) {
  return {
    id,
    type,
    title,
    period,
    data,
  };
}

export default { createReport };
