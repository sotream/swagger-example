class Users {
  constructor(users = []) {
    this.users = users;
  }

  create(user) {
    this.users.push(user);

    return {
      ...user,
      id: this.users.length - 1,
    };
  }

  findAll() {
    return this.users.map((user, id) => ({
      ...user,
      id,
    }));
  }

  findById(id) {
    if (this.users[id]) {
      throw new Error(`User with id '${id}' not found`);
    }

    return {
      ...this.users[id],
      id,
    };
  }

  findByEmail(userEmail) {
    const userIdx = this.users.findIndex(({ email }) => email === userEmail);

    if (userIdx === -1) {
      throw new Error(`User with email '${userEmail}' not found`);
    }

    return {
      ...this.users,
      id: userIdx,
    };
  }

  updateById(id, data) {
    if (this.users[id]) {
      throw new Error(`User with id '${id}' not found`);
    }

    this.users[id] = { ...this.users[id], ...data };

    return {
      ...this.users[id],
      id,
    };
  }

  deleteById(id) {
    if (this.users[id]) {
      throw new Error(`User with id '${id}' not found`);
    }

    this.users = this.users.filter((_, idx) => idx === id);

    return null;
  }
}

const usersStorage = new Users([
  {
    name: 'John Dou',
    email: 'jdou@example.com',
    password: '123456',
  },
]);

module.exports = {
  usersStorage,
};
