import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignUp />} />
        {/* 그 외의 경로는 모두 회원가입 페이지로 이동 */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
