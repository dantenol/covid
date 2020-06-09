import React, { useState, useEffect } from "react";
import axios from "axios";

import { url } from "../../../../connector.json";
import styles from "./index.module.css";

import Header from "../../components/header/";
import HoursModal from "./hours";
import Modal from "../../components/modal";

const Psychologist = ({ data, selectDay, idx }) => (
  <div className={styles.entry}>
    <p>{data.fullName}</p>
    <button onClick={() => selectDay(data, "segunda")}>S</button>
    <button onClick={() => selectDay(data, "terca")}>T</button>
    <button onClick={() => selectDay(data, "quarta")}>Q</button>
    <button onClick={() => selectDay(data, "quinta")}>Q</button>
    <button onClick={() => selectDay(data, "sexta")}>S</button>
    <button onClick={() => selectDay(data, "sabado")}>S</button>
    <button onClick={() => selectDay(data, "domingo")}>D</button>
  </div>
);

const Professional = ({ history }) => {
  const [psychologists, setPsychologists] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const loadPsychologists = async () => {
    const psys = await axios(`${url}agents/psychologists`, {
      params: {
        access_token: localStorage.access_token,
      },
    });

    setPsychologists(psys.data);
  };

  useEffect(() => {
    loadPsychologists();
  }, []);

  const openModal = (data, day) => {
    setModal(true);
    setModalData({ day, data });
  };

  const findPsyIdx = (id) => {
    const psy = psychologists.findIndex((p) => p.id === id);
    return psy;
  };

  const saveHours = async (data, day, id) => {
    const idx = findPsyIdx(id);

    const res = await axios.patch(
      `${url}agents/${id}/availability`,
      {
        [day]: data,
      },
      {
        params: {
          access_token: localStorage.access_token,
        },
      }
    );

    const psys = [...psychologists];
    psys[idx] = res.data;

    setPsychologists(psys);
    setModal(false);
  };

  return (
    <div>
      <Header user={localStorage.user} />
      <Modal open={modal} onClose={() => setModal(false)}>
        <HoursModal save={saveHours} data={modalData} />
      </Modal>
      <h2>Psicólogos</h2>
      <div className={styles.list}>
        {psychologists.map((p, i) => (
          <Psychologist key={p.id} data={p} idx={i} selectDay={openModal} />
        ))}
      </div>
    </div>
  );
};

export default Professional;
