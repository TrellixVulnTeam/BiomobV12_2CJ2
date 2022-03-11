import React, { useState, useEffect } from 'react';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { Row, Col, Button } from 'reactstrap';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { savePassword, reset } from './password.reducer';

export const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const handleValidSubmit = ({ currentPassword, newPassword }) => {
    dispatch(savePassword({ currentPassword, newPassword }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    } else if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="password-title">Senha para {account.login}</h2>
          <ValidatedForm id="password-form" onSubmit={handleValidSubmit}>
            <ValidatedField
              name="currentPassword"
              label="Senha atual"
              placeholder={'Senha atual'}
              type="password"
              validate={{
                required: { value: true, message: 'Sua senha é obrigatória' },
              }}
              data-cy="currentPassword"
            />
            <ValidatedField
              name="newPassword"
              label="Nova senha"
              placeholder={'Nova senha'}
              type="password"
              validate={{
                required: { value: true, message: 'Sua senha é obrigatória.' },
                minLength: { value: 4, message: 'Sua senha é obrigada a ter pelo menos 4 caracteres.' },
                maxLength: { value: 50, message: 'Sua senha não pode ser maior que 50 caracteres.' },
              }}
              onChange={updatePassword}
              data-cy="newPassword"
            />
            <PasswordStrengthBar password={password} />
            <ValidatedField
              name="confirmPassword"
              label="Confirme a nova senha"
              placeholder="Confirme a nova senha"
              type="password"
              validate={{
                required: { value: true, message: 'Sua confirmação de senha é obrigatória.' },
                minLength: { value: 4, message: 'Sua confirmação de senha é obrigada a ter pelo menos 4 caracteres.' },
                maxLength: { value: 50, message: 'Sua confirmação de senha não pode ser maior que 50 caracteres.' },
                validate: v => v === password || 'As senhas não são iguais!',
              }}
              data-cy="confirmPassword"
            />
            <Button color="success" type="submit" data-cy="submit">
              Salvar
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordPage;
