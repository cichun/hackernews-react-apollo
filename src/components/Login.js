import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {AUTH_TOKEN} from "../constants";


const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
        $email: String!
        $password: String!
        $name: String!
    ) {
        signup(
            email: $email
            password: $password
            name: $name
        ) {
            token
        }
    }
`;

const LOGIN_MUTATION = gql`
    mutation LoginMutation(
        $email: String! 
        $password: String!
    ) {
        login(email: $email, password: $password) {
            token
        }
    }
`;


const Login = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        login: true,
        email: '',
        password: '',
        name: ''
    });


    const [login] = useMutation(LOGIN_MUTATION, {
        variables: {
            email: formState.email,
            password: formState.password
        },
        onCompleted:({login})=>{
            localStorage.setItem(AUTH_TOKEN, login.token);
            navigate('/');
        }
    })

    const [signup] = useMutation(SIGNUP_MUTATION, {
        variables:{
            email: formState.email,
            password: formState.password,
            name: formState.name
        },
        onCompleted: ({signup})=>{
            localStorage.setItem(AUTH_TOKEN, signup.token);
            navigate('/');
        }
    })

    return (
        <div>
            <h4 className={"mv3"}>
                {formState.login ? "Login" : "Sign up"}
            </h4>
            <div className={"flex flex-column"}>
                {!formState.login && (
                    <input
                        value={formState.name}
                        onChange={event => setFormState({...formState, name: event.target.value})}
                        type={"text"}
                        placeholder={"Your name"}
                    />
                )}

                <input
                    value={formState.email}
                    onChange={event => setFormState({...formState, email: event.target.value})}
                    type={"text"}
                    placeholder={"Your email address"}
                />

                <input
                    value={formState.password}
                    onChange={event => setFormState({...formState, password: event.target.value})}
                    type={"text"}
                    placeholder={"Choose a safe password"}
                />
            </div>

            <div className={"flex mt3"}>
                <button className={"pointer mr2 button"} onClick={formState.login ? login : signup}>
                    {formState.login ? 'login' : 'create account'}
                </button>

                <button className={"pointer button"} onClick={() => {
                    setFormState({...formState, login: !formState.login})
                }}>
                    {formState.login ? 'need to create an ccount?' : 'already have an account?'}
                </button>

            </div>


        </div>
    )
}

export default Login;
