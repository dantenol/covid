import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import { url } from "../../../../connector.json";
import Toolbar from "./list/toolbar";
import Patient from "./list/patient";
import PatientInfo from "./list/patientInfo";
import Header from "../../components/header";
import Modal from "../../components/modal";
import ScheduleModal from "./schedule";
import FinishedConsultation from "./finished";

const PsychologicalHome = () => {
  const [patients, setPatients] = useState([]);
  const [showingPatients, setShowingPatients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState();
  const [modal, setModal] = useState("");

  const listPatients = async () => {
    try {
      const pats = await axios(`${url}psyRequests/list`, {
        params: {
          access_token: localStorage.access_token,
        },
      });

      setPatients(pats.data);
      setShowingPatients(pats.data);
    } catch (error) {
      console.log(error);
      alert("Algo deu errado ao carregar os pacientes");
    }
  };

  const loadPsychologists = async () => {
    const psys = await axios(`${url}agents/psychologists`, {
      params: {
        access_token: localStorage.access_token,
      },
    });
    setPsychologists(psys.data);
  };

  useEffect(() => {
    listPatients();
    loadPsychologists();
  }, []);

  const filterPatients = (filters, pats = patients) => {
    let patientsToShow = pats;
    if (filters.length) {
      patientsToShow = pats.filter((pat) => {
        return filters.includes(pat.status);
      });
    }

    setShowingPatients(patientsToShow);
  };

  const queryPatients = (query) => {
    const patientsToShow = patients.filter((pat) => {
      const name = pat.psyRequest.person.name.toLowerCase();
      return name.startsWith(query);
    });

    setShowingPatients(patientsToShow);
  };

  const showModal = (type, data) => {
    setModal(type);
    setSelectedPatient(data);
  };

  const updatePatient = (prop, val, idx) => {
    const showing = [...showingPatients];
    showing[idx][prop] = val;

    setShowingPatients(showing);
  };

  const save = async ({ target }, i) => {
    const personId = showingPatients[i].psyRequest.personId;
    const { value, name } = target;

    const sure = window.confirm("Tem certeza que quer fazer essa alteração?");

    if (!sure) {
      return false;
    }

    const trueValue = Number(value) || value;
    try {
      await axios.patch(
        `${url}psyRequests/${personId}/updateState`,
        { [name]: trueValue },
        {
          params: {
            access_token: localStorage.access_token,
          },
        }
      );

      updatePatient(name, trueValue, i);
    } catch (error) {
      console.log(error);
    }
  };

  const schedule = async (date, hour) => {
    console.log(date);
    const time = date.minutes(hour.slice(2)).hours(hour.slice(0, 2));
    console.log(time.toDate());

    try {
      await axios.post(
        `${url}psyRequests/schedule`,
        {
          schedule: time.toDate(),
          personId: selectedPatient.personId,
          psychologistId: selectedPatient.psychologistId,
          request: selectedPatient.psyRequestId,
        },
        {
          params: {
            access_token: localStorage.access_token,
          },
        }
      );

      setModal(false);

    } catch (error) {
      console.log(error);
    }
  };

  const finishConsultation = async (reason, message) => {
    try {
      await axios.post(
        `${url}psyRequests/finishConsultation`,
        {
          reason,
          message,
          person: selectedPatient.personId
        },
        {
          params: {
            access_token: localStorage.access_token,
          },
        }
      );

      setModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Header user={localStorage.user} />
      <Modal open={modal === "patient"} onClose={() => setModal(false)}>
        <PatientInfo data={selectedPatient} />
      </Modal>
      <Modal open={modal === "schedule"} onClose={() => setModal(false)}>
        <ScheduleModal
          data={selectedPatient}
          psys={psychologists}
          handleSchedule={schedule}
        />
      </Modal>
      <Modal open={modal === "finish"} onClose={() => setModal(false)}>
        <FinishedConsultation
          data={selectedPatient}
          handleSubmit={finishConsultation}
        />
      </Modal>
      <h2>Pacientes</h2>
      <Toolbar changeFilters={filterPatients} changeQuery={queryPatients} />
      {showingPatients.map((pat, i) => (
        <Patient
          key={i}
          patient={pat}
          index={i}
          handleChange={(e) => save(e, i)}
          openModal={(type, data) => showModal(type, data)}
          psys={psychologists}
        />
      ))}
    </div>
  );
};

export default PsychologicalHome;
