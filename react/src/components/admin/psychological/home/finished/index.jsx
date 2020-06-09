import React, { useState } from "react";

import styles from "./index.module.css";

const FinishedConsultation = ({ data, handleSubmit }) => {
  const [reason, setReason] = useState("");
  const [logMessage, setLogMessage] = useState("");

  const save = () => {
    handleSubmit(reason, logMessage);
  };

  return (
    <div className={styles.container}>
      <h2>Encerrar consulta de {data.name}</h2>
      <b>Detalhes do encerramento</b>
      <br />
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value=""></option>
        <option value="reschedule">
          Atendimento realizado, aguardando remarcação
        </option>
        <option value="reschedule_canceled">
          Atendimento não realizado, remarcar
        </option>
        <option value="finished">Acompanhamento finalizado</option>
      </select>
      <div className={styles.newLog}>
        <textarea
          value={logMessage}
          onChange={({ target }) => setLogMessage(target.value)}
          rows="3"
          placeholder="Atualização..."
        >
        </textarea>
      </div>
      <button onClick={save}>salvar</button>
    </div>
  );
};

export default FinishedConsultation;
