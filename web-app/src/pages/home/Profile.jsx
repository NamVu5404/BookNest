import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Image, message, Row, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReusablePostList from "../../components/ReusablePostList";
import SubFriendList from "../../components/SubFriendList";
import { useUserDetails } from "../../contexts/UserContext";
import { getUserPosts } from "../../services/postService";
import { getPublicProfileByUid } from "../../services/profileService";
import { CheckOutlined, CloseOutlined, UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { cancelFriendRequest, respondFriendRequest, sendFriendRequest, unfriend } from "../../services/friendService";

const { Text } = Typography;

export default function Profile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId === userDetails?.userId) {
      navigate("/profile", { replace: true });
    }

    const fetchProfile = async () => {
      try {
        const response = await getPublicProfileByUid(userId);
        setUserProfile(response.data.result);
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi khi tải profile");
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, navigate, userDetails]);

  const userPostsFetcher = () => getUserPosts(userId);

  // Friend request handlers
  const handleSendFriendRequest = async () => {
    try {
      setButtonLoading(true);
      await sendFriendRequest(userId);
      // Update local state to reflect changes
      setUserProfile({ ...userProfile, status: 'SENT' });
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi gửi lời mời kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      setButtonLoading(true);
      await cancelFriendRequest(userId);
      // Update local state to reflect changes
      setUserProfile({ ...userProfile, status: 'NONE' });
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi hủy lời mời kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleRespondFriendRequest = async (action) => {
    try {
      setButtonLoading(true);
      await respondFriendRequest(userId, action);

      if (action === "accept") {
        // Update local state to reflect changes
        setUserProfile({ ...userProfile, status: 'FRIEND' });
      } else if (action === "reject") {
        // Update local state to reflect changes
        setUserProfile({ ...userProfile, status: 'NONE' });
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi respond mời kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const showUnfriendConfirm = () => {
    Modal.confirm({
      title: 'Xác nhận hủy kết bạn',
      content: `Bạn có chắc chắn muốn hủy kết bạn với ${userProfile.fullName}?`,
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleUnfriend
    });
  };

  const handleUnfriend = async () => {
    try {
      setButtonLoading(true);
      await unfriend(userId);
      message.success("Đã hủy kết bạn");
      // Update local state to reflect changes
      setUserProfile({ ...userProfile, status: 'NONE' });
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi hủy kết bạn");
      console.error("Fail to fetch:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  // Render friend button based on status
  const renderFriendButton = () => {
    if (!userProfile || !userId || userId === userDetails?.userId) return null;

    const status = userProfile.status || 'NONE';

    switch (status) {
      case 'FRIEND':
        return (
          <Button
            type="default"
            danger
            icon={<UserDeleteOutlined />}
            style={{
              width: '100%',
              borderRadius: 6,
              marginTop: '16px',
              maxWidth: "30%"
            }}
            onClick={showUnfriendConfirm}
            loading={buttonLoading}
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
              borderRadius: 6,
              marginTop: '16px',
              maxWidth: "30%"
            }}
            onClick={handleCancelFriendRequest}
            loading={buttonLoading}
          >
            <span style={{ fontSize: 15 }}>Hủy lời mời</span>
          </Button>
        );
      case 'RECEIVED':
        return (
          <div style={{ display: 'flex', gap: 8, marginTop: '16px' }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              style={{
                flex: 1,
                borderRadius: 6,
              }}
              onClick={() => handleRespondFriendRequest("accept")}
              loading={buttonLoading}
            >
              <span style={{ fontSize: 15 }}>Đồng ý</span>
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              style={{
                flex: 1,
                borderRadius: 6,
              }}
              onClick={() => handleRespondFriendRequest("reject")}
              loading={buttonLoading}
            >
              <span style={{ fontSize: 15 }}>Từ chối</span>
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
              borderRadius: 6,
              marginTop: '16px',
              maxWidth: "30%"
            }}
            onClick={handleSendFriendRequest}
            loading={buttonLoading}
          >
            <span style={{ fontSize: 15 }}>Thêm bạn bè</span>
          </Button>
        );
    }
  };

  return (
    <Row gutter={[16]}>
      <Col xl={10}>
        <Row gutter={[16, 16]}>
          {/* thông tin cá nhân */}
          <Col xl={24}>
            <Card
              title={
                <div>
                  Thông tin cá nhân
                </div>
              }
              styles={{
                body: { padding: '24px' }
              }}
              loading={loading}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '12px', position: 'relative' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {userProfile?.avatar ? (
                      <Image
                        src={userProfile.avatar}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Avatar
                        size={120}
                        icon={<UserOutlined style={{ fontSize: '48px' }} />}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f5f5f5',
                          border: '2px dashed #d9d9d9'
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Tên người dùng */}
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}>
                  {userProfile?.fullName || 'Người dùng'}
                </div>

                {/* Render friend button here */}
                {renderFriendButton()}
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary">Họ và tên</Text>
                    <div style={{ fontSize: '15px', marginTop: '4px' }}>
                      {userProfile?.fullName || 'Chưa cập nhật'}
                    </div>
                  </Col>

                  <Col span={12}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text type="secondary">Ngày sinh</Text>
                      <div style={{ fontSize: '15px', marginTop: '4px' }}>
                        {userProfile?.dob ? dayjs(userProfile.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div>
                  <Text type="secondary">Giới thiệu bản thân</Text>
                  <div style={{ fontSize: '15px', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                    {userProfile?.bio || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Bạn bè */}
          <Col xl={24}>
            <SubFriendList userId={userId} loading={loading} />
          </Col>
        </Row>
      </Col>

      {/* bài viết */}
      <Col xl={14}>
        <ReusablePostList fetchFunction={userPostsFetcher} hidden={true} />
      </Col>
    </Row>
  );
}