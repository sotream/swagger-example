const log4js = require('log4js');

const { NotFoundError } = require('../common/errors');

class Users {
  #users = new Map();
  #id = 0;

  constructor(users) {
    this.log = log4js.getLogger('usersStorage');
    this.log.level = 'debug';

    for (const user of users) {
      this.#users.set(++this.#id, user);
    }
  }

  create(newUser) {
    if (!newUser.name || !newUser.email || !newUser.password) {
      throw new Error('User params are not valid');
    }

    const usersArray = Array.from(this.#users);

    for (const [, user] of usersArray) {
      if (user.email === newUser.email) {
        throw new Error('user already exists');
      }
    }

    const userId = ++this.#id;

    this.#users.set(++this.#id, newUser);

    // eslint-disable-next-line no-param-reassign
    delete newUser.password;

    const createdUser = {
      ...newUser,
      id: userId,
    };

    this.log.debug('User id=', userId, 'successfully created. Created user=', createdUser);

    return createdUser;
  }

  findAll() {
    const users = Array.from(this.#users).map(([id, user]) => ({
      ...user,
      id,
    }));

    this.log.debug('Stored users=', users);

    return users;
  }

  findById(userId) {
    const userEntry = Array.from(this.#users).find(([id]) => userId === id);

    if (!userEntry) {
      throw new NotFoundError(`User with id '${userId}' not found`);
    }

    const [id, user] = userEntry;

    const userEntity = {
      ...user,
      id,
    };

    this.log.debug('Get user by id=', userId, 'user=', userEntity);

    return userEntity;
  }

  findByFilter(filter, withPassword = false) {
    const usersArray = Array.from(this.#users);
    const lowerCasedFilter = filter.toLowerCase();
    const filteredUserEntries = usersArray.filter(([, user]) => {
      const email = user.email.toLowerCase();
      const name = user.name.toLowerCase();

      return email.includes(lowerCasedFilter) || name.includes(lowerCasedFilter);
    });

    const users = filteredUserEntries.map(([id, { password, ...user }]) => {
      const result = {
        ...user,
        id,
      };

      if (withPassword) {
        result.password = password;
      }

      return result;
    });

    this.log.debug('Get user by filter=', `'${filter}'`, 'users=', users);

    return users;
  }

  updateById(id, data) {
    const user = this.#users.get(id);

    if (user) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    const newUser = { ...user, ...data };

    this.#users.set(id, newUser);

    this.log.debug('Update user by user id=', id, 'data to update=', data, 'updated user=', newUser);

    return {
      ...newUser,
      id,
    };
  }

  deleteById(id) {
    const isUserExists = this.#users.has(id);

    if (isUserExists) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    this.#users.delete(id);

    this.log.debug('User with id=', id, 'removed successfully');

    return null;
  }
}

const usersStorage = new Users([
  {
    name: 'John Dou',
    email: 'jdou@test.com',
    password: '12345678',
  },
  {
    name: 'Joe Dou',
    email: 'jedou@test.com',
    password: '87654321',
  },
]);

module.exports = {
  usersStorage,
};
