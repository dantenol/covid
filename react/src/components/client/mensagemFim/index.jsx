import React from "react";
import classNames from 'classnames';

import style from "../../../assets/style/message.module.css";

const MensagemFim = ({ history }) => {
  return (
    <div className={style.container}>
      <h1>
        A sua mensagem foi enviada e em breve alguém vai te responder com um
        amparo!
      </h1>
      <a className={classNames(style.text, style.big)} href="https://instagram.com/naacao" rel="noreferrer noopener">
        Acessar Instagram do NaAção
      </a>
      <p className={classNames(style.text, style.big)} onClick={() => history.push("/")}>Voltar para página inicial</p>
    </div>
  );
};

export default MensagemFim;
