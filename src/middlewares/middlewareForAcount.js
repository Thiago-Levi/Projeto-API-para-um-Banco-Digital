const { banco, contas } = require("../database/bancodedados");

const passwordValidate = (req, res, next) => {
  const { senha_banco } = req.query;
  if (!senha_banco) {
    return res.status(400).json({
      mensagem: "A senha do banco não foi informada informada!",
    });
  }

  if (banco.senha !== senha_banco) {
    return res.status(404).json({
      mensagem: "A senha do banco informada é inválida!",
    });
  }
  next();
};

const createAcountValidate = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const isAllFillFields =
    nome && cpf && data_nascimento && telefone && email && senha;

  if (!isAllFillFields) {
    return res.status(400).json({
      message:
        "O objeto precisa ter as seguintes propriedades e todas elas devem ser preenchidas: nome, cpf, data_nascimento, telefone, email, senha",
    });
  }

  const foundCPF = contas.find(({ usuario }) => usuario.cpf === cpf);
  const foundEmail = contas.find(({ usuario }) => usuario.email === email);

  if (foundCPF || foundEmail) {
    return res.status(400).json({
      message:
        "Já existe uma conta com este email e/ou a CPF em nossa base de dados. ",
    });
  }

  next();
};

const updateUserAcountValidade = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const isAllFillFields = nome && data_nascimento && telefone && senha;

  if (!isAllFillFields) {
    return res.status(400).json({
      message:
        "Devem ser passados no body da requisição: nome, cpf, data_nascimento, telefone, email, senha",
    });
  }

  next();
};

const deletAcountValidade = (req, res, next) => {
  const { numeroConta } = req.params;
  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === String(numeroConta)
  );

  if (!numeroConta || !foundAcountByNumber) {
    return res.status(404).json({
      message: `Número da conta é inválido! ou usuário e conta não encontrados`,
    });
  }
  next();
};

const passwordUserValidate = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if (!senha || !numero_conta) {
    return res
      .status(404)
      .json({
        mensagem: "O número da conta e senha são obrigatórios!",
      })
      .send();
  }

  const foundAcountByNumber = contas.find(
    ({ numero }) => numero === numero_conta
  );

  if (!foundAcountByNumber) {
    return res.status(404).json({
      message: `Número da conta é inválido. Usuário e conta não encontrados`,
    });
  }

  if (foundAcountByNumber.usuario.senha !== senha) {
    return res.status(404).json({
      message: `Senha inválida!`,
    });
  }

  next();
};

module.exports = {
  passwordValidate,
  createAcountValidate,
  updateUserAcountValidade,
  deletAcountValidade,
  passwordUserValidate,
};
