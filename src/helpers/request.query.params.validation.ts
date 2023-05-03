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

  if (sortBy && sortBy.trim()) {
    validParams.sortBy = sortBy;
  }

  if (sortDirection === 'asc' || sortDirection === 'desc') {
    validParams.sortDirection = sortDirection;
  }

  if (pageNumber && !isNaN(+pageNumber)) {
    validParams.page = parseInt(pageNumber);
  }

  if (pageSize && !isNaN(+pageSize)) {
    validParams.pageSize = parseInt(pageSize);
  }

  return validParams;
};

// import { TypeQueryParams, TypeValidQueryParams } from '../types/req-res.types';

// export const requestQueryParamsValidation = (
//   params: TypeQueryParams
// ): TypeValidQueryParams => {
//   const page =
//     typeof params.pageNumber === 'string' ? parseInt(params.pageNumber) : 1;

//   const pageSize =
//     typeof params.pageSize === 'string' ? parseInt(params.pageSize) : 10;

//   const condition =
//     typeof params.searchNameTerm === 'string' ? params.searchNameTerm : '';

//   const sortBy =
//     typeof params.sortBy === 'string' ? params.sortBy : 'createdAt';

//   const sortDirection =
//     typeof params.sortDirection === 'string' ? params.sortDirection : 'desc';

//   return { page, pageSize, condition, sortBy, sortDirection };
// };
