import React, { useState, useEffect } from "react";
import moment from "moment";

import styles from "./index.module.css";

const weekdays = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

const parsedWeekdays = {
  domingo: "Domingo",
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
  sabado: "Sábado",
};

const Hours = ({ hours, hour, handleChange }) => (
  <>
    <b>Selecione a hora:</b>
    <br />
    <select value={hour} onChange={(e) => handleChange(e.target.value)}>
      {hours.map((h) => (
        <option value={h} key={h}>
          {h}
        </option>
      ))}
    </select>
  </>
);

const ScheduleModal = ({ data, psys, handleSchedule }) => {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState();
  const [avaliableHours, setAvaliableHours] = useState([]);
  const [availableWeekdays, setAvailableWeekdays] = useState([]);

  const { fullName, availability } = psys.find(
    (p) => p.id === data.psychologistId
  );

  const loadAvailability = () => {
    const weekdays = [];

    Object.keys(availability).forEach((d) => {
      if (availability[d].length > 1) {
        weekdays.push(parsedWeekdays[d]);
      }
    });

    setAvailableWeekdays(weekdays);
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const selectDate = ({ target }) => {
    const date = moment(target.value);
    const isPassed = date.startOf("D").isBefore(moment().startOf("D"));
    const psyNotWorking = availability[weekdays[date.day()]].length < 2;
    if (isPassed || psyNotWorking) {
      alert("Data inválida!");
      return;
    }

    setAvaliableHours(availability[weekdays[date.day()]]);
    setDate(target.value);
  };

  const save = () => {
    handleSchedule(moment(date), hour);
  };

  return (
    <div className={styles.container}>
      <h3>
        Agendando um horário para {data.name} com {fullName}
      </h3>
      <p>{availableWeekdays.join(", ")}</p>
      <br />
      <br />
      <b>
        Selecione a data:
        {date && moment(date).format(" dddd, D [de] MMMM.")}
      </b>
      <br />
      <input type="date" value={date} onChange={selectDate} />
      <br />
      <br />
      {date && (
        <Hours hour={hour} handleChange={setHour} hours={avaliableHours} />
      )}
      <br />
      {hour && <button onClick={save}>agendar</button>}
    </div>
  );
};

export default ScheduleModal;
