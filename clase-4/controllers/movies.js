import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movie.js'

export class MovieController {
	static async getAll(req, res) {
		const { genre } = req.query
		const moviesByGenre = await MovieModel.getAll({ genre })
		if (moviesByGenre.length > 0) return res.json(moviesByGenre)

		return res.status(404).json({ message: 'Peliculas no encontradas' })
	}

	static async getById(req, res) {
		const { id } = req.params

		const searchedMovie = await MovieModel.getById({ id })

		if (searchedMovie) return res.json(searchedMovie)

		return res.status(404).json({ message: 'Pelicula no encontrada' })
	}

	static async create(req, res) {
		console.log(req.body)
		const result = validateMovie(req.body)

		if (result.error) {
			return res.status(400).json({ error: result.error })
		}

		const newMovie = await MovieModel.create({ input: result.data })

		return res.status(201).json(newMovie)
	}

	static async update(req, res) {
		const { id } = req.params

		console.log(req.body)

		const result = validatePartialMovie(req.body)

		if (result.error) {
			return res.status(400).json({ message: 'Hubo un error al validar' })
		}
		const newMovie = await MovieModel.update({ input: result.data, id })

		return res.json(newMovie)
	}

	static async delete(req, res) {
		const { id } = req.params

		const movie = await MovieModel.delete({ id })

		if (!movie) {
			return res.status(404).json({ message: ' Pelicula no encontrada' })
		}

		return res.json({ message: 'movie deleted' })
	}
}
