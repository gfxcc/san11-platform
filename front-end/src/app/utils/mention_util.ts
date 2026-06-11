export interface MentionTarget {
  userId: string | number;
  username: string;
}

const legacyMentionPattern = /@([^@#$%^&*()=+{}\[\]|\\:<>?]+):/g;

export function buildMentionAnchor(target: MentionTarget): string {
  const userId = escapeHtml(`${target.userId}`);
  const username = escapeHtml(target.username);
  return `<a class="mention" data-user-id="${userId}" href="/users/${userId}">@${username}</a>`;
}

export function buildReplyHtml(body: string, target?: MentionTarget): string {
  const escapedBody = escapeHtml(body).replace(/\n/g, '<br>');
  return target ? `${buildMentionAnchor(target)} ${escapedBody}` : escapedBody;
}

export function renderMentionContent(content: string): string {
  if (!content) {
    return '';
  }

  if (/<[a-z][\s\S]*>/i.test(content)) {
    return normalizeMentionAnchors(content);
  }

  return escapeHtml(content)
    .replace(/\n/g, '<br>')
    .replace(legacyMentionPattern, (_match, username) => {
      const displayName = escapeHtml(username.trim());
      return `<span class="mention mention-legacy">@${displayName}</span>`;
    });
}

function normalizeMentionAnchors(content: string): string {
  return content;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
