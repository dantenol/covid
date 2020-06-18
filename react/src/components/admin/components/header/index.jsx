import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { url } from "../../../../connector.json";
import styles from "./header.module.css";

const Header = () => {
  const { fullName, teams } = JSON.parse(localStorage.user);
  const history = useHistory();

  const logout = async () => {
    await axios.post(
      `${url}/agent/logout`,
      {},
      {
        params: {
          access_token: localStorage.access_token,
        },
      }
    );

    localStorage.clear();
    history.push("/admin");
  };

  return (
    <div className={styles.header}>
      <p className={styles.name}>{fullName}</p>
      <div className={styles.buttonsGroup}>
        {teams.length > 1 && (
          <button
            onClick={() => history.push("/admin/home")}
            className={styles.button}
          >
            trocar time
          </button>
        )}
        <button onClick={logout} className={styles.button}>
          sair
        </button>
      </div>
    </div>
  );
};

export default Header;
