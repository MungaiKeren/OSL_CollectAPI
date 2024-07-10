const getContent = (from, name, pass) => {
  return `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forgot Password</title>
    <style>
      body {
        background-color: white;
        padding: 1em;
      }
      h4,
      h6,
      p {
        font-size: small;
      }
      h6 {
        font-style: italic;
        font-weight: 500;
      }
      h4 {
        font-weight: 560;
      }
      hr {
        color: #60606010;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <p>Dear ${name},</p>
      <p>We have generated a password for you: <b>${pass}</b></p>

      <br />
      <p>By System Admin.</p>
    </div>
    <hr />
    <div class="footer">
      <h4>Western Kenya Water Project (WKWP) </br> MEL-MIS</h4>
      <h4>Data Collection Module</h4>
    </div>
    <hr />
    <h6>This is an auto-generated email no need to reply.</h6>
  </body>
</html>
  `;
};

exports.getContent = getContent;
