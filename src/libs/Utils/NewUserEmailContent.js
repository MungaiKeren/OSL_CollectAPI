const getContent = (name, email, phone, password, role) => {
  return `<body style="height: fit-content; padding: 1em">
    <div
      style="
        border-radius: 10px;
        background-color: #f2f2f2;
        max-width: 85%;
        margin: auto;
        padding: 1em;
        height: fit-content;
      "
    >
      <div style="padding: 1em 2em 1em 2em">
        <h2
          style="
            text-align: center;
            margin: 10px 0 10px 0;
            font-size: x-large;
            color: #a20c0c;
          "
        >
          The Western Kenya Water Project
        </h2>
        <h3
          style="
            text-align: center;
            margin: 10px 0 10px 0;
            font-size: large;
            color: #fd5614;
          "
        >
          Monitoring Evaluation and Learning Management Information System (MEL-MIS)
        </h3>
      </div>

      <hr />

      <div style="background-color: white; padding: 1em 2em 1em 2em">
          <h4>Hi ${name},</h3>
           <p style="line-height: 1.3; font-size: medium">
           Your MEL-MIS account was created with the following details:
          </p>
           <h4>
            <b>Email: ${email}
          </h4>
           <h4>
            <b>Phone: ${phone}
          </h4>
           <h4>
            <b>Password: ${password}
          </h4>
           <h4>
            <b>Role: ${role}
          </h4>
          <h4>
            Please login to the system to change your password to a more secure one through the <b>Settings Page</b>.
          </h4>
         <h4>System Link: <a href='https://dashboard-melmis.finnai.co.ke'>here</a></h4>
          <h4 style="text-align: center; color: #0e0e80">
             From: System Admin
          </h4>
      </div>
      <hr />
      <div
        style="text-align: center"
      >
     
          <h3 style="display: block">MEL-MIS Dashboard</h3>
          <p>
            Access, analyse and review MEL data for WKWP.
          </p>
      
      </div>
    </div>
    <br />
  </body>`;
};

exports.getContent = getContent;
