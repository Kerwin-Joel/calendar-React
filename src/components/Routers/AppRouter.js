import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
} from "react-router-dom";
import { startChecking } from '../../actions/auth';
import { LoginScreen } from '../auth/LoginScreen';
import { CalendarScreen } from '../calendar/CalendarScreen';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';


export const AppRouter = () => {

    const {uid,checking} = useSelector(state => state.auth)


    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(startChecking())
    },[dispatch])
    if (checking) {
        return(
            <Loader
                className="loader"
                type="MutatingDots"
                color="#cc6000"
                height={100}
                width={100}
                secondaryColor="#85c2ff"
            />
        )
    }

    return (
        <Router>
            <div>
                <Switch>
                    <PublicRoute isAuthenticated={!!uid} component={LoginScreen} path="/login" exact/>
                    <PrivateRoute isAuthenticated={!!uid} component={CalendarScreen} path="/" exact/>
                    <Redirect to='/'/>
                </Switch>
            </div>
        </Router>
    )
}
