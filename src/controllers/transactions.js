let {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../database/bancodedados");

const depositIntoAccount = (req, res) => {
  const { numero_conta, valor } = req.body;
  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  foundAcountByNumber.saldo += valor;
  const newRegister = {
    data: dateAndHourGenerate(),
    numero_conta,
    valor,
  };

  depositos.push(newRegister);

  return res.status(201).send();
};

const withdrawFromAnAccount = (req, res) => {
  const { numero_conta, valor } = req.body;

  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  if (foundAcountByNumber.saldo < valor) {
    return res
      .status(403)
      .json({
        mensagem: `Não há saldo na conta para sacar o valor de ${valor}`,
      })
      .send();
  }
  if (valor <= 0) {
    return res
      .status(403)
      .json({
        mensagem: `Não é permitido sacar o valor de ${valor}`,
      })
      .send();
  }

  if (foundAcountByNumber.saldo < valor) {
    return res
      .status(403)
      .json({
        mensagem: `Não há saldo na conta para sacar o valor de ${valor}`,
      })
      .send();
  }

  foundAcountByNumber.saldo -= valor;

  const newRegister = {
    data: dateAndHourGenerate(),
    numero_conta,
    valor,
  };

  saques.push(newRegister);

  return res.status(201).send();
};

const transfer = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor } = req.body;

  const foundOriginAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta_origem
  );
  const foundTargetAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta_destino
  );

  if (foundOriginAcountByNumber.saldo < valor) {
    return res
      .status(403)
      .json({
        mensagem: `Saldo insuficiente na conta de origem informada!`,
      })
      .send();
  }

  foundOriginAcountByNumber.saldo -= valor;
  foundTargetAcountByNumber.saldo += valor;

  const newRegister = {
    data: dateAndHourGenerate(),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };

  transferencias.push(newRegister);

  return res.status(200).send();
};

//////////////// auxiliary/utils functions  /////////////////////////////////////
//////////////// I made it here to facilitate the correction ///////////////////

function dateAndHourGenerate() {
  const dateAndHourOfTransaction = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  return dateAndHourOfTransaction;
}
module.exports = { depositIntoAccount, withdrawFromAnAccount, transfer };
