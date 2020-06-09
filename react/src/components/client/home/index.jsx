import React from "react";

import style from "./index.module.css";

import Centerlab from "../../../assets/images/centerlab.png";
import logo from "../../../assets/images/logo.png";
import hero from "../../../assets/images/hero.svg";
import BF from "../../../assets/images/BF.png";
import Marvin from "../../../assets/images/Marvin.png";
import yoou from "../../../assets/images/yoou.png";
import naacao from "../../../assets/images/naacao.png";
import supreglobo from "../../../assets/images/superglobo.jpeg";
import santaclara from "../../../assets/images/santaclara.jpeg";

const Home = ({ history }) => (
  <div>
    <div className={style.main}>
      <div className={style.hero}>
        <div className={style.container}>
          <div className={style.introText}>
            <img src={logo} alt="AMPARO" />
            <h1>
              Sua plataforma GRATUITA de apoio durante a pandemia do coronavírus
            </h1>
            <p>
              O INSTITUTO NAAÇÃO desenvolveu esta plataforma para dar apoio
              gratuito a toda a população. Seja ele psicológico ou com doações.
              Precisa de algum tipo de ajuda? Clique no botão abaixo.
            </p>
          </div>
          <div>
            <div onClick={() => history.push("triagem")} className={style.cta}>
              QUERO AJUDA GRATUITA AGORA
            </div>
          </div>
        </div>
      </div>
      <div className={style.wave}>
        <img src={hero} alt="onda" />
      </div>
      <div className={style.volunteer}>
        <p>Venha ajudar com a gente nessa pandemia!</p>
        <p className={style.orange}>Juntos somos mais fortes</p>
        <p className={style.cta}>
          Clique no botão abaixo e preencha o formulário
        </p>
        <div className={style.button}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdc_OKcmSfGBqj3kuER2BRg3BQXkojw5kQ3Y7QGCn7ZsNP9nw/viewform"
            rel="noreferrer noopener"
            target="_blank"
          >
            QUERO ME VOLUNTARIAR
          </a>
        </div>
        <br />
        <div className={style.button}>
          <a href="https://naacao.com.br/#doacao" rel="noreferrer noopener">
            QUERO FAZER DOAÇÃO FINANCEIRA
          </a>
        </div>
        <br />
        <p className={style.cta}>
          Ainda não estamos aceitando doações materiais
        </p>
      </div>
      <div className={style.sponsors}>
        <p>APOIO INSTITUCIONAL</p>
        <div>
          <img src={Centerlab} alt="img" />
          <img src={BF} alt="img" />
          <img src={Marvin} alt="img" />
          <img src={yoou} alt="img" />
          <img src={supreglobo} alt="img" />
          <img src={santaclara} alt="img" />
        </div>
      </div>
      <div className={style.info}>
        <img src={naacao} alt="" />
        <div className={style.details}>
          <div>
            <h3>Endereço</h3>
            <p>Avenida Pedro II, 1689</p>
            <p>Belo Horizonte/MG</p>
            <hr />
            <p>Rua Augusto Diniz Murta, 535</p>
            <p>Brumadinho/MG</p>
          </div>
          <div>
            <h3>Telefone</h3>
            <p>Celular/WhatsApp</p>
            <p>(31) 99197-3535</p>
          </div>
          <div>
            <h3>Site e email</h3>
            <p>www.naacao.com.br</p>
            <p>contato@naacao.com.br</p>
          </div>
        </div>
      </div>
    </div>
    <div className={style.footer}>
      2020 &copy; Instituto NaAção. Todos os direitos reservados.
    </div>
  </div>
);

export default Home;
