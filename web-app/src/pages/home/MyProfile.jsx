import { DeleteOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Skeleton, Upload } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import ReusablePostList from "../../components/ReusablePostList";
import { useUserDetails } from "../../contexts/UserContext";
import { getUid } from "../../services/localStorageService";
import { getMyPosts } from "../../services/postService";
import { deleteAvatar, updateAvatar, updateProfile } from "../../services/profileService";
import SubFriendList from "../../components/SubFriendList";

export default function MyProfile() {
  const { userDetails } = useUserDetails();
  const [form] = Form.useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(userDetails?.avatar || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Handler for wheel zoom
  const onWheelZoom = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * 0; // Điều chỉnh độ nhạy của zoom, giá trị càng nhỏ càng mượt
    setZoom(prev => Math.min(Math.max(1, prev + delta), 3)); // Giới hạn zoom từ 1 đến 3
  }, []);

  const myPostsFetcher = useCallback(() => getMyPosts(), []);

  // Populate form with user details when component mounts
  useEffect(() => {
    if (userDetails) {
      form.setFieldsValue({
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
        bio: userDetails.bio,
        // Convert date string to dayjs object for DatePicker
        dob: userDetails.dob ? dayjs(userDetails.dob) : null,
      });
      setImageUrl(userDetails.avatar);
      setPageLoading(false);
    }
  }, [userDetails, form]);

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Convert dayjs object to string for API
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        avatar: imageUrl,
      };

      // Kiểm tra thay đổi
      const hasChanged =
        formattedValues.fullName !== userDetails.fullName ||
        formattedValues.phoneNumber !== userDetails.phoneNumber ||
        formattedValues.bio !== userDetails.bio ||
        formattedValues.dob !== userDetails.dob ||
        formattedValues.avatar !== userDetails.avatar;

      if (!hasChanged) {
        setLoading(false);
        return;
      }

      try {
        await updateProfile(getUid(), {
          userId: getUid(),
          ...formattedValues,
        });
        message.success("Cập nhật thông tin thành công!");
        setLoading(false);
      } catch (error) {
        console.error("Failed to update profile:", error);
        message.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  // Upload avatar handling
  const handleAvatarChange = ({ file }) => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result);
        setIsCropping(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      });
      reader.readAsDataURL(file);
    }
    return false;
  };

  const handleDeleteAvatar = async () => {
    try {
      setImageUrl(null);
      await deleteAvatar();
    } catch (error) {
      console.error("Failed to delete avatar:", error);
      message.error(error.response?.data?.message || "Xóa ảnh đại diện thất bại!");
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setSelectedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    if (croppedAreaPixels) {
      setCroppedAreaPixels(croppedAreaPixels);
    }
  }, []);

  const getCroppedImage = useCallback(async () => {
    try {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = selectedImage;
      await new Promise((resolve) => (image.onload = resolve));

      const ctx = canvas.getContext("2d");
      const { width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const base64Image = canvas.toDataURL("image/jpeg");
      setImageUrl(base64Image);
      setIsCropping(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to crop image:", err);
      message.error("Cắt ảnh thất bại.");
    }
  }, [croppedAreaPixels, selectedImage]);

  const handleUpdateAvatar = async () => {
    if (!imageUrl) {
      message.warning("Vui lòng chọn ảnh đại diện trước khi lưu!");
      return;
    }

    try {
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create file from blob
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      await updateAvatar(file);
      message.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Failed to update avatar:", error);
      message.error(error.response?.data?.message || "Cập nhật ảnh đại diện thất bại!");
    }
  };

  // Validate date of birth (3-80 years old)
  const validateDob = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }

    const today = new Date();
    const birthDate = value.toDate();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 3) {
      return Promise.reject("Tuổi phải lớn hơn hoặc bằng 3!");
    }

    if (age > 80) {
      return Promise.reject("Tuổi phải nhỏ hơn hoặc bằng 80!");
    }

    return Promise.resolve();
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const renderProfileSkeleton = () => (
    <div style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Skeleton.Avatar active size={120} style={{ marginBottom: '12px' }} />
        <Skeleton.Button active size="large" style={{ width: '150px' }} />
      </div>

      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    </div>
  );

  return (
    <>
      <Row gutter={[16]}>
        <Col xl={10}>
          <Row gutter={[16, 16]}>
            {/* thông tin cá nhân */}
            <Col xl={24}>
              <Card
                title={
                  <div style={{}}>
                    Thông tin cá nhân
                  </div>
                }
                styles={{
                  body: { padding: pageLoading ? 0 : '24px' }
                }}
              >
                {pageLoading ? renderProfileSkeleton() : (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                      fullName: userDetails?.fullName || "",
                      phoneNumber: userDetails?.phoneNumber || "",
                      bio: userDetails?.bio || "",
                      dob: userDetails?.dob ? dayjs(userDetails.dob) : null,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginBottom: '24px'
                    }}>
                      <Form.Item style={{ marginBottom: '12px', position: 'relative' }}>
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          customRequest={handleAvatarChange}
                        >
                          <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            ':hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}>
                            {imageUrl ? (
                              <>
                                <Avatar
                                  src={imageUrl}
                                  size={120}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'rgba(0,0,0,0.5)',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.3s',
                                  ':hover': {
                                    opacity: 1
                                  }
                                }}>
                                  <UploadOutlined style={{ color: 'white', fontSize: '24px' }} />
                                </div>
                              </>
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
                        </Upload>
                        {imageUrl && (
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleDeleteAvatar}
                            style={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                              borderRadius: '50%',
                              minWidth: 'unset',
                              width: '32px',
                              height: '32px',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          />
                        )}
                      </Form.Item>
                      {imageUrl && (
                        <Button
                          type="primary"
                          icon={<UploadOutlined />}
                          onClick={handleUpdateAvatar}
                          style={{
                            borderRadius: '6px',
                            height: '36px',
                            boxShadow: '0 2px 0 rgba(0,0,0,0.02)',
                            transition: 'all 0.3s ease'
                          }}
                          disabled={imageUrl === userDetails?.avatar}
                        >
                          Lưu ảnh đại diện
                        </Button>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
                      <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nguyễn Văn A"
                          maxLength={50}
                          size="large"
                          style={{ borderRadius: '6px' }}
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                              {
                                required: true,
                                pattern: /^0\d{9}$/,
                                message: "Số điện thoại không hợp lệ",
                              },
                            ]}
                          >
                            <Input
                              placeholder="0123456789"
                              size="large"
                              style={{ borderRadius: '6px' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Ngày sinh"
                            name="dob"
                            rules={[{ validator: validateDob }]}
                          >
                            <DatePicker
                              style={{ width: "100%", borderRadius: '6px' }}
                              placeholder="09/09/1999"
                              format="DD/MM/YYYY"
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        label="Giới thiệu bản thân"
                        name="bio"
                      >
                        <Input.TextArea
                          rows={4}
                          maxLength={255}
                          showCount
                          placeholder="Viết vài dòng giới thiệu về bản thân ..."
                          style={{
                            borderRadius: '6px',
                            fontSize: '14px',
                            resize: 'none'
                          }}
                        />
                      </Form.Item>

                      <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                          <Button
                            onClick={handleCancel}
                            size="large"
                            style={{
                              borderRadius: '6px',
                              minWidth: '100px'
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            style={{
                              borderRadius: '6px',
                              minWidth: '140px'
                            }}
                          >
                            Cập nhật thông tin
                          </Button>
                        </div>
                      </Form.Item>
                    </div>
                  </Form>
                )}
              </Card>
            </Col>

            {/* Bạn bè */}
            <Col xl={24}>
              {userDetails && <SubFriendList userId={userDetails.userId} loading={loading} />}
            </Col>
          </Row>
        </Col>

        {/* bài viết */}
        <Col xl={14}>
          <ReusablePostList fetchFunction={myPostsFetcher} />
        </Col>
      </Row>

      {/* Modal crop ảnh */}
      <Modal
        title="Chỉnh sửa ảnh đại diện"
        open={isCropping}
        onCancel={handleCropCancel}
        width={800}
        footer={null}
        centered
        maskClosable={false}
        className="crop-modal"
      >
        {selectedImage && (
          <>
            <div
              style={{ position: 'relative', height: '400px', width: '100%', background: '#333' }}
              onWheel={onWheelZoom}
            >
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            </div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button onClick={handleCropCancel}>Hủy</Button>
              <Button type="primary" onClick={getCroppedImage}>
                Xác nhận
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
