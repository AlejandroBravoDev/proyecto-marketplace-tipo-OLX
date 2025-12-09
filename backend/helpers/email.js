import nodemailer from "nodemailer";

const emailPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = data;

  await transport.sendMail({
    from: "ParcheMarket.com",
    to: email,
    subject: "Restablecer contraseña en ParcheMarket",
    html: `
        <h1 style="color:#006e18; ">ParcheMarket</h1>
        <p>Hola ${nombre}, has solicitado restablecer tu contraseña de ParcheMarket</p>
        <a href="${process.env.FRONTEND_URL}/resetPassword/${token} ">
        recuperar contraseña
        </a>

        <p>Si no solicitaste este correo, ignoralo</p>
    `,
  });
};

export default emailPassword;
