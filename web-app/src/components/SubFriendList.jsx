import { useEffect, useState } from "react";
import { getAllFriends } from "../services/friendService";
import { Col, message, Row, Skeleton } from "antd";
import FriendItem from "./FriendItem";
import { Link } from "react-router-dom";

export default function SubFriendList({ userId, loading }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const friendResponse = await getAllFriends(userId, "", 6);
        setFriends(friendResponse.data.result.data);
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriend();
  }, [userId])

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Col xl={8} key={index}>
        <Skeleton.Avatar active size={64} shape="circle" />
        <Skeleton active paragraph={{ rows: 1 }} />
      </Col>
    ));
  };

  return (
    <div style={{ fontSize: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>Bạn bè</span>
        <Link to={`/users/${userId}/friends`}>Xem tất cả</Link>
      </div>

      <Row gutter={[16, 16]}>
        {friends.map(item => (
          <Col xl={8} key={item.userId}>
            <FriendItem data={item} />
          </Col>
        ))}
        {loading && renderSkeletons()}
      </Row>

      {!loading && friends.length === 0 && (
        <span style={{ fontSize: 20, fontWeight: 700, color: "#63666A" }}>
          Không có bạn bè nào
        </span>
      )}
    </div>
  )
}