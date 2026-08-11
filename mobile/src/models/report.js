/**
 * Firestore Report document model.
 * Collection: reports/{reportId}
 */
export function createReport({
  id,
  homeId,
  type,
  title,
  summary = '',
  data = {},
  period = null,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    homeId,
    type,
    title,
    summary,
    data,
    period,
    createdAt,
    updatedAt,
  };
}

export default createReport;
