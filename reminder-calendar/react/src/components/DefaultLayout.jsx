import React, { useContext, useState } from "react";
import { getMonth} from '../util'
import Header from "../views/Header";
import Sidebar from "../views/Sidebar";
import Month from "../views/Month";

export default function DefautltLayout() {
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    
    return (
        <React.Fragment>
            <div className="container-fluid h-100">
                <div className="row">
                    <Header />
                </div>
                <div className="row">
                    <div className="col-1" style={{ width: "290px" }}>
                        <Sidebar />
                    </div>
                    <div className="col">
                        <Month month={currentMonth} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}