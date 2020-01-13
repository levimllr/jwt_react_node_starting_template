import React, {Component} from "react";

import './login.css'
import axios from "axios";
import { Link } from 'react-router-dom';
import AuthHelperMethods from './components/AuthHelperMethods';

export default class Signup extends Component {
    
    
    state = {
        username: "",
        password: ""
    }

    Auth = new AuthHelperMethods();

    _handleChange = (e) => {
        
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )

        console.log(this.state);
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        
        axios.post("/signup", {
            username: this.state.username,
            password: this.state.password
        }).then(data => {
            console.log(data);
            this.props.history.replace("/login");
        });  
    };

    render() {
        return (
            <React.Fragment>
                <div className="main-wrapper">
                    <div className="box">
                        <div className="box-header">
                            <h1>Signup</h1>
                        </div>
                        <form className="box-form">
                            <input
                                className="form-item"
                                placeholder="Username"
                                name="username"
                                type="text"
                                onChange={this._handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Password"
                                name="password"
                                type="password"
                                onChange={this._handleChange}
                            />
                            <button className="form-submit" onClick={this.handleFormSubmit}>Signup</button>
                        </form>
                        <Link className="link" to="/login">Already have an account? <span className="link-signup">Login</span></Link>
                    </div>
                    <div className="signiture">
                        <h1>Template Built & Designed by Roman Chvalbo</h1>
                    </div>
                </div>
                
            </React.Fragment>
        );
    }

}