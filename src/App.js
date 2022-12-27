import React, { Suspense } from "react";
import { Route, Switch} from "react-router-dom";
import Header from "./components/Layout/Header";
import Loader from "./components/Layout/Loader";

const UserForm = React.lazy(()=>import("./components/Auth/UserForm"));

const App = () => {
  
  return (
    <div className={`app-interface bg-dark`}>
      <Header/>
      
      <Suspense fallback={<Loader/>}>
        <Switch>
          <Route exact path="/auth">
            <UserForm />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
