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
import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";
import TableItem from "./TableItem.js";
import { useCoinData } from "../../hooks/coinData";

function Tables() {
  const [items, setItems] = useState([]);
  const { coinList, isLoading ,portfolioValue} = useCoinData();

  return (
    <>
      <Header portfolioValue= {portfolioValue}/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">
                  Polygon PoS Bridge Stats TVL{" "}
                </h3>
              </CardHeader>
              <Table className="align-items-center table-dark table-flush">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Token</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Price</th>
                    <th scope="col">Value [$]</th>
                  </tr>
                </thead>
                <tbody>
                  {(!coinList || !coinList.length || isLoading) && (
                    <tr><td>Loading</td></tr>
                  )}
                  {coinList.map((item) => (
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

export default Tables;
