import { HttpException } from '../exceptions/http.exception';

export type HttpError<E extends HttpException> = Pick<E, 'code'>;
