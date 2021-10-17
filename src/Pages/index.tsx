// src/Pages/index.tsx
import React from "react";
import { Route, Switch } from "react-router";
import AboutPage from "./src/AboutPage";
import HomePage from "./src/HomePage";
import NotFoundPage from "./src/NotFoundPage";

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/about">
        <AboutPage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default Pages;
