import {
     Landing,
     Login
} from "@/pages/index";
// import path from "path";

const routes = [
    {path: "/", name:'Landing',element: Landing},
    {path: "/login", name:'Login', element: Login},
];

export default routes;