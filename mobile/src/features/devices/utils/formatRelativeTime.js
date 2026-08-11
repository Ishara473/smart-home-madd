/**
 * Formats an ISO-8601 timestamp string into a human-readable relative time format.
 * E.g., 'Just now', '2m ago', '3h ago', 'Yesterday', '3d ago'.
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Never';

  try {
    const timestamp = new Date(isoString).getTime();
    if (isNaN(timestamp)) return 'Never';

    const now = Date.now();
    const diffMs = now - timestamp;
    
    // Safety check for future timestamps
    if (diffMs < 0) return 'Just now';

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    return `${diffDays}d ago`;
  } catch (error) {
    return 'Never';
  }
}

export default formatRelativeTime;
