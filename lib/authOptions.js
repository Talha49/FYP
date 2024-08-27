import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    sesssion: {
      strategy: 'jwt'
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
  }