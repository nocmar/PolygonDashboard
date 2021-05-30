import React from "react";

// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
} from "reactstrap";
import ItemAction from "./ItemAction";
import {n6,c2} from "../../utils"
// core components
const TableItem = ({coin}) => {
    return (
        <tr>
            <th scope="row">
                <Media className="align-items-center">
                    <a
                        className="avatar rounded-circle mr-3"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        { coin.logo_url && 
                        <img
                            alt="??"
                            src={coin.logo_url}
                            onError={(e)=>{e.target.onerror = null; e.target.src=require("../../assets/img/theme/eqmark.png")
                            .default}}
                         /> 
                        }
                    </a>
                    {coin.name}
                      
               
                </Media>
            </th>
            <td>
            <span className="mb-0 text-sm text-wrap">
                            {coin.symbol}
                          </span>
            </td>
            <td>
            <span className="mb-0 text-sm text-wrap">
            {coin.amountTxt}
   
                          </span>
            </td>
            <td>
            <span className="mb-0 text-sm text-wrap">
            {c2.format(coin.price)}
                          </span>
            </td>
            <td>
            <span className="mb-0 text-sm text-wrap">
            {c2.format(coin.value)}
                  
                          </span>
            </td>
        
        </tr>
    );
};

export default TableItem;
