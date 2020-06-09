import React, { useState } from "react";
import { Multiselect } from "multiselect-react-dropdown";

import styles from "./list.module.css";

const options = [
  {
    name: "Aguardando contato",
    value: "pending",
  },
  {
    name: "Primeiro contato",
    value: "firstContact",
  },
  {
    name: "Aguardando remarcação",
    value: "reschedule",
  },
  {
    name: "Consulta agendada",
    value: "scheduled",
  },
  {
    name: "Finalizado",
    value: "finished",
  },
];

const customStyles = {
  multiselectContainer: {
    maxWidth: "40vw",
  },
  inputField: {
    width: 40,
  },
  searchBox: {
    maxWidth: "40vw",
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "darkgrey",
    backgroundColor: "white",
  },
};

const Toolbar = ({ changeFilters, changeQuery }) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);

  const handleQuery = ({ target }) => {
    setQuery(target.value);
    changeQuery(target.value);
    setFilters([...options]);
  };

  const handleFilter = (selectedOptions) => {
    setFilters(selectedOptions);
    const filters = selectedOptions.map((f) => {
      return f.value;
    });

    changeFilters(filters);
  };

  return (
    <div className={styles.toolbar}>
      <input
        type="text"
        value={query}
        onChange={handleQuery}
        className={styles.input}
        placeholder="Pesquisar nome"
      />
      <Multiselect
        style={customStyles}
        selectedValues={filters}
        placeholder="Filtros"
        options={options}
        onRemove={handleFilter}
        onSelect={handleFilter}
        displayValue="name"
      />
    </div>
  );
};

export default Toolbar;
