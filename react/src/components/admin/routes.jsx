import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./login";
import Home from "./home";
import PsychologicalHome from "./psychological/home";
import Professional from "./psychological/professional";

const AdminRoutes = () => (
  <Router>
    <Switch>
      <Route exact path="/admin" component={Login} />
      <Route exact path="/admin/home" component={Home} />
      <Route exact path="/admin/psicologia" component={PsychologicalHome} />
      <Route exact path="/admin/psicologia/psicologos" component={Professional} />
    </Switch>
  </Router>
);

export default AdminRoutes;
