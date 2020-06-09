import React from "react";

import style from "../../../assets/style/message.module.css";

const Triagem = ({ history }) => {
  const goTo = (path) => {
    history.push(path);
  };

  return (
    <div className={style.container}>
      <h1>Triagem</h1>
      <p>Qual tipo de ajuda você precisa?</p>
      <div onClick={() => goTo("doacao")} className={style.botaoGrande}>
        Doação de alimentos, produtos de higiene e afins
      </div>
      <div onClick={() => goTo("psicologo")} className={style.botaoGrande}>
        Atendimento psicológico
      </div>
      <a href="https://api.whatsapp.com/send?phone=5531991973535">
        <div className={style.botaoGrande}>Enviar uma mensagem</div>
      </a>
      <div className={style.text} onClick={() => goTo("violencia-domestica")}>
        Clique aqui se estiver sofrendo violência doméstica
      </div>
    </div>
  );
};

export default Triagem;
