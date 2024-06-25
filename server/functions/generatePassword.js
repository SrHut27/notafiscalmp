// Função para uma senha aleatória:
function generatePass() {
    const passLength = 20;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < passLength; i++) {
      pass += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return pass;
  };

module.exports = generatePass;