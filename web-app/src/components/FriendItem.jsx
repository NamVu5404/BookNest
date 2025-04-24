import { CheckOutlined, CloseOutlined, UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Button, Card, message, Modal } from "antd";
import { Link } from "react-router-dom";
import defaultAvatar from '../assets/images/default-avatar.jpg';
import { cancelFriendRequest, respondFriendRequest, sendFriendRequest, unfriend } from "../services/friendService";
import { useState } from "react";

export default function FriendItem({ data: initialData, onStatusChange }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSendFriendRequest = async () => {
    try {
      setLoading(true);
      await sendFriendRequest(data.userId);
      // Update local state to reflect changes
      setData({ ...data, status: 'SENT' });
      if (onStatusChange) onStatusChange(data.userId, 'SENT');
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi gửi lời mời kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      setLoading(true);
      await cancelFriendRequest(data.userId);
      // Update local state to reflect changes
      setData({ ...data, status: 'NONE' });
      if (onStatusChange) onStatusChange(data.userId, 'NONE');
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi hủy lời mời kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondFriendRequest = async (action) => {
    try {
      setLoading(true);
      await respondFriendRequest(data.userId, action);

      if (action === "accept") {
        // Update local state to reflect changes
        setData({ ...data, status: 'FRIEND' });
        if (onStatusChange) onStatusChange(data.userId, 'FRIEND');
      } else if (action === "reject") {
        // Update local state to reflect changes
        setData({ ...data, status: 'NONE' });
        if (onStatusChange) onStatusChange(data.userId, 'NONE');
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi respond mời kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const showUnfriendConfirm = () => {
    Modal.confirm({
      title: 'Xác nhận hủy kết bạn',
      content: `Bạn có chắc chắn muốn hủy kết bạn với ${data.fullName}?`,
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleUnfriend
    });
  };

  const handleUnfriend = async () => {
    try {
      setLoading(true);
      await unfriend(data.userId);
      message.success("Đã hủy kết bạn");
      // Update local state to reflect changes
      setData({ ...data, status: 'NONE' });
      if (onStatusChange) onStatusChange(data.userId, 'NONE');
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi hủy kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render different button based on friend status
  const renderActionButton = () => {
    switch (data.status) {
      case 'FRIEND':
        return (
          <Button
            type="default"
            danger
            icon={<UserDeleteOutlined />}
            style={{
              width: '100%',
              borderRadius: 6
            }}
            onClick={showUnfriendConfirm}
            loading={loading}
          >
            <span style={{ fontSize: 15 }}>Hủy kết bạn</span>
          </Button>
        );
      case 'SENT':
        return (
          <Button
            type="default"
            icon={<CloseOutlined />}
            style={{
              width: '100%',
              borderRadius: 6
            }}
            onClick={handleCancelFriendRequest}
            loading={loading}
          >
            <span style={{ fontSize: 15 }}>Hủy lời mời</span>
          </Button>
        );
      case 'RECEIVED':
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              style={{
                flex: 1,
                borderRadius: 6
              }}
              onClick={() => handleRespondFriendRequest("accept")}
              loading={loading}
            >
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              style={{
                flex: 1,
                borderRadius: 6
              }}
              onClick={() => handleRespondFriendRequest("reject")}
              loading={loading}
            >
            </Button>
          </div>
        );
      case 'NONE':
      default:
        return (
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            style={{
              width: '100%',
              borderRadius: 6
            }}
            onClick={handleSendFriendRequest}
            loading={loading}
          >
            <span style={{ fontSize: 15 }}>Thêm bạn bè</span>
          </Button>
        );
    }
  };

  return (
    <Card
      className="bg"
      style={{ maxWidth: 450, margin: 0 }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '100%',
          height: "100%",
          overflow: 'hidden'
        }}>
          <Link to={`/profile/${data.userId}`}>
            <img
              src={data?.avatar ? data.avatar : defaultAvatar}
              alt={data.fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
          </Link>
        </div>
        <div style={{
          padding: '16px',
          width: '100%'
        }}>
          <div style={{
            fontWeight: 500,
            fontSize: '15px',
            textAlign: 'center',
            marginBottom: 16
          }}>
            {data.fullName}
          </div>
          {renderActionButton()}
        </div>
      </div>
    </Card>
  );
}