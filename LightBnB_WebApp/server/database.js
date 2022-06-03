const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
  .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      //console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser =  function({ name, email, password }) {
  const values = [name, email, password];
  return pool
  .query(`SELECT * FROM users WHERE email = $1`, [email])
  .then((result) => {
    
    if (result.rows.length) {
      throw new Error('User already exists')
    }
    return pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, values);
  })
  .catch((err) => {
    console.log(err.message);
  });
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // if (options.owner_id) {
  //   if (queryParams.length !== 0) {
  //     queryParams.push(`${options.owner_id}`);
  //     queryString += ` AND WHERE owner_id = $${queryParams.length}`;
  //   } else {
  //     queryParams.push(`${options.owner_id}`);
  //     queryString += ` WHERE owner_id = $${queryParams.length}`;
  //   }
  // }
  // console.log(options);

  let min_price = options.minimum_price_per_night;
  if (min_price) {
    min_price = min_price * 100;
    if (queryParams.length !== 0) {
      queryParams.push(min_price);
      queryString += ` AND WHERE cost_per_night >= $${queryParams.length}`;
    } else {
      queryParams.push(min_price);
      queryString += ` WHERE cost_per_night >= $${queryParams.length}`;
    }
  }

  let max_price = options.maximum_price_per_night;
  if (max_price) {
    max_price = max_price * 100;
    if (queryParams.length !== 0) {
      queryParams.push(max_price);
      queryString += ` AND WHERE cost_per_night <= $${queryParams.length}`;
    } else {
      queryParams.push(max_price);
      queryString += ` WHERE cost_per_night <= $${queryParams.length}`;
    }
  }

  let rating = options.minimum_rating;
  if (rating) {
    if (queryParams.length !== 0) {
      queryParams.push(rating);
      queryString += ` AND WHERE rating >= $${queryParams.length}`;
    } else {
      queryParams.push(rating);
      queryString += ` WHERE rating >= $${queryParams.length}`;
    }
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);


  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
