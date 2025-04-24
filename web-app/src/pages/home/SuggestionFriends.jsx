import { Col, message, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import FriendItem from "../../components/FriendItem";
import { getFriendSuggestions } from "../../services/friendService";
import { getUid } from "../../services/localStorageService";

export default function Friends() {
  const userId = getUid()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUserId, setLastUserId] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const limit = 18;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFriendSuggestions(userId, lastUserId, limit);
        const newData = response.data.result.data;
        
        // Nếu không có thêm dữ liệu, đánh dấu là hết dữ liệu
        if (newData.length < limit) {
          setHasMore(false);
        }

        // Thêm dữ liệu mới vào danh sách hiện tại
        setData(prev => [...prev, ...newData]);
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi khi tải danh sách gợi ý bạn bè");
        console.error("Fail to fetch friend suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchData();
    }
  }, [lastUserId, hasMore, userId]);

  // Lắng nghe sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Khi người dùng cuộn gần cuối trang (cách 200px)
      if (scrollTop + clientHeight >= scrollHeight - 200 && !loading && hasMore) {
        const lastItem = data[data.length - 1];
        if (lastItem) {
          setLastUserId(lastItem.userId);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, loading, hasMore]);

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
      <h3 style={{ marginBottom: 16, fontSize: 20 }}>Những người bạn có thể biết</h3>

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
          Không có bạn bè nào
        </span>
      )}
    </div>
  );
}
