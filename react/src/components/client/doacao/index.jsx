import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import axios from "axios";
import classNames from "classnames";

import gps from "../../../assets/images/target.png"

import style from "../../../assets/style/form.module.css";

const entrys = {
  "entry.106456020": { required: true },
  "entry.363426765": {},
  "entry.472405798": { required: true, regex: /^\(\d{2}\) \d{5}-\d{4}$/g },
  "entry.505288745": { required: true },
  "entry.730457284": {},
  "entry.805271285": {},
  "entry.859324267": { required: true, regex: /^\d{3}.\d{3}.\d{3}-\d{2}$/g },
  "entry.1231759706": { required: true },
  "entry.1238987351": { required: true },
  "entry.1509069398": { required: true },
  "entry.1707728601": { required: true },
  "entry.1851459686": {},
  "entry.1896023146": { required: true },
};

const Doacao = ({ history }) => {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [GPS, setGPS] = useState(false);
  const [form, setForm] = useState({
    "entry.106456020": "",
    "entry.363426765": "",
    "entry.472405798": "",
    "entry.505288745": "",
    "entry.730457284": [],
    "entry.805271285": "",
    "entry.859324267": "",
    "entry.1231759706": "",
    "entry.1238987351": "",
    "entry.1509069398": "",
    "entry.1707728601": "",
    "entry.1851459686": "",
    "entry.1896023146": [],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      setGPS(true);
    }
  }, []);

  const next = (name) => {
    if (name && entrys[name].required && !form[name]) {
      alert("Ops, você não pode pular essa pergunta.");
    } else if (
      name &&
      entrys[name].regex &&
      !entrys[name].regex.test(form[name])
    ) {
      alert("Verifique a informação");
    } else {
      setStep(step + 1);
    }
  };

  const handleChangeText = ({ target }) => {
    const newForm = { ...form };
    newForm[target.name] = target.value;
    setForm(newForm);
  };

  const handleChangeFormattedText = (val, name) => {
    const newForm = { ...form };
    newForm[name] = val;
    setForm(newForm);
  };

  const handleCheckboxClick = ({ target }) => {
    const newForm = { ...form };
    const arr = newForm[target.name];
    if (target.checked) {
      arr.push(target.value);
    } else {
      arr.splice(arr.indexOf(target.value), 1);
    }
    newForm[target.name] = arr;
    setForm(newForm);
  };

  const send = async () => {
    setSending(true);
    if (!form["entry.363426765"]) {
      alert("Você precisa especificar sua doação!");
      return;
    }

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    const res = await axios.post(
      "https://cors-anywhere.herokuapp.com/https://docs.google.com/forms/d/e/1FAIpQLSezrWbn_uGiAL0rQlLnPu6H5oIUzBB2cHgvTbVgwrZm5pMjTA/formResponse",
      formData
    );

    if (res.status === 200) {
      console.log(res);
      history.push("/enviado");
    }
  };

  const keyPressed = (e) => {
    const { name } = e.target;
    if (e.key === "Enter") {
      if (step < Object.keys(entrys).length) {
        next(name);
      } else {
        console.log("enviado");
        send();
      }
      e.target.blur();
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(savePosition);
    }
  };

  const savePosition = ({coords}) => {
    const pos = {
      lat: coords.latitude,
      lng: coords.longitude,
    }
    handleChangeFormattedText(JSON.stringify(pos), "entry.1322271110");
    setGPS(false);
  };

  return (
    <div className={classNames(style.container, style.fullscreen)}>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Preencha os dados para receber sua doação!
        </p>
        <button onClick={() => next()} className={style.button}>
          Começar
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Seu nome e sobrenome<span>*</span>
        </p>
        <input
          type="text"
          name="entry.1707728601"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.1707728601")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          CPF<span>*</span>
        </p>
        <p className={style.subtitle}>Será mantido em sigilo</p>
        <NumberFormat
          type="tel"
          format="###.###.###-##"
          className={style.input}
          onKeyDown={keyPressed}
          name="entry.859324267"
          value={form["entry.859324267"]}
          onValueChange={(values) => {
            handleChangeFormattedText(values.formattedValue, "entry.859324267");
          }}
          placeholder="Digite aqui..."
        />
        <button
          onClick={() => next("entry.859324267")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Celular<span>*</span>
        </p>
        <p className={style.subtitle}>Com WhatsApp</p>
        <NumberFormat
          type="tel"
          placeholder="Digite aqui..."
          format="(##) #####-####"
          className={style.input}
          onKeyDown={keyPressed}
          name="entry.472405798"
          value={form["entry.472405798"]}
          onValueChange={(values) => {
            handleChangeFormattedText(values.formattedValue, "entry.472405798");
          }}
        />
        <button
          onClick={() => next("entry.472405798")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Profissão</p>
        <input
          type="text"
          name="entry.1851459686"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.1851459686")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Cidade<span>*</span>
        </p>
        <input
          type="text"
          name="entry.1509069398"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.1509069398")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Bairro<span>*</span>
        </p>
        <input
          type="text"
          name="entry.1231759706"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.1231759706")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Rua<span>*</span>
        </p>
        <input
          type="text"
          name="entry.106456020"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.106456020")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Número e complemento<span>*</span>
        </p>
        <input
          type="text"
          name="entry.505288745"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.505288745")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Ponto de referência</p>
        <p className={style.subtitle}>Como podemos identificar sua casa?</p>
        <input
          type="text"
          name="entry.805271285"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        {GPS && (
        <button
          onClick={handleGetLocation}
          className={classNames(style.button, style.gpsButton)}
        >
          <img src={gps} alt="GPS"/>
          Pegar localização do GPS
        </button>
        )}
        <button
          onClick={() => next("entry.805271285")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Quantas pessoas moram na casa?<span>*</span>
        </p>
        <p className={style.subtitle}>Incluindo você</p>
        <input
          type="number"
          name="entry.1238987351"
          placeholder="Digite aqui..."
          onKeyDown={keyPressed}
          onChange={handleChangeText}
          className={style.input}
        />
        <button
          onClick={() => next("entry.1238987351")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Fonte de renda</p>
        <p className={style.subtitle}>Será mantida em sigilo</p>
        <div className={style.multipleChoiceContainer}>
          <input
            type="checkbox"
            value="Salário"
            name="entry.730457284"
            id="730457284.Salário"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.730457284"].includes("Salário")}
          />
          <label htmlFor="730457284.Salário">Salário</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Auxílio_emergencial_do_Governo"
            name="entry.730457284"
            id="730457284.Auxílio_emergencial_do_Governo"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.730457284"].includes(
              "Auxílio_emergencial_do_Governo"
            )}
          />
          <label htmlFor="730457284.Auxílio_emergencial_do_Governo">
            Auxílio emergencial do Governo
          </label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Bolsa_família"
            name="entry.730457284"
            id="730457284.Bolsa_família"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.730457284"].includes("Bolsa_família")}
          />
          <label htmlFor="730457284.Bolsa_família">Bolsa-família</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="outros"
            name="entry.730457284"
            id="730457284.outros"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.730457284"].includes("outros")}
          />
          <label htmlFor="730457284.outros">Outros</label>
        </div>
        <button
          onClick={() => next("entry.730457284")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Do que você precisa?<span>*</span>
        </p>
        <div className={style.multipleChoiceContainer}>
          <input
            type="checkbox"
            value="Cesta_básica"
            name="entry.1896023146"
            id="1896023146.Cesta_básica"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Cesta_básica")}
          />
          <label htmlFor="1896023146.Cesta_básica">Cesta básica</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Alimentos"
            name="entry.1896023146"
            id="1896023146.Alimentos"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Alimentos")}
          />
          <label htmlFor="1896023146.Alimentos">Alimentos</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Alimentos_infantis"
            name="entry.1896023146"
            id="1896023146.Alimentos_infantis"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Alimentos_infantis")}
          />
          <label htmlFor="1896023146.Alimentos_infantis">
            Alimentos infantis
          </label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Leite"
            name="entry.1896023146"
            id="1896023146.Leite"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Leite")}
          />
          <label htmlFor="1896023146.Leite">Leite</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Verduras"
            name="entry.1896023146"
            id="1896023146.Verduras"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Verduras")}
          />
          <label htmlFor="1896023146.Verduras">Verduras</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Fraldas"
            name="entry.1896023146"
            id="1896023146.Fraldas"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Fraldas")}
          />
          <label htmlFor="1896023146.Fraldas">Fraldas</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Roupas"
            name="entry.1896023146"
            id="1896023146.Roupas"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Roupas")}
          />
          <label htmlFor="1896023146.Roupas">Roupas</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Itens_de_limpeza"
            name="entry.1896023146"
            id="1896023146.Itens_de_limpeza"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Itens_de_limpeza")}
          />
          <label htmlFor="1896023146.Itens_de_limpeza">Itens de limpeza</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Itens_de_higiene"
            name="entry.1896023146"
            id="1896023146.Itens_de_higiene"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Itens_de_higiene")}
          />
          <label htmlFor="1896023146.Itens_de_higiene">Itens de higiene</label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Itens_de_proteçao_pessoal"
            name="entry.1896023146"
            id="1896023146.Itens_de_proteçao_pessoal"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes(
              "Itens_de_proteçao_pessoal"
            )}
          />
          <label htmlFor="1896023146.Itens_de_proteçao_pessoal">
            Itens de proteção
          </label>
          <br />
          <br />
          <input
            type="checkbox"
            value="Outros"
            name="entry.1896023146"
            id="1896023146.Outros"
            className={style.input}
            onChange={handleCheckboxClick}
            checked={form["entry.1896023146"].includes("Outros")}
          />
          <label htmlFor="1896023146.Outros">Outros</label>
        </div>
        <button
          onClick={() => next("entry.1896023146")}
          className={style.button}
        >
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Especificação da doação<span>*</span>
        </p>
        <p className={style.subtitle}>Conte mais sobre suas necessidades</p>
        <textarea
          name="entry.363426765"
          placeholder="Digite aqui..."
          className={classNames(style.input, style.textarea)}
          onChange={handleChangeText}
        ></textarea>
        <br />
        <button onClick={send} disabled={sending} className={style.button}>
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default Doacao;
