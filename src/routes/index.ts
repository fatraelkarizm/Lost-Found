import {
     Landing,
     Login,
     Register,
    PostItem,
} from "@/pages/index";
// import path from "path";

const routes = [
    {path: "/", name:'Landing',element: Landing},
    {path: "/login", name:'Login', element: Login},
    {path: "/register", name:'Register', element: Register},
    {path: "/post-item", name:'PostItem', element: PostItem},
];

export default routes;