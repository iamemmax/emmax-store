declare namespace Express {
    import { ReqUser } from './src/model/users.model';
    export interface Request {
        user: ReqUser;
    }
    export interface Response {
        user: ReqUser;
    }
}