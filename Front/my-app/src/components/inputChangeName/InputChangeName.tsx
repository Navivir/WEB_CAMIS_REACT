import React ,{useState} from 'react';
import './InputChangeName.css'


interface InputChangeNameProps {
    label:string;
    onSubmit: (name:string) => void;
    onCancel: () => void;
}


const InputChangeName:React.FC <InputChangeNameProps> = ({
    label,
    onSubmit,
    onCancel
}) => {
    const [inputValue, setInputValue] = useState("");
  

 

return(
    <div className='change-name-container-input'>
        <label className='change-name-label-input'>{label}</label>
        <input 
        type = 'text' 
        placeholder ='Escribe el nuevo nombre'
        onChange={(e) => setInputValue(e.target.value)}
        className='change-name-input'
        >
        </input>
        <div className="change-name-input-button-container">
                <button
                    onClick={onCancel}
                    className="change-name-exit-button-input"
                >
                    Salir
                </button>
                <button
                    onClick={() => onSubmit(inputValue)}
                    className="change-name-save-button-input"
                >
                    Guardar
                </button>
            </div>
    </div>
);
};

export {InputChangeName};