import { Col, message, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import FriendItem from "../../components/FriendItem";
import { getFriendRequestsSent } from "../../services/friendService";

export default function FriendRequestReceived() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFriendRequestsSent();
        setData(response.data.result);
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
        console.error("Fail to fetch friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Col xl={4} key={index}>
        <Skeleton.Avatar active size={64} shape="circle" />
        <Skeleton active paragraph={{ rows: 1 }} />
      </Col>
    ));
  };

  return (
    <div style={{ fontSize: 15 }}>
      <h3 style={{ marginBottom: 16, fontSize: 20 }}>Đang chờ chấp nhận</h3>

      <Row gutter={[16, 16]}>
        {data.map(item => (
          <Col xl={4} key={item.userId}>
            <FriendItem data={item} />
          </Col>
        ))}
        {loading && renderSkeletons()}
      </Row>

      {!loading && data.length === 0 && (
        <span style={{ fontSize: 20, fontWeight: 700, color: "#63666A" }}>
          Không có lời mời nào
        </span>
      )}
    </div>
  )
}