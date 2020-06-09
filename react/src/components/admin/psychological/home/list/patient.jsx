import React, { useState, useEffect } from "react";
import classNames from "classnames";

import flattenObj from "../../../../../helpers/flattenObj";
import calendar from "../../../../../assets/images/calendar.png";
import check from "../../../../../assets/images/check.png";

import styles from "./list.module.css";

const classes = {
  true: styles.domesticViolence,
  1: styles.urgency1,
  2: styles.urgency2,
  3: styles.urgency3,
};

const Patient = ({ patient, handleChange, psys, openModal }) => {
  const {
    name,
    domesticViolence,
    status,
    urgency,
    psychologistId,
  } = flattenObj(patient);

  const [waitingSchedule, setWaitingSchedule] = useState(false);

  const isWaitingSchedule = () => {
    setWaitingSchedule(status === "firstContact" || status === "reschedule");
  };

  useEffect(() => {
    isWaitingSchedule();
  }, [status]);

  return (
    <div
      className={classNames(
        styles.patientEntry,
        classes[domesticViolence || urgency]
      )}
    >
      <div onClick={() => openModal("patient", flattenObj(patient))}>
        <p className={styles.name}>{name}</p>
      </div>
      <div>
        <select value={urgency} name="urgency" onChange={handleChange}>
          <option value={1}>Não urgente</option>
          <option value={2}>Semi-urgente</option>
          <option value={3}>Emergência</option>
        </select>
      </div>
      <div>
        <select value={status} name="status" onChange={handleChange}>
          <option value="pending">Aguardando contato</option>
          <option value="firstContact">Primeiro contato</option>
          <option value="scheduled">Agendado</option>
          <option value="reschedule">Aguardando remarcação</option>
          <option value="finished">Finalizado</option>
        </select>
      </div>
      <div>
        <select
          value={psychologistId || ""}
          name="psychologistId"
          onChange={handleChange}
        >
          <option value="">Nenhum</option>
          {psys.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </select>
      </div>
      <div>
        {waitingSchedule && psychologistId && (
          <button
            onClick={() => openModal("schedule", flattenObj(patient))}
            className={classNames(styles.patButton, styles.schedule)}
          >
            <img src={calendar} alt="Calendar" />
            Agendar
          </button>
        )}
        {status === "scheduled" && (
          <button
            className={classNames(
              styles.patButton,
              styles.finishedConsultation
            )}
            onClick={() => openModal("finish", flattenObj(patient))}
          >
            <img src={check} alt="Check" />
            finalizar
          </button>
        )}
      </div>
    </div>
  );
};

export default Patient;
