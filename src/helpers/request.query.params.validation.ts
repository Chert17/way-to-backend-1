import { TypeQueryParams, TypeValidQueryParams } from '../types/req-res.types';

export const requestQueryParamsValidation = (
  params: TypeQueryParams
): TypeValidQueryParams => {
  const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
    params;

  const validParams: TypeValidQueryParams = {
    condition: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  };

  if (searchNameTerm && searchNameTerm.trim()) {
    validParams.condition = searchNameTerm;
  }

  if (sortBy && sortBy.trim()) validParams.sortBy = sortBy;

  if (sortDirection === 'asc' || sortDirection === 'desc') {
    validParams.sortDirection = sortDirection;
  }

  if (pageNumber && !isNaN(pageNumber)) validParams.page = pageNumber;

  if (pageSize && !isNaN(pageSize)) validParams.pageSize = pageSize;

  return validParams;
};
