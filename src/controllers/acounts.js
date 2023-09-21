let {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../database/bancodedados");

const listBankAccounts = (req, res) => {
  return res.status(200).json({ contas });
};

const createAcount = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const newId = createNewId();

  const newAcount = {
    numero: newId,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  contas.push(newAcount);
  return res.status(201).send();
};

const updateUserAcount = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  const foundAcountNumber = contas.find(
    ({ numero }) => numero === String(numeroConta)
  );

  if (!foundAcountNumber) {
    return res.status(404).json({
      message: `Número da conta é inválido. Usuário e conta não encontrados`,
    });
  }

  if (cpf) {
    const foundCPF = contas.find(({ usuario }) => usuario.cpf === cpf);
    if (foundCPF) {
      return res.status(403).json({
        mensagem: "Já existe uma conta com o cpf informado!",
      });
    }
  }

  if (email) {
    const foundEmail = contas.find(({ usuario }) => usuario.email === email);
    if (foundEmail) {
      return res.status(403).json({
        mensagem: "Já existe uma conta com o email informado!",
      });
    }
  }

  const isCPFIHasBeenInformed = cpf.trim() !== "";
  const isEMAILHasBeenInformed = email.trim() !== "";

  foundAcountNumber.usuario.nome = nome;
  if (isCPFIHasBeenInformed) foundAcountNumber.usuario.cpf = cpf;
  if (isEMAILHasBeenInformed) foundAcountNumber.usuario.email = email;
  foundAcountNumber.usuario.data_nascimento = data_nascimento;
  foundAcountNumber.usuario.telefone = telefone;
  foundAcountNumber.usuario.senha = senha;

  return res.status(201).send();
};

const deletAcount = (req, res) => {
  const { numeroConta } = req.params;
  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === String(numeroConta)
  );

  const isZeroValueAccount = foundAcountByNumber.saldo === 0;

  if (!isZeroValueAccount) {
    return res.status(404).json({
      mensagem: "A conta só pode ser removida se o saldo for zero!",
    });
  }

  if (isZeroValueAccount) {
    contas = contas.filter((conta) => conta !== foundAcountByNumber);
  }

  return res.status(202).send();
};

const accountBalance = (req, res) => {
  const { numero_conta } = req.query;
  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  res.status(200).json({ saldo: foundAcountByNumber.saldo });
};

const extract = (req, res) => {
  const { numero_conta, senha } = req.query;

  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  const getWithdraw = saques.filter(
    (saque) => saque.numero_conta === foundAcountByNumber.numero
  );
  const getDeposit = depositos.filter(
    (deposito) => deposito.numero_conta === foundAcountByNumber.numero
  );

  const getSetTransfers = transferencias.filter(
    (transferencia) =>
      transferencia.numero_conta_origem === foundAcountByNumber.numero
  );

  const getIncomingTransfers = transferencias.filter(
    (transferencia) =>
      transferencia.numero_conta_destino === foundAcountByNumber.numero
  );

  const showExtract = {
    saques: getWithdraw,
    depositos: getDeposit,
    transferenciasEnviadas: getSetTransfers,
    transferenciasRecebidas: getIncomingTransfers,
  };

  return res.status(200).json(showExtract);
};

module.exports = {
  listBankAccounts,
  createAcount,
  updateUserAcount,
  deletAcount,
  accountBalance,
  extract,
};

//////////////// auxiliary/utils functions  /////////////////////////////////////
//////////////// I made it here to facilitate the correction ///////////////////

function createNewId() {
  return String(Number(contas[contas.length - 1].numero) + 1);
}
