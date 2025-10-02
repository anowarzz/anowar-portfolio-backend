import { Router } from "express";
import { BlogRoutes } from "../modules/blog/blog.route";
import { ProjectRoutes } from "../modules/project/project.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
