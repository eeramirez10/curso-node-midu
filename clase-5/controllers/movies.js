import { validateMovie, validatePartialMovie } from '../schemas/movie.js'

export class MovieController {
	constructor({ movieModel }){
		this.movieModel = movieModel
	}
	getAll = async (req, res) => {
		const { genre } = req.query
		const moviesByGenre = await this.movieModel.getAll({ genre })
		if (moviesByGenre.length > 0) return res.json(moviesByGenre)

		return res.status(404).json({ message: 'Peliculas no encontradas' })
	}

	getById = async (req, res) => {
		const { id } = req.params

		const searchedMovie = await this.movieModel.getById({ id })

		if (searchedMovie) return res.json(searchedMovie)

		return res.status(404).json({ message: 'Pelicula no encontrada' })
	}

	create = async (req, res) => {
		const result = validateMovie(req.body)

		if (result.error) {
			return res.status(400).json({ error: result.error })
		}

		const newMovie = await this.movieModel.create({ input: result.data })

		return res.status(201).json(newMovie)
	}

	update = async (req, res) => {
		const { id } = req.params

		const result = validatePartialMovie(req.body)

		if (result.error) {
			return res.status(400).json({ message: 'Hubo un error al validar' })
		}
		const newMovie = await this.movieModel.update({ input: result.data, id })

		return res.json(newMovie)
	}

	delete = async (req, res) => {
		const { id } = req.params

		const movie = await this.movieModel.delete({ id })

		if (!movie) {
			return res.status(404).json({ message: ' Pelicula no encontrada' })
		}

		return res.json({ message: 'movie deleted' })
	}
}
