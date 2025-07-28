const rootTemplate = (body: string) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:14px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table  width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; padding:25px 14px; margin:0 auto;">
     <tr style="padding-top:20px;">
        <td align="center" style="padding-bottom: 10px;"> <table cellpadding="0" cellspacing="0" border="0" style="display:inline-block;">
            <tr>
              <td align="center" style="vertical-align: middle;">
                <img width="40" height="32" src="https://i.ibb.co/XfW89Sx2/webtricker-w.png" alt="webtricker-w" border="0" style="display:block;">
              </td>
              <td align="center" style="vertical-align: middle; padding-left: 2px;"> <span style="font-size:18px; color:#333333; line-height: 1;">Webtricker</span> </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0">
            ${body}
            <tr>
             <td>
              <br />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 20px; border-top:1px solid #eeeeee;">
                <p style="margin:0; font-size:14px; color:#999999;">
                  &copy; 2025 Webtricker. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const getThankingMailTemplate = () => {

  const template = `
   
            <!-- Thank You Message -->
            <tr>
              <td align="center">
                <h1 style="margin-bottom:5px; font-size:20px; color:#333333;">Message received!<br /> Thanks for your message.</h1>
              </td>
            </tr>
            <tr>
              <td align="center">
                <p style="margin:0; font-size:16px; color:#555555; line-height:1.5;">
                  We have received your message and will get back to you shortly.<br />
                  In the meantime, feel free to browse our website or follow us on social media.
                </p>
              </td>
            </tr>
    `;

  return rootTemplate(template);
}


export const getAdminMailTemplate = () => {
  const template = `
   <!-- Alert admin about login -->
            <tr>
              <td>
                <h3 style="margin:0; font-size:18px; color:#333333;">You have just logged in your website.</h3>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin:0; font-size:16px; color:#555555; line-height:1.5;">
                 If its not you, please contact your authorized person to verifiy the logged in user.
                If your site has been compromised then contact your developer to change the root password from Database.
                </p>
              </td>
            </tr>
  `
  return rootTemplate(template);
}

export const getSubscribeOTPMailTemplate = (otp: string) => {
  const template = `
    <!-- OTP Notification Message -->
    <tr>
      <td align="center">
        <p style="margin:0 0 10px; font-size:16px; color:#555555;">
          Thank you for subscribing our newsletter! Use the 6-digit OTP below to verify your email address on our website.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="font-size:28px; font-weight:bold; color:#2b2b2b; margin:20px 0;">
          ${otp}
        </p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="font-size:14px; color:#888888;">
          This OTP is valid for the next 10 minutes. Please do not share it with anyone.
        </p>
      </td>
    </tr>
  `;

  return rootTemplate(template);
};
