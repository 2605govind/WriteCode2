1. jab bhi email send karna ho otp ke sath
    step1. generate OTP and get email
    step2. install nodemailer 
    step3. define subject, message(html + otp), email
    step4. create transporter = nodemailer.createtransporter defain (host, service, port, auth{user, pass})
    step5. create options (from, to, subject, html);
    step6. await tranporter.sendEmail(options);



2. 401 => Unauthorized 
   400 => bad requiest
   500 => internal server error
   429 => Too Many Requests    



3. google backend
    config
    step 1. take "google" from googleapis module
    step 2. const oauth2client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'postmessage') now export this

    controller
    step 1.  me {req.body.code} , getAllToken
    step 2. auth2client.setCredentials( await oauth2client.getToken(code) );
    