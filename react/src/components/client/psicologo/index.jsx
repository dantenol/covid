import React, { useState } from "react";
import NumberFormat from "react-number-format";
import axios from "axios";
import classNames from "classnames";
import { url } from "../../../connector.json";

import style from "../../../assets/style/form.module.css";

const entrys = {
  name: { required: true },
  cpf: { regex: /^$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/g },
  phone: { required: true, regex: /^\(\d{2}\) \d{5}-\d{4}$/g },
  profession: {},
  city: {},
  neighborhood: {},
  psychologist: {},
  medicines: {},
  psychiatrist: {},
  message: {},
};

const Psicologo = ({ history }) => {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    phone: "",
    profession: "",
    city: "",
    neighborhood: "",
    psychologist: "",
    medicines: "",
    psychiatrist: "",
    message: "",
  });

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
    const {
      name,
      cpf,
      phone,
      city,
      neighborhood,
      profession,
      psychiatrist,
      psychologist,
      medicines,
      message,
    } = form;

    setSending(true);
    const res = await axios.post(`${url}psyRequests/formAnswer`, {
      personInfo: {
        name,
        cpf,
        phone,
        city,
        neighborhood,
        profession,
      },
      form: {
        psychiatrist: psychiatrist === "true",
        psychologist: psychologist === "true",
        medicines: medicines === "true",
        message,
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
        <p className={style.title}>
          Qual o seu nome completo?<span>*</span>
        </p>
        <input
          className={style.input}
          onKeyDown={keyPressed}
          type="text"
          name="name"
          onChange={handleChangeText}
          value={form["name"]}
          placeholder="Digite aqui..."
        />
        <button className={style.button} onClick={() => next("name")}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>E seu CPF?</p>
        <p className={style.subtitle}>Opcional</p>
        <NumberFormat
          type="tel"
          format="###.###.###-##"
          className={style.input}
          onKeyDown={keyPressed}
          name="cpf"
          value={form["cpf"]}
          onValueChange={(values) => {
            handleChangeFormattedText(values.formattedValue, "cpf");
          }}
          placeholder="Digite aqui..."
        />
        <button className={style.button} onClick={() => next("cpf")}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Precisaremos entrar em contato com você, então informe seu número de
          celular<span>*</span>
        </p>
        <NumberFormat
          type="tel"
          placeholder="Digite aqui..."
          format="(##) #####-####"
          className={style.input}
          onKeyDown={keyPressed}
          value={form["phone"]}
          name="phone"
          onValueChange={(values) => {
            handleChangeFormattedText(values.formattedValue, "phone");
          }}
        />
        <button className={style.button} onClick={() => next("phone")}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Qual a sua profissão?</p>
        <p className={style.subtitle}>Opcional</p>
        <input
          className={style.input}
          onKeyDown={keyPressed}
          name="profession"
          type="text"
          placeholder="Digite aqui..."
          onChange={handleChangeText}
          value={form["profession"]}
        />
        <button className={style.button} onClick={() => next()}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Em que cidade você mora?</p>
        <p className={style.subtitle}>Opcional</p>
        <input
          className={style.input}
          onKeyDown={keyPressed}
          name="city"
          type="text"
          placeholder="Digite aqui..."
          onChange={handleChangeText}
          value={form["city"]}
        />
        <button className={style.button} onClick={() => next()}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>E qual bairro?</p>
        <p className={style.subtitle}>Opcional</p>
        <input
          className={style.input}
          onKeyDown={keyPressed}
          name="neighborhood"
          type="text"
          placeholder="Digite aqui..."
          onChange={handleChangeText}
          value={form["neighborhood"]}
        />
        <button className={style.button} onClick={() => next()}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Faz ou já fez acompanhamento psicológico?</p>
        <p className={style.subtitle}>Opcional</p>
        <select
          name="psychologist"
          onChange={handleChangeText}
          className={style.input}
          value={form["psychologist"]}
        >
          <option value=""></option>
          <option value={true}>SIM</option>
          <option value={0}>NÃO</option>
        </select>
        <button className={style.button} onClick={() => next()}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Faz uso de medicamentos controlados?</p>
        <p className={style.subtitle}>Opcional</p>
        <select
          className={style.input}
          name="medicines"
          onChange={handleChangeText}
          value={form["medicines"]}
        >
          <option value=""></option>
          <option value={true}>SIM</option>
          <option value={false}>NÃO</option>
        </select>
        <button className={style.button} onClick={() => next()}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>
          Faz ou já fez acompanhamento psiquiátrico?
        </p>
        <p className={style.subtitle}>Opcional</p>
        <select
          name="psychiatrist"
          className={style.input}
          onChange={handleChangeText}
          value={form["psychiatrist"]}
        >
          <option value=""></option>
          <option value={true}>SIM</option>
          <option value={false}>NÃO</option>
        </select>
        <button className={style.button} onClick={() => next()}>
          Próximo
        </button>
      </div>
      <div className={style.question} style={{ top: `-${step * 100}%` }}>
        <p className={style.title}>Tem mais alguma coisa para falar?</p>
        <p className={style.subtitle}>Opcional</p>
        <textarea
          className={classNames(style.input, style.textarea)}
          name="message"
          placeholder="Digite aqui..."
          onChange={handleChangeText}
          value={form["message"]}
        ></textarea>
        <button className={style.button} disabled={sending} onClick={send}>
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default Psicologo;
