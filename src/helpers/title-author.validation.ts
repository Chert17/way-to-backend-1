export const titleAndAuthorValidation = (str: string, maxLength: number) => {
  const condition =
    !str || !str.trim() || typeof str !== 'string' || str.length > maxLength;

  if (condition)
    return `Field must be a string and no more than ${maxLength} characters`;

  return;
};
