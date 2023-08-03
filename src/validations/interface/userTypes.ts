export interface createuserTypes {
    userId?: string;
    firstname: string;
    lastname: string;
    phone: number;
    email: string;
    password: string;
    password2: string;
    verified: boolean;
    roles: "user" | "admin " | "merchant";
    token: number;
}
export interface authenticateUserTypes {
    email: string;
    password: string;
}
// export interface authenticateUserTypes {
//     email: string;
//     password: string;
// }

export interface MailProps {
    email: string;
    subject: string;
    html: string;
}