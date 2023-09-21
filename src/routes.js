const express = require("express");
const routes = express();
const {
  passwordValidate,
  createAcountValidate,
  updateUserAcountValidade,
  deletAcountValidade,
  passwordUserValidate,
} = require("./middlewares/middlewareForAcount");
const {
  listBankAccounts,
  createAcount,
  updateUserAcount,
  deletAcount,
  accountBalance,
  extract,
} = require("./controllers/acounts");

const {
  depositIntoAccountValidate,
  withdrawFromAnAccountValidate,
  transferValidade,
} = require("./middlewares/middlewareForTransactions");
const {
  depositIntoAccount,
  withdrawFromAnAccount,
  transfer,
} = require("./controllers/transactions");

routes.get("/contas", passwordValidate, listBankAccounts);
routes.get("/contas/saldo", passwordUserValidate, accountBalance);
routes.post("/contas", createAcountValidate, createAcount);

routes.put(
  "/contas/:numeroConta/usuario",
  updateUserAcountValidade,
  updateUserAcount
);
routes.delete("/contas/:numeroConta", deletAcountValidade, deletAcount);
routes.get("/contas/extrato", passwordUserValidate, extract);

routes.post(
  "/transacoes/depositar",
  depositIntoAccountValidate,
  depositIntoAccount
);
routes.post(
  "/transacoes/sacar",
  withdrawFromAnAccountValidate,
  withdrawFromAnAccount
);
routes.post("/transacoes/transferir", transferValidade, transfer);
module.exports = routes;
