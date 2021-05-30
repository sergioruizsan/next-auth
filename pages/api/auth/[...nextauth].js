import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from "next-auth/adapters"

console.log(process.env.NEXTAUTH_URL)
console.log(process.env.EMAIL_PORT)
console.log(process.env.EMAIL_HOST)
console.log(process.env.EMAIL_USERNAME)
console.log(process.env.EMAIL_PASSWORD)

const options = {
    site: process.env.NEXTAUTH_URL,
    providers: [
        Providers.Credentials({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Sign In',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.

            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },

            authorize: async (credentials) => {
                // Add logic here to look up the user from the credentials supplied
                // const user = {id: 1, name: 'J Smith', email: 'jsmith@example.com'}
                const user = await Adapters.TypeORM.Models.User.model.user.findOne(credentials.email)
                console.log("user", user)
                console.log("credentials", credentials)

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return Promise.resolve(user)
                } else {
                    // If you return null or false then the credentials will be rejected
                    return Promise.resolve(null)
                    // You can also Reject this callback with an Error or with a URL:
                    // return Promise.reject(new Error('error message')) // Redirect to error page
                    // return Promise.reject('/path/to/redirect')        // Redirect to a URL
                }
            }
        }),
        // Providers.Email({
        //     server: {
        //         port: parseInt(process.env.EMAIL_PORT),
        //         host: process.env.EMAIL_HOST,
        //         secure: false,
        //         auth: {
        //             user: process.env.EMAIL_USERNAME,
        //             pass: process.env.EMAIL_PASSWORD,
        //         },
        //         tls: {
        //             rejectUnauthorized: false,
        //         },
        //     },
        //     from: process.env.EMAIL_FROM
        // })
    ],
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    jwt: {
        // encryption: true,
        secret: process.env.JWT_SECRET
      },
    database: process.env.DATABASE_URL,
}

export default (req, res) => NextAuth(req, res, options)