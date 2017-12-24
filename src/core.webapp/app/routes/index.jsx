import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import configureStore, { client } from '../store';
import { Preferences } from '../../components/pages/preferences';
import Navigation from '../../components/navigation';
import Login from '../../components/pages/login';
import { Dashboard } from '../../components/pages/dashboard';
import { NotFound } from '../../components/notfound';
import { Example } from '../../components/onboarding/example';
import ProtectedRoute from './ProtectedRoute';

import '../app.styl';
import '../stuff.styl';

export const Routes = () => (
  <ApolloProvider store={configureStore()} client={client}>
    <Router>
      <div>
        <Navigation />
        <section>
          <Switch>
            <Route path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={Dashboard} />
            <ProtectedRoute path="/cameras" component={Example} />
            <ProtectedRoute path="/preferences" component={Preferences} />
            <Route path="*" component={NotFound} />
          </Switch>
        </section>
      </div>
    </Router>
  </ApolloProvider>
);

export default Routes;
