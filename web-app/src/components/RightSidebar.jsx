import React from "react";

function RightSidebar() {
    return (
        <div
            style={{
                padding: "16px",
                width: "100%",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                position: "fixed",
                top: 64,
                height: "calc(100vh - 64px)",
                overflow: "auto",
            }}
        >
            <h3>Người liên hệ</h3>
        </div>
    );
}

export default RightSidebar;