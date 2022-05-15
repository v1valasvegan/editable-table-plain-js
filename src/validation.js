const validate = ({ name, phone }) => {
  const isValidName = name?.trim().length > 0;
  const isValidPhone = /^[+, 0-9](\d+-?\d+$)+/.test(phone);
  return { name: isValidName, phone: isValidPhone };
};

const handleValidation = (form, validationState) => {
  const name = form.querySelector("[name='name']");
  const phone = form.querySelector("[name='phone']");
  [name, phone].forEach((input) => {
    if (!validationState[input.name]) {
      input.classList.add('invalid');
    }
    if (validationState[input.name]) {
      input.classList.remove('invalid');
    }
  });
};

export { validate, handleValidation };
