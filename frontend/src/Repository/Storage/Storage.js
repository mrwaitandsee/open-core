
class Storage {
  constructor() {

  }

  clear() {
    localStorage.clear();
  }

  saveToken(token) {
    localStorage.setItem('token', token);
  }

  hasToken() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

const storage = new Storage();

export {
  storage
};
