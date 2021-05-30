import { getSession } from 'next-auth/client'

export default async (req, res) => {
    const session = await getSession({ req })

    if(session) {
        res.status(200).json({
            message: 'You are signed in!'
        })
    }else{
        res.status(403).json({
            message: 'You must be sign in'
        })
    }
}