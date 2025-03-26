import {UserOutlined} from "@ant-design/icons";
import {Avatar, Typography} from "antd";
import React, {forwardRef} from "react";

const {Text} = Typography;

const Post = forwardRef((props, ref) => {
    const {avatar, fullName, elapsedTime, content} = props.post;

    return (
        <div
            ref={ref}
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 12,
                }}
            >
                {avatar ? (
                    <Avatar
                        src={avatar}
                        size="large"
                        style={{cursor: "pointer", marginRight: 12}}
                    />
                ) : (
                    <Avatar
                        size="large"
                        icon={<UserOutlined/>}
                        style={{cursor: "pointer", marginRight: 12}}
                    />
                )}
                <div>
                    <Text strong>{fullName}</Text>
                    <div>
                        <Text type="secondary" style={{fontSize: "12px"}}>
                            {elapsedTime}
                        </Text>
                    </div>
                </div>
            </div>

            <div style={{marginLeft: avatar ? 46 : 46}}>
                <Text>{content}</Text>
            </div>
        </div>
    );
});

export default Post;
