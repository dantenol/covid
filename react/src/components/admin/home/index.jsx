import React, { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";

import { url } from "../../../connector.json";
import style from "../../../assets/style/form.module.css";
import buttonStyles from "./buttons.module.css";

const NoTeam = () => (
  <h1>
    Ops, parece que você não está em nenhum time. Entre em contato com sua
    liderança.
  </h1>
);

const Psychological = (history) => (
  <button
    className={buttonStyles.team}
    onClick={() => history.push("psicologia")}
  >
    Psicológico
  </button>
);

const Donations = (history) => (
  <button className={buttonStyles.team} onClick={() => history.push("doacoes")}>
    Doações
  </button>
);

const redirects = {
  psychological: "psicologia",
  donations: "doacoes",
};

const Home = ({ history }) => {
  const [teams, setTeams] = useState([]);

  const getUser = async () => {
    const { access_token, userId, user } = localStorage;
    if (user) {
      const { teams } = JSON.parse(user);
      setTeams(teams);
    }

    try {
      const usr = await axios(`${url}agents/${userId}`, {
        params: {
          access_token,
        },
      });

      setTeams(usr.data.teams);

      if (usr.data.teams.length === 1) {
        history.push(redirects[usr.data.teams[0]]);
      }

      localStorage.setItem("user", JSON.stringify(usr.data));
    } catch (error) {
      console.log(error);
      alert("Algo deu errado, entre novamente.");
      localStorage.clear();
      history.push("/admin");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div
      className={classNames(
        style.container,
        style.centered,
        buttonStyles.centered
      )}
    >
      {!teams.length && <NoTeam />}
      {teams.length > 0 && <h1>Selecione o time que deseja acessar:</h1>}
      {teams.includes("donations") && <Donations history={history} />}
      {teams.includes("psychological") && <Psychological history={history} />}
    </div>
  );
};

export default Home;
