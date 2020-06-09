import React, { useEffect, useState } from "react";
import moment from "moment";

import styles from "./index.module.css";

const Hours = ({ data, save }) => {
  const [hours, setHours] = useState([]);
  const [selectedHours, setSelectedHours] = useState(
    data.data.availability[data.day]
  );

  const buildHours = () => {
    const hs = [];
    let i = 0;
    while (i < 28) {
      const h = moment("7:00", "HH:mm")
        .add(i * 30, "m")
        .format("HH:mm");
      hs.push(h);
      i++;
    }

    setHours(hs);
  };

  useEffect(() => {
    buildHours();
  }, []);

  const selectHour = ({ target }) => {
    const { value, checked } = target;
    const hours = [...selectedHours];
    if (checked) {
      hours.push(value);
    } else {
      hours.splice(hours.indexOf(value), 1);
    }

    setSelectedHours(hours);
  };

  const finish = () => {
    save(selectedHours, data.day, data.data.id);
  };

  return (
    <>
      <div>
        <h2>{data.day}</h2>
      </div>
      <div className={styles.times}>
        {hours.map((h) => (
          <div key={h}>
            <input
              checked={selectedHours.includes(h)}
              type="checkbox"
              id={h}
              value={h}
              onChange={selectHour}
            />
            <label htmlFor={h}>{h}</label>
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={finish}>
        salvar
      </button>
    </>
  );
};

export default Hours;
