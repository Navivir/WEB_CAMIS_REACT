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

  export interface Product {
    id: number;
    name: string;
    imagen1: string;
  }

export interface CardProps {
    id: number;
    title: string;
    imageUrl: string;
    type: string;
    onClick?: () => void;
    onDelete: (id: number) => void; 
    onMakeItReal: (id: number) => void;
    showActions: boolean; 
  }