export const requestConditionValidation = <T, B>(
  condition: T,
  defVal: B
): T | B => {
  const validCondition = defVal;

  return validCondition;
};
