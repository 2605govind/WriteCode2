import { OAuth2Client } from 'google-auth-library'
import 'dotenv/config';


const googleclient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // Special for auth code flow
);


export default googleclient;

