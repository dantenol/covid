import React, { useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";

import { url } from "../../../connector.json";
import style from "../../../assets/style/form.module.css";
import naacao from "../../../assets/images/naacao.png";

const customStyle = {
  image: {
    width: 320,
    maxWidth: "80vw",
    margin: 16,
  },
  button: {
    width: 160,
  },
};

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.access_token) {
      history.push("admin/home");
    }
  }, [history]);

  const login = async () => {
    try {
      const data = await axios.post(`${url}agents/login?include=user`, {
        email,
        password,
      });

      console.log(data);
      localStorage.setItem("access_token", data.data.id);
      localStorage.setItem("userId", data.data.userId);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      history.push("admin/home");
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        alert("Email ou senha inválido!");
      } else {
        alert("Oops, algo deu errado!");
      }
    }
  };

  return (
    <div className={classNames(style.container, style.centered)}>
      <img src={naacao} alt="NaAção" style={customStyle.image} />
      <input
        type="email"
        className={classNames(style.input, style.spacing16)}
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className={classNames(style.input, style.spacing16)}
        value={password}
        placeholder="senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className={style.button}
        style={customStyle.button}
        onClick={login}
      >
        Entrar
      </button>
    </div>
  );
};

export default Login;
