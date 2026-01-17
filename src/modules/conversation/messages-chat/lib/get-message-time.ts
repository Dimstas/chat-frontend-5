export const getMessageTime = (created_at: number): string => {
  const messageDate = new Date(created_at * 1000);
  const hours = messageDate.getHours();
  const minutes = messageDate.getMinutes();
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};
