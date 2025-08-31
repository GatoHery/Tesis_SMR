import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { dbConnection } from '../database/config'
import {
  authRoutes,
  rolesRoutes,
  resourcesRoutes,
  soundDetectionRoutes,
  userRoutes,
  reservationRoutes
} from '../routes'
import passport from 'passport'
import '../config/passport'

dotenv.config()

class Server {
  private app: Application
  private port: string | undefined

  // paths declarations
  public authPath: string
  public reservationPath: string
  public resourcesPath: string
  public rolesPath: string
  public soundDetectionPath: string
  public userPath: string

  constructor() {
    this.app = express()
    this.port = process.env.PORT || '3000'

    this.authPath = '/api/auth'
    this.reservationPath = '/api/reservations'
    this.resourcesPath = '/api/resources'
    this.rolesPath = '/api/roles'
    this.soundDetectionPath = '/api/sound-detection'
    this.userPath = '/api/users'

    this.connectingDatabase()
    this.middlewares()
    this.routes()
  }

  async connectingDatabase() {
    await dbConnection()
  }

  middlewares() {
    this.app.use(cors())

    this.app.use(cookieParser())
    this.app.use(passport.initialize())
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.authPath, authRoutes.default)
    this.app.use(this.reservationPath, reservationRoutes.default) // Use the reservation routes
    this.app.use(this.resourcesPath, resourcesRoutes.default) // Use the resources routes
    this.app.use(this.rolesPath, rolesRoutes.default)
    this.app.use(this.soundDetectionPath, soundDetectionRoutes.default)
    this.app.use(this.userPath, userRoutes.default)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`)
    })
  }
}

export default Server // Use ES6 export
