import {
  getUsrs,
  getUsrById,
  lgin,
  addUsr,
  updateUsr,
  deleteUsr,
} from "../services/userServices.js";

export const getUsers = async () => {
  const questions = getUsrs();
  return questions;
};

export const getUserById = async (id) => {
  const questions = getUsrById(id);
  return questions;
};

export const login = async (data) => {
  const questions = lgin(data);
  return questions;
};

export const addUser = async (userinfo) => {
  const questions = addUsr(userinfo);
  return questions;
};

export const updateUser = async (user) => {
  const questions = updateUsr(user);
  return questions;
};

export const deleteUser = async (id) => {
  const questions = deleteUsr(id);
  return questions;
};
