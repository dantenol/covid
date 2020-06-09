import React, { Suspense, lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import 'moment/locale/pt-br.js';

import Home from "./components/client/home";
import Triagem from "./components/client/triagem";
import ViolenciaDomestica from "./components/client/violenciaDomestica";
import MensagemFim from "./components/client/mensagemFim";
import Psicologo from "./components/client/psicologo";
import Doacao from "./components/client/doacao";
import Loading from "./components/admin/components/loading";

const AdminRoutes = lazy(() => import("./components/admin/routes"));
const history = createBrowserHistory();

history.listen((location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

ReactGA.initialize("UA-163842537-2");

const App = () => (
  <Router history={history}>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/triagem" component={Triagem} />
        <Route
          exact
          path="/violencia-domestica"
          component={ViolenciaDomestica}
        />
        <Route exact path="/enviado" component={MensagemFim} />
        <Route exact path="/psicologo" component={Psicologo} />
        <Route exact path="/doacao" component={Doacao} />
        <Route path="/admin" component={AdminRoutes} />
      </Switch>
    </Suspense>
  </Router>
);

export default App;
