export function otpTemplate(otp: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>RescrapX Verification</h2>

        <p>Your one-time password is:</p>

        <h1>${otp}</h1>

        <p>
          This OTP will expire in 5 minutes.
        </p>

        <p>
          If you did not request this code, you can safely ignore this email.
        </p>

        <hr />

        <p>
          © ${new Date().getFullYear()} RescrapX
        </p>
      </body>
    </html>
  `;
}