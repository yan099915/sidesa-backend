const createEmailLayoutResetPassword = (resetPasswordUrl) => {
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
                  <img src="https://portal.desarawang.com/assets/images/logo_sidera_large.png" alt="Logo">
              </div>
              <div class="content">
                  <h1>Reset account password</h1>
                  <p>Click button below to reset your account password.</p>
                  <div class="button">
                      <a href="${resetPasswordUrl}">Reset Account Password</a>
                  </div>
              </div>
              <div class="footer">
                  <p>This email is valid for 15 minute.</p>
              </div>
          </div>
      </div>
  </body>
  
  </html>`;
};

module.exports = createEmailLayoutResetPassword;
