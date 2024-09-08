export type TMessagesType = {
  message: string;
  property: string;
};

export type TApiResponseDto<T> = {
  statusCode: number;
  message: TmessagesType[] | [];
  data: T;
};
