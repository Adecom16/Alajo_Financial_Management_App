// Format a date to a human-readable string
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Generate a random ID
  export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };