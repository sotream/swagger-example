const { generateId } = require('../utils')

class Users {
  #users = new Map();

  constructor(users) {
    for (const user of users) {
      this.#users.set(generateId(), user)
    }
  }

  create(newUser) {
    if (!user.name || !user.email || !user.password) {
      throw new Error('User params are not valid');
    }

    const usersArray = Array.from(this.#users)

    for (const [,user] of usersArray) {
      if (user.email === newUser.email) {
        throw new Error('user already exists');
      }
    }

    const userId = generateId()
    this.#users.set(userId, user);

    delete user.password;

    return {
      ...user,
      id: userId
    };
  }

  findAll() {
    return Array.from(this.#users).map(([id, user]) => ({
      ...user,
      id,
    }));
  }

  findById(userId) {
    const userEntry = Array.from(this.#users).find(([id]) => {
      return userId === id
    });

    if (!userEntry) {
      throw new Error(`User with id '${userId}' not found`);
    }

    const [id, user] = userEntry;

    return {
      ...user,
      id
    }
  }

  findByFilter(filter, withPassword = false) {
    const usersArray = Array.from(this.#users)
    const filteredUserEntries = usersArray.filter(([, user]) => {
      return user.email.toLowerCase().includes(filter.toLowerCase()) || user.name.toLowerCase().includes(filter.toLowerCase())
    });

    const users = filteredUserEntries.map(([id, { password, ...user }]) => {
      const result = {
        ...user,
        id
      }

      if (withPassword) {
        result.password = password
      }

      return result
    })

    return users
  }

  updateById(id, data) {
    const user = this.#users.get(id)

    if (user) {
      throw new Error(`User with id '${id}' not found`);
    }

    const newUser = { ...user, ...data }

    this.#users.set(id, newUser)

    return {
      ...newUser,
      id,
    };
  }

  deleteById(id) {
    const isUserExists = this.#users.has(id)

    if (isUserExists) {
      throw new Error(`User with id '${id}' not found`);
    }

    this.#users.delete(id);

    return null;
  }
}

const usersStorage = new Users([
  {
    name: 'John Dou',
    email: 'jdou@test.com',
    password: '123456',
  },
  {
    name: 'Joe Dou',
    email: 'jedou@test.com',
    password: '654321',
  },
]);

module.exports = {
  usersStorage,
};
