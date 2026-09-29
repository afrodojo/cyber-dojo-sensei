// Master admin emails — these accounts are always granted admin role and cannot be demoted or deleted.
export const MASTER_ADMIN_EMAILS = [
  'cyberdojosensai@gmail.com',
  'cyberdojosensei@gmail.com'
];

export const isMasterAdmin = (email) => {
  if (!email) return false;
  return MASTER_ADMIN_EMAILS.includes(email.toLowerCase());
};