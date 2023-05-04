export const requestConditionValidation = <T, B>(
  condition: T,
  defVal: B
): T | B => (!condition ? defVal : condition);
