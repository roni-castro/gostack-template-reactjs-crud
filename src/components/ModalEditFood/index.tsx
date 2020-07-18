import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import { mapValidationErrorToErrorObject } from '../../utils/validationErrorMapper';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          image: Yup.string().required('Url da imagem é obrigatório').url(),
          name: Yup.string().required('Nome é obrigatório'),
          price: Yup.number().required().min(0.01),
          description: Yup.string(),
        });
        await schema.validate(data, { abortEarly: false });
        handleUpdateFood(data);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = mapValidationErrorToErrorObject(error);
          formRef.current?.setErrors(errors);
          return;
        }
      }
    },
    [handleUpdateFood],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input
          name="image"
          labelTitle="URL da imagem"
          placeholder="Cole o link aqui"
        />

        <Input
          name="name"
          labelTitle="Nome do prato"
          placeholder="Ex: Moda Italiana"
        />
        <Input
          name="price"
          type="number"
          step="0.01"
          labelTitle="Preço"
          placeholder="Ex: 19.90"
        />

        <Input
          name="description"
          labelTitle="Descrição do prato"
          placeholder="Descrição"
        />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
