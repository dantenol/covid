import React, { useState } from "react";
import NumberFormat from "react-number-format";
import axios from "axios";
import { url } from "../../../connector.json";

import style from "../../../assets/style/form.module.css";

const entrys = {
  name: {
    required: true,
  },
  phone: {
    required: true,
    regex: /^\(\d{2}\) \d{5}-\d{4}$/g,
  },
  message: {},
};

const ViolenciaDomestica = ({ history }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

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

  const send = async () => {
    const { name, phone, message } = form;
    setSending(true);
    const res = await axios.post(`${url}psyRequests/formAnswer`, {
      personInfo: {
        name,
        phone,
      },
      form: {
        domesticViolence: true,
        message: "VIOLÊNCIA DOMÉSTICA " + message,
      },
    });

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

  return (
    <div className={style.container}>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <h1>Responda as perguntas abaixo para receber ajuda EM SEGURANÇA.</h1>
        <button className={style.button} onClick={() => next()}>
          Começar
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Qual o seu nome?<span>*</span>
        </p>
        <input
          type="text"
          name="name"
          placeholder="Digite aqui..."
          onChange={handleChangeText}
          value={form["name"]}
          className={style.input}
          onKeyDown={keyPressed}
        />
        <button className={style.button} onClick={() => next("name")}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          E seu número de celular?<span>*</span>
        </p>
        <p className={style.subtitle}>
          Vamos te ligar apenas quando estiver em um momento seguro!
        </p>
        <NumberFormat
          format="(##) #####-####"
          type="tel"
          placeholder="Digite aqui..."
          name="phone"
          onValueChange={(values) => {
            handleChangeFormattedText(values.formattedValue, "phone");
          }}
          value={form["phone"]}
          className={style.input}
          onKeyDown={keyPressed}
        />
        <button className={style.button} onClick={() => next("phone")}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Qual o melhor dia e horário para podermos te ligar?
        </p>
        <input
          type="text"
          name="message"
          placeholder="Digite aqui..."
          className={style.input}
          onKeyDown={keyPressed}
          onChange={handleChangeText}
        />
        <button className={style.button} disabled={sending} onClick={send}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ViolenciaDomestica;
