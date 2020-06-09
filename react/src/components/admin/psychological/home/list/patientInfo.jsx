import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { url } from "../../../../../connector.json";

import styles from "./list.module.css";

const texts = {
  domesticViolence: "Violência doméstica",
  message: "Mensagem",
  true: "Sim",
  false: "Não",
  psychologist: "Faz atendimento psicológico",
  medicine: "Toma medicamentos psiquiátricos",
  psychiatrist: "Faz acompanhamento psiquiátrico",
  phone: "Telefone",
  cpf: "CPF",
  city: "Cidade",
  neighborhood: "Bairro",
};

const loadType = (data) => {
  if (data.hasOwnProperty("psyRequestId")) {
    return "Atendimento psicolígico";
  }
};

const Questions = ({ data }) => {
  return Object.keys(data).map((entry) => {
    const text = texts[entry];
    const val = texts[data[entry]] || data[entry];
    if (text) {
      return (
        <p key={entry}>
          {text}: <span>{val}</span>
        </p>
      );
    }
    return null;
  });
};

const LogEntry = ({ createdBy, timestamp, message, isManual }) => (
  <div className={styles.log}>
    <b>{`${createdBy} em ${moment(timestamp).format(
      "DD/MM/YYYY [às] HH:mm"
    )}:`}</b>
    <p className={styles[isManual]}>{message}</p>
  </div>
);

const PatientInfo = ({ data }) => {
  const [logs, setLogs] = useState([]);
  const [logMessage, setLogMessage] = useState("");

  const getLogs = async () => {
    const logs = await axios(`${url}psyRequests/${data.id}/logs`, {
      params: {
        access_token: localStorage.access_token,
      },
    });

    setLogs(logs.data);
  };

  useEffect(() => {
    getLogs();
  }, []);

  const addLog = async () => {
    const log = await axios.post(
      `${url}psyRequests/${data.id}/log`,
      {
        message: logMessage,
      },
      {
        params: {
          access_token: localStorage.access_token,
        },
      }
    );

    setLogs([log.data, ...logs]);
    setLogMessage("");
  };

  return (
    <>
      <div className={styles.name}>
        <b>{data.name}</b>
      </div>
      <p className={styles.timestamp}>
        {moment(data.timestamp).format("DD/MM/YYYY [às] HH:mm")}
      </p>
      <p className={styles.type}>{loadType(data)}</p>
      <div className={styles.questions}>
        <Questions data={data} />
      </div>
      <div className={styles.logsList}>
        {logs.map((l) => (
          <LogEntry key={l.id} {...l} />
        ))}
      </div>
      <div className={styles.newLog}>
        <textarea
          value={logMessage}
          onChange={({ target }) => setLogMessage(target.value)}
          rows="3"
        >
          Atualização...
        </textarea>
        <button onClick={addLog}>Salvar</button>
      </div>
    </>
  );
};

export default PatientInfo;
