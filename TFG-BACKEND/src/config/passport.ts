import passport from 'passport'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import { config } from 'dotenv'

config()

const clientID = process.env.MICROSOFT_CLIENT_ID
const clientSecret = process.env.MICROSOFT_CLIENT_SECRET

if (!clientID || !clientSecret) {
  throw new Error(
    '❌ MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET is not defined in .env'
  )
}

interface MicrosoftStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
  scope: string[]
  authorizationURL: string
  tokenURL: string
}

interface MicrosoftProfile {
  id: string
  displayName: string
  emails?: { value: string }[]
  [key: string]: unknown
}

passport.use(
  'auth-microsoft',
  new MicrosoftStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:5050/api/auth/microsoft/callback',
      scope: ['user.read', 'calendars.read', 'mail.read', 'offline_access'],
      authorizationURL:
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    } as MicrosoftStrategyOptions,
    function (
      accessToken: string,
      refreshToken: string,
      profile: MicrosoftProfile,
      done: (error: any, user?: MicrosoftProfile | false) => void
    ) {
      done(null, profile)
    }
  )
)
