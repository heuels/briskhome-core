/** @flow */

import React from 'react';
import Button from '../../ui/button';
import Input from '../../ui/input';
import { login as loginQuery } from './graphql';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import './login.styl';
import type { BriskhomeState, LoginAction, User } from '../../../app/types';

type LoginProps = {
  loginUser: User => void,
  mutate: Function,
  history: any,
};

type LoginState = {
  username: string,
  password: string,
  isLoading: boolean,
  errors: string[],
};

export class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps): void {
    super(props);

    this.state = {
      username: '',
      password: '',
      errors: [],
      isLoading: false,
    };
  }

  resetErrors(): void {
    this.setState({ errors: [] });
  }

  componentDidMount() {
    if (this.props.user) this.props.history.replace('/');
  }

  async submit(): Promise<void> {
    const { history, loginUser, mutate } = this.props;
    const { username, password } = this.state;

    this.resetErrors();
    const errors = [];
    if (!username) errors.push('E_INVALID_USERNAME');
    if (!password) errors.push('E_INVALID_PASSWORD');
    if (errors.length) return this.setState({ errors });

    this.setState({ isLoading: true });

    let user: ?User;
    try {
      ({
        data: { login: user },
      } = await mutate({
        variables: {
          username,
          password,
        },
      }));
    } catch (e) {
      this.setState({ errors: e.graphQLErrors.pop().message });
      this.setState({ isLoading: false });
      return;
    }

    loginUser(user);
    history.replace('/');
  }

  render() {
    const { isLoading, errors } = this.state;
    return (
      <form className="briskhome-login">
        <img
          src="/static/assets/img/logo@256w-i.png"
          alt="Briskhome"
          className="briskhome-login__image"
        />
        <Input
          name="username"
          autoComplete="username"
          placeholder="Username"
          valid={!errors.includes('E_INVALID_USERNAME')}
          onChange={({ target: { value } }) => {
            this.resetErrors();
            this.setState({ username: value });
          }}
        />
        <Input
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          valid={!errors.includes('E_INVALID_PASSWORD')}
          type="password"
          onChange={({ target: { value } }) => {
            this.resetErrors();
            this.setState({ password: value });
          }}
        />
        <Button
          caps
          large
          yellow
          type="submit"
          loading={isLoading}
          display="inline-block"
          className="briskhome-login__button_submit"
          onClick={() => this.submit()}
        >
          Log in
        </Button>
        <Button
          className="briskhome-login__button_restore"
          display="inline-block"
        >
          Forgot password?
        </Button>
      </form>
    );
  }
}

export default compose(
  connect(
    (state: BriskhomeState) => {
      return state;
    },
    dispatch => {
      return {
        loginUser: (user: User) =>
          dispatch(({ type: '@@BRISKHOME/LOGIN', value: user }: LoginAction)),
      };
    },
  ),
  graphql(loginQuery, {
    options: () => ({
      updateQueries: {
        me: (state, { mutationResult }) => ({ ...state, ...mutationResult }),
      },
    }),
  }),
)(Login);
