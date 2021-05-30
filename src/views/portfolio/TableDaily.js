import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

// reactstrap components
import {
  Button,
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
// core components
import HeaderDaily from "../../components/Headers/HeaderDaily.js";
import TableItem from "./TableItemDaily.js";
import { useDailyFlow } from "../../hooks/dailyFlow.js";
import DatePicker from "react-datepicker";

function TableDaily() {
  const { dailyCoins, isLoading, setSelectedDate,totalInflow, totalOutflow,txNr } = useDailyFlow();
  const [date, setDate ] = useState(new Date());

  let setCurrentDate = (date) => {
    setDate(date);
    console.log(date);
    setSelectedDate(date);

  };



  return (
    <>
      <HeaderDaily totalInflow={totalInflow} totalOutflow={totalOutflow} txNr={txNr}/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
          <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                {/* <h3 className="mb-0">Polygon PoS Bridge Stats</h3> */}
                <DatePicker
                  className="form-control"
                  styles={{marginLeft:"60px" }}
                  selected={date}
                  onChange={(d) => setCurrentDate(d)}
                />
              </CardHeader>
              <Table className="align-items-center table-dark table-flush">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Token</th>
                    <th scope="col">Price</th>
                    <th scope="col">In[$]</th>
                    <th scope="col">Out [$]</th>
                    <th scope="col">Diff [$]</th>
        
                  </tr>
                </thead>
                <tbody>
                {(!dailyCoins || !dailyCoins.length || isLoading) && (
                   <tr><td>Loading</td></tr>
                  )}
                  {dailyCoins && dailyCoins.map((item) => (
                    <TableItem key={item.token_address} coin={item} />
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default TableDaily;
