import React from "react";
import Header1 from "../views/Header1";
import Sidebar1 from "../views/Sidebar1";
import RecycleBin from "../views/RecycleBin";

export default function SubLayout() {

    return (
        <React.Fragment>
            <div className="container-fluid h-100">
                <div className="row">
                    <Header1 />
                </div>
                <div className="row">
                    <div className="col-1" style={{ width: "290px" }}>
                        <Sidebar1 onDateClick={handleDateClick} selectedDate={selectedDate}/>
                    </div>
                    <div className="col">
                        <RecycleBin selectedDate={selectedDate}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}