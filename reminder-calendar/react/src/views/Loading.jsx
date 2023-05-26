import React from 'react'
import { Oval } from 'react-loader-spinner'

export default function Loading() {

    return (
        <div className="loading-content-overlay">
            <div className="loading-box">
                <div className="loading-content">
                    <Oval
                        height={20}
                        width={20}
                        color="#353434"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#eeeeee"
                        strokeWidth={5}
                        strokeWidthSecondary={2}
                    />
                    <p>Đang xử lý!</p>
                </div>
            </div>
        </div>
    );
}
