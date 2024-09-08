import { TApiResponseDto } from '../types/response.types';

export function apiResponse<T>(
  statusCode: number,
  data: any = null,
  message: { message: string; property: string }[] | [] = [],
): TApiResponseDto<T> {
  return {
    statusCode,
    message,
    data,
  };
}
