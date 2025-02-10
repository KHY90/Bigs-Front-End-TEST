// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return isEmail.test(email);
  };
  
  // 비밀번호 유효성 검사 (8자 이상, 영문, 숫자, 특수문자 포함)
  export const validatePassword = (password: string): boolean => {
    const isPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]{8,}$/;
    return isPassword.test(password);
  };
  
  // 비밀번호 확인
  export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };
  