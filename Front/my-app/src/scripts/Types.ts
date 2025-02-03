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
    images: string[];
    type: string;
    size: string;
    color: string;
    quantity: number;
    name: string;
    created: string;
    user_id: number;
    user?: User; 
    
  }

  export interface CardItemCart {
    id: number;
    name: string;
    size: string | null;
    color: string;
    price: number | null;
    quantity: number | null;
    id_cami: number;
    type: string;
    discount: number | null;
    images: string[]; 
  }

  export interface ImageDesign {
    id:number;
    imagen1:string;
    created:string;
    name:string;
    description:string;
    published:number;
    user_id:number;
  }

  export interface Product {
    id: number;
    name: string;
    imagen1: string;
    created: string;
    user_id: number;
    user?: User; 
  }

export interface CardProps {
    id: number;
    title: string;
    images: string[];
    created: string;
    user_name: string;
    user_image: string;
    onClick?: () => void;
    onDelete: (id: number) => void; 
    onMakeItReal: (id: number) => void;
    showActions: boolean; 
  }

  export interface CardPropsImg {
    id: number;
    title: string;
    imageUrl: string;
    user_name: string;
    user_image: string;
    created: string;
    onClick?: () => void;
    onDelete: (id: number) => void; 
    onMakeItReal: (id: number) => void;
    showActions: boolean; 
  }

