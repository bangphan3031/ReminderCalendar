import React, { useContext, useState } from "react";
import Header from "../views/Header";
import Sidebar from "../views/Sidebar";
import Event from "../views/Event";
import moment from 'moment';

export default function DefautltLayout() {
    const [currentMonth, setCurrentMonth] = useState(moment())

    
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
                        <Event />
                        {/* <Month month={currentMonth} /> */}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}