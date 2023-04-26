export const minAgeRestrictionValidation = (
  age: number,
  min: number,
  max: number
) => {
  const condition = !age || typeof age !== 'number' || age < min || age > max;

  if (condition)
    return `Field must be a number and not less than ${min} and not more than ${max}`;

  return;
};
