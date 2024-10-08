const createEmailLayout = (verificationUrl) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Confirmation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
          }
  
          .main {
              padding: 20px;
              background-color: #f3f2f0;
              
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
  
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
  
          .header {
              color: #ffffff;
              padding: 10px 0;
              border-radius: 8px 8px 0 0;
          }
  
  
  
          .content {
              padding: 20px;
          }
  
          .content h1 {
              color: #333333;
          }
  
          .content p {
              color: #666666;
              font-size: 16px;
          }
  
          .button {
              margin: 20px 0;
          }
  
          .button a {
              background-color: #000000;
              color: #ffffff;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              font-size: 16px;
          }
  
          .footer {
              color: #999999;
              font-size: 14px;
              padding: 10px 0;
          }
      </style>
  </head>
  
  <body>
      <div class="main">
          <div class="container">
              <div class="header">
                  <img src="https://sidera.my.id/assets/img/logo_sidera_large.png" alt="Logo">
              </div>
              <div class="content">
                  <h1>Verify your email address</h1>
                  <p>Please confirm that you want to use this as your Sidera email address. Once it's done, your account
                      will
                      be able to start using our services.</p>
                  <div class="button">
                      <a href="${verificationUrl}">Verify Email Address</a>
                  </div>
              </div>
              <div class="footer">
                  <p>This verification email is valid for 24 hours.</p>
              </div>
          </div>
      </div>
  </body>
  
  </html>`;
};

module.exports = createEmailLayout;
