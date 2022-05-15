import fetchUsers from './fetchUsers';
import errorMessages from './errorMessages';
import { validate, handleValidation } from './validation';

const makeButton = (action, handler) => {
  const button = document.createElement('button');
  button.classList.add('button-icon', action);

  if (handler) {
    button.addEventListener('click', handler);
  } else {
    button.setAttribute('type', 'submit');
  }

  return button;
};

const makeCell = (text) => {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.innerText = text;
  return cell;
};

const makeCellInput = (name, value) => {
  const cell = document.createElement('div');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', name);
  input.value = value;
  const errorMessage = document.createElement('pre');
  errorMessage.innerText = errorMessages[name];
  errorMessage.classList.add('error-message');
  cell.append(input, errorMessage);
  cell.classList.add('cell');
  return cell;
};

const App = async () => {
  const container = document.getElementById('table-body');
  const loader = document.createElement('div');
  loader.classList.add('loader');
  loader.innerText = '...Loading';
  container.append(loader);
  const users = await fetchUsers();
  let state = [...users];

  const makeRow = ({ name, phone, id }) => {
    const row = document.createElement('div');
    const fields = [name, phone].map(makeCell);
    const cell = document.createElement('div');
    const deleteButton = makeButton('delete', makeDeleteHandler(id));
    const editButton = makeButton('edit', makeEditToggleHandler(id, true));
    cell.classList.add('cell');
    cell.append(editButton, deleteButton);
    const children = [...fields, cell];
    row.append(...children);
    row.classList.add('row');
    return row;
  };

  const makeEditableRow = ({ name, phone, id }) => {
    const form = document.createElement('form');
    const nameCell = makeCellInput('name', name);
    const phoneCell = makeCellInput('phone', phone);
    const actionCell = document.createElement('div');
    const saveButton = makeButton('save');
    const cancelButton = makeButton('cancel', makeEditToggleHandler(id, false));
    actionCell.append(saveButton, cancelButton);
    actionCell.classList.add('cell');
    form.append(nameCell, phoneCell, actionCell);
    form.classList.add('row');
    form.addEventListener('submit', makeSaveUserHandler(id));
    return form;
  };

  const makeDeleteHandler = (uid) => () => {
    state = state.filter(({ id }) => id !== uid);
    render(state);
  };

  const makeEditToggleHandler = (uid, isEditing) => () => {
    state = state.map((user) =>
      user.id === uid ? { ...user, isEditing } : user
    );
    render(state);
  };

  const makeSaveUserHandler = (uid) => (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const validationState = validate({ name, phone });
    handleValidation(e.target, validationState);
    if (Object.values(validationState).some((isValid) => !isValid)) {
      return;
    }

    state = state.map((user) => (user.id === uid ? { name, phone } : user));
    render(state);
    e.target.reset();
  };

  const addUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const validationState = validate({ name, phone });
    handleValidation(e.target, validationState);
    if (Object.values(validationState).some((isValid) => !isValid)) {
      return;
    }
    const id = Date.now();
    state.push({ name, phone, id });
    render(state);
    e.target.reset();
  };

  const render = (state) => {
    const container = document.getElementById('table-body');
    const children = state.map((user) =>
      user.isEditing ? makeEditableRow(user) : makeRow(user)
    );
    container.innerHTML = '';
    container.append(...children);
  };
  render(state);
  const form = document.getElementById('form');
  form.addEventListener('submit', addUser);
};

App();
