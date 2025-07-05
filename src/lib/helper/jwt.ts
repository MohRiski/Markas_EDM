import jwt from "jsonwebtoken";

const JWT_SECRET = 'Rahasia_kode_aman';

type Payload = {
    id: number;
    username: string;
    email: string;
    foto: string | null;
    hak_akses: string[];
}

export function generateToken(payload: Payload): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '5h'});
}

export function verifyToken(token: string): Payload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as Payload;
    } catch (error) {
        console.error('Token tidak valid', error);
        return null;
    }
}