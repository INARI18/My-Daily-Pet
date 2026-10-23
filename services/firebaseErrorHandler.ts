export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "O email fornecido é inválido.";
    case "auth/user-not-found":
      return "Usuário não encontrado. Verifique suas credenciais.";
    case "auth/wrong-password":
      return "Senha incorreta. Tente novamente.";
    case "auth/invalid-credential":
      return "Email ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde um pouco e tente de novo.";
    case "auth/email-already-in-use":
      return "Este email já está em uso.";
    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";
    default:
      return "Erro desconhecido. Tente novamente.";
  }
};
