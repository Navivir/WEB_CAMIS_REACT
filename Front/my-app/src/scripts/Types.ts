export interface User {
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    birthDate: string;
    imagenPerfil: string | null;
  }

  export interface CartItem {
    id: number;
    image: string;
    type: string;
    size: string;
    color: string;
    quantity: number;
    name: string;
  }