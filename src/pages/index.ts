import React from "react";

const Landing = React.lazy(() => import("@/pages/landing/"));
const Login = React.lazy(() => import("@/pages/login/"));
const Register = React.lazy(() => import("@/pages/register/"));
const PostItem = React.lazy(() => import("@/pages/post-item/"));

export{
     Landing,
     Login,
     Register,
     PostItem
}