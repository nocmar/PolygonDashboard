/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Table from "./views/portfolio/Table.js";
import TableDaily from "./views/portfolio/TableDaily.js";


var routes = [
  {
    path: "/index",
    name: "PoS Bridge TVL",
    icon: "ni ni-bullet-list-67 text-red",
    component: Table,
    layout: "/admin",
  },
  {
    path: "/tableDaily",
    name: "PoS Bridge daily transfer",
    icon: "ni ni-bullet-list-67 text-red",
    component: TableDaily,
    layout: "/admin",
  },
];
export default routes;
