import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Switch} from "react-router-dom";
import Header from "./components/Layout/Header";
import Loader from "./components/Layout/Loader";

const UserForm = React.lazy(()=>import("./components/Auth/UserForm"));
const Home = React.lazy(()=>import("./components/Home/Home"))
const App = () => {
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
  return (
    <div className={`app-interface bg-dark`}>
      <Header/>
      
      <Suspense fallback={<Loader/>}>
        <Switch>
          <Route exact path='/'>
          {isLoggedIn&&<Home/>}
          {!isLoggedIn&&<UserForm/>}            
          </Route>
          <Route exact path="/auth">
            <UserForm />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
