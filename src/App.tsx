import { Route } from "react-router";
import { Routes } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import RootLayout from "./layouts/RootLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import AuthLayout from "./layouts/AuthLayout";
import User from "./pages/User";
import Posting from "./pages/Posting";
import PublicRoute from "./route/PublicRoute";
// 댓글테스트 페이지 삭제하기!! ❌
import Test from "./pages/test";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/:user_id" element={<User />} />
          <Route path="/posting" element={<Posting />} />
          {/* 댓글테스트 페이지 삭제하기!! ❌ */}
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Error />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
