import React, { useContext, useState } from "react";
import Header from "../views/Header";
import Sidebar from "../views/Sidebar";
import Event from "../views/Event";

export default function DefautltLayout() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <React.Fragment>
            <div className="container-fluid h-100">
                <div className="row">
                    <Header />
                </div>
                <div className="row">
                    <div className="col-1" style={{ width: "290px" }}>
                        <Sidebar onDateClick={handleDateClick} selectedDate={selectedDate}/>
                    </div>
                    <div className="col">
                        <Event selectedDate={selectedDate}/>
                        {/* <Month month={currentMonth} /> */}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}