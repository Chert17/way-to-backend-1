import {
  TypeRequestParamsPagination,
  TypeValidRequestQueryParams,
} from '../types/req-res.types';

export const paginationRequestQueryValidation = (
  query: TypeRequestParamsPagination
) => {
  const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;

  const validParams: TypeValidRequestQueryParams = {
    searchNameTerm: '',
    sortDirection: 'desc',
    sortBy: 'createdAt',
    pageNumber: 1,
    pageSize: 10,
  };

  if (searchNameTerm) validParams.searchNameTerm = searchNameTerm;

  if (sortDirection === 'asc' || sortDirection === 'desc') {
    validParams.sortDirection = sortDirection;
  }

  if (sortBy) validParams.sortBy = sortBy;

  if (pageNumber && !isNaN(pageNumber)) validParams.pageNumber = pageNumber;

  if (pageSize && !isNaN(pageSize)) validParams.pageSize = pageSize;

  return { ...validParams };
};
