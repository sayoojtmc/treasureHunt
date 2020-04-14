import React, { Component } from 'react';
import { BrowserRouter as Router,Route } from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import SignUpPage from '../SignUp/SignUp';
import SignInPage from '../SignIn/SignIn';
import HomePage from '../Home/Home';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {authUser:null,};
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                authUser
                ? this.setState({ authUser })
                : this.setState({ authUser: null });
            },
        );
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        return (
            <Router>
            <div>    
                <Navigation authUser={this.state.authUser} />

                <hr />

                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.HOME} component={HomePage} />
            </div>
            </Router>
        );
    }
}

export default withFirebase(App);