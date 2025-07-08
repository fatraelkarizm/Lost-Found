import React from "react";

const Landing = React.lazy(() => import("@/pages/landing/"));
const Login = React.lazy(() => import("@/pages/login/"));

export{
     Landing,
     Login
}