export const validateEmail = (email) => {
  if (/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email)) {
    return true;
  }
  return false;
};

export const validatePassword = (password) => {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{3,15}$/.test(
      password
    )
  ) {
    return true;
  }
  return false;
};
export const validateName = (name) => {
  if (
    /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(
      name
    )
  ) {
    return true;
  }
  return false;
};
