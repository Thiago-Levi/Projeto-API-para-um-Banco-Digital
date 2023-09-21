let { contas } = require("../database/bancodedados");

const depositIntoAccountValidate = (req, res, next) => {
  const { numero_conta, valor } = req.body;
  const isValidDespositValue = valor > 0;
  const isNotAllFillFields = !numero_conta || !valor;
  const isCharacter = typeof valor === "string";

  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  if (isNotAllFillFields) {
    return res.status(404).json({
      message: `Número da conta e valor do depósito precisam ser informados.`,
    });
  }

  if (isCharacter || !isValidDespositValue) {
    return res.status(404).send({
      mensagem:
        "O valor do depósito não aceita valores negativos ou zerados e nem caracteres.",
    });
  }

  if (!foundAcountByNumber) {
    return res.status(404).json({
      message: `Usuário/conta não encontrados`,
    });
  }

  next();
};

const withdrawFromAnAccountValidate = (req, res, next) => {
  const { numero_conta, valor, senha } = req.body;
  const isNotAllFillFields = !numero_conta || !valor || !senha;

  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  if (isNotAllFillFields) {
    return res.status(400).json({
      mensagem:
        "O numero da conta, o valor do saque e a senha devem ser informados!",
    });
  }

  if (!foundAcountByNumber) {
    return res.status(400).json({
      mensagem: "Número de usuário inválido!",
    });
  }

  if (foundAcountByNumber.usuario.senha !== senha) {
    return res
      .status(400)
      .json({
        mensagem:
          "A senha informada não é uma senha válida para a conta informada!",
      })
      .send();
  }
  next();
};

const transferValidade = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const isNotAllFillFields =
    !numero_conta_origem || !numero_conta_destino || !valor || !senha;
  const foundOriginAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta_origem
  );

  const foundTargetAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta_destino
  );

  if (isNotAllFillFields) {
    return res.status(400).json({
      message: `o número da conta de origem, de destino, senha da conta de origem e valor da transferência NÃO foram informados no body`,
    });
  }

  if (!foundOriginAcountByNumber) {
    return res
      .status(400)
      .json({
        mensagem: `A conta de número: ${numero_conta_origem} não existe.`,
      })
      .send();
  }
  if (!foundTargetAcountByNumber) {
    return res
      .status(400)
      .json({
        mensagem: `A conta de número: ${numero_conta_destino} não existe.`,
      })
      .send();
  }

  if (foundOriginAcountByNumber.usuario.senha !== senha) {
    return res
      .status(401)
      .json({
        mensagem: `A senha informada não é uma senha válida para a conta de origem informada!`,
      })
      .send();
  }
  next();
};

module.exports = {
  depositIntoAccountValidate,
  withdrawFromAnAccountValidate,
  transferValidade,
};
