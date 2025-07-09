export function getOfferStatus(startDate, endDate) {
  const now = new Date();

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "inactive";
  if (now >= start && now <= end) return "active";
  return "closed";
}
