
import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre }) {

    if (genre) {
      const lowercaseGenre = genre.toLowerCase()

      const [genreRows] = await connection.query(' Select id, name from genre where name = ?', [lowercaseGenre])

      console.log(genreRows)

      if (genreRows.length === 0) return []

      const [{ id }] = genreRows

      const [movieGenre] = await connection.query(`
        SELECT bin_to_uuid(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name genre from movie_genre mg
        inner join movie m on mg.movie_id = m.id
        inner join genre g on mg.genre_id = g.id
        where g.id = ?`,
        [id]
      )

      return movieGenre

    }

    const [rows] = await connection.query(`SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate FROM movie`)


    return rows
  }

  static async getById({ id }) {

    const [movie] = await connection.query(`
      SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate 
      FROM movie
      where id = UUID_TO_BIN(?)`,
      [id]
    )

    return movie



  }

  static async create({ input }) {

    const { title, year, director, duration, poster, rate } = input

    const [uuidResult] = await connection.query(` Select UUID() uuid `)

    const [{ uuid }] = uuidResult

    await connection.query(`
      INSERT INTO movie (id,title, year, director, duration, poster, rate) 
      VALUES (UUID_TO_BIN(?),?,?,?,?,?,?)
    `,
      [uuid, title, year, director, duration, poster, rate]
    )

    const [movie] = await connection.query(`
      SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate FROM movie 
      WHERE id = UUID_TO_BIN(?)
    `,
      [uuid]
    )

    return movie

  }

  static async delete({ id }) {

    const [movie] = await connection.query(`SELECT * FROM movie WHERE id = UUID_TO_BIN(?)`, [id])

    if (movie.length === 0) return false

    await connection.query(`DELETE FROM movie WHERE id =UUID_TO_BIN(?)`, [id])

    return true

  }

  static async update({ input, id }) {

    const keys = Object.keys(input)

    const values = Object.values(input)

    const rows = `${keys.join(' = ?,')} = ?`

    try {

      await connection.query(
        `UPDATE movie
          SET ${rows}
          WHERE id = UUID_TO_BIN(?)`,
        [...values, id]
      )

      const [movieUpdated] = await connection.query(
        `SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate FROM movie
         WHERE id = UUID_TO_BIN(?)`, 
        [id]
      )

      return movieUpdated

    } catch (error) {
      console.log(error)
    }


  }
}
