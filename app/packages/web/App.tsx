import React, { Suspense, lazy } from "react";
import { Router, Switch, Route } from "react-router-dom";
import rootStore from "./store";
import Loading from "./connectors/Loading";
import Toast from "./connectors/Toast";
import { createHashHistory } from "history";
const history = createHashHistory();
const MainPage = lazy(() => import("./pages/MainPage"));
const EditChartImagePage = lazy(() => import("./pages/EditCharImagePage"));

export default function App() {
  React.useEffect(() => {
    rootStore.init();
    history.push("/");
  });
  return (
    <>
      <Router history={history}>
        <Loading />
        <Toast />
        <Suspense fallback={<div>Loading...</div>}>
          <Route exact path={"/edit"} component={EditChartImagePage} />
          <Route exact path={"/"} component={MainPage} />
        </Suspense>
      </Router>
    </>
  );
}
